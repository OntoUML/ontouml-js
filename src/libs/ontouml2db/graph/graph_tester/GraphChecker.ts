/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { IGraph } from '@libs/ontouml2db/graph/IGraph';
import { Transformation2DB } from '@libs/ontouml2db/Transformation2DB';
import { NodeChecker } from './NodeCheker';
import { TrackerChecker } from './TrackerChecker';
import { RelationshipChecker } from './RelationshipChecker';

export class GraphChecker {
  private nodes: NodeChecker[];
  private relationships: RelationshipChecker[];
  private trackers: TrackerChecker[];
  private targetGraph: IGraph;
  private sourceGraph: IGraph;

  constructor() {
    this.nodes = [];
    this.relationships = [];
    this.trackers = [];
  }
  //constructor(builder: GraphCheckerBuilder){
  //	this.targetGraph = builder.getTransformation().getTargetGraph();
  //	this.sourceGraph = builder.getTransformation().getSourceGraph();
  //nodesTest = builder.nodes;
  //associationsTest = builder.associations;
  //trackersTest = builder.trackers;
  //}
  public setTransformation(transformation: Transformation2DB): GraphChecker {
    this.targetGraph = transformation.getTargetGraph();
    this.sourceGraph = transformation.getSourceGraph();
    return this;
  }

  public addNode(node: NodeChecker): GraphChecker {
    this.nodes.push(node);
    return this;
  }

  public addRelationship(relationship: RelationshipChecker): GraphChecker {
    this.relationships.push(relationship);
    return this;
  }

  public addTracker(tracker: TrackerChecker): GraphChecker {
    this.trackers.push(tracker);
    return this;
  }

  public check(): string {
    let result = '';

    // **************************************************************
    // ** Checkes the nodes
    for (let node of this.nodes) {
      result = node.check(this.targetGraph);
      if (result != '') return result;
    }

    if (this.nodes.length != this.targetGraph.getNodes().length) {
      return 'The amount of nodes does not match.';
    }

    // ***************************************************************
    // ** Checks the relationships
    for (let relationship of this.relationships) {
      result = relationship.check(this.targetGraph);
      if (result != '') return result;
    }

    if (
      this.relationships.length != this.targetGraph.getAssociations().length
    ) {
      return (
        'The amount of RELATIONSHIPS does not match. Tested: ' +
        this.relationships.length +
        '. Graph: ' +
        this.targetGraph.getAssociations().length
      );
    }

    // ***************************************************************
    // ** Checks whether traceability is correct
    if (this.trackers.length == 0) return 'Tracking has not been set.';

    for (let tracker of this.trackers) {
      result = tracker.check(this.sourceGraph);
      if (result != '') return result;
    }
    // ****************************************************************
    return result;
  }
}
