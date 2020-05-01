import { TEdge, TLayoutEdge, TLayoutGraph, TLayoutVertex, TSizeVertex } from '../types';
export declare enum EWorkerErrorType {
    Error = "Error",
    LayoutError = "LayoutError"
}
export declare enum ECoordinatorPhase {
    Done = "Done",
    DotOnly = "DotOnly",
    Edges = "Edges",
    NotStarted = "NotStarted",
    Positions = "Positions"
}
export declare enum EWorkerPhase {
    DotOnly = "DotOnly",
    Edges = "Edges",
    Positions = "Positions"
}
export declare type TLayoutOptions = {
    rankdir?: 'TB' | 'LR' | 'BT' | 'RL';
    ranksep?: number;
    nodesep?: number;
    sep?: number;
    shape?: string;
    splines?: string;
    useDotEdges?: boolean;
    totalMemory?: number;
};
export declare type TLayoutWorkerMeta = {
    layoutId: number;
    workerId: number;
    phase: EWorkerPhase;
};
export declare type TWorkerInputMessage = {
    edges: TEdge<{}>[];
    meta: TLayoutWorkerMeta;
    options: TLayoutOptions | null;
    vertices: TSizeVertex<{}>[] | TLayoutVertex<{}>[];
};
export declare type TWorkerOutputMessage = {
    type: EWorkerPhase | EWorkerErrorType.LayoutError;
    edges: TLayoutEdge<{}>[] | null;
    graph: TLayoutGraph;
    layoutErrorMessage?: string;
    meta: TLayoutWorkerMeta;
    vertices: TLayoutVertex<{}>[];
};
export declare type TWorkerErrorMessage = {
    errorMessage: any;
    meta: TLayoutWorkerMeta | null;
    type: EWorkerErrorType.Error;
};
export declare type TNodesUpdate<T = Record<string, unknown>> = {
    type: ECoordinatorPhase.Positions;
    layoutId: number;
    graph: TLayoutGraph;
    vertices: TLayoutVertex<T>[];
};
export declare type TLayoutUpdate<T = Record<string, unknown>, U = Record<string, unknown>> = {
    type: ECoordinatorPhase.Done;
    layoutId: number;
    graph: TLayoutGraph;
    edges: TLayoutEdge<U>[];
    vertices: TLayoutVertex<T>[];
};
export declare type TUpdate<T = Record<string, unknown>, U = Record<string, unknown>> = TNodesUpdate<T> | TLayoutUpdate<T, U>;
