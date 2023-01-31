import { OntoumlElement, Cardinality, Classifier, PropertyStereotype, Decoratable, ModelElement } from '..';
export declare enum AggregationKind {
    NONE = "NONE",
    SHARED = "SHARED",
    COMPOSITE = "COMPOSITE"
}
export declare class Property extends Decoratable<PropertyStereotype> {
    propertyType: Classifier<any, any>;
    subsettedProperties: Property[];
    redefinedProperties: Property[];
    cardinality: Cardinality;
    aggregationKind: AggregationKind;
    isDerived: boolean;
    isOrdered: boolean;
    isReadOnly: boolean;
    constructor(base?: Partial<Property>);
    getContents(): OntoumlElement[];
    getAllowedStereotypes(): PropertyStereotype[];
    isStereotypeValid(allowsNone?: boolean): boolean;
    isAttribute(): boolean;
    isRelationEnd(): boolean;
    isPropertyTypeDefined(): boolean;
    isShared(): boolean;
    isComposite(): boolean;
    isAggregationEnd(): boolean;
    getOppositeEnd(): Property;
    getOtherEnds(): Property[];
    clone(): Property;
    replace(originalElement: ModelElement, newElement: ModelElement): void;
    toJSON(): any;
    resolveReferences(elementReferenceMap: Map<string, OntoumlElement>): void;
}
