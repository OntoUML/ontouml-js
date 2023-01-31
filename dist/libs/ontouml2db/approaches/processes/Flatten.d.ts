import { Graph } from '../../../ontouml2db/graph/Graph';
import { Node } from '../../../ontouml2db/graph/Node';
import { GraphGeneralization } from '../../../ontouml2db/graph/GraphGeneralization';
import { GraphRelation } from '../../../ontouml2db/graph/GraphRelation';
import { Cardinality } from '../../../ontouml2db/constants/enumerations';
import { Tracker } from '../../../ontouml2db/tracker/Tracker';
export declare class Flatten {
    static doFlattening(graph: Graph, tracker: Tracker): void;
    static flattenNode(node: Node, graph: Graph, tracker: Tracker): void;
    static flattenGeneralization(generalization: GraphGeneralization, tracker: Tracker): void;
    static flattenAssociation(flattenNode: Node, relation: GraphRelation, graph: Graph): void;
    static flattenAssociationWith(flattenNode: Node, toNode: Node, relation: GraphRelation, graph: Graph): void;
    static getNewCardinality(oldCardinality: Cardinality): Cardinality;
}
