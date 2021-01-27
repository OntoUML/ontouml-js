/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Graph } from '@libs/ontouml2db/graph/Graph';
import { OntoUML2DB } from '@libs/ontouml2db/OntoUML2DB';
import { NodeChecker } from './NodeChecker';
import { TrackerChecker } from './TrackerChecker';
import { RelationshipChecker } from './RelationshipChecker';
import { Tracker } from '@libs/ontouml2db/tracker/Tracker';
import { Tracer } from '@libs/ontouml2db/tracker/Tracer';
//import { TracedNode } from '@libs/ontouml2db/tracker/TracedNode';

it('should ignore', () => {
  expect(true).toBe(true);
});

export class GraphChecker {
  private nodes: NodeChecker[];
  private relationships: RelationshipChecker[];
  private trackerCheckers: TrackerChecker[];
  //private targetGraph: Graph;
  private sourceGraph: Graph;
  private tracker: Tracker;

  constructor() {
    this.nodes = [];
    this.relationships = [];
    this.trackerCheckers = [];
  }

  setTransformation(transformation: OntoUML2DB): GraphChecker {
    //this.targetGraph = transformation.getTargetGraph();
    this.sourceGraph = transformation.getSourceGraph();
    this.tracker = transformation.getTracker();
    return this;
  }

  addNode(node: NodeChecker): GraphChecker {
    this.nodes.push(node);
    return this;
  }

  addRelationship(relationship: RelationshipChecker): GraphChecker {
    this.relationships.push(relationship);
    return this;
  }

  addTracker(tracker: TrackerChecker): GraphChecker {
    this.trackerCheckers.push(tracker);
    return this;
  }

  check(): string {
    let result = '';

    // **************************************************************
    // ** Checks the nodes
    for (let node of this.nodes) {
      //result = node.check(this.targetGraph);
      result = node.check(this.sourceGraph);
      if (result != '') return result;
    }

    //if (this.nodes.length != this.targetGraph.getNodes().length) {
    if (this.nodes.length != this.sourceGraph.getNodes().length) {
      return 'The amount of nodes does not match.';
    }

    // ***************************************************************
    // ** Checks the relationships
    for (let relationship of this.relationships) {
      //result = relationship.check(this.targetGraph);
      result = relationship.check(this.sourceGraph);
      if (result != '') return result;
    }

    if (
      //this.relationships.length != this.targetGraph.getAssociations().length
      this.relationships.length != this.sourceGraph.getAssociations().length
    ) {
      return (
        'The amount of RELATIONSHIPS does not match. Tested: ' +
        this.relationships.length +
        '. Graph: ' +
        //this.targetGraph.getAssociations().length
        this.sourceGraph.getAssociations().length
      );
    }

    // ***************************************************************
    // ** Checks whether traceability is correct
    if (this.trackerCheckers.length === 0) return 'Tracking has not been set.';

    //check if all traces to check exists in the graph
    for (let trackerChecker of this.trackerCheckers) {
      result = trackerChecker.check(this.tracker);
      if (result != '') return result;
    }

    //Check if all traces in the graph was evaluated to validate.
    let sourceNodeName: string;
    let targetNodeName: string;
    let map: Map<string, Tracer> = this.tracker.getTraceMap();

    for (let tracer of map.values()) {
      sourceNodeName = tracer.getSourceNode().getName();
      for (let tracedNode of tracer.getTargetNodes().values()) {
        targetNodeName = tracedNode.getName();
        if (!this.existsTrace(sourceNodeName, targetNodeName)) {
          return (
            'The trace ' +
            sourceNodeName +
            ' - ' +
            targetNodeName +
            ' was produced in the graph and not evaluated in the check.'
          );
        }
      }
    }

    // ****************************************************************
    return result;
  }

  existsTrace(sourceName: string, targetName: string): boolean {
    for (let trackerChecker of this.trackerCheckers) {
      if (
        sourceName === trackerChecker.getSourceNodeName() &&
        targetName === trackerChecker.getTargetNodeName()
      ) {
        return true;
      }
    }
    return false;
  }
}
