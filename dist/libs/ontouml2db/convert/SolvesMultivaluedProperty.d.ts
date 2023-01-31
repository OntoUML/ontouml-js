import { NodeProperty } from '../../ontouml2db/graph/NodeProperty';
import { Node } from '../../ontouml2db/graph/Node';
import { Graph } from '../../ontouml2db/graph/Graph';
import { Tracker } from '../../ontouml2db/tracker/Tracker';
export declare class SolvesMultivaluedProperty {
    static solves(graph: Graph, tracker: Tracker): void;
    static transformPropertyIntoNode(property: NodeProperty, node: Node, graph: Graph, tracker: Tracker): void;
    static doTracking(tracedNode: Node, joinedNode: Node, property: NodeProperty, graph: Graph, tracker: Tracker): void;
}
