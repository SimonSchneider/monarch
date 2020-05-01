"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _EdgePath = _interopRequireDefault(require("./EdgePath"));

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
class PureEdges extends React.PureComponent {
  render() {
    const _this$props = this.props,
          arrowIriRef = _this$props.arrowIriRef,
          layoutEdges = _this$props.layoutEdges,
          setOnEdgePath = _this$props.setOnEdgePath;
    return layoutEdges.map(edge => React.createElement(_EdgePath.default, Object.assign({
      key: `${edge.edge.from}\v${edge.edge.to}`,
      pathPoints: edge.pathPoints,
      markerEnd: arrowIriRef
    }, setOnEdgePath && setOnEdgePath(edge.edge))));
  }

}

exports.default = PureEdges;