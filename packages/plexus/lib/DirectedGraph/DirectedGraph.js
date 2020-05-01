"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _EdgeArrowDef = _interopRequireDefault(require("./builtins/EdgeArrowDef"));

var _EdgesContainer = _interopRequireDefault(require("./builtins/EdgesContainer"));

var _PureEdges = _interopRequireDefault(require("./builtins/PureEdges"));

var _PureNodes = _interopRequireDefault(require("./builtins/PureNodes"));

var _classNameIsSmall = _interopRequireDefault(require("./prop-factories/classNameIsSmall"));

var _mergePropSetters = _interopRequireWildcard(require("./prop-factories/mergePropSetters"));

var _scaledStrokeWidth = _interopRequireDefault(require("./prop-factories/scaledStrokeWidth"));

var _MiniMap = _interopRequireDefault(require("../zoom/MiniMap"));

var _ZoomManager = _interopRequireWildcard(require("../zoom/ZoomManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const PHASE_NO_DATA = 0;
const PHASE_CALC_SIZES = 1;
const PHASE_CALC_POSITIONS = 2;
const PHASE_CALC_EDGES = 3;
const PHASE_DONE = 4;
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

function createHtmlRefs(length) {
  const rv = [];

  for (let i = 0; i < length; i++) {
    rv.push(React.createRef());
  }

  return rv;
}

class DirectedGraph extends React.PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    const edges = nextProps.edges,
          vertices = nextProps.vertices,
          zoomEnabled = nextProps.zoom;
    const stEdges = prevState.edges,
          stVertices = prevState.vertices,
          stZoomEnabled = prevState.zoomEnabled;

    if (zoomEnabled !== stZoomEnabled) {
      throw new Error('Zoom cannot be toggled');
    }

    if (edges === stEdges && vertices === stVertices) {
      return null;
    }

    return {
      edges,
      vertices,
      layoutPhase: PHASE_CALC_SIZES,
      vertexRefs: createHtmlRefs(vertices.length),
      sizeVertices: null,
      layoutEdges: null,
      layoutGraph: null,
      layoutVertices: null
    };
  }

  constructor(props) {
    super(props);
    this.arrowId = void 0;
    this.arrowIriRef = void 0;
    this.rootRef = void 0;
    this.rootSelection = void 0;
    this.zoomManager = void 0;
    this.state = {
      edges: [],
      layoutPhase: PHASE_NO_DATA,
      sizeVertices: null,
      layoutEdges: null,
      layoutGraph: null,
      layoutVertices: null,
      vertexRefs: [],
      vertices: [],
      zoomEnabled: false,
      zoomTransform: _ZoomManager.zoomIdentity
    };

    this._onPositionsDone = result => {
      if (!result.isCancelled) {
        const layoutGraph = result.graph,
              layoutVertices = result.vertices;
        this.setState({
          layoutGraph,
          layoutVertices,
          layoutPhase: PHASE_CALC_EDGES
        });
      }
    };

    this._onLayoutDone = result => {
      const root = this.rootRef.current;

      if (result.isCancelled || !root) {
        return;
      }

      const layoutEdges = result.edges,
            layoutGraph = result.graph,
            layoutVertices = result.vertices;
      this.setState({
        layoutEdges,
        layoutGraph,
        layoutVertices,
        layoutPhase: PHASE_DONE
      });

      if (this.zoomManager) {
        this.zoomManager.setContentSize(layoutGraph);
      }
    };

    this._onZoomUpdated = zoomTransform => {
      this.setState({
        zoomTransform
      });
    };

    const edges = props.edges,
          vertices = props.vertices,
          zoomEnabled = props.zoom;

    if (Array.isArray(edges) && edges.length && Array.isArray(vertices) && vertices.length) {
      this.state.layoutPhase = PHASE_CALC_SIZES;
      this.state.edges = edges;
      this.state.vertices = vertices;
      this.state.vertexRefs = createHtmlRefs(vertices.length);
    }

    this.state.zoomEnabled = zoomEnabled;
    const idBase = `plexus--DirectedGraph--${idCounter}`;
    idCounter += 1;
    this.arrowId = _EdgeArrowDef.default.getId(idBase);
    this.arrowIriRef = _EdgeArrowDef.default.getIriRef(idBase);
    this.rootRef = React.createRef();

    if (zoomEnabled) {
      this.zoomManager = new _ZoomManager.default(this._onZoomUpdated);
    } else {
      this.zoomManager = null;
    }
  }

  componentDidMount() {
    this._setSizeVertices();

    const current = this.rootRef.current;

    if (current && this.zoomManager) {
      this.zoomManager.setElement(current);
    }
  }

  componentDidUpdate() {
    const layoutPhase = this.state.layoutPhase;

    if (layoutPhase === PHASE_CALC_SIZES) {
      this._setSizeVertices();
    }
  }

  _setSizeVertices() {
    const _this$props = this.props,
          edges = _this$props.edges,
          layoutManager = _this$props.layoutManager,
          vertices = _this$props.vertices;
    const sizeVertices = [];
    this.state.vertexRefs.forEach((ref, i) => {
      const current = ref.current; // use a `.forEach` with a guard on `current` because TypeScript doesn't
      // like `.filter(Boolean)`

      if (current) {
        sizeVertices.push({
          height: current.offsetHeight,
          vertex: vertices[i],
          width: current.offsetWidth
        });
      }
    });

    const _layoutManager$getLay = layoutManager.getLayout(edges, sizeVertices),
          positions = _layoutManager$getLay.positions,
          layout = _layoutManager$getLay.layout;

    positions.then(this._onPositionsDone);
    layout.then(this._onLayoutDone);
    this.setState({
      sizeVertices,
      layoutPhase: PHASE_CALC_POSITIONS
    });
  }

  _renderVertices() {
    const _this$props2 = this.props,
          classNamePrefix = _this$props2.classNamePrefix,
          getNodeLabel = _this$props2.getNodeLabel,
          setOnNode = _this$props2.setOnNode,
          vertices = _this$props2.vertices;
    const _this$state = this.state,
          layoutVertices = _this$state.layoutVertices,
          vertexRefs = _this$state.vertexRefs;
    return React.createElement(_PureNodes.default, {
      classNamePrefix: classNamePrefix,
      getNodeLabel: getNodeLabel || String,
      layoutVertices: layoutVertices,
      setOnNode: setOnNode,
      vertexRefs: vertexRefs,
      vertices: vertices
    });
  }

  _renderEdges() {
    const setOnEdgePath = this.props.setOnEdgePath;
    const layoutEdges = this.state.layoutEdges;
    return layoutEdges && React.createElement(_PureEdges.default, {
      setOnEdgePath: setOnEdgePath,
      layoutEdges: layoutEdges,
      arrowIriRef: this.arrowIriRef
    });
  }

  render() {
    const _this$props3 = this.props,
          arrowScaleDampener = _this$props3.arrowScaleDampener,
          className = _this$props3.className,
          classNamePrefix = _this$props3.classNamePrefix,
          minimapEnabled = _this$props3.minimap,
          minimapClassName = _this$props3.minimapClassName,
          setOnEdgesContainer = _this$props3.setOnEdgesContainer,
          setOnNodesContainer = _this$props3.setOnNodesContainer,
          setOnRoot = _this$props3.setOnRoot;
    const _this$state2 = this.state,
          phase = _this$state2.layoutPhase,
          layoutGraph = _this$state2.layoutGraph,
          zoomEnabled = _this$state2.zoomEnabled,
          zoomTransform = _this$state2.zoomTransform;

    const _ref = layoutGraph || {},
          _ref$height = _ref.height,
          height = _ref$height === void 0 ? 0 : _ref$height,
          _ref$width = _ref.width,
          width = _ref$width === void 0 ? 0 : _ref$width; // const { current: rootElm } = this.rootRef;


    const haveEdges = phase === PHASE_DONE;
    const nodesContainerProps = (0, _mergePropSetters.assignMergeCss)(setOnNodesContainer && setOnNodesContainer(this.state) || {}, {
      style: _objectSpread({}, zoomEnabled ? _ZoomManager.default.getZoomStyle(zoomTransform) : null, {
        position: 'absolute',
        top: 0,
        left: 0
      }),
      className: `${classNamePrefix}-DirectedGraph--nodeContainer`
    });
    const edgesContainerProps = (0, _mergePropSetters.assignMergeCss)(setOnEdgesContainer && setOnEdgesContainer(this.state) || {}, {
      style: {
        minHeight: '100%',
        minWidth: '100%'
      },
      className: `${classNamePrefix}-DirectedGraph--nodeContainer`
    });
    const rootProps = (0, _mergePropSetters.assignMergeCss)(setOnRoot && setOnRoot(this.state) || {}, {
      style: zoomEnabled ? WRAPPER_STYLE_ZOOM : WRAPPER_STYLE,
      className: `${classNamePrefix}-DirectedGraph ${className}`
    });
    return React.createElement("div", Object.assign({}, rootProps, {
      ref: this.rootRef
    }), layoutGraph && haveEdges && React.createElement(_EdgesContainer.default, Object.assign({}, edgesContainerProps, {
      height: height,
      width: width
    }), React.createElement(_EdgeArrowDef.default, {
      id: this.arrowId,
      scaleDampener: arrowScaleDampener,
      zoomScale: zoomEnabled && zoomTransform ? zoomTransform.k : null
    }), React.createElement("g", {
      transform: zoomEnabled ? _ZoomManager.default.getZoomAttr(zoomTransform) : undefined
    }, this._renderEdges())), React.createElement("div", nodesContainerProps, this._renderVertices()), zoomEnabled && minimapEnabled && this.zoomManager && React.createElement(_MiniMap.default, Object.assign({
      className: minimapClassName,
      classNamePrefix: classNamePrefix
    }, this.zoomManager.getProps())));
  }

}

exports.default = DirectedGraph;
DirectedGraph.propsFactories = {
  classNameIsSmall: _classNameIsSmall.default,
  mergePropSetters: _mergePropSetters.default,
  scaledStrokeWidth: _scaledStrokeWidth.default
};
DirectedGraph.defaultProps = {
  arrowScaleDampener: undefined,
  className: '',
  classNamePrefix: 'plexus',
  // getNodeLabel: defaultGetNodeLabel,
  minimap: false,
  minimapClassName: '',
  zoom: false
};