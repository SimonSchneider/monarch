import * as React from 'react';
declare type TProps = Record<string, any> & {
    markerEnd: string;
    pathPoints: [number, number][];
};
export default class EdgePath extends React.PureComponent<TProps> {
    render(): JSX.Element;
}
export {};
