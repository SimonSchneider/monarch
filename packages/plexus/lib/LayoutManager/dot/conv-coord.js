"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vertexToDot = vertexToDot;
exports.edgeToPixels = edgeToPixels;
exports.graphToPixels = graphToPixels;
exports.vertexToPixels = vertexToPixels;
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
const round = Math.round;
const DPI = 72;

function vertexToDot(v) {
  // expect only width and height for going to dot
  const vertex = v.vertex,
        height = v.height,
        width = v.width;
  return {
    vertex,
    height: height / DPI,
    width: width / DPI
  };
}

function edgeToPixels(graph, e) {
  const h = graph.height;
  const edge = e.edge,
        pathPoints = e.pathPoints;
  return {
    edge,
    pathPoints: pathPoints && pathPoints.map(pt => [round(pt[0] * DPI), round((h - pt[1]) * DPI)])
  };
}

function graphToPixels(graph) {
  const height = graph.height,
        scale = graph.scale,
        width = graph.width;
  return {
    scale,
    height: height * DPI,
    width: width * DPI
  };
}

function vertexToPixels(graph, v) {
  const h = graph.height;
  const vertex = v.vertex,
        height = v.height,
        left = v.left,
        top = v.top,
        width = v.width;
  return {
    vertex,
    height: round(height * DPI),
    left: left != null ? round((left - width * 0.5) * DPI) : left,
    top: top != null ? round((h - top - height * 0.5) * DPI) : top,
    width: round(width * DPI)
  };
}