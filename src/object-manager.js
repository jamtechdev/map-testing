import java from "./images/on-map/java.svg";
import node from "./images/on-map/nodejs.svg";
import angular from "./images/on-map/angular.svg";
import ObjectCoordinates from "./data/datafile.json";
import { objectModification } from "./objectInterface";
import { getZoomDirection } from "./wheelDirection";
import { getScale, setTransformationLevel } from "./svgOverlay";
import { fontSizeWatcher, thumbnailSizeWatcher, sImageXWatcher, sImageYWatcher, sLabelXWatcher, sLabelYWatcher } from "./watchers";
import { labelWordCount } from "./constants";
const mapObjects = ObjectCoordinates
let dThree = undefined
let lastZoom = 0
let firstZoomed = false
let currentSelect = -100
let highlightIndex = -100
let selectedIndex = -100
let lastUpdatedIndex = -100;
let lastDeltaCoords = 0;
let svgNode = undefined
let xHolder = 0
let yHolder = 0
let description = "Description Not Available"
let url = ""
let full_url = ""
let open_full_url = ""
let object_title = ""
//Special objects
let upperObjects = ["E015", "C035", "C038"];
let rightObjects = ["B1109", "B0217", "B0412", "C025", "B0204", "M001", "B1116"];
let upperObjectsIndices = []
let rightObjectsIndices = []
let allCordIndex = []
let cordsX = []
let cordsY = []

export function drawObjectsOnMap(d3, svg, xScale, yScale, size) {
  dThree = d3
  svgNode = svg
  for (let index = 0; index < mapObjects.length; index++) {
    let object = mapObjects[index];
    const item = objectModification(Object.assign({}, object));
    let [mY, mX, c_m, category] = [yScale(Number(item.Latitude)), xScale(Number(item.Longitude)), item.Code_id, item.Category];
    if (upperObjects.includes(c_m)) upperObjectsIndices.push(index);
    if (rightObjects.includes(c_m)) rightObjectsIndices.push(index);
    cordsX[index] = mX;
    cordsY[index] = mY;
    allCordIndex.push(c_m);
    if (svg.select(".coords[index='" + index + "']").size() === 0) {
      let shape = node;
      switch (item.Category) {
        case "ST":
          shape = node;
          break;
        case "G":
          shape = angular;
          break;
        case "C":
          shape = java;
          break;
   
      }
      /* eslint-disable  no-loop-func */
      const rect = svg
        .insert("svg:image")
        .attr("class", "coords")
        .attr("preserveAspectRatio", "none")
        .attr("x", mX)
        .attr("y", mY)
        .attr("width", size)
        .attr("height", size)
        .attr("cursor", "pointer")
        .attr("index", index)
        .attr("c_m", c_m)
        .attr("category", category)
        .attr("xlink:href", shape)
        .attr("opacity", "0")
      rect.transition().duration(Math.floor(Math.random(500) * 1000)).attr("opacity", "1");
    }
  }
}

