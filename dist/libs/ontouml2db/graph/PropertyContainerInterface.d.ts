import { NodeProperty } from '../../ontouml2db/graph/NodeProperty';
export interface PropertyContainerInterface {
    addProperty(property: NodeProperty): void;
    addProperties(properties: NodeProperty[]): void;
    addPropertyAt(index: number, property: NodeProperty): void;
    addPropertiesAt(index: number, properties: NodeProperty[]): void;
    getPropertyByID(id: string): NodeProperty;
    getPropertyByName(name: string): NodeProperty;
    getProperties(): NodeProperty[];
    clonePropertyContainer(): PropertyContainerInterface;
    removeProperty(id: string): void;
    getPrimaryKey(): NodeProperty;
    getPKName(): string;
    existsPropertyName(propertyName: string): boolean;
    existsProperty(property: NodeProperty): boolean;
    getFKRelatedOfNodeID(id: string): NodeProperty;
    toString(): string;
}
