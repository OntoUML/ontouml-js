import { Node } from '../../../ontouml2db/graph/Node';
import { Graph } from '../../../ontouml2db/graph/Graph';
import { GraphGeneralizationSet } from '../../../ontouml2db/graph/GraphGeneralizationSet';
import { Cardinality } from '../../../ontouml2db/constants/enumerations';
import { Tracker } from '../../../ontouml2db/tracker/Tracker';
export declare class Lifting {
    static doLifting(graph: Graph, tracker: Tracker): void;
    static liftNode(node: Node, graph: Graph, tracker: Tracker): void;
    static resolveGeneralization(node: Node, tracker: Tracker): void;
    static liftAttributes(node: Node): void;
    static resolveGeneralizationSet(node: Node, graph: Graph, tracker: Tracker): void;
    static getEnumName(gs: GraphGeneralizationSet): string;
    static getNewSourceCardinality(gs: GraphGeneralizationSet): Cardinality;
    static remakeReferences(node: Node, tracker: Tracker): void;
    static getNewCardinality(oldCardinality: Cardinality): Cardinality;
}
