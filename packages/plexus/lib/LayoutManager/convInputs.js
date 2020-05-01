"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convInputs;

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
const makeEdgeId = edge => `${edge.from}\v${edge.to}`;

function unmapVertices(idToVertex, output) {
  return output.map(lv => {
    const sv = idToVertex.get(lv.vertex.key);

    if (!sv) {
      throw new Error(`Unable to find Vertex for ${lv.vertex.key}`);
    }

    return _objectSpread({}, lv, {
      vertex: sv.vertex
    });
  });
}

function unmapEdges(idsToEdge, output) {
  return output.map(le => {
    const id = makeEdgeId(le.edge);
    const edge = idsToEdge.get(id);

    if (!edge) {
      throw new Error(`Unable to find edge for ${id}`);
    }

    return _objectSpread({}, le, {
      edge
    });
  });
}

function convInputs(srcEdges, inVertices) {
  const keyToId = new Map();
  const idToVertex = new Map();
  const idsToEdge = new Map();
  const vertices = inVertices.map(v => {
    const key = v.vertex.key,
          rest = _objectWithoutProperties(v, ["vertex"]);

    if (keyToId.has(key)) {
      throw new Error(`Non-unique vertex key: ${key}`);
    }

    const id = String(keyToId.size);
    keyToId.set(key, id);
    idToVertex.set(id, v);
    return _objectSpread({
      vertex: {
        key: id
      }
    }, rest);
  });
  const edges = srcEdges.map(e => {
    const from = e.from,
          to = e.to,
          isBidirectional = e.isBidirectional;
    const fromId = keyToId.get(from);
    const toId = keyToId.get(to);

    if (fromId == null) {
      throw new Error(`Unrecognized key on edge, from: ${from}`);
    }

    if (toId == null) {
      throw new Error(`Unrecognized key on edge, to: ${to}`);
    }

    const edge = {
      isBidirectional,
      from: fromId,
      to: toId
    };
    idsToEdge.set(makeEdgeId(edge), e);
    return edge;
  });
  return {
    edges,
    vertices,
    unmapEdges: unmapEdges.bind(null, idsToEdge),
    unmapVertices: unmapVertices.bind(null, idToVertex)
  };
}