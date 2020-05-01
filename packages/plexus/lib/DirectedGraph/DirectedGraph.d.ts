import * as React from 'react';
import classNameIsSmall from './prop-factories/classNameIsSmall';
import mergePropSetters from './prop-factories/mergePropSetters';
import scaledStrokeWidth from './prop-factories/scaledStrokeWidth';
import { TDirectedGraphProps, TDirectedGraphState } from './types';
import { TCancelled, TLayoutDone, TPositionsDone } from '../types';
import ZoomManager from '../zoom/ZoomManager';
export default class DirectedGraph<T> extends React.PureComponent<TDirectedGraphProps<T>, TDirectedGraphState> {
    arrowId: string;
    arrowIriRef: string;
    rootRef: React.RefObject<HTMLDivElement>;
    rootSelection: any;
    zoomManager: ZoomManager | null;
    static propsFactories: {
        classNameIsSmall: typeof classNameIsSmall;
        mergePropSetters: typeof mergePropSetters;
        scaledStrokeWidth: typeof scaledStrokeWidth;
    };
    static defaultProps: {
        arrowScaleDampener: undefined;
        className: string;
        classNamePrefix: string;
        minimap: boolean;
        minimapClassName: string;
        zoom: boolean;
    };
    state: TDirectedGraphState;
    static getDerivedStateFromProps<T>(nextProps: TDirectedGraphProps<T>, prevState: TDirectedGraphState): {
        edges: {
            from: string;
            to: string;
            isBidirectional?: boolean | undefined;
        }[];
        vertices: {
            key: string;
        }[];
        layoutPhase: number;
        vertexRefs: React.RefObject<HTMLElement>[];
        sizeVertices: null;
        layoutEdges: null;
        layoutGraph: null;
        layoutVertices: null;
    } | null;
    constructor(props: TDirectedGraphProps<T>);
    componentDidMount(): void;
    componentDidUpdate(): void;
    _onPositionsDone: (result: TCancelled | TPositionsDone<Record<string, unknown>>) => void;
    _onLayoutDone: (result: TCancelled | TLayoutDone<Record<string, unknown>, Record<string, unknown>>) => void;
    _onZoomUpdated: (zoomTransform: import("d3-zoom").ZoomTransform) => void;
    _setSizeVertices(): void;
    _renderVertices(): JSX.Element;
    _renderEdges(): JSX.Element | null;
    render(): JSX.Element;
}
