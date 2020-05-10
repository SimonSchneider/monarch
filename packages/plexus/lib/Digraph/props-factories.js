"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scaleProperty = exports.classNameIsSmall = void 0;

var _utils = require("./utils");

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
const classNameIsSmall = (() => {
  // define via an IIFE to sequester consts
  const SCALE_THRESHOLD_SMALL = 0.29; // eslint-disable-next-line no-shadow

  function classNameIsSmall(graphState) {
    const _ref = graphState.zoomTransform || {},
          _ref$k = _ref.k,
          k = _ref$k === void 0 ? 1 : _ref$k;

    if (k <= SCALE_THRESHOLD_SMALL) {
      return {
        className: 'is-small'
      };
    }

    return null;
  }

  return classNameIsSmall;
})();

exports.classNameIsSmall = classNameIsSmall;

const scaleProperty = (() => {
  // define via an IIFE to sequester consts
  const MAX = 1;
  const MIN = 0.3;
  const EXP_ADJUSTER = 0.5; // eslint-disable-next-line no-shadow

  function scaleProperty(property) {
    let valueMin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : MIN;
    let valueMax = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : MAX;
    let expAdjuster = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EXP_ADJUSTER;
    const defaultStyle = {
      style: {
        [property]: valueMax
      }
    };
    const fnName = `scale_${property}`;
    const valueScaler = (0, _utils.getValueScaler)({
      valueMax,
      valueMin,
      expAdjuster
    });
    const o = {
      [fnName](graphState) {
        const zoomTransform = graphState.zoomTransform;

        if (!zoomTransform) {
          return defaultStyle;
        }

        const value = valueScaler(zoomTransform.k);
        return {
          style: {
            [property]: value
          }
        };
      }

    };
    return o[fnName];
  }

  scaleProperty.opacity = scaleProperty('opacity');
  scaleProperty.strokeOpacity = scaleProperty('strokeOpacity');
  scaleProperty.strokeOpacityStrong = scaleProperty('strokeOpacity', MIN, MAX, 0.75);
  scaleProperty.strokeOpacityStrongest = scaleProperty('strokeOpacity', MIN, MAX, 1);
  return scaleProperty;
})();

exports.scaleProperty = scaleProperty;