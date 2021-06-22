let _node;
let _viewer;
let _containerWidth = 0;
let _containerHeight = 0;
let _svg;
let snapDragon;
let zoom;
let scale;
let dThree;
let size = 0.10;
export function svgOverLay(viewer, osdWidth, osdHeight, dragon, d3) {
  snapDragon = dragon;
  dThree = d3;
  const svgNS = "http://www.w3.org/2000/svg";
  [_viewer, _containerWidth, _containerHeight] = [viewer, osdWidth, osdHeight]
  _svg = document.createElementNS(svgNS, "svg")
  _svg.style.position = "absolute"
  _svg.style.left = 0
  _svg.style.top = 0
  _svg.style.width = "100%"
  _svg.style.height = "100%"
  _viewer.canvas.appendChild(_svg)
  _node = document.createElementNS(svgNS, "g");
  _svg.appendChild(_node);
  _viewer.addHandler("open", function () {
    resize()
  })
  _viewer.addHandler("rotate", function (evt) {
    resize()
  })
  _viewer.addHandler("pan", function(evt) {
    resize()
  })
  _viewer.addHandler("resize", function () {
    resize()
  })
    _viewer.addHandler('canvas-click', function(event) {
      
      if (event.quick) {
        console.log(event)
        var point = event.position;
        var vp = _viewer.viewport.windowToViewportCoordinates(point);
        var box = new snapDragon.Rect(vp.x - size / 2, vp.y - size / 2, size, size); 
        _viewer.viewport.fitBounds(box);
        _viewer.viewport.applyConstraints();
      }
   });
  resize()
}

export function resize() {
  if (_containerWidth !== _viewer.container.clientWidth) {
    _containerWidth = _viewer.container.clientWidth
    _svg.setAttribute("width", _containerWidth)
  }
  if (_containerHeight !== _viewer.container.clientHeight) {
    _containerHeight = _viewer.container.clientHeight
    _svg.setAttribute("height", _containerHeight)
  }
  let p = getDragonPoint()
  zoom = getZoom(true)
  scale = (1 * zoom)
  _node.setAttribute("transform",
    "translate(" + p.x + "," + p.y + ") scale(" + scale + ")")
}

export function svgNode() {
  return _node;
}

export function getScale() {
  return scale;
}

export function getZoom() {
  return _viewer.viewport.getZoom(true);
}

export function getDragonPoint() {
  return _viewer.viewport.pixelFromPoint(new snapDragon.Point(0, 0), true);
}

