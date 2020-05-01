"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _SvgEdges = _interopRequireDefault(require("./SvgEdges"));

var _SvgLayer = _interopRequireDefault(require("./SvgLayer"));

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
// Add the default black stroke on an outter <g> so CSS classes or styles
// on the inner <g> can override it
// TODO: A more configurable appraoch to setting a default stroke color
const INHERIT_STROKE = {
  stroke: '#000'
};

class SvgEdgesLayer extends React.PureComponent {
  render() {
    const _this$props = this.props,
          getClassName = _this$props.getClassName,
          graphState = _this$props.graphState,
          markerEndId = _this$props.markerEndId,
          markerStartId = _this$props.markerStartId,
          setOnEdge = _this$props.setOnEdge;
    const layoutEdges = graphState.layoutEdges,
          renderUtils = graphState.renderUtils;

    if (!layoutEdges) {
      return null;
    }

    return React.createElement(_SvgLayer.default, Object.assign({}, this.props, {
      classNamePart: "SvgEdgesLayer",
      extraWrapper: INHERIT_STROKE
    }), React.createElement(_SvgEdges.default, {
      getClassName: getClassName,
      layoutEdges: layoutEdges,
      markerEndId: markerEndId,
      markerStartId: markerStartId,
      renderUtils: renderUtils,
      setOnEdge: setOnEdge
    }));
  }

}

exports.default = SvgEdgesLayer;