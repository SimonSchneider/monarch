/// <reference types="react" />
import { ZoomTransform as ZoomTransform_ } from 'd3-zoom';
export { zoomIdentity } from 'd3-zoom';
export declare type ZoomTransform = ZoomTransform_;
declare type TUpdateCallback = (xform: ZoomTransform) => void;
declare type TSize = {
    height: number;
    width: number;
};
declare type TZoomProps = {
    x: number;
    y: number;
    k: number;
    contentHeight: number;
    contentWidth: number;
    viewAll: () => void;
    viewportHeight: number;
    viewportWidth: number;
};
export default class ZoomManager {
    static getZoomAttr(zoomTransform: ZoomTransform | void): string | undefined;
    static getZoomStyle(zoomTransform: ZoomTransform | void): Readonly<{
        transform: string;
        transformOrigin: string;
    }> | import("react").CSSProperties;
    private elem;
    private contentSize;
    private selection;
    private readonly updateCallback;
    private readonly zoom;
    private currentTransform;
    constructor(updateCallback: TUpdateCallback);
    setElement(elem: Element): void;
    setContentSize(size: TSize): void;
    resetZoom: () => void;
    getProps(): TZoomProps;
    private setExtent;
    private onZoomed;
    private constrainZoom;
}
