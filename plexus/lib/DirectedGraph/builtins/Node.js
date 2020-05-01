"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

class Node extends React.PureComponent {
  render() {
    const _this$props = this.props,
          classNamePrefix = _this$props.classNamePrefix,
          hidden = _this$props.hidden,
          labelFactory = _this$props.labelFactory,
          vertex = _this$props.vertex,
          left = _this$props.left,
          top = _this$props.top,
          forwardedRef = _this$props.forwardedRef,
          rest = _objectWithoutProperties(_this$props, ["classNamePrefix", "hidden", "labelFactory", "vertex", "left", "top", "forwardedRef"]);

    const p = rest;
    p.style = _objectSpread({}, p.style, {
      position: 'absolute',
      transform: left == null || top == null ? undefined : `translate(${left}px,${top}px)`,
      visibility: hidden ? 'hidden' : undefined
    });
    p.className = `${classNamePrefix}-Node ${p.className || ''}`;
    return React.createElement("div", Object.assign({
      ref: forwardedRef
    }, p), labelFactory(vertex));
  }

} // ghetto fabulous cast because the 16.3 API is not in flow yet
// https://github.com/facebook/flow/issues/6103
// eslint-disable-next-line react/no-multi-comp


Node.defaultProps = {
  hidden: false,
  left: null,
  top: null
};

var _default = React.forwardRef((props, ref) => React.createElement(Node, Object.assign({}, props, {
  forwardedRef: ref
})));

exports.default = _default;