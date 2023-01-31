import { Graph } from '../../ontouml2db/graph/Graph';
import { Node } from '../../ontouml2db/graph/Node';
import { Tracker } from '../../ontouml2db/tracker/Tracker';
import { GraphAssociation } from '../graph/GraphAssociation';
import { GraphRelation } from '../graph/GraphRelation';
export declare class SolvesCardinalityNtoN {
    static solves(graph: Graph, tracker: Tracker): void;
    static resolveNtoN(relation: GraphRelation, graph: Graph, tracker: Tracker): void;
    static filterNtoN(element: GraphAssociation): boolean;
    static getAssociationName(relation: GraphRelation): string;
    static adjustTraceability(tracker: Tracker, relation: GraphRelation, newNode: Node): void;
    static existsEnumAtRelation(relation: GraphRelation): boolean;
    static getEnumNode(relation: GraphRelation): Node;
}
