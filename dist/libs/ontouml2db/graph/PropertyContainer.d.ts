import { PropertyContainerInterface } from '../../ontouml2db/graph/PropertyContainerInterface';
import { NodeProperty } from '../../ontouml2db/graph/NodeProperty';
export declare class PropertyContainer implements PropertyContainerInterface {
    private properties;
    constructor();
    addProperty(property: NodeProperty): void;
    addProperties(properties: NodeProperty[]): void;
    addPropertyAt(index: number, property: NodeProperty): void;
    addPropertiesAt(index: number, properties: NodeProperty[]): void;
    getPropertyByID(id: string): NodeProperty;
    getPropertyByName(name: string): NodeProperty;
    getProperties(): NodeProperty[];
    removeProperty(id: string): void;
    getPrimaryKey(): NodeProperty;
    getPKName(): string;
    existsPropertyName(propertyName: string): boolean;
    existsProperty(property: NodeProperty): boolean;
    clonePropertyContainer(): PropertyContainerInterface;
    getFKRelatedOfNodeID(id: string): NodeProperty;
    toString(): string;
}
