"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assignMergeCss = assignMergeCss;
exports.default = mergePropSetters;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// Copyright (c) 2018 Uber Technologies, Inc.
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

function mergePropSetters() {
  for (var _len2 = arguments.length, fns = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fns[_key2] = arguments[_key2];
  }

  return input => {
    const propsList = [];

    for (let i = 0; i < fns.length; i++) {
      const props = fns[i](input); // TypeScript doesn't believe in `.filter(Boolean)`, so do this manually
      // http://t.uber.com/joef-ts-strict-filter-boolean

      if (props) {
        propsList.push(props);
      }
    }

    return propsList.reduce(reduce);
  };
}