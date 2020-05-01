"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getScaleExtent = getScaleExtent;
exports.fitWithinContainer = fitWithinContainer;
exports.constrainZoom = constrainZoom;
exports.getZoomStyle = getZoomStyle;
exports.getZoomAttr = getZoomAttr;
exports.DEFAULT_SCALE_EXTENT = void 0;

var _d3Zoom = require("d3-zoom");

// Copyright (c) 2019 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
const SCALE_MAX = 1;
const SCALE_MIN = 0.03;
const SCALE_MARGIN = 0.05;
const DEFAULT_ZOOM_STYLE = Object.freeze({
  transform: `translate(0px, 0px) scale(1)`,
  transformOrigin: '0 0'
});
const DEFAULT_SCALE_EXTENT = [SCALE_MIN, SCALE_MAX];
exports.DEFAULT_SCALE_EXTENT = DEFAULT_SCALE_EXTENT;

function boundValue(min, max, value) {
  if (value < min) {
    return min;
  }

  return value > max ? max : value;
}

function getFittedScale(width, height, viewWidth, viewHeight) {
  return Math.max(SCALE_MIN, Math.min((1 - SCALE_MARGIN) * viewWidth / width, (1 - SCALE_MARGIN) * viewHeight / height, SCALE_MAX));
}

function getScaleExtent(width, height, viewWidth, viewHeight) {
  const scaleMin = getFittedScale(width, height, viewWidth, viewHeight);
  return [scaleMin, SCALE_MAX];
}

function fitWithinContainer(width, height, viewWidth, viewHeight) {
  const scale = getFittedScale(width, height, viewWidth, viewHeight);
  const scaledHeight = scale * height;
  const scaledWidth = scale * width;
  const x = (viewWidth - scaledWidth) / 2;
  const y = (viewHeight - scaledHeight) / 2;
  return _d3Zoom.zoomIdentity.translate(x, y).scale(scale);
}

function constrainZoom(transform, width, height, viewWidth, viewHeight) {
  const tk = transform.k,
        tx = transform.x,
        ty = transform.y;
  const fittedScale = getFittedScale(width, height, viewWidth, viewHeight);
  const k = Math.max(tk, fittedScale);
  const x = boundValue(-width * k + viewWidth * 0.5, viewWidth * 0.5, tx);
  const y = boundValue(-height * k + viewHeight * 0.5, viewHeight * 0.5, ty);

  if (k !== tk || x !== tx || y !== ty) {
    return _d3Zoom.zoomIdentity.translate(x, y).scale(k);
  }

  return transform;
}

function getZoomStyle(transform) {
  if (transform == null) {
    return DEFAULT_ZOOM_STYLE;
  }

  const x = transform.x,
        y = transform.y,
        k = transform.k;
  const rv = {
    transform: `translate(${x.toFixed()}px, ${y.toFixed()}px) scale(${k})`,
    transformOrigin: '0 0'
  };
  return rv;
}

function getZoomAttr(transform) {
  if (!transform) {
    return undefined;
  }

  const x = transform.x,
        y = transform.y,
        k = transform.k;
  return `translate(${x.toFixed()},${y.toFixed()}) scale(${k})`;
}