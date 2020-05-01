"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getLayout;

var _viz = _interopRequireDefault(require("viz.js/viz.js"));

var _convPlain2 = _interopRequireDefault(require("./dot/convPlain"));

var _toDot = _interopRequireDefault(require("./dot/toDot"));

var _types = require("./types");

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
var EValidity;

(function (EValidity) {
  EValidity["Ok"] = "Ok";
  EValidity["Warn"] = "Warn";
  EValidity["Error"] = "Error";
})(EValidity || (EValidity = {}));

const SHIFT_THRESHOLD = 0.015;

function isCloseEnough(a, b) {
  return Math.abs(a - b) / b < SHIFT_THRESHOLD;
}

function getVerticesValidity(input, output) {
  const inputHash = {};
  input.forEach(v => {
    inputHash[String(v.vertex.key)] = v;
  });
  let warn;

  for (let i = 0; i < output.length; i++) {
    const _output$i = output[i],
          key = _output$i.vertex.key,
          height = _output$i.height,
          left = _output$i.left,
          top = _output$i.top,
          width = _output$i.width;
    const src = inputHash[String(key)];

    if (!src) {
      return {
        validity: EValidity.Error,
        message: `Extra vertex found: ${key}`
      };
    }

    if (!isCloseEnough(src.height, height) || !isCloseEnough(src.width, width)) {
      return {
        validity: EValidity.Error,
        message: `Vertex ${key} failed size threshhold check (${SHIFT_THRESHOLD})`
      };
    }

    if ('left' in src && 'top' in src) {
      const srcLeft = src.left,
            srcTop = src.top;

      if (!isCloseEnough(srcLeft, left) || !isCloseEnough(srcTop, top)) {
        warn = {
          validity: EValidity.Warn,
          message: `Vertex ${key} failed position threshhold check (${SHIFT_THRESHOLD})`
        };
      }
    }

    delete inputHash[String(key)];
  }

  const missingKeys = Object.keys(inputHash);

  if (missingKeys.length !== 0) {
    const word = missingKeys.length > 1 ? 'vertices' : 'vertex';
    return {
      validity: EValidity.Error,
      message: `Missing ${word}: ${missingKeys.join(', ')}`
    };
  }

  return warn || {
    validity: EValidity.Ok,
    message: null
  };
}

function getLayout(phase, inEdges, inVertices, layoutOptions) {
  const dot = (0, _toDot.default)(inEdges, inVertices, layoutOptions);

  const _ref = layoutOptions || {},
        _ref$totalMemory = _ref.totalMemory,
        totalMemory = _ref$totalMemory === void 0 ? undefined : _ref$totalMemory;

  const options = {
    totalMemory,
    engine: phase === _types.EWorkerPhase.Edges ? 'neato' : 'dot',
    format: 'plain'
  };
  const plainOut = (0, _viz.default)(dot, options);

  const _convPlain = (0, _convPlain2.default)(plainOut, phase !== _types.EWorkerPhase.Positions),
        edges = _convPlain.edges,
        graph = _convPlain.graph,
        vertices = _convPlain.vertices;

  const result = getVerticesValidity(inVertices, vertices);

  if (result.validity === EValidity.Error) {
    const message = result.message;
    return {
      graph,
      edges,
      vertices,
      layoutError: true,
      layoutErrorMessage: message
    };
  }

  if (result.validity === EValidity.Warn) {
    return {
      graph,
      edges,
      vertices,
      layoutErrorMessage: result.message
    };
  }

  return {
    edges,
    graph,
    vertices
  };
}