function adjustThumbs(deltaX, deltaY, labY, labX, level) {
  if (
    selectedIndex === -100 ||
    selectedIndex === undefined ||
    (selectedIndex === lastUpdatedIndex && lastDeltaCoords === deltaY)
  ) {
    return false;
  }
  let imgObj = dThree.select(".hover_image[index='" + selectedIndex + "']");
  let rectObj = dThree.select(".rect-border[index='" + selectedIndex + "']");
  let labObj = dThree.select(".label[index='" + selectedIndex + "']");
  if (!imgObj) {
    setTimeout(function () {
      // wait for it
    }, 100);
  }
  let cordX = cordsX[selectedIndex];
  let cordY = cordsY[selectedIndex];

  let imgDeltaY = cordY + deltaY;
  let imgDeltaX = cordX + deltaX;
  let labDeltaX = cordX + 5;
  // Handle special objects here
  if (upperObjectsIndices.includes(selectedIndex)) {
    if (level === 1) {
      imgDeltaY = cordY - (deltaY + 20);
    } else if (level === 2) {
      imgDeltaY = cordY - (deltaY + 15);
    }
  }
  if (rightObjectsIndices.includes(selectedIndex)) {
    imgDeltaX = cordX - (deltaX + 10);
    labDeltaX = cordX - 20;
  }

  if (allCordIndex[selectedIndex] === "B0204") {
    labDeltaX = cordX + labX;
  }

  imgObj.attr("y", imgDeltaY).attr("x", imgDeltaX);

  rectObj.attr("y", imgDeltaY).attr("x", imgDeltaX);

  labObj.attr("x", labDeltaX).attr("y", cordY + labY);

  lastUpdatedIndex = selectedIndex;
  lastDeltaCoords = deltaY;
}
function reChangeObjects(c_m, hoveredX, hoveredY, labelWordCount, settings, action) {

  /*
  Renders objects / shapes
  */
  // Adjust individual items here
  if (c_m === undefined) {
    //  If c_m is not passed, do not execute the function
    return false;
  }
  let scale = getScale()

  if (upperObjects.includes(c_m)) {
    settings["imgY"] = -10;
    return settings;
  }
  if (rightObjects.includes(c_m)) {
    settings["imgX"] = -25;
    settings["imgY"] = 30;
    settings["labX"] = -30;
    settings["labY"] = -5;
    if (c_m === "B0204") {
      if (scale < 1.5) {
        settings["labX"] = -80;
      } else {
        settings["labX"] = -55;
      }
    }
    if (c_m === "B1116") settings["labX"] = -38;
    return settings;
  }
  //  Returns settings object unconditionally
  return settings; // Must NOT remove this return
}
/*
Resizes shapes on zoom
*/
export function changeSize(size) {
  dThree.selectAll(".coords")
    .attr("width", function () {
      return size;
    })
    .attr("height", function () {
      return size;
    });

  let pointer = dThree.select("#leapPointer");
  let loaderGif = dThree.select("#gifLoaderImg");
  let cordWidth = parseFloat(size) * 1.5;
  let cordHeight = parseFloat(size) * 1.5;
  pointer
    .attr("width", cordWidth)
    .attr("height", cordHeight);
  loaderGif.attr("width", cordWidth).attr("height", cordHeight);
}
function resizeThumbs(size) {
  /*
  Resizes thumbnails on zoom
  */

  dThree.selectAll(".rect-border, .hover_image")
    .attr("width", function () {
      return size;
    })
    .attr("height", function () {
      return size;
    });
}
function resizeText(size) {
  /*
  Resizes labels on zoom
  */
  dThree.selectAll(".label").attr("font-size", function () {
    return size + "%";
  });
}

export function zoomed() {
  /*
  Handles changes needed to be performed on zoom
  */
  let scale = getScale();
  let zoomDirection;
  zoomDirection = getZoomDirection(lastZoom, scale);
  if (zoomDirection === "in") {
    if (scale === 1) {
      changeSize(15)
    } else if (scale > 1 && scale <= 2) {
      changeSize(11)
    } else if (scale > 2 && scale <= 3) {
      changeSize(7)
    } else if (scale > 3 && scale <= 4) {
      changeSize(6.5)
    } else if (scale > 4 && scale <= 5) {
      changeSize(6)
    } else if (scale > 5 && scale <= 6) {
      changeSize(5.5)
    } else if (scale > 6 && scale <= 7) {
      changeSize(5)
    } else if (scale > 7 && scale <= 8) {
      changeSize(4.5)
    } else if (scale > 8 && scale <= 9) {
      changeSize(4)
      resizeThumbs(14);
      adjustThumbs(5, -20, -1, -40, 1);
    } else if (scale > 9 && scale <= 10) {
      changeSize(3.5)
    } else if (scale > 10 && scale < 11) {
      changeSize(3)
    } else if (scale > 11 && scale <= 12) {
      changeSize(2.5)
    } else if (scale > 12 && scale <= 13) {
      changeSize(2)
    } else if (scale > 14 && scale <= 15) {
      changeSize(1.5)
    } else if (scale > 15 && scale <= 16) {
      changeSize(1.4)
      resizeThumbs(10);
      adjustThumbs(5, -15, -1, -25, 2);
    } else if (scale > 16 && scale <= 18) {
      changeSize(1.3)
    } else if (scale > 18 && scale <= 25) {
      changeSize(1.2)
    }
  } else if (zoomDirection === "out") {
    if (scale <= 1) {
      changeSize(15)
    } else if (scale > 4 && scale <= 5) {
      changeSize(6)
    }
  }
  if (scale <= 2) {
    fontSizeWatcher.fontSize = 35
    resizeText(fontSizeWatcher.fontSize);
  } else if (scale === 6) {
    fontSizeWatcher.fontSize = 22
    resizeText(fontSizeWatcher.fontSize);
  } else if (scale > 6 && scale < 10) {
    fontSizeWatcher.fontSize = 20
    resizeText(fontSizeWatcher.fontSize);
  } else if (scale > 10) {
    fontSizeWatcher.fontSize = 16
    resizeText(fontSizeWatcher.fontSize);
  }
  reChangeObjects()
  if (firstZoomed) {
    lastZoom = scale;
  }
  firstZoomed = true;
}

