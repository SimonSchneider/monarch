"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defs = exports.arrowDef = exports.iriRef = void 0;

var React = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// Copyright (c) 2017 Uber Technologies, Inc.
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
const id = 'edgeArrow';
const iriRef = `url(#${id})`;
exports.iriRef = iriRef;
const arrowDef = React.createElement("marker", {
  id: id,
  markerWidth: "8",
  markerHeight: "8",
  refX: "8",
  refY: "3",
  orient: "auto",
  markerUnits: "strokeWidth"
}, React.createElement("path", {
  d: "M0,0 L0,6 L9,3 z",
  fill: "#000"
}));
exports.arrowDef = arrowDef;
const defs = React.createElement("defs", null, arrowDef);
exports.defs = defs;