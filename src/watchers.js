export let fontSizeWatcher = {
  fontSizeDefault: 35,
  fontSizeListner: function (val) { },
  set fontSize(val) {
    this.fontSizeDefault = val;
    this.fontSizeListner(val);
  },
  get fontSize() {
    return this.fontSizeDefault;
  },
  addFontSizeEventListner: function (evt) {
    this.fontSizeListner = evt;
  }
}
export let thumbnailSizeWatcher = {
  locthumbImageSize: 20,
  thumbImageSizeListner: function (val) { },
  set thumbImageSize(val) {
    this.locthumbImageSize = val
    this.thumbImageSizeListner(val)
  },
  get thumbImageSize() {
    return this.locthumbImageSize
  },
  addThumbImageSizeEventListner: function (evt) {
    this.thumbImageSizeListner = evt
  }
}
export let sImageYWatcher = {
  sImageYDefault: 22,
  sImageYListner: function (val) { },
  set sImgY(val) {
    this.sImageYDefault = val
    this.sImageYListner(val)
  },
  get sImgY() {
    return this.sImageYDefault
  },
  addsImageYEventListner: function (evt) {
    this.sImageYListner = evt
  }
}
export let sImageXWatcher = {
  sImageXDefault: 6,
  sImageXListner: function (val) { },
  set sImgX(val) {
    this.sImageXDefault = val
    this.sImageXListner(val)
  },
  get sImgX() {
    return this.sImageXDefault
  },
  addsImageXEventListner: function (evt) {
    this.sImageXListner = evt
  }
}
export let sLabelYWatcher = {
  sLabelYDefault: 5,
  sLabelYListner: function (val) { },
  set sLabY(val) {
    this.sLabelYDefault = val
    this.slabelYListner(val)
  },
  get sLabY() {
    return this.sLabelYDefault
  },
  addsLabelYEventListner: function (evt) {
    this.sLabelYListner = evt
  }
}
export let sLabelXWatcher = {
  sLabelXDefault: 8,
  sLabelXListner: function (val) { },
  set sLabX(val) {
    this.sLabelXDefault = val
    this.slabelXListner(val)
  },
  get sLabX() {
    return this.sLabelXDefault
  },
  addsLabelXEventListner: function (evt) {
    this.sLabelXListner = evt
  }
}

export let lightBoxWatcher = {
  isLightBoxOpenDefault: false,
  lightBoxListner: function (val) { },
  set isLightBoxOpen(val) {
    this.isLightBoxOpenDefault = val
    this.lightBoxListner(val)
  },
  get isLightBoxOpen() {
    return this.isLightBoxOpenDefault
  },
  addLightBoxEventListner: function (evt) {
    this.lightBoxListner = evt
  }
}

export let offGestureWatcher = {
  isgestureOffDefault: false,
  gestureOffListner: function (val) { },
  set isgestureOff(val) {
    this.isgestureOffDefault = val
    this.gestureOffListner(val)
  },
  get isgestureOff() {
    return this.isgestureOffDefault
  },
  addGestureOffEventListner: function (evt) {
    this.gestureOffListner = evt
  }
}