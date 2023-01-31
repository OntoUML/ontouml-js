import { ModelElement, OntoumlElement, ElementView, Class, Generalization, GeneralizationSet, Package, Relation, ClassView, GeneralizationSetView, GeneralizationView, PackageView, RelationView } from '..';
export declare class Diagram extends OntoumlElement {
    owner: ModelElement;
    contents: ElementView<any, any>[];
    constructor(base?: Partial<Diagram>);
    getContents(): OntoumlElement[];
    getClassViews(): ClassView[];
    getRelationViews(): RelationView[];
    getGeneralizationViews(): GeneralizationView[];
    getGeneralizationSetViews(): GeneralizationSetView[];
    getRealizedModelElements(): ModelElement[];
    addElement(element: ElementView<any, any>): void;
    addElements(elements: ElementView<any, any>[]): void;
    setElements(elements: ElementView<any, any>[]): void;
    findElementById(id: string): ElementView<any, any>;
    findView(modelElement: ModelElement): ElementView<any, any>;
    containsView(modelElement: ModelElement): boolean;
    addModelElements(modelElements: ModelElement[]): ElementView<any, any>[];
    addModelElement(modelElement: ModelElement): ElementView<any, any>;
    findOrCreateView(modelElement: ModelElement): ElementView<any, any>;
    addClass(clazz: Class): ClassView;
    addGeneralizationSet(gs: GeneralizationSet): GeneralizationSetView;
    addPackage(gs: Package): PackageView;
    addBinaryRelation(relation: Relation): RelationView;
    addGeneralization(generalization: Generalization): GeneralizationView;
    toJSON(): any;
    resolveReferences(elementReferenceMap: Map<string, OntoumlElement>): void;
}
