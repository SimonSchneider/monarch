"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _Node = _interopRequireDefault(require("./Node"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
class PureNodes extends React.PureComponent {
  _renderVertices() {
    const _this$props = this.props,
          classNamePrefix = _this$props.classNamePrefix,
          getNodeLabel = _this$props.getNodeLabel,
          setOnNode = _this$props.setOnNode,
          vertices = _this$props.vertices,
          vertexRefs = _this$props.vertexRefs;
    return vertices.map((v, i) => React.createElement(_Node.default, Object.assign({
      key: v.key,
      ref: vertexRefs[i],
      hidden: true,
      classNamePrefix: classNamePrefix,
      labelFactory: getNodeLabel,
      vertex: v
    }, setOnNode && setOnNode(v))));
  }

  _renderLayoutVertices() {
    const _this$props2 = this.props,
          classNamePrefix = _this$props2.classNamePrefix,
          getNodeLabel = _this$props2.getNodeLabel,
          setOnNode = _this$props2.setOnNode,
          layoutVertices = _this$props2.layoutVertices,
          vertexRefs = _this$props2.vertexRefs;

    if (!layoutVertices) {
      return null;
    }

    return layoutVertices.map((lv, i) => React.createElement(_Node.default, Object.assign({
      key: lv.vertex.key,
      ref: vertexRefs[i],
      classNamePrefix: classNamePrefix,
      labelFactory: getNodeLabel,
      vertex: lv.vertex,
      left: lv.left,
      top: lv.top
    }, setOnNode && setOnNode(lv.vertex))));
  }

  render() {
    if (this.props.layoutVertices) {
      return this._renderLayoutVertices();
    }

    return this._renderVertices();
  }

}

exports.default = PureNodes;