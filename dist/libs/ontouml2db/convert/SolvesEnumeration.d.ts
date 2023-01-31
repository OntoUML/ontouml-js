import { Cardinality } from '../../ontouml2db/constants/enumerations';
import { Graph } from '../../ontouml2db/graph/Graph';
import { GraphRelation } from '../../ontouml2db/graph/GraphRelation';
import { Node } from '../../ontouml2db/graph/Node';
import { Tracker } from '../../ontouml2db/tracker/Tracker';
export declare class SolvesEnumeration {
    static solves(graph: Graph, tracker: Tracker, enumFiledToLookupTable: boolean): void;
    static applyEnumToFilds(graph: Graph, tracker: Tracker): void;
    static addEnumerationColumn(enumNode: Node, relation: GraphRelation, tracker: Tracker): void;
    static getTargetNode(node: Node, relation: GraphRelation): Node;
    static getCardinalityOf(node: Node, relation: GraphRelation): Cardinality;
    static transformEnumToLookupTables(graph: Graph, tracker: Tracker): void;
}
