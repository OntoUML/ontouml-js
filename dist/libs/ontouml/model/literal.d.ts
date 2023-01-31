import { OntoumlElement, ModelElement } from '..';
export declare class Literal extends ModelElement {
    constructor(base?: Partial<Literal>);
    getContents(): OntoumlElement[];
    clone(): Literal;
    replace(originalElement: ModelElement, newElement: ModelElement): void;
}
