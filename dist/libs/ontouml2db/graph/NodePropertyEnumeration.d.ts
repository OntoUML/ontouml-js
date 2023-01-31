import { NodeProperty } from '../../ontouml2db/graph/NodeProperty';
export declare class NodePropertyEnumeration extends NodeProperty {
    private values;
    constructor(id: string, name: string, dataType: string, isNull: boolean, multiValues: boolean);
    addValue(value: string): void;
    getValues(): string[];
    toString(): string;
}
