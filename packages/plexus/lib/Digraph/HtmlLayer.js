"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _utils = require("./utils");

var _ZoomManager = _interopRequireDefault(require("../zoom/ZoomManager"));

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
const STYLE = {
  left: 0,
  position: 'absolute',
  top: 0
};

class HtmlLayer extends React.PureComponent {
  render() {
    const _this$props = this.props,
          children = _this$props.children,
          classNamePart = _this$props.classNamePart,
          getClassName = _this$props.getClassName,
          graphState = _this$props.graphState,
          setOnContainer = _this$props.setOnContainer,
          standalone = _this$props.standalone,
          topLayer = _this$props.topLayer;
    const zoomTransform = graphState.zoomTransform;
    const zoomStyle = {
      style: topLayer || standalone ? _ZoomManager.default.getZoomStyle(zoomTransform) : {}
    };
    const containerProps = (0, _utils.assignMergeCss)({
      className: getClassName(classNamePart),
      style: STYLE
    }, zoomStyle, (0, _utils.getProps)(setOnContainer, graphState));
    return React.createElement("div", containerProps, children);
  }

}

exports.default = HtmlLayer;