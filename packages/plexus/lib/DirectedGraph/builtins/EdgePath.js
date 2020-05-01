"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const D_CMDS = ['M', 'C']; // const strokeDefId = 'pathStroke';
// const strokeReference = `url(#${strokeDefId})`;
// export function EdgePathStrokeDef(props) {
//   const strokeDef = (
//     <linearGradient id={strokeDefId}>
//       <stop offset="0%" stopColor="#00c" />
//       <stop offset="7%" stopColor="#00c" />
//       <stop offset="93%" stopColor="#0c0" />
//       <stop offset="100%" stopColor="#0c0" />
//     </linearGradient>
//   );
//   return props.enclose ? <defs>{strokeDef}</defs> : strokeDef;
// }
// NOTE: This function is necessary for gradient stroke
// function renderPathPoint(pt, i) {
//   let [x, y] = pt;
//   if (i === 0) {
//     // add a small amount of jitter (1% of a pixel) to avert an issue with
//     // bounding-box based linear gradients
//     // https://stackoverflow.com/q/13223636/1888292
//     y += 0.01;
//   }
//   return `${D_CMDS[i] || ''}${x},${y}`;
// }

class EdgePath extends React.PureComponent {
  render() {
    const _this$props = this.props,
          markerEnd = _this$props.markerEnd,
          pathPoints = _this$props.pathPoints,
          rest = _objectWithoutProperties(_this$props, ["markerEnd", "pathPoints"]);

    const d = pathPoints.map((pt, i) => `${D_CMDS[i] || ''}${pt.join(',')}`).join(' ');
    return React.createElement("path", Object.assign({
      d: d,
      fill: "none",
      stroke: "#000",
      vectorEffect: "non-scaling-stroke",
      markerEnd: markerEnd
    }, rest));
  }

}

exports.default = EdgePath;