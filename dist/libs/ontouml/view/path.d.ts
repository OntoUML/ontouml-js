import { OntoumlElement, Shape, Point } from '..';
export declare class Path extends Shape {
    points: Point[];
    constructor(base?: Partial<Path>);
    getContents(): OntoumlElement[];
    moveTo(x: number, y: number): void;
    setPoints(points: Point[]): void;
    addPoints(points: Point[]): void;
    addPoint(point: Point): void;
}
