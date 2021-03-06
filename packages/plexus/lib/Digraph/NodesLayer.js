"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _HtmlLayer = _interopRequireDefault(require("./HtmlLayer"));

var _Nodes = _interopRequireDefault(require("./Nodes"));

var _SvgLayer = _interopRequireDefault(require("./SvgLayer"));

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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
class NodesLayer extends React.PureComponent {
  render() {
    const renderNode = this.props.renderNode;
    const _this$props$graphStat = this.props.graphState,
          layoutVertices = _this$props$graphStat.layoutVertices,
          renderUtils = _this$props$graphStat.renderUtils;

    if (!layoutVertices || !renderNode) {
      return null;
    }

    const _this$props = this.props,
          getClassName = _this$props.getClassName,
          layerType = _this$props.layerType,
          setOnNode = _this$props.setOnNode;
    const LayerComponent = layerType === _types.ELayerType.Html ? _HtmlLayer.default : _SvgLayer.default;
    return React.createElement(LayerComponent, Object.assign({}, this.props, {
      classNamePart: "NodesLayer"
    }), React.createElement(_Nodes.default, {
      getClassName: getClassName,
      layerType: layerType,
      layoutVertices: layoutVertices,
      renderNode: renderNode,
      renderUtils: renderUtils,
      setOnNode: setOnNode
    }));
  }

}

exports.default = NodesLayer;