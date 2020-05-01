"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _HtmlLayer = _interopRequireDefault(require("./HtmlLayer"));

var _MeasurableNodes = _interopRequireDefault(require("./MeasurableNodes"));

var _SvgLayer = _interopRequireDefault(require("./SvgLayer"));

var _types = require("./types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createRefs(length) {
  const rv = [];

  for (let i = 0; i < length; i++) {
    rv.push(React.createRef());
  }

  return rv;
}

class MeasurableNodesLayer extends React.PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    const vertices = nextProps.graphState.vertices;
    const stVertices = prevState.vertices;

    if (vertices === stVertices) {
      return null;
    }

    return {
      vertices,
      nodeRefs: createRefs(vertices.length)
    };
  }

  constructor(props) {
    super(props);
    const graphState = props.graphState;
    const vertices = graphState.vertices;
    this.state = {
      vertices,
      nodeRefs: createRefs(vertices.length)
    };
  }

  componentDidMount() {
    this.measureNodes();
  }

  componentDidUpdate() {
    this.measureNodes();
  }

  measureNodes() {
    const _this$props$graphStat = this.props.graphState,
          layoutPhase = _this$props$graphStat.layoutPhase,
          vertices = _this$props$graphStat.vertices;

    if (layoutPhase !== _types.ELayoutPhase.CalcSizes) {
      return;
    }

    const nodeRefs = this.state.nodeRefs;

    if (!nodeRefs) {
      return;
    }

    const _this$props = this.props,
          layerType = _this$props.layerType,
          measureNode = _this$props.measureNode,
          senderKey = _this$props.senderKey,
          setSizeVertices = _this$props.setSizeVertices;
    let current = null;
    const utils = measureNode && {
      layerType,
      getWrapper: () => {
        if (current) {
          return current.getRef();
        }

        throw new Error('Invalid scenario');
      },
      getWrapperSize: () => {
        if (current) {
          return current.measure();
        }

        throw new Error('Invalid scenario');
      }
    };
    const sizeVertices = [];

    for (let i = 0; i < nodeRefs.length; i++) {
      current = nodeRefs[i].current;
      const vertex = vertices[i];

      if (current) {
        sizeVertices.push(_objectSpread({
          vertex
        }, measureNode && utils ? measureNode(vertex, utils) : current.measure()));
      }
    }

    setSizeVertices(senderKey, sizeVertices);
  }

  render() {
    const nodeRefs = this.state.nodeRefs;

    if (nodeRefs) {
      const _this$props2 = this.props,
            getClassName = _this$props2.getClassName,
            _this$props2$graphSta = _this$props2.graphState,
            layoutVertices = _this$props2$graphSta.layoutVertices,
            renderUtils = _this$props2$graphSta.renderUtils,
            vertices = _this$props2$graphSta.vertices,
            layerType = _this$props2.layerType,
            renderNode = _this$props2.renderNode,
            setOnNode = _this$props2.setOnNode;
      const LayerComponent = layerType === _types.ELayerType.Html ? _HtmlLayer.default : _SvgLayer.default;
      return React.createElement(LayerComponent, Object.assign({
        classNamePart: "MeasurableNodesLayer"
      }, this.props), React.createElement(_MeasurableNodes.default, {
        nodeRefs: nodeRefs,
        getClassName: getClassName,
        layerType: layerType,
        renderNode: renderNode,
        renderUtils: renderUtils,
        vertices: vertices,
        layoutVertices: layoutVertices,
        setOnNode: setOnNode
      }));
    }

    return null;
  }

}

exports.default = MeasurableNodesLayer;