import { OntoumlElement, Class, Classifier, Generalization, ModelElement, Relation } from '..';
export declare class GeneralizationSet extends ModelElement {
    isDisjoint: boolean;
    isComplete: boolean;
    categorizer: Class;
    generalizations: Generalization[];
    constructor(base?: Partial<GeneralizationSet>);
    getContents(): OntoumlElement[];
    isPartition(): boolean;
    isPhasePartition(): boolean;
    getGeneral(): Classifier<any, any>;
    getSpecifics(): Classifier<any, any>[];
    getGeneralClass(): Class;
    getSpecificClasses(): Class[];
    getGeneralRelation(): Relation;
    getSpecificRelations(): Relation[];
    getInvolvedClassifiers(): Classifier<any, any>[];
    static collectSpecifics(generalizations: Generalization[]): Classifier<any, any>[];
    static collectGeneralizations(genSets: GeneralizationSet[]): Generalization[];
    involvesClasses(): boolean;
    involvesRelations(): boolean;
    clone(): GeneralizationSet;
    replace(originalElement: ModelElement, newElement: ModelElement): void;
    getInstantiationRelations(): Relation[];
    toJSON(): any;
    resolveReferences(elementReferenceMap: Map<string, OntoumlElement>): void;
}
