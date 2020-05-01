"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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
// SVG is from React Icons:
// https://github.com/react-icons/react-icons/blob/396b4d9241a61b6d22f3907273158b6a91aea2fd/md/zoom-out-map.js
// LICENSE: MIT
var _default = React.createElement("svg", {
  fill: "currentColor",
  preserveAspectRatio: "xMidYMid meet",
  height: "1em",
  width: "1em",
  viewBox: "0 0 40 40"
}, React.createElement("g", null, React.createElement("path", {
  d: "m35 25v10h-10l3.8-3.8-4.8-4.8 2.4-2.4 4.8 4.8z m-20 10h-10v-10l3.8 3.8 4.8-4.8 2.4 2.4-4.8 4.8z m-10-20v-10h10l-3.8 3.8 4.8 4.8-2.4 2.4-4.8-4.8z m20-10h10v10l-3.8-3.8-4.8 4.8-2.4-2.4 4.8-4.8z"
})));

exports.default = _default;