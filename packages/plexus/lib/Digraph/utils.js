"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assignMergeCss = assignMergeCss;
exports.getProps = getProps;
exports.isSamePropSetter = isSamePropSetter;
exports.getValueScaler = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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
function reduce(a, b) {
  // eslint-disable-next-line prefer-const
  let className = a.className,
      style = a.style,
      rest = _objectWithoutProperties(a, ["className", "style"]);

  const bClassName = b.className,
        bStyle = b.style,
        bRest = _objectWithoutProperties(b, ["className", "style"]); // merge className props


  if (bClassName) {
    className = className ? `${className} ${bClassName}` : bClassName;
  } // merge style props


  if (bStyle && typeof bStyle === 'object') {
    style = style ? _objectSpread({}, style, bStyle) : bStyle;
  }

  return _objectSpread({
    className,
    style
  }, rest, bRest);
}

function assignMergeCss() {
  for (var _len = arguments.length, objs = new Array(_len), _key = 0; _key < _len; _key++) {
    objs[_key] = arguments[_key];
  }

  return objs.reduce(reduce);
}

function getProps(propSpec) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  if (!propSpec) {
    return {};
  }

  const specs = Array.isArray(propSpec) ? propSpec : [propSpec];
  const propsList = specs.map(spec => typeof spec === 'function' ? spec(...args) || {} : spec);
  return assignMergeCss(...propsList);
}

const getValueScaler = (() => {
  // define via an IIFE to sequester non-public stuff
  const DEFAULT_PARAMS = {
    expAdjuster: 0.5,
    factorMax: 1,
    factorMin: 0,
    valueMax: 1,
    valueMin: 0.3
  }; // eslint-disable-next-line no-shadow

  function getValueScaler() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    const _DEFAULT_PARAMS$confi = _objectSpread({}, DEFAULT_PARAMS, config),
          expAdjuster = _DEFAULT_PARAMS$confi.expAdjuster,
          factorMax = _DEFAULT_PARAMS$confi.factorMax,
          factorMin = _DEFAULT_PARAMS$confi.factorMin,
          valueMax = _DEFAULT_PARAMS$confi.valueMax,
          valueMin = _DEFAULT_PARAMS$confi.valueMin;

    return function scaleValue(factor) {
      if (factor >= factorMax) {
        return valueMax;
      }

      if (factor <= factorMin) {
        return valueMin;
      }

      return valueMin + ((factor - factorMin) / (factorMax - factorMin)) ** expAdjuster * (valueMax - valueMin);
    };
  }

  return getValueScaler;
})();

exports.getValueScaler = getValueScaler;

function isSamePropSetter(a, b) {
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) {
      return false;
    }

    return !a.some((item, i) => item !== b[i]);
  }

  return a === b;
}