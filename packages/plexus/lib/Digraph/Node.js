"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _types = require("./types");

var _utils = require("./utils");

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
function getHtmlStyle(lv) {
  const height = lv.height,
        left = lv.left,
        top = lv.top,
        width = lv.width;
  return {
    height,
    width,
    position: 'absolute',
    transform: left == null || top == null ? undefined : `translate(${left.toFixed()}px,${top.toFixed()}px)`
  };
}

class Node extends React.PureComponent {
  render() {
    const _this$props = this.props,
          getClassName = _this$props.getClassName,
          layerType = _this$props.layerType,
          renderNode = _this$props.renderNode,
          renderUtils = _this$props.renderUtils,
          setOnNode = _this$props.setOnNode,
          layoutVertex = _this$props.layoutVertex;
    const nodeContent = renderNode(layoutVertex, renderUtils);

    if (!nodeContent) {
      return null;
    }

    const left = layoutVertex.left,
          top = layoutVertex.top;
    const props = (0, _utils.assignMergeCss)({
      className: getClassName('Node'),
      style: layerType === _types.ELayerType.Html ? getHtmlStyle(layoutVertex) : null,
      transform: layerType === _types.ELayerType.Svg ? `translate(${left.toFixed()},${top.toFixed()})` : null
    }, (0, _utils.getProps)(setOnNode, layoutVertex, renderUtils));
    const Wrapper = layerType === _types.ELayerType.Html ? 'div' : 'g';
    return React.createElement(Wrapper, props, nodeContent);
  }

}

exports.default = Node;