export function setTransformationLevel(zoomLevel, x, y) {
  //console.log(dThree.select())
let point = snapDragon.getMousePosition({ pageX: x, pageY: y });
// console.log(point)
// var vp = _viewer.viewport.windowToViewportCoordinates(point);
// var box = new snapDragon.Rect(vp.x - size / 2, vp.y - size / 2, size, size); 
// _viewer.viewport.fitBounds(box);
// _viewer.viewport.applyConstraints();


// var viewportPoint = _viewer.viewport.pointFromPixel(point);
// var vp= _viewer.viewport.windowToViewportCoordinates(viewportPoint);


//  let vp =_viewer.viewport.viewerElementToViewportCoordinates(point)
//   let box = new snapDragon.Rect(vp.x - size / 2, vp.y - size / 2, size, size); 
//    _viewer.viewport.fitBounds(box);
//    _viewer.viewport.applyConstraints();

  // let vp = _viewer.viewport.windowToViewportCoordinates(point, true);
  // let vpX = vp.x;
  // let vpY = vp.y;
  // if (x <= 146 || x >= 1275 || y < 47 || y>624.9793700777778) {
  //   _viewer.viewport.zoomTo(zoomLevel, new snapDragon.Point(vpX, vpY), false);
  //   return true;
  // }
  // else{
  //   _viewer.viewport.zoomTo(zoomLevel, null, false);
  //   _viewer.viewport.panTo({ x: vpX, y: vpY },false);

  // }

  // var tc = $(window).height() / 2 - _containerHeight / 2;
  // var lc = $(window).width() / 2 -  _containerHeight / 2;

  // let point = snapDragon.getMousePosition({ pageX: x,pageY: y });
  // let vp = _viewer.viewport.windowToViewportCoordinates(point);

  // let newBounds = new snapDragon.Rect(vp.x - size / 2, vp.y - size / 2, size, size); 

  // var aspect = _viewer.viewport.getAspectRatio();
  // var center = newBounds.getCenter();

  // if (newBounds.getAspectRatio() >= aspect) {
  //     newBounds.height = newBounds.width / aspect;
  // } else {
  //     newBounds.width = newBounds.height * aspect;
  // }
  //  // Compute x and y from width, height and center position
  //  newBounds.x = center.x - newBounds.width / 2 ;
  //  newBounds.y = center.y - newBounds.height / 2;
  //  console.log(center)
  //  var newZoom = 1.0 / newBounds.width;

  //  var oldBounds = _viewer.viewport.getBounds();
  //  var oldZoom   = _viewer.viewport.getZoom();

  //  if (oldZoom === 0 || Math.abs(newZoom / oldZoom - 1) < 0.00000001) {
  //    console.log('here')
  //      _viewer.viewport.zoomTo(newZoom, true);
  //      return _viewer.viewport.panTo(center,false);
  //  }

  //  newBounds = newBounds.rotate(-_viewer.viewport.getRotation());
  //  var referencePoint = newBounds.getTopLeft().times(newZoom)
  //      .minus(oldBounds.getTopLeft().times(oldZoom))
  //      .divide(newZoom - oldZoom);

  //  _viewer.viewport.zoomTo(newZoom, referencePoint, false);


// _viewer.viewport.fitBounds(box);
//   _viewer.viewport.applyConstraints();
//console.log(dThree.select('#leapPointer'))
 //  if (x * (zoomLevel - 1) > _containerWidth * (zoomLevel - 1.5)) {
//     x = _containerWidth - _containerWidth / zoomLevel / 2;
//   }
//   if (x * (zoomLevel - 1) < _containerWidth * 0.5) {
//     x = _containerWidth / zoomLevel / 2;
//   }
//   if (y * (zoomLevel - 1) > _containerHeight * (zoomLevel - 1.5)) {
//     y = _containerHeight - _containerHeight / zoomLevel / 2;
//   }
//   if (y * (zoomLevel - 1) < _containerHeight * 0.5) {
//     y = _containerHeight / zoomLevel / 2;
//   }
  //$(document).trigger('click',function () { this.position = function() { this.left = x; this.top = y; }; })
//   var e = new $.Event("mousedown");
//   e.pageX = x;
//   e.pageY = y;
// console.log(  $("#render_map2").trigger(e));

//  document.addEventListener('pointerup', function() {
//   console.log('Event triggered');
// });

// var event = new PointerEvent('pointerup', {
//   'view': window,
//   'bubbles': true,
//   'cancelable': true
// });

//document.dispatchEvent(event);
  _viewer.raiseEvent('canvas-click',{
    eventSource:_viewer,
    position:point,
    quick:true,
    shift:false,
    preventDefaultAction:false, 
    originalEvent: new PointerEvent('pointerup',{
      clientX:point.x,
      clientY:point.y,
      screenX:point.x,
      screenY:point.y,
      view:window,
      pointerType:'mouse',
      pointerId:1
    })

})

  // document.getElementById('render_map2').dispatchEvent(new CustomEvent('canvas-click', { 'bubbles': true }))
  //    let point = snapDragon.getMousePosition({ pageX: x, pageY: y });
  //       var vp = _viewer.viewport.windowToViewportCoordinates(point);
  //       var box = new snapDragon.Rect(vp.x - size / 2, vp.y - size / 2, size, size); 
  //       _viewer.viewport.fitBounds(box);
  //       _viewer.viewport.applyConstraints();
    return true;
 }

export function setMotionZoomIn(scaleLevel, x, y) {
  let point = snapDragon.getMousePosition({ pageX: x, pageY: y });
  let vp = _viewer.viewport.pointFromPixel(point, true);
  let vpX = vp.x;
  let vpY = vp.y;
  _viewer.viewport.zoomTo(scaleLevel, new snapDragon.Point(vpX, vpY), false);
  return true;
}

export function setMotionZoomOut(immediately) {
  _viewer.viewport.goHome(immediately);
  return true;
}

export function getTransform() {
  let matrix = _node.transform.baseVal.consolidate().matrix;
  return { x: matrix.e, y: matrix.f };
}

export function scrollUpKeyEvent(pixelsPerArrowPress) {
  _viewer.viewport.panBy(_viewer.viewport.deltaPointsFromPixels(new snapDragon.Point(0, -pixelsPerArrowPress)));
  _viewer.viewport.applyConstraints();
  return true;
}

export function scrollDownKeyEvent(pixelsPerArrowPress) {
  _viewer.viewport.panBy(_viewer.viewport.deltaPointsFromPixels(new snapDragon.Point(0, pixelsPerArrowPress)));
  _viewer.viewport.applyConstraints();
  return true;
}

export function scrollLeftKeyEvent(pixelsPerArrowPress) {
  _viewer.viewport.panBy(_viewer.viewport.deltaPointsFromPixels(new snapDragon.Point(-pixelsPerArrowPress, 0)));
  _viewer.viewport.applyConstraints();
  return true;
}

export function scrollRightKeyEvent(pixelsPerArrowPress) {
  _viewer.viewport.panBy(_viewer.viewport.deltaPointsFromPixels(new snapDragon.Point(pixelsPerArrowPress, 0)));
  _viewer.viewport.applyConstraints();
  return true;
}