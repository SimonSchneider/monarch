"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _Node = _interopRequireDefault(require("./Node"));

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
class Nodes extends React.Component {
  shouldComponentUpdate(np) {
    const p = this.props;
    return p.renderNode !== np.renderNode || p.getClassName !== np.getClassName || p.layerType !== np.layerType || p.layoutVertices !== np.layoutVertices || p.renderUtils !== np.renderUtils || !(0, _utils.isSamePropSetter)(p.setOnNode, np.setOnNode);
  }

  render() {
    const _this$props = this.props,
          getClassName = _this$props.getClassName,
          layoutVertices = _this$props.layoutVertices,
          renderUtils = _this$props.renderUtils,
          layerType = _this$props.layerType,
          renderNode = _this$props.renderNode,
          setOnNode = _this$props.setOnNode;
    return layoutVertices.map(lv => React.createElement(_Node.default, {
      key: lv.vertex.key,
      getClassName: getClassName,
      layerType: layerType,
      layoutVertex: lv,
      renderNode: renderNode,
      renderUtils: renderUtils,
      setOnNode: setOnNode
    }));
  }

}

exports.default = Nodes;