"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _NodesLayer = _interopRequireDefault(require("./NodesLayer"));

var _SvgEdgesLayer = _interopRequireDefault(require("./SvgEdgesLayer"));

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
class SvgLayersGroup extends React.PureComponent {
  renderLayers() {
    const _this$props = this.props,
          getClassName = _this$props.getClassName,
          layers = _this$props.layers,
          graphState = _this$props.graphState;
    return layers.map(layer => {
      const key = layer.key,
            setOnContainer = layer.setOnContainer;

      if (layer.edges) {
        return React.createElement(_SvgEdgesLayer.default, {
          key: key,
          getClassName: getClassName,
          graphState: graphState,
          markerEndId: layer.markerEndId,
          markerStartId: layer.markerStartId,
          setOnContainer: setOnContainer,
          setOnEdge: layer.setOnEdge
        });
      }

      if (layer.measurable) {
        // meassurable nodes layer
        throw new Error('Not implemented');
      }

      return React.createElement(_NodesLayer.default, {
        key: key,
        getClassName: getClassName,
        graphState: graphState,
        layerType: _types.ELayerType.Svg,
        renderNode: layer.renderNode,
        setOnContainer: setOnContainer,
        setOnNode: layer.setOnNode
      });
    });
  }

  render() {
    return React.createElement(_SvgLayer.default, Object.assign({
      topLayer: true
    }, this.props, {
      classNamePart: "SvgLayersGroup"
    }), this.renderLayers());
  }

}

exports.default = SvgLayersGroup;