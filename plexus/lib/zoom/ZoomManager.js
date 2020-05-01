"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "zoomIdentity", {
  enumerable: true,
  get: function get() {
    return _d3Zoom.zoomIdentity;
  }
});
exports.default = void 0;

var _d3Selection = require("d3-selection");

var _d3Zoom = require("d3-zoom");

var _utils = require("./utils");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

class ZoomManager {
  static getZoomAttr(zoomTransform) {
    return (0, _utils.getZoomAttr)(zoomTransform);
  }

  static getZoomStyle(zoomTransform) {
    return (0, _utils.getZoomStyle)(zoomTransform);
  }

  constructor(updateCallback) {
    this.elem = null;
    this.contentSize = null;
    this.selection = null;
    this.updateCallback = void 0;
    this.zoom = void 0;
    this.currentTransform = _d3Zoom.zoomIdentity;

    this.resetZoom = () => {
      const elem = this.elem;
      const selection = this.selection;
      const size = this.contentSize;

      if (!elem || !selection || !size) {
        this.updateCallback(_d3Zoom.zoomIdentity);
        return;
      }

      const viewHeight = elem.clientHeight,
            viewWidth = elem.clientWidth;
      this.currentTransform = (0, _utils.fitWithinContainer)(size.width, size.height, viewWidth, viewHeight);
      this.zoom.transform(selection, this.currentTransform);
      this.updateCallback(this.currentTransform);
    };

    this.onZoomed = () => {
      if (!this.elem) {
        return;
      }

      this.currentTransform = (0, _d3Zoom.zoomTransform)(this.elem);
      this.updateCallback(this.currentTransform);
    };

    this.constrainZoom = (transform, extent) => {
      if (!this.contentSize) {
        return transform;
      }

      const _this$contentSize = this.contentSize,
            height = _this$contentSize.height,
            width = _this$contentSize.width;

      const _extent = _slicedToArray(extent, 2),
            _extent$ = _slicedToArray(_extent[1], 2),
            vw = _extent$[0],
            vh = _extent$[1];

      return (0, _utils.constrainZoom)(transform, width, height, vw, vh);
    };

    this.updateCallback = updateCallback;
    this.zoom = (0, _d3Zoom.zoom)().scaleExtent(_utils.DEFAULT_SCALE_EXTENT).constrain(this.constrainZoom).on('zoom', this.onZoomed);
  }

  setElement(elem) {
    if (elem === this.elem) {
      return;
    }

    this.elem = elem;
    this.selection = (0, _d3Selection.select)(elem);
    this.selection.call(this.zoom);
    this.setExtent();
    this.resetZoom();
  }

  setContentSize(size) {
    if (!this.contentSize || this.contentSize.height !== size.height || this.contentSize.width !== size.width) {
      this.contentSize = size;
    }

    this.setExtent();
    this.resetZoom();
  }

  getProps() {
    const _this$currentTransfor = this.currentTransform,
          x = _this$currentTransfor.x,
          y = _this$currentTransfor.y,
          k = _this$currentTransfor.k;

    const _ref = this.contentSize || {},
          _ref$height = _ref.height,
          contentHeight = _ref$height === void 0 ? 1 : _ref$height,
          _ref$width = _ref.width,
          contentWidth = _ref$width === void 0 ? 1 : _ref$width;

    const _ref2 = this.elem || {},
          _ref2$clientHeight = _ref2.clientHeight,
          viewportHeight = _ref2$clientHeight === void 0 ? 1 : _ref2$clientHeight,
          _ref2$clientWidth = _ref2.clientWidth,
          viewportWidth = _ref2$clientWidth === void 0 ? 1 : _ref2$clientWidth;

    return {
      contentHeight,
      contentWidth,
      k,
      viewportHeight,
      viewportWidth,
      x,
      y,
      viewAll: this.resetZoom
    };
  }

  setExtent() {
    const elem = this.elem;
    const size = this.contentSize;

    if (!elem || !size) {
      return;
    }

    const viewHeight = elem.clientHeight,
          viewWidth = elem.clientWidth;
    const scaleExtent = (0, _utils.getScaleExtent)(size.width, size.height, viewWidth, viewHeight);
    this.zoom.scaleExtent(scaleExtent);
  }

}

exports.default = ZoomManager;