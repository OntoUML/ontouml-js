import { Shape, Point } from '..';
export declare abstract class RectangularShape extends Shape {
    topLeft: Point;
    width: number;
    height: number;
    constructor(type: string, base?: Partial<RectangularShape>);
    getX(): number;
    setX(x: number): void;
    getY(): number;
    setY(y: number): void;
    getWidth(): number;
    setWidth(width: number): void;
    getHeight(): number;
    setHeight(height: number): void;
    toJSON(): any;
}
