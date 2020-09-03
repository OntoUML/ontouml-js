/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { IGraph } from '@libs/ontouml2db/graph/IGraph';
import { ITracker } from '@libs/ontouml2db/graph/ITracker';

export class TrackerChecker {
  private sourceNodeName: string;
  private targetNodeName: string;

  public constructor(sourceNode: string, targetNode: string) {
    this.sourceNodeName = sourceNode;
    this.targetNodeName = targetNode;
  }

  public check(graph: IGraph): string {
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

  private existsNode(trackers: ITracker[]): boolean {
    for (let tracker of trackers) {
      if (tracker.getNode().getName() == this.targetNodeName) return true;
    }
    return false;
  }
}
