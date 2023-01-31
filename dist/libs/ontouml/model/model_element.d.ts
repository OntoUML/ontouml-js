import { OntoumlElement, Package } from '..';
export declare abstract class ModelElement extends OntoumlElement {
    propertyAssignments: object;
    constructor(type: string, base?: Partial<ModelElement>);
    toJSON(): any;
    abstract clone(): ModelElement;
    abstract replace(originalElement: ModelElement, newElement: ModelElement): void;
    lock(): void;
    unlock(): void;
    isLocked(): boolean;
    getModelOrRootPackage(): Package;
    resolveReferences(_elementReferenceMap: Map<string, OntoumlElement>): void;
}
