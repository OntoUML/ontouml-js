import { OntoumlElement, RectangularShape } from '..';
export declare class Text extends RectangularShape {
    value: string;
    constructor(base?: Partial<Text>);
    getContents(): OntoumlElement[];
}
