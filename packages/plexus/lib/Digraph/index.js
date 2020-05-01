"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _HtmlLayersGroup = _interopRequireDefault(require("./HtmlLayersGroup"));

var _MeasurableNodesLayer = _interopRequireDefault(require("./MeasurableNodesLayer"));

var _NodesLayer = _interopRequireDefault(require("./NodesLayer"));

var _propsFactories = require("./props-factories");

var _SvgEdgesLayer = _interopRequireDefault(require("./SvgEdgesLayer"));

var _SvgLayersGroup = _interopRequireDefault(require("./SvgLayersGroup"));

var _types = require("./types");

var _utils = require("./utils");

var _MiniMap = _interopRequireDefault(require("../zoom/MiniMap"));

var _ZoomManager = _interopRequireWildcard(require("../zoom/ZoomManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const WRAPPER_STYLE_ZOOM = {
  height: '100%',
  overflow: 'hidden',
  position: 'relative',
  width: '100%'
};
const WRAPPER_STYLE = {
  position: 'relative'
};
let idCounter = 0;

class Digraph extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderUtils = void 0;
    this.state = {
      edges: [],
      layoutEdges: null,
      layoutGraph: null,
      layoutPhase: _types.ELayoutPhase.NoData,
      layoutVertices: null,
      sizeVertices: null,
      vertices: [],
      zoomTransform: _ZoomManager.zoomIdentity
    };
    this.baseId = `plexus--Digraph--${idCounter++}`;
    this.makeClassNameFactory = (0, _memoizeOne.default)(classNamePrefix => {
      return name => `${classNamePrefix} ${classNamePrefix}-Digraph--${name}`;
    });
    this.rootRef = React.createRef();
    this.zoomManager = null;

    this.getGlobalId = name => `${this.baseId}--${name}`;

    this.getZoomTransform = () => this.state.zoomTransform;

    this.setSizeVertices = (senderKey, sizeVertices) => {
      const _this$props = this.props,
            edges = _this$props.edges,
            layoutManager = _this$props.layoutManager,
            expectedKey = _this$props.measurableNodesKey;

      if (senderKey !== expectedKey) {
        const values = `expected ${JSON.stringify(expectedKey)}, recieved ${JSON.stringify(senderKey)}`;
        throw new Error(`Key mismatch for measuring nodes; ${values}`);
      }

      this.setState({
        sizeVertices
      });

      const _layoutManager$getLay = layoutManager.getLayout(edges, sizeVertices),
            layout = _layoutManager$getLay.layout;

      layout.then(this.onLayoutDone);
      this.setState({
        sizeVertices,
        layoutPhase: _types.ELayoutPhase.CalcPositions
      }); // We can add support for drawing nodes in the correct position before we have edges
      // via the following (instead of the above)
      // const { positions, layout } = layoutManager.getLayout(edges, sizeVertices);
      // positions.then(this._onPositionsDone);
    };

    this.onZoomUpdated = zoomTransform => {
      this.setState({
        zoomTransform
      });
    };

    this.onLayoutDone = result => {
      if (result.isCancelled) {
        return;
      }

      const layoutEdges = result.edges,
            layoutGraph = result.graph,
            layoutVertices = result.vertices;
      this.setState({
        layoutEdges,
        layoutGraph,
        layoutVertices,
        layoutPhase: _types.ELayoutPhase.Done
      });

      if (this.zoomManager) {
        this.zoomManager.setContentSize(layoutGraph);
      }
    };

    const _edges = props.edges,
          vertices = props.vertices,
          zoomEnabled = props.zoom;

    if (Array.isArray(_edges) && _edges.length && Array.isArray(vertices) && vertices.length) {
      this.state.layoutPhase = _types.ELayoutPhase.CalcSizes;
      this.state.edges = _edges;
      this.state.vertices = vertices;
    }

    if (zoomEnabled) {
      this.zoomManager = new _ZoomManager.default(this.onZoomUpdated);
    }

    this.renderUtils = {
      getGlobalId: this.getGlobalId,
      getZoomTransform: this.getZoomTransform
    };
  }

  componentDidMount() {
    const current = this.rootRef.current;

    if (current && this.zoomManager) {
      this.zoomManager.setElement(current);
    }
  }

  renderLayers() {
    const _this$props2 = this.props,
          classNamePrefix = _this$props2.classNamePrefix,
          topLayers = _this$props2.layers;
    const getClassName = this.makeClassNameFactory(classNamePrefix || ''); // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const _this$state = this.state,
          _ = _this$state.sizeVertices,
          partialGraphState = _objectWithoutProperties(_this$state, ["sizeVertices"]);

    const graphState = _objectSpread({}, partialGraphState, {
      renderUtils: this.renderUtils
    });

    const layoutPhase = graphState.layoutPhase;
    return topLayers.map(layer => {
      const layerType = layer.layerType,
            key = layer.key,
            setOnContainer = layer.setOnContainer;

      if (layer.layers) {
        if (layer.layerType === _types.ELayerType.Html) {
          return React.createElement(_HtmlLayersGroup.default, {
            key: key,
            graphState: graphState,
            layers: layer.layers,
            getClassName: getClassName,
            setOnContainer: setOnContainer,
            setSizeVertices: this.setSizeVertices
          });
        } // svg group layer, the if is for TypeScript


        if (layer.layerType === _types.ELayerType.Svg) {
          return React.createElement(_SvgLayersGroup.default, {
            key: key,
            getClassName: getClassName,
            defs: layer.defs,
            graphState: graphState,
            layers: layer.layers,
            setOnContainer: setOnContainer
          });
        }
      }

      if (layer.edges) {
        // edges standalone layer
        const defs = layer.defs,
              markerEndId = layer.markerEndId,
              markerStartId = layer.markerStartId,
              setOnEdge = layer.setOnEdge;
        return layoutPhase === _types.ELayoutPhase.Done ? React.createElement(_SvgEdgesLayer.default, {
          key: key,
          standalone: true,
          getClassName: getClassName,
          defs: defs,
          graphState: graphState,
          markerEndId: markerEndId,
          markerStartId: markerStartId,
          setOnContainer: setOnContainer,
          setOnEdge: setOnEdge
        }) : null;
      }

      if (layer.measurable) {
        // standalone measurable Nodes Layer
        const measureNode = layer.measureNode,
              renderNode = layer.renderNode,
              setOnNode = layer.setOnNode;
        return React.createElement(_MeasurableNodesLayer.default, {
          key: key,
          standalone: true,
          getClassName: getClassName,
          graphState: graphState,
          layerType: layerType,
          measureNode: measureNode,
          renderNode: renderNode,
          senderKey: key,
          setOnContainer: setOnContainer,
          setOnNode: setOnNode,
          setSizeVertices: this.setSizeVertices
        });
      }

      const renderNode = layer.renderNode;

      if (renderNode !== undefined) {
        return React.createElement(_NodesLayer.default, {
          key: key,
          standalone: true,
          getClassName: getClassName,
          graphState: graphState,
          layerType: layer.layerType,
          renderNode: renderNode,
          setOnContainer: setOnContainer,
          setOnNode: layer.setOnNode
        });
      }

      throw new Error('Unrecognized layer');
    });
  }

  render() {
    const _this$props3 = this.props,
          className = _this$props3.className,
          classNamePrefix = _this$props3.classNamePrefix,
          minimapEnabled = _this$props3.minimap,
          minimapClassName = _this$props3.minimapClassName,
          setOnGraph = _this$props3.setOnGraph,
          style = _this$props3.style;
    const builtinStyle = this.zoomManager ? WRAPPER_STYLE_ZOOM : WRAPPER_STYLE;
    const rootProps = (0, _utils.assignMergeCss)({
      style: builtinStyle,
      className: `${classNamePrefix} ${classNamePrefix}-Digraph`
    }, {
      className,
      style
    }, (0, _utils.getProps)(setOnGraph, _objectSpread({}, this.state, {
      renderUtils: this.renderUtils
    })));
    return React.createElement("div", rootProps, React.createElement("div", {
      style: builtinStyle,
      ref: this.rootRef
    }, this.renderLayers()), minimapEnabled && this.zoomManager && React.createElement(_MiniMap.default, Object.assign({
      className: minimapClassName,
      classNamePrefix: classNamePrefix
    }, this.zoomManager.getProps())));
  }

}

exports.default = Digraph;
Digraph.propsFactories = {
  classNameIsSmall: _propsFactories.classNameIsSmall,
  scaleOpacity: _propsFactories.scaleProperty.opacity,
  scaleStrokeOpacity: _propsFactories.scaleProperty.strokeOpacity,
  scaleStrokeOpacityStrong: _propsFactories.scaleProperty.strokeOpacityStrong,
  scaleStrokeOpacityStrongest: _propsFactories.scaleProperty.strokeOpacityStrongest
};
Digraph.scaleProperty = _propsFactories.scaleProperty;
Digraph.defaultProps = {
  className: '',
  classNamePrefix: 'plexus',
  minimap: false,
  minimapClassName: '',
  zoom: false
};