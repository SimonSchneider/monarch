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
const SVG_HIDDEN_STYLE = {
  visibility: 'hidden'
};

class MeasurableNode extends React.PureComponent {
  constructor() {
    super(...arguments);
    this.htmlRef = React.createRef();
    this.svgRef = React.createRef();
  }

  measureHtml() {
    const current = this.htmlRef.current;

    if (!current) {
      return {
        height: 0,
        width: 0
      };
    }

    return {
      height: current.offsetHeight,
      width: current.offsetWidth
    };
  }

  measureSvg() {
    const current = this.svgRef.current;

    if (!current) {
      return {
        height: 0,
        width: 0
      };
    }

    const _current$getBBox = current.getBBox(),
          height = _current$getBBox.height,
          width = _current$getBBox.width;

    return {
      height,
      width
    };
  }

  renderHtml() {
    const _this$props = this.props,
          getClassName = _this$props.getClassName,
          hidden = _this$props.hidden,
          renderNode = _this$props.renderNode,
          renderUtils = _this$props.renderUtils,
          setOnNode = _this$props.setOnNode,
          vertex = _this$props.vertex,
          layoutVertex = _this$props.layoutVertex;

    const _ref = layoutVertex || {},
          _ref$height = _ref.height,
          height = _ref$height === void 0 ? null : _ref$height,
          _ref$left = _ref.left,
          left = _ref$left === void 0 ? null : _ref$left,
          _ref$top = _ref.top,
          top = _ref$top === void 0 ? null : _ref$top,
          _ref$width = _ref.width,
          width = _ref$width === void 0 ? null : _ref$width;

    const props = (0, _utils.assignMergeCss)({
      className: getClassName('MeasurableHtmlNode'),
      style: {
        height,
        width,
        boxSizing: 'border-box',
        position: 'absolute',
        transform: left == null || top == null ? undefined : `translate(${left.toFixed()}px,${top.toFixed()}px)`,
        visibility: hidden ? 'hidden' : undefined
      }
    }, (0, _utils.getProps)(setOnNode, vertex, renderUtils, layoutVertex));
    return React.createElement("div", Object.assign({
      ref: this.htmlRef
    }, props), renderNode(vertex, renderUtils, layoutVertex));
  }

  renderSvg() {
    const _this$props2 = this.props,
          getClassName = _this$props2.getClassName,
          hidden = _this$props2.hidden,
          renderNode = _this$props2.renderNode,
          renderUtils = _this$props2.renderUtils,
          setOnNode = _this$props2.setOnNode,
          vertex = _this$props2.vertex,
          layoutVertex = _this$props2.layoutVertex;

    const _ref2 = layoutVertex || {},
          _ref2$left = _ref2.left,
          left = _ref2$left === void 0 ? null : _ref2$left,
          _ref2$top = _ref2.top,
          top = _ref2$top === void 0 ? null : _ref2$top;

    const props = (0, _utils.assignMergeCss)({
      className: getClassName('MeasurableSvgNode'),
      transform: left == null || top == null ? undefined : `translate(${left.toFixed()}, ${top.toFixed()})`,
      style: hidden ? SVG_HIDDEN_STYLE : null
    }, (0, _utils.getProps)(setOnNode, vertex, renderUtils, layoutVertex));
    return React.createElement("g", Object.assign({
      ref: this.svgRef
    }, props), renderNode(vertex, renderUtils, layoutVertex));
  }

  getRef() {
    if (this.props.layerType === _types.ELayerType.Html) {
      return {
        htmlWrapper: this.htmlRef.current,
        svgWrapper: undefined
      };
    }

    return {
      svgWrapper: this.svgRef.current,
      htmlWrapper: undefined
    };
  }

  measure() {
    return this.props.layerType === _types.ELayerType.Html ? this.measureHtml() : this.measureSvg();
  }

  render() {
    const layerType = this.props.layerType;

    if (layerType === _types.ELayerType.Html) {
      return this.renderHtml();
    }

    return this.renderSvg();
  }

}

exports.default = MeasurableNode;