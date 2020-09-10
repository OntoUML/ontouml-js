/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Graph } from '@libs/ontouml2db/graph/Graph';
import { Tracker } from '@libs/ontouml2db/graph/Tracker';

export class TrackerChecker {
  private sourceNodeName: string;
  private targetNodeName: string;

  constructor(sourceNode: string, targetNode: string) {
    this.sourceNodeName = sourceNode;
    this.targetNodeName = targetNode;
  }

  check(graph: Graph): string {
    let sourceNode = graph.getNodeByName(this.sourceNodeName);
    if (sourceNode == null) {
      return "Class '" + this.sourceNodeName + "' was not found.";
    }

    if (!this.existsNode(sourceNode.getTrackers())) {
      return (
        "Tracker '" +
        this.sourceNodeName +
        ' - ' +
        this.targetNodeName +
        "' was not found."
      );
    }

    return '';
  }

  existsNode(trackers: Tracker[]): boolean {
    for (let tracker of trackers) {
      if (tracker.getNode().getName() == this.targetNodeName) return true;
    }
    return false;
  }
}
