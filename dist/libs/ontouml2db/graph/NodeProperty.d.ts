import { GraphAssociation } from '../../ontouml2db/graph/GraphAssociation';
export declare class NodeProperty {
    private id;
    private name;
    private dataType;
    private acceptNull;
    private multivalued;
    private isPK;
    private isPKAutoIncrement;
    private isFK;
    private foreignNodeID;
    private associationRelated;
    private defaultValue;
    private resolved;
    constructor(id: string, name: string, dataType: string, acceptNull: boolean, multivalued: boolean);
    getID(): string;
    setName(name: string): void;
    getName(): string;
    setDataType(dataType: string): void;
    getDataType(): string;
    setPrimaryKey(flag: boolean): void;
    isPrimaryKey(): boolean;
    setPKAutoIncrement(flag: boolean): void;
    isPrimaryKeyAutoIncrement(): boolean;
    setForeignNodeID(foreignNodeID: string, associationRelated: GraphAssociation): void;
    getForeignKeyNodeID(): string;
    isForeignKey(): boolean;
    getAssociationRelatedOfFK(): GraphAssociation;
    setNullable(flag: boolean): void;
    isNullable(): boolean;
    setMultivalued(flag: boolean): void;
    isMultivalued(): boolean;
    setDefaultValue(value: any): void;
    getDefaultValue(): any;
    setResolved(flag: boolean): void;
    isResolved(): boolean;
    clone(newKey?: string): NodeProperty;
    toString(): string;
}
