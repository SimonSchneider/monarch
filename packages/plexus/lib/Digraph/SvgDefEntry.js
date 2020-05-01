"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

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
const getMarkerScale = (0, _utils.getValueScaler)({
  factorMax: 1,
  factorMin: 0.1,
  valueMax: 2,
  valueMin: 6
});

function renderDefaultMarker(graphState, entryProps, id) {
  const scale = getMarkerScale(graphState.zoomTransform.k);
  return React.createElement("marker", Object.assign({
    id: id,
    markerHeight: scale * 8,
    markerUnits: "userSpaceOnUse",
    markerWidth: scale * 8,
    orient: "auto",
    refX: scale * 8,
    refY: scale * 3
  }, entryProps), React.createElement("path", {
    d: `M0,0 L0,${scale * 6} L${scale * 9},${scale * 3} z`
  }));
}

class SvgDefEntry extends React.PureComponent {
  render() {
    const _this$props = this.props,
          getClassName = _this$props.getClassName,
          localId = _this$props.localId,
          graphState = _this$props.graphState,
          _this$props$renderEnt = _this$props.renderEntry,
          renderEntry = _this$props$renderEnt === void 0 ? renderDefaultMarker : _this$props$renderEnt,
          setOnEntry = _this$props.setOnEntry;
    const id = graphState.renderUtils.getGlobalId(localId);
    const entryProps = (0, _utils.assignMergeCss)({
      className: getClassName('DefEntry')
    }, (0, _utils.getProps)(setOnEntry, graphState));
    return renderEntry(graphState, entryProps, id);
  }

}

exports.default = SvgDefEntry;