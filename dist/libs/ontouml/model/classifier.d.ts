import { Stereotype, Decoratable, Generalization, GeneralizationSet, Property, Relation } from '..';
export declare abstract class Classifier<T extends Classifier<T, S>, S extends Stereotype> extends Decoratable<S> {
    isAbstract: boolean;
    isDerived: boolean;
    properties: Property[];
    constructor(type: string, base?: Partial<Classifier<T, S>>);
    addParent(parent: T): Generalization;
    addChild(child: T): Generalization;
    getGeneralizations(): Generalization[];
    getGeneralizationsWhereGeneral(): Generalization[];
    getGeneralizationsWhereSpecific(): Generalization[];
    getGeneralizationSets(): GeneralizationSet[];
    getGeneralizationSetsWhereGeneral(): GeneralizationSet[];
    getGeneralizationSetsWhereSpecific(): GeneralizationSet[];
    getGeneralizationSetsWhereCategorizer(): GeneralizationSet[];
    getParents(): T[];
    getChildren(): T[];
    getAncestors(knownAncestors?: T[]): T[];
    getDescendants(knownDescendants?: T[]): T[];
    getFilteredAncestors(filter: (ancestor: T) => boolean): T[];
    getFilteredDescendants(filter: (descendent: T) => boolean): T[];
    getOwnRelations(_filter?: Function): Relation[];
    getOwnIncomingRelations(): Relation[];
    getOwnOutgoingRelations(): Relation[];
    getAllRelations(_filter?: Function): Relation[];
    getAllIncomingRelations(): Relation[];
    getAllOutgoingRelations(): Relation[];
    getOwnNaryRelations(): {
        position: number;
        relation: Relation;
    }[];
    getAllNaryRelations(): {
        position: number;
        relation: Relation;
    }[];
    getOwnDerivations(): Relation[];
    getAllDerivations(): Relation[];
    getAllOppositeRelationEnds(): Property[];
    getOwnOppositeRelationEnds(): Property[];
}
