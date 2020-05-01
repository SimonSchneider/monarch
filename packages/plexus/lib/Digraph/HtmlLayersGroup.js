"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _HtmlLayer = _interopRequireDefault(require("./HtmlLayer"));

var _MeasurableNodesLayer = _interopRequireDefault(require("./MeasurableNodesLayer"));

var _NodesLayer = _interopRequireDefault(require("./NodesLayer"));

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
class HtmlLayersGroup extends React.PureComponent {
  renderLayers() {
    const _this$props = this.props,
          getClassName = _this$props.getClassName,
          layers = _this$props.layers,
          graphState = _this$props.graphState,
          setSizeVertices = _this$props.setSizeVertices;
    return layers.map(layer => {
      const key = layer.key,
            setOnContainer = layer.setOnContainer;

      if (layer.measurable) {
        const renderNode = layer.renderNode,
              setOnNode = layer.setOnNode;
        return React.createElement(_MeasurableNodesLayer.default, {
          key: key,
          getClassName: getClassName,
          graphState: graphState,
          layerType: _types.ELayerType.Html,
          renderNode: renderNode,
          senderKey: key,
          setOnContainer: setOnContainer,
          setOnNode: setOnNode,
          setSizeVertices: setSizeVertices
        });
      }

      if (layer.renderNode) {
        const renderNode = layer.renderNode,
              setOnNode = layer.setOnNode;
        return React.createElement(_NodesLayer.default, {
          key: key,
          getClassName: getClassName,
          graphState: graphState,
          layerType: _types.ELayerType.Html,
          renderNode: renderNode,
          setOnContainer: setOnContainer,
          setOnNode: setOnNode
        });
      } // html edges layer


      throw new Error('Not implemented');
    });
  }

  render() {
    return React.createElement(_HtmlLayer.default, Object.assign({
      topLayer: true,
      classNamePart: "HtmlLayersGroup"
    }, this.props), this.renderLayers());
  }

}

exports.default = HtmlLayersGroup;