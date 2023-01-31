import { Node } from '../../ontouml2db/graph/Node';
import { NodeProperty } from '../../ontouml2db/graph/NodeProperty';
export declare class Filter {
    private id;
    private sourceNode;
    private filterProperty;
    private value;
    private nodeToApplyFilter;
    private chainOfNodesToApplyFilter;
    constructor(sourceNode: Node, property: NodeProperty, value: any, belongsToOtherNode: Node);
    getId(): string;
    setSourceNode(node: Node): void;
    getSourceNode(): Node;
    setProperty(property: NodeProperty): void;
    getProperty(): NodeProperty;
    setValue(value: any): void;
    getValue(): any;
    setNodeToApplyFilter(node: Node): void;
    removeNodeToApplyFilter(): void;
    addJoinedNodeToDoFilter(node: Node): void;
    getNodeToApplyFilter(): Node;
    isNodeToApplyFilter(node: Node): boolean;
    getChainOfNodesToApplyFilter(): Node[];
    isFiltredByProperty(property: NodeProperty): boolean;
    toString(): string;
}
