/**
 * Class responsible for storing the traceability of the node linked to this container to
 * the nodes in the transformed graph.
 *
 * Author: Gustavo L. Guidoni
 */

import { Node } from '@libs/ontouml2db/graph/Node';
import { Tracer } from '@libs/ontouml2db/tracker/Tracer';
import { Graph } from '@libs/ontouml2db/graph/Graph';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';

export class Tracker {
  private traceMap: Map<string, Tracer>;

  constructor(graph: Graph) {
    this.traceMap = new Map();

    for (let node of graph.getNodes()) {
      this.createNewTracerForTheSourceNode(node);
    }
  }

  /**
   * Creates a new tracer for the source node, that is, adds a new node to be tracked.
   * @param node
   */
  createNewTracerForTheSourceNode(node: Node): void {
    let trace: Tracer;

    trace = new Tracer(node.clone()); //saves the class in its original form

    trace.addTargetNode(node); //initially, each class references itself.

    this.traceMap.set(node.getId(), trace); //puts the new trace
  }

  /**
   * Returns the tracers.
   */
  getTraceMap(): Map<string, Tracer> {
    return this.traceMap;
  }

  /**
   * Causes the originating node to track a new node.
   * @param fromID
   * @param toID
   * @param property
   * @param value
   * @param propertyBelongsToTheNode
   */
  moveTraceFromTo(from: Node, to: Node, property: NodeProperty, value: any, propertyBelongsToTheNode: Node): void {
    this.addFilterAtNode(from, to, property, value, propertyBelongsToTheNode);
    this.copyTracesFromTo(from, to);
    this.removeNodeFromTraces(from);
  }

  /**
   * It just copies the trace from the source node to the destination node.
   * @param fromID
   * @param toID
   */
  copyTracesFromTo(from: Node, to: Node): void {
    let trace = this.traceMap.get(from.getId());

    trace.addTargetNode(to);

    //change the references presents in the others traces
    for (trace of this.traceMap.values()) {
      if (trace.existsTraceFor(from)) {
        trace.addTargetNode(to);
        trace.updateSourceRulesToFrom(from, to);
      }
    }
  }

  /**
   * Deletes a node from all tracers.
   * @param id
   */
  removeNodeFromTraces(node: Node): void {
    for (let trace of this.traceMap.values()) {
      trace.removeTrace(node);
    }
  }

  /**
   * Adds a new filte to the node.
   * @param id
   * @param mappedToTheNode
   * @param property
   * @param value
   * @param belongsToTheNode
   */
  addFilterAtNode(from: Node, mappedToTheNode: Node, property: NodeProperty, value: any, belongsToTheNode: Node): void {
    let trace = this.traceMap.get(from.getId());
    trace.newFilter(mappedToTheNode, property, value, belongsToTheNode);

    let nextTrace = this.traceMap.get(mappedToTheNode.getId());
    this.putCascateRules(trace, nextTrace);
    this.putRulesInFlatteningClasses(trace);
  }

  /**
   * Adds to the tracker all the rules of the tracked node, and of your
   * trackers until there are no more tracks.
   */
  putCascateRules(originalTrace: Tracer, currentTrace: Tracer): void {
    let nextTrace = this.traceMap.get(currentTrace.getSourceNode().getId());

    if (originalTrace.getSourceNode().getId() != currentTrace.getSourceNode().getId()) {
      for (let filter of currentTrace.getFilters()) {
        originalTrace.addFilter(filter);
      }
    }

    if (currentTrace.getSourceNode().getId() != nextTrace.getSourceNode().getId()) {
      this.putCascateRules(originalTrace, nextTrace);
    }
  }

  /**
   * Checks whether the current node is tracked by any source node. If so, add the
   * rules from the source node to the current node. This is important when a class
   * is flattened and there are selection rules in the target class.
   * @param originalTracer
   */
  putRulesInFlatteningClasses(originalTracer: Tracer) {
    let id: string = originalTracer.getSourceNode().getId();

    for (let tracer of this.traceMap.values()) {
      //for not put on yourself
      if (tracer.getSourceNode().getId() != id) {
        for (let tracedNode of tracer.getTargetNodes().values()) {
          for (let targetNode of tracedNode.getNodes()) {
            if (targetNode.getId() === id) {
              for (let filter of originalTracer.getFilters()) {
                tracer.addFilter(filter);
              }
            }
          }
        }
      }
    }
  }

  /**
   * Informs that the property no longer belongs to another class. The method informs
   * all traced nodes that the node passed as an argument is not the owner of the property.
   * @param id
   */
  removePropertyBelongsToOtherNode(node: Node) {
    for (let tracer of this.traceMap.values()) {
      for (let filter of tracer.getFilters()) {
        if (filter.getBelongToOtherNode() != null) {
          if (filter.getBelongToOtherNode().getId() === node.getId()) {
            filter.setBelongToOtherNode(null);
          }
        }
      }
    }
  }

  /**
   * Informs if exists the tracer from the source node to the target node.
   * @param sourceNodeName
   * @param targetNodeName
   */
  existsTracerByName(sourceNodeName: string, targetNodeName: string): boolean {
    for (let trace of this.traceMap.values()) {
      if (trace.getSourceNode().getName() === sourceNodeName) {
        for (let tracedNode of trace.getTargetNodes().values()) {
          for (let targetNode of tracedNode.getNodes()) {
            if (targetNode.getName() === targetNodeName) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  putNewNode(newNode: Node): void {
    this.createNewTracerForTheSourceNode(newNode);
  }

  addJoinedNode(tracerNode: Node, tracedNode: Node, joinedNode: Node, innerJoin: boolean): void {
    let trace = this.traceMap.get(tracerNode.getId());
    trace.addJoinedNode(tracedNode, joinedNode, innerJoin);
  }

  toString(): string {
    let msg = '\n : Tracker ';

    for (let trace of this.traceMap.values()) {
      msg += '\n\t\t' + trace.toString();
    }
    return msg;
  }
}
