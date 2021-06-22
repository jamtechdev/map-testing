import './style.css'
import * as d3 from "d3";
import { connectWithLeapDevice } from "./leap-manager";
import * as OpenSeadragon from "openseadragon";
import { sWidth, sHeight, osdWidth, osdHeight } from "./constants";
import { svgOverLay, svgNode, resize } from "./svgOverlay";
import { drawObjectsOnMap, zoomed } from "./object-manager";
const xLinerScale = d3.scaleLinear().range([0, osdWidth]).domain([-180, 180]);
const yLinerScale = d3.scaleLinear().range([0, osdHeight]).domain([-90, 90]);

let masterContainer
let viewer
let svg

function main() {
    try {
        if (setupStage() && masterContainer) {
            //later I place loader here
            setTimeout(() => {
                setupOSDContainer()
            }, 500)
        }
    } catch (error) {
        console.log("Error From Main Method", error)
    }
}
//setup blank div stage for OSD contatiner
function setupStage() {
    masterContainer = document.createElement('div')
    masterContainer.setAttribute("id", 'render_map2')
    masterContainer.style.width = sWidth + "px"
    masterContainer.style.height = sHeight + "px"
    document.getElementById("app").appendChild(masterContainer);
    return true
}
//Load OSD contatiner inside blank div stage
function setupOSDContainer() {
    var duomo = {
        Image: {
          xmlns: "http://schemas.microsoft.com/deepzoom/2008",
          Url: "//openseadragon.github.io/example-images/duomo/duomo_files/",
          Format: "jpg",
          Overlap: "2",
          TileSize: "256",
            // There are my image size Width: 16384, Height: 8192
          Size: {
            Width:  "13920",
            Height: "10200"
          }
        }
      };
    viewer = OpenSeadragon({
        id: "render_map2",
        tileSources:duomo,
        prefixUrl: "//openseadragon.github.io/openseadragon/images/",
        showNavigationControl: false,
        homeFillsViewer:true,
        visibilityRatio: 1,
        animationTime: 1.0,
        blendTime: 1,
        maxZoomLevel: 25,
        minZoomLevel: 1,
        panVertical:true,
        panHorizontal:true,
        gestureSettingsMouse: {
            clickToZoom: false
        }, zoomPerClick: 0,
        //defaultZoomLevel: 1,
        //  zoomPerScroll: 1.5,
    });
    //setup the svg stage on top of OSD contatiner
    setupSvgStageOnTopOfOsdContatiner(viewer, osdWidth, osdHeight, OpenSeadragon, d3)
    //Resize the objects when OSD fire animation event
    viewer.addHandler("animation", function () {
        resize()
        zoomed()
    });
}
function setupSvgStageOnTopOfOsdContatiner(viewer, width, height, seaDragon, d3) {
    //call svg stage
    svgOverLay(viewer, width, height, seaDragon, d3);
    svg = d3.select(svgNode()).attr("class", "scale-holder").attr("id", "dragon_image");
    //place objects over map
    drawObjectsOnMap(d3, svg, xLinerScale, yLinerScale, 15);
    //wait until svg is created 
    setTimeout(() => {
        connectWithLeapDevice(svg)
    }, 2000)
}
//start the applivation once DOM loaded
document.addEventListener("DOMContentLoaded", main)