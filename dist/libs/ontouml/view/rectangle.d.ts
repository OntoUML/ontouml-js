import { OntoumlElement, RectangularShape } from '..';
export declare class Rectangle extends RectangularShape {
    constructor(base?: Partial<Rectangle>);
    getContents(): OntoumlElement[];
}
