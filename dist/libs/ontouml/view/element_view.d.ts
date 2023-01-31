import { ModelElement, OntoumlElement, DiagramElement, Shape } from '..';
export declare abstract class ElementView<T extends ModelElement, S extends Shape> extends DiagramElement {
    modelElement: T;
    shape: S;
    constructor(type: string, base?: Partial<ElementView<T, S>>);
    getContents(): OntoumlElement[];
    abstract createShape(): S;
    toJSON(): any;
    resolveReferences(elementReferenceMap: Map<string, OntoumlElement>): void;
}
