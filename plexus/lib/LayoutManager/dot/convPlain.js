"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = convPlain;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
const FLAG_MAPPINGS = {
  bidir: 'isBidirectional'
};

function throwMalformedPlain(str, i) {
  throw new Error(`Malformed plain output: ${str.slice(i - 100, i + 100)}`);
}

function parseString(str, startIndex) {
  const isQuoted = str[startIndex] === '"';
  const i = startIndex + Number(isQuoted);
  const end = str.indexOf(isQuoted ? '"' : ' ', i);
  return {
    value: str.slice(i, end),
    end: end + Number(isQuoted)
  };
}

function parseNumber(str, startIndex) {
  let boundary = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';
  const end = str.indexOf(boundary, startIndex);

  if (end < startIndex) {
    throwMalformedPlain(str, startIndex);
  }

  return {
    value: Number(str.slice(startIndex, end)),
    end
  };
}

function parseNumbers(count, str, startIndex) {
  let boundary = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ' ';
  const values = [];
  let ci = startIndex;
  let i = count;

  while (i--) {
    if (str[ci] === ' ') {
      ci++;
    }

    const _parseNumber = parseNumber(str, ci, boundary),
          value = _parseNumber.value,
          end = _parseNumber.end;

    values.push(value);
    ci = end;
  }

  return {
    values,
    end: ci
  };
}

function parseGraph(str, startIndex) {
  // skip "graph "
  const i = startIndex + 6;

  const _parseNumbers = parseNumbers(2, str, i),
        _parseNumbers$values = _slicedToArray(_parseNumbers.values, 2),
        scale = _parseNumbers$values[0],
        width = _parseNumbers$values[1],
        widthEnd = _parseNumbers.end;

  const _parseNumber2 = parseNumber(str, widthEnd + 1, '\n'),
        height = _parseNumber2.value,
        end = _parseNumber2.end;

  return {
    end,
    graph: {
      height,
      scale,
      width
    }
  };
}

function parseNode(str, startIndex) {
  // skip "node "
  const i = startIndex + 5;

  const _parseString = parseString(str, i),
        key = _parseString.value,
        keyEnd = _parseString.end;

  const _parseNumbers2 = parseNumbers(4, str, keyEnd + 1),
        values = _parseNumbers2.values,
        end = _parseNumbers2.end;

  const _values = _slicedToArray(values, 4),
        left = _values[0],
        top = _values[1],
        width = _values[2],
        height = _values[3];

  return {
    vertex: {
      vertex: {
        key
      },
      height,
      left,
      top,
      width
    },
    end: str.indexOf('\n', end + 1)
  };
}

function parseEdge(str, startIndex) {
  // skip "edge "
  const i = startIndex + 5;

  const _parseString2 = parseString(str, i),
        from = _parseString2.value,
        fromEnd = _parseString2.end;

  const _parseString3 = parseString(str, fromEnd + 1),
        to = _parseString3.value,
        toEnd = _parseString3.end;

  const _parseNumber3 = parseNumber(str, toEnd + 1),
        pointCount = _parseNumber3.value,
        endPtCount = _parseNumber3.end;

  const _parseNumbers3 = parseNumbers(pointCount * 2, str, endPtCount + 1),
        flatPoints = _parseNumbers3.values,
        pointsEnd = _parseNumbers3.end;

  const _parseString4 = parseString(str, pointsEnd + 1),
        flags = _parseString4.value,
        flagsEnd = _parseString4.end;

  const pathPoints = [];

  for (let pi = 0; pi < flatPoints.length; pi += 2) {
    pathPoints.push([flatPoints[pi], flatPoints[pi + 1]]);
  }

  const edgeFlags = {};
  flags.split(',').forEach(flag => {
    const name = FLAG_MAPPINGS[flag];

    if (name) {
      edgeFlags[name] = true;
    }
  });
  return {
    edge: {
      edge: _objectSpread({
        from,
        to
      }, edgeFlags),
      pathPoints
    },
    end: str.indexOf('\n', flagsEnd + 1)
  };
}

function convPlain(str) {
  let parseEdges = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const edges = [];
  const vertices = [];
  let i = 0;

  const _parseGraph = parseGraph(str, i),
        graphEnd = _parseGraph.end,
        graph = _parseGraph.graph;

  i = graphEnd + 1; // stop when the "stop" line is hit

  while (str[i] !== 's') {
    if (str[i] === 'n') {
      const _parseNode = parseNode(str, i),
            end = _parseNode.end,
            vertex = _parseNode.vertex;

      vertices.push(vertex);
      i = end + 1;
      continue;
    }

    if (str[i] === 'e') {
      if (!parseEdges) {
        i = str.indexOf('\n', i) + 1;
        continue;
      }

      const _parseEdge = parseEdge(str, i),
            end = _parseEdge.end,
            edge = _parseEdge.edge;

      edges.push(edge);
      i = end + 1;
      continue;
    }

    throwMalformedPlain(str, i);
  }

  return {
    graph,
    vertices,
    edges: parseEdges ? edges : null
  };
}