export declare type TLayoutGraph = {
    height: number;
    scale: number;
    width: number;
};
export declare type TVertexKey = string;
export declare type TVertex<T = {}> = T & {
    key: TVertexKey;
};
export declare type TSizeVertex<T = {}> = {
    vertex: TVertex<T>;
    width: number;
    height: number;
};
export declare type TLayoutVertex<T = {}> = TSizeVertex<T> & {
    left: number;
    top: number;
};
export declare type TEdge<T = {}> = T & {
    from: TVertexKey;
    to: TVertexKey;
    isBidirectional?: boolean;
};
export declare type TLayoutEdge<T = {}> = {
    edge: TEdge<T>;
    pathPoints: [number, number][];
};
export declare type TCancelled = {
    isCancelled: true;
};
export declare type TPositionsDone<T = Record<string, unknown>> = {
    isCancelled: false;
    graph: TLayoutGraph;
    vertices: TLayoutVertex<T>[];
};
export declare type TLayoutDone<T = Record<string, unknown>, U = Record<string, unknown>> = {
    isCancelled: false;
    edges: TLayoutEdge<U>[];
    graph: TLayoutGraph;
    vertices: TLayoutVertex<T>[];
};
export declare type TPendingLayoutResult<T = Record<string, unknown>, U = Record<string, unknown>> = {
    positions: Promise<TPositionsDone<T> | TCancelled>;
    layout: Promise<TLayoutDone<T, U> | TCancelled>;
};
