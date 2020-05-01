"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toDot;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
const GRAPH_FOOTER = `}`;
const DEFAULT_GRAPH_ATTRS = {
  nodesep: 1.5,
  rankdir: 'LR',
  ranksep: 5,
  sep: 0.5,
  shape: 'box',
  splines: 'true'
};

function makeGraphWrapper(options) {
  const _DEFAULT_GRAPH_ATTRS$ = _objectSpread({}, DEFAULT_GRAPH_ATTRS, options),
        nodesep = _DEFAULT_GRAPH_ATTRS$.nodesep,
        rankdir = _DEFAULT_GRAPH_ATTRS$.rankdir,
        ranksep = _DEFAULT_GRAPH_ATTRS$.ranksep,
        sep = _DEFAULT_GRAPH_ATTRS$.sep,
        shape = _DEFAULT_GRAPH_ATTRS$.shape,
        splines = _DEFAULT_GRAPH_ATTRS$.splines;

  return `digraph G {
  graph[nodesep=${nodesep.toFixed(3)}, rankdir=${rankdir}, ranksep=${ranksep.toFixed(3)}, sep=${sep.toFixed(3)}, splines=${splines}];
  node [shape=${shape}, fixedsize=true, label="", color="_", fillcolor="_"];
  edge [arrowhead=none, arrowtail=none];`;
}

function makeNode(v) {
  const vertex = v.vertex,
        height = v.height,
        width = v.width;
  let pos = '';

  if ('left' in v && 'top' in v) {
    const left = v.left,
          top = v.top;
    pos = `,pos="${left.toFixed(5)},${top.toFixed(5)}!"`;
  }

  return `"${vertex.key}" [height=${height.toFixed(5)},width=${width.toFixed(5)}${pos}];`;
}

function makeEdge(head, tails) {
  let isBidirectional = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  const bidir = isBidirectional ? ' [style="bidir",dir=both]' : '';

  if (!Array.isArray(tails)) {
    return `"${head}"->"${tails}"${bidir};`;
  }

  const tailStrs = tails.map(tail => `"${tail}"`);
  return `"${head}"->{ ${tailStrs.join(' ')} };`;
}

function toDot(edges, vertices, options) {
  const bidirectional = [];
  const fromTo = new Map();
  edges.forEach(edge => {
    if (edge.isBidirectional) {
      bidirectional.push(edge);
      return;
    }

    const tails = fromTo.get(edge.from) || [];
    tails.push(edge.to);
    fromTo.set(edge.from, tails);
  });
  const nodeStrs = vertices.map(makeNode);
  const bidirStrs = bidirectional.map(edge => makeEdge(edge.from, edge.to, true));
  const edgeStrs = [];
  fromTo.forEach((tails, from) => {
    edgeStrs.push(makeEdge(from, tails));
  });
  return [makeGraphWrapper(options), '  ', nodeStrs.join('\n  '), '  ', bidirStrs.join('\n  '), '  ', edgeStrs.join('\n  '), GRAPH_FOOTER].join('\n  ');
}