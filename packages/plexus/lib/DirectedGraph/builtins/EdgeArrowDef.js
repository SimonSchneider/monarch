"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

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
class EdgeArrowDef extends React.PureComponent {
  static getId(idBase) {
    return `${idBase}--edgeArrow`;
  }

  static getIriRef(idBase) {
    return `url(#${EdgeArrowDef.getId(idBase)})`;
  }

  render() {
    const _this$props = this.props,
          id = _this$props.id,
          scaleDampener = _this$props.scaleDampener,
          _this$props$zoomScale = _this$props.zoomScale,
          zoomScale = _this$props$zoomScale === void 0 ? null : _this$props$zoomScale;
    const scale = zoomScale != null ? Math.max(scaleDampener / zoomScale, 1) : 1;
    return React.createElement("defs", null, React.createElement("marker", {
      id: id,
      markerHeight: scale * 8,
      markerUnits: "strokeWidth",
      markerWidth: scale * 8,
      orient: "auto",
      refX: scale * 8,
      refY: scale * 3
    }, React.createElement("path", {
      d: `M0,0 L0,${scale * 6} L${scale * 9},${scale * 3} z`,
      fill: "#000"
    })));
  }

}

exports.default = EdgeArrowDef;
EdgeArrowDef.defaultProps = {
  zoomScale: null,
  scaleDampener: 0.6
};