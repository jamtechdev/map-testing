import * as Leap from "leapjs";
import * as d3 from "d3";
import { osdWidth, osdHeight, sWidth, sHeight } from "./constants";
import {
  getTransform,
  getScale,
  setMotionZoomIn,
  setMotionZoomOut,
  scrollDownKeyEvent,
  scrollLeftKeyEvent,
  scrollRightKeyEvent,
  scrollUpKeyEvent,
} from "./svgOverlay";
import pointer from "./images/on-map/pointer-y.png";
import gifPointer from "./images/on-map/gifPointer.gif";
import {
  hoveredObjectClick,
  getCurrentSelected,
  changeSize
} from "./object-manager";
let controller = null;
let hand = undefined;
let options = { enableGestures: true, frameEventName: "deviceFrame" };
const [MIN_HAND, MAX_FINGERS] = [1, 5];
let [prevX, prevY] = [sWidth / 2, sHeight / 2];
let svgNode = undefined;
let position = undefined;
let timeoutId = null;
let pointableId = 0;
let coords = undefined;
let lastHit = 0;
let downtime = 1000;

export function connectWithLeapDevice(svg) {
  svgNode = svg;
  coords = d3.selectAll(".coords");
  svgNode.select("#leapPointer").remove();
  svgNode.select("#gifLoaderImg").remove();
  svgNode
    .insert("svg:image")
    .attr("id", "gifLoaderImg")
    .style("display", "none")
    .attr("x", prevX)
    .attr("y", prevX)
    .attr("width", 22.5)
    .attr("height", 22.5)
    .attr("xlink:href", gifPointer);
  svgNode
    .insert("svg:image")
    .attr("id", "leapPointer")
    .attr("x", prevX)
    .attr("y", prevY)
    .attr("width", 22.5)
    .attr("height", 22.5)
    .attr("xlink:href", pointer);
  // Main Leap Loop
  controller = Leap.loop(options, function (frame) {
    /*
     * Frames are ignored if they occur too soon after a gesture was recognized.
     */
    if (new Date().getTime() - lastHit < downtime) {
      return;
    }
    if (frame.valid && frame.fingers.length > 0) {
      try {
        if (frame.hands.length === MIN_HAND) {
          hand = frame.hands[0];
          //Creating leap interation box
          position = frame.interactionBox.normalizePoint(
            hand.stabilizedPalmPosition,
            true
          );
          //If any gesture exist I use it for normal zoom IN/OUT on circular gesture
          if (getExtendedFingersCount(hand) < MAX_FINGERS) {
              if (frame.data.gestures.length) {
             if (frame.data.gestures[0].type != "circle") return;
              gestureHandler(frame.data.gestures, frame);
            }
             /*@iangilman :
             Sir If we point over the object with Index finger open and thumb close then 
             select object will work.I pass the interationbox postion to slectobject method.
             Please take look of the gesture image
             https://st3.depositphotos.com/11296934/17829/i/1600/depositphotos_178290940-stock-photo-hand-point-index-finger-isolated.jpg
             */
            if (hand.fingers[1].extended && (!hand.fingers[0].extended)) {
            //  console.log("select object postion",position)
              selectObject(position)
            }
          }
          /*@iangilman :
          Sir If we move hand with open pam then cursor will start moving.
          From here I pass the interation box poistion into drawCursor method
          */
          if (getExtendedFingersCount(hand) === MAX_FINGERS) {
            //console.log("cursor postion",position)
             drawCursor(position)
          }
        }
        //  else {
        //   throw "Please use one hand program is desing to support one hand at a time";
        // }
      } catch (error) {
        console.error("Leap Error:", error);
      }
    }
  });
  controller.setBackground(true);
  //geneate random screen coordinates
  // setInterval(()=>{
  //   var x = (Math.random() * ((osdWidth) - parseFloat(d3.select('#leapPointer').attr('width')))).toFixed();
  //   var y = (Math.random() * ((osdHeight) - parseFloat(d3.select('#leapPointer').attr('width')) )).toFixed();
  //   let point = [x,y]
  //   console.log(point)
  //   drawCursor(point)
  //   selectObject(point)
  // },2500)
}

