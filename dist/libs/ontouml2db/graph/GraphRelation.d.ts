import { Cardinality } from '../../ontouml2db/constants/enumerations';
import { GraphAssociation } from '../../ontouml2db/graph/GraphAssociation';
import { Node } from '../../ontouml2db/graph/Node';
export declare class GraphRelation extends GraphAssociation {
    private sourceNode;
    private targetNode;
    private sourceCardinality;
    private targetCardinality;
    constructor(ID: string, name: string, sourceNode: Node, sourceCardinality: Cardinality, targetNode: Node, targetCardinality: Cardinality);
    getSourceNode(): Node;
    setSourceNode(sourceNode: Node): void;
    getTargetNode(): Node;
    setTargetNode(targetNode: Node): void;
    getSourceCardinality(): Cardinality;
    setSourceCardinality(sourceCardinality: Cardinality): void;
    getTargetCardinality(): Cardinality;
    setTargetCardinality(targetCardinality: Cardinality): void;
    clone(newID?: string): GraphRelation;
    cloneChangingReferencesTo(nodes: Node[]): GraphAssociation;
    deleteAssociation(): void;
    isLowCardinalityOfNode(node: Node): boolean;
    isHighCardinalityOfNode(node: Node): boolean;
    toString(): string;
}
