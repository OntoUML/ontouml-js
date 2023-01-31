import { NodeProperty } from '../../ontouml2db/graph/NodeProperty';
import { Node } from '../../ontouml2db/graph/Node';
export declare class TracedNode {
    private nodes;
    private innerJoin;
    constructor(node: Node);
    getNodes(): Node[];
    getMainNode(): Node;
    isNodeTraced(node: Node): boolean;
    addJoinedNode(joinedNode: Node, innerJoin: boolean): void;
    getPropertyByID(id: string): NodeProperty;
    getFKPropertiesOfMainNode(): NodeProperty[];
    getNodeProperty(id: string): Node;
    existsTracedNodeByName(nodeName: string): boolean;
    toString(): string;
}