function gestureHandler(gestures, frame) {
  gestures.forEach(function (gesture) {
    switch (gesture.type) {
      case "circle":
        if (hand.fingers[0].extended && getExtendedFingersCount(hand) >1) {
          pointableId = gesture.pointableIds[0];
          let direction = frame.pointable(pointableId).direction;
          let dotProduct = Leap.vec3.dot(direction, gesture.normal);
          if (dotProduct > 0 && frame.pointable(pointableId).extended) {
            let scaleIncrement = getScale() + 1;
            let zoomTimer = setTimeout(() => {
              scaleIncrement = scaleIncrement >= 25 ? 25 : scaleIncrement;
              let [l, t] = [getPointerCoords().x, getPointerCoords().y];
              prevX = l;
              prevY = t;
              setMotionZoomIn(scaleIncrement, l, t);
              clearTimeout(zoomTimer);
            }, 2);
          } else if (dotProduct < 0 && frame.pointable(pointableId).extended) {
            if (Math.floor(getScale()) === 1) return;
            setMotionZoomOut(true);
            changeSize(15)
          }
        }
        break;
        // case "keyTap":
        //   console.log("Key Tap Gesture",gesture);
        //   break;  
    }
    return;
  });
}
function getExtendedFingersCount(hand) {
  let extendedFingers = 0;
  for (let f = 0; f < hand.fingers.length; f++) {
    let finger = hand.fingers[f];
    if (finger.extended) extendedFingers++;
  }
  return extendedFingers;
}
function selectObject(points) {
  let radius = 10
  let scrCoords = getCursorInsideViewPort(points[0], points[1]);
  let [x, y] = [scrCoords.x, scrCoords.y];
  //comment line 159,160 and then uncomment line 162 for random point check
//let [x,y] = [points[0],points[1]]
  prevX = x;
  prevY = y;
  let hoveredObject;
  if (!timeoutId) {
    timeoutId = window.setTimeout(function () {
      timeoutId = null; // EDIT: added this line
      coords.each(function () {
        hoveredObject = d3.select(this);
        let dx = Math.abs(parseFloat(hoveredObject.attr("x")) - x);
        let dy = Math.abs(parseFloat(hoveredObject.attr("y")) - y);
        //arrange the value for selection 
        if (getScale() <= 1) {
          dy -= 10
          dx -= 5
        }
        if(getScale()>=5){
          radius =4
        }
        if (dx * dx + dy * dy <= radius * radius) {
          if (getCurrentSelected() != hoveredObject.attr("index")) {
            /**
             * This function will take the object details and cursor x,y
             * value.
             * import {hoveredObjectClick} from "./object-manager";
             */
            hoveredObjectClick(hoveredObject,x,y);
          }
          return true;
        } else {
          hoveredObject = null;
        }
      });
      if (timeoutId) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    }, 1000);
  }
}

function drawCursor(points) {
  /**
   * Sir getCursorInsideViewPort takes leap points and convert them into screen relative points
   * here I do some values +/- to maintain the cursor Inside screen 
   */
  let scrCoords = getCursorInsideViewPort(points[0], points[1]);
  let [x, y] = [scrCoords.x, scrCoords.y];
  //comment line 207,208 and then uncomment line 210 for random point check
 //let [x,y] = [ points[0], points[1]]
  if (sWidth - x === 0 || sHeight - y === 0) {
    //Here I minus some value form x,y coords for maintaining cursor in viewport
    x -= 5;
    y -= 15;
  }
  prevX = x;
  prevY = y;
  svgNode.select("#gifLoaderImg").attr("x", x).attr("y", y);
  svgNode.select("#leapPointer").attr("x", x).attr("y", y);
  if (getScale() > 1) {
    dragHandler(points, 10);
  }
}
function lightboxCursor(frame) {
  return true;
}


function dragHandler(points, pixelsPerArrowPress) {
  let x = points[0];
  let y = points[1];
  if (x === 0) {
    scrollLeftKeyEvent(pixelsPerArrowPress);
  } else if (x === 1) {
    scrollRightKeyEvent(pixelsPerArrowPress);
  } else if (y === 1) {
    scrollUpKeyEvent(pixelsPerArrowPress);
  } else if (y === 0) {
    scrollDownKeyEvent(pixelsPerArrowPress);
  }
  return;
}

function getCursorInsideViewPort(x, y) {
  if (getScale() > 1) {
    /**
     * If OSD scale is greate then 1 then these values will return 
     * If we remove this then on zoom cursor will lost.
     */
    let z = getTransform();
    let w = sWidth * x + 5;
    let h = sHeight * (1 - y) + 5;
    let center = {
      x: (z.x / getScale()) * -1 + (w / getScale()) * 1,
      y: (z.y / getScale()) * -1 + (h / getScale()) * 1,
    };
    return { x: center.x, y: center.y };
  }
  /**
   * Normal Leap calculation 
   */
  return { x: sWidth * x, y: sHeight * (1 - y) };
}

function getPointerCoords() {
  let leapPointer = svgNode.select("#leapPointer");
  let x = parseFloat(leapPointer.attr("x"));
  let y = parseFloat(leapPointer.attr("y"));
  return { x: x, y: y };
}
