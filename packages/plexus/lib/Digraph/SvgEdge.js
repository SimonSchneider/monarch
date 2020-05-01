"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

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
function makeIriRef(renderUtils, localId) {
  return localId ? `url(#${renderUtils.getGlobalId(localId)})` : localId;
}

const PATH_D_CMDS = ['M', 'C'];

function makePathD(points) {
  const dArr = [];
  const cmdLen = PATH_D_CMDS.length;

  for (let i = 0; i < points.length; i++) {
    const pt = points[i];

    if (i < cmdLen) {
      dArr.push(PATH_D_CMDS[i]);
    }

    dArr.push(pt[0], pt[1]);
  }

  return dArr.join(' ');
}

class SvgEdge extends React.PureComponent {
  constructor() {
    super(...arguments);
    this.makePathD = (0, _memoizeOne.default)(makePathD);
  }

  render() {
    const _this$props = this.props,
          getClassName = _this$props.getClassName,
          layoutEdge = _this$props.layoutEdge,
          markerEndId = _this$props.markerEndId,
          markerStartId = _this$props.markerStartId,
          renderUtils = _this$props.renderUtils,
          setOnEdge = _this$props.setOnEdge;
    const pathPoints = layoutEdge.pathPoints;
    const d = makePathD(pathPoints);
    const markerEnd = makeIriRef(renderUtils, markerEndId);
    const markerStart = makeIriRef(renderUtils, markerStartId);
    const customProps = (0, _utils.assignMergeCss)({
      className: getClassName('SvgEdge')
    }, (0, _utils.getProps)(setOnEdge, layoutEdge, renderUtils));
    return React.createElement("path", Object.assign({
      d: d,
      fill: "none",
      vectorEffect: "non-scaling-stroke",
      markerEnd: markerEnd,
      markerStart: markerStart
    }, customProps));
  }

}

exports.default = SvgEdge;