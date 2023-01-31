import { Package, Class, GeneralizationSet, Generalization, Relation, ModelElement, Diagram } from '../ontouml';
export declare class Module {
    name: string;
    classes: Class[];
    relations: Relation[];
    generalizations: Generalization[];
    generalizationSets: GeneralizationSet[];
    constructor(name: string);
    createDiagram(owner: Package): Diagram;
    addClasses(classes: Class[]): void;
    containsRelation(relation: Relation): boolean;
    addRelations(relations: Relation[]): void;
    addGeneralizations(generalizations: Generalization[]): void;
    addGeneralizationSets(generalizationSets: GeneralizationSet[]): void;
    removeDuplicates(): void;
    static removeDuplicatesArray<T extends ModelElement>(elements: T[]): T[];
    addAll(cluster: Module): boolean;
}
