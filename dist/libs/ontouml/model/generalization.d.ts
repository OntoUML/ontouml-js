import { OntoumlElement, Class, Classifier, GeneralizationSet, ModelElement, Relation } from '..';
export declare class Generalization extends ModelElement {
    general: Classifier<any, any>;
    specific: Classifier<any, any>;
    constructor(base?: Partial<Generalization>);
    getContents(): OntoumlElement[];
    getGeneralizationSets(): GeneralizationSet[];
    involvesClasses(): boolean;
    involvesRelations(): boolean;
    clone(): Generalization;
    replace(originalElement: ModelElement, newElement: ModelElement): void;
    getGeneralClass(): Class;
    getGeneralRelation(): Relation;
    getSpecificClass(): Class;
    getSpecificRelation(): Relation;
    toJSON(): any;
    resolveReferences(elementReferenceMap: Map<string, OntoumlElement>): void;
}
