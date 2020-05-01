"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _SvgEdge = _interopRequireDefault(require("./SvgEdge"));

var _utils = require("./utils");

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
class SvgEdges extends React.Component {
  shouldComponentUpdate(np) {
    const p = this.props;
    return p.getClassName !== np.getClassName || p.layoutEdges !== np.layoutEdges || p.markerEndId !== np.markerEndId || p.markerStartId !== np.markerStartId || p.renderUtils !== np.renderUtils || !(0, _utils.isSamePropSetter)(p.setOnEdge, np.setOnEdge);
  }

  render() {
    const _this$props = this.props,
          getClassName = _this$props.getClassName,
          layoutEdges = _this$props.layoutEdges,
          markerEndId = _this$props.markerEndId,
          markerStartId = _this$props.markerStartId,
          renderUtils = _this$props.renderUtils,
          setOnEdge = _this$props.setOnEdge;
    return layoutEdges.map(edge => React.createElement(_SvgEdge.default, {
      key: `${edge.edge.from}\v${edge.edge.to}`,
      getClassName: getClassName,
      layoutEdge: edge,
      markerEndId: markerEndId,
      markerStartId: markerStartId,
      renderUtils: renderUtils,
      setOnEdge: setOnEdge
    }));
  }

}

exports.default = SvgEdges;