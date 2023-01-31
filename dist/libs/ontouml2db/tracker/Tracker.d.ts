import { Node } from '../../ontouml2db/graph/Node';
import { Tracer } from '../../ontouml2db/tracker/Tracer';
import { Graph } from '../../ontouml2db/graph/Graph';
import { NodeProperty } from '../../ontouml2db/graph/NodeProperty';
export declare class Tracker {
    private traceMap;
    constructor(graph: Graph);
    createNewTracerForTheSourceNode(node: Node): void;
    getTraceMap(): Map<string, Tracer>;
    moveTraceFromTo(from: Node, to: Node, property: NodeProperty, value: any, propertyBelongsToTheNode: Node): void;
    copyTracesFromTo(from: Node, to: Node): void;
    removeNodeFromTraces(node: Node): void;
    addFilterAtNode(from: Node, mappedToTheNode: Node, property: NodeProperty, value: any, belongsToTheNode: Node): void;
    putCascateRules(sourcelTrace: Tracer, currentTrace: Tracer): void;
    putRulesInFlatteningClasses(sourceTracer: Tracer): void;
    removePropertyBelongsToOtherNode(node: Node): void;
    existsTracerByName(sourceNodeName: string, targetNodeName: string): boolean;
    addJoinedNode(tracerNode: Node, tracedNode: Node, joinedNode: Node, innerJoin: boolean): void;
    addJoinedNodeToApplyFilter(nodeFilter: Node, joinedNode: Node): void;
    changeFieldToFilter(oldProperty: NodeProperty, newProperty: NodeProperty): void;
    toString(): string;
}
