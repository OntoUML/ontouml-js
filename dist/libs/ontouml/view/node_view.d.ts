import { ModelElement, ElementView, RectangularShape } from '..';
export declare abstract class NodeView<T extends ModelElement, S extends RectangularShape> extends ElementView<T, S> {
    constructor(type: string, base?: Partial<NodeView<T, S>>);
    getX(): number;
    setX(x: number): void;
    getY(): number;
    setY(y: number): void;
    getWidth(): number;
    setWidth(width: number): void;
    getHeight(): number;
    setHeight(height: number): void;
}