export function hoveredObjectClick(obj,cursorX,cursorY) {
  let leapPointer = dThree.select("#leapPointer");
  let sharedObject = {
    x: obj.attr("x"),
    y: obj.attr("y"),
    c_m: obj.attr("c_m"),
    index: obj.attr("index"),
    cursorX:cursorX,
    cursorY:cursorY
  };
  if (obj !== null) {
    leapPointer.style("display", "none")
    dThree.select('#gifLoaderImg').style("display", "block").attr("x", Number(leapPointer.attr("x"))).attr("y", Number(leapPointer.attr("y")))

    setTimeout(() => {
      currentSelect = sharedObject.index
      //this will simulate the click event effect .actually there is not click event 
      emitObjectEventListner(sharedObject)
      dThree.select('#gifLoaderImg').style("display", "none")
      leapPointer.style("display", "block")
    }, 1000)
  }
}

function emitObjectEventListner(slectedObj) {
  let scaleLevel = 5
  if (currentSelect === highlightIndex) return
  /*
  Handles object clicks
  */
  const obj = slectedObj;
  highlightIndex = obj !== undefined ? obj.index : ""
  dThree.selectAll(".hover_image").remove()
  dThree.selectAll(".label").remove()
  dThree.selectAll(".rect-border").remove()
  currentSelect = highlightIndex
  selectedIndex = highlightIndex
  let object = mapObjects[highlightIndex];
  const item = objectModification(Object.assign({}, object))
  if (
    item.Code_id.includes("M") ||
    item.Code_id.includes("C") ||
    item.Code_id.includes("B") ||
    item.Code_id.includes("E")
  ) {
    full_url = "https://cdn.pixabay.com/photo/2015/02/24/09/11/connection-647206_960_720.jpg"
    url = "https://cdn.pixabay.com/photo/2015/02/24/09/11/connection-647206_960_720.jpg"
    open_full_url = "https://cdn.pixabay.com/photo/2015/02/24/09/11/connection-647206_960_720.jpg"
  }
  selectedIndex = highlightIndex;
  let useX = parseFloat(obj !== undefined ? obj.x : "")
  let useY = parseFloat(obj !== undefined ? obj.y : "")
  let labelX = parseFloat(obj !== undefined ? obj.x : "")
  let labelY = parseFloat(obj !== undefined ? obj.y : "")
  let c_m = obj !== undefined ? obj.c_m : ""
  xHolder = useX
  yHolder = useY
  let settings = {
    useX: useX,
    useY: useY,
    labelX: labelX,
    labelY: labelY,
    imgX: sImageXWatcher.sImgX,
    imgY: sImageYWatcher.sImgY,
    labX: sLabelXWatcher.sLabX,
    labY: sLabelYWatcher.sLabY,
  };
  settings = reChangeObjects(c_m, xHolder, yHolder, labelWordCount(item["WISE Objects"]), settings, "click");

  let hoveredImg = svgNode
    .insert("svg:image")
    .attr("class", "hover_image")
    .attr("index", highlightIndex)
    .attr("c_m", c_m)
    .attr("x", useX + settings["imgX"])
    .attr("y", useY - settings["imgY"])
    .attr("width", thumbnailSizeWatcher.thumbImageSize)
    .attr("height", thumbnailSizeWatcher.thumbImageSize)
    .attr("opacity", "0")
    .attr("xlink:href", url)
    .on('click',()=>{
      /*
   setTransformationLevel  takes cursor x,y and call OSD functions
      */
      setTransformationLevel(scaleLevel,parseInt(obj.cursorX),parseInt(obj.cursorY)); 
    })
  hoveredImg.attr("opacity", "1");
hoveredImg.dispatch('click');
}
export function getCurrentSelected() {
  return currentSelect
}
export function setCurrentSelected(val) {
  currentSelect = val
}
export function getLightBoxData() {
  return {
    full_url: full_url,
    open_full_url: open_full_url,
    description: description,
    object_title: object_title
  }
}

