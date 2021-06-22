/*
   Determines if the user is zooming in our out
 */
   export const getZoomDirection = (prevScale, currentScale) => {
    let delta;
    let direction;
    delta = currentScale - prevScale;
    if (delta > 0) {
      direction = "in";
    } else if (delta < 0) {
      direction = "out";
    } else {
      direction = "none";
    }
    return direction;
  };
  