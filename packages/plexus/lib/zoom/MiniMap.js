"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MiniMap = MiniMap;
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _resetZoomIcon = _interopRequireDefault(require("./resetZoomIcon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-enable react/no-unused-prop-types */
const LENGTH_TARGET_PX = 80;

function getMapSize(props) {
  const ch = props.contentHeight,
        cw = props.contentWidth;

  if (ch > cw) {
    return {
      height: LENGTH_TARGET_PX,
      width: LENGTH_TARGET_PX * cw / ch
    };
  }

  return {
    height: LENGTH_TARGET_PX * ch / cw,
    width: LENGTH_TARGET_PX
  };
}

function getViewTransform(props, displaySize) {
  const ch = props.contentHeight,
        cw = props.contentWidth,
        vh = props.viewportHeight,
        vw = props.viewportWidth,
        _props$k = props.k,
        k = _props$k === void 0 ? 1 : _props$k,
        _props$x = props.x,
        x = _props$x === void 0 ? 1 : _props$x,
        _props$y = props.y,
        y = _props$y === void 0 ? 1 : _props$y;
  const dh = displaySize.height,
        dw = displaySize.width;
  const sch = ch * k;
  const scw = cw * k;
  const left = Math.max(-x / scw, 0);
  const right = Math.min((-x + vw) / scw, 1);
  const top = Math.max(-y / sch, 0);
  const bottom = Math.min((-y + vh) / sch, 1);
  return {
    transform: `
      translate(${(left * dw).toFixed(2)}px, ${(top * dh).toFixed(2)}px)
      scale(${right - left}, ${bottom - top})
    `,
    transformOrigin: '0 0'
  };
}

function getClassNames(props) {
  const className = props.className,
        classNamePrefix = props.classNamePrefix;
  const base = `${classNamePrefix || 'plexus'}-MiniMap`;
  return {
    root: `${base} ${className || ''}`,
    item: `${base}--item`,
    map: `${base}--map`,
    mapActive: `${base}--mapActive`,
    button: `${base}--button`
  };
}

function MiniMap(props) {
  const css = getClassNames(props);
  const mapSize = getMapSize(props);
  const activeXform = getViewTransform(props, mapSize);
  return React.createElement("div", {
    className: css.root
  }, React.createElement("div", {
    className: `${css.item} ${css.map}`,
    style: mapSize
  }, React.createElement("div", {
    className: css.mapActive,
    style: _objectSpread({}, activeXform, mapSize)
  })), React.createElement("div", {
    className: `${css.item} ${css.button}`,
    onClick: props.viewAll,
    role: "button"
  }, _resetZoomIcon.default));
}

MiniMap.defaultProps = {
  className: '',
  classNamePrefix: 'plexus'
};

var _default = React.memo(MiniMap);

exports.default = _default;