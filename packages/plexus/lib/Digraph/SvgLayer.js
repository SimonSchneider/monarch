"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _SvgDefEntry = _interopRequireDefault(require("./SvgDefEntry"));

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
  minHeight: '100%',
  minWidth: '100%',
  position: 'absolute',
  top: 0
};

class SvgLayer extends React.PureComponent {
  render() {
    const _this$props = this.props,
          children = _this$props.children,
          classNamePart = _this$props.classNamePart,
          getClassName = _this$props.getClassName,
          defs = _this$props.defs,
          extraWrapper = _this$props.extraWrapper,
          graphState = _this$props.graphState,
          setOnContainer = _this$props.setOnContainer,
          standalone = _this$props.standalone,
          topLayer = _this$props.topLayer;
    const containerProps = (0, _utils.assignMergeCss)({
      className: getClassName(classNamePart)
    }, (0, _utils.getProps)(setOnContainer, graphState));
    let content = React.createElement("g", containerProps, defs && React.createElement("defs", null, defs.map(defEntry => React.createElement(_SvgDefEntry.default, Object.assign({
      key: defEntry.localId
    }, defEntry, {
      getClassName: getClassName,
      graphState: graphState
    })))), children);

    if (extraWrapper) {
      content = React.createElement("g", extraWrapper, content);
    }

    if (!standalone && !topLayer) {
      return content;
    }

    const zoomTransform = graphState.zoomTransform;
    return React.createElement("svg", {
      className: getClassName('SvgLayer'),
      style: STYLE
    }, React.createElement("g", {
      className: getClassName('SvgLayer--transformer'),
      transform: _ZoomManager.default.getZoomAttr(zoomTransform)
    }, content));
  }

}

exports.default = SvgLayer;