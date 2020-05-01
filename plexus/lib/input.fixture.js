"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sizedInput = exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
const input = {
  vertices: [{
    key: 'string key 0',
    data: {
      value: new Date(),
      message: 'vertex w a string key that has spaces'
    }
  }, {
    key: 1,
    label: 'Key is the number 1',
    data: {
      err: new Error('An error object'),
      message: 'vertex with a number key and a string label'
    }
  }, {
    key: '2',
    label: _react.default.createElement("h3", null, "OMG an H3"),
    data: {
      message: 'label is an H3 React element'
    }
  }, {
    key: 33,
    data: {
      value: /abc/,
      message: 'data contains a RegExp and the node lacks a label'
    }
  }],
  edges: [{
    from: 'string key 0',
    to: 1,
    label: 'The Great TEdge Label',
    data: 'TEdge with a string label'
  }, {
    from: 'string key 0',
    to: '2',
    label: _react.default.createElement("strong", null, "Drop it like its hot"),
    data: 'edge with a React.Node label'
  }, {
    from: '1',
    to: '2',
    data: 'edge sans label'
  }, {
    from: '2',
    to: 33,
    isBidirectional: true,
    data: 'A bidirection edge'
  }]
};
var _default = input;
exports.default = _default;
const sizedInput = {
  vertices: input.vertices.map(vertex => ({
    vertex,
    height: 100,
    width: 300
  })),
  edges: input.edges
};
exports.sizedInput = sizedInput;