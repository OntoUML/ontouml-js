/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Tracker } from '@libs/ontouml2db/tracker/Tracker';
//import { Tracker } from '@libs/ontouml2db/graph/REM_Tracker';

it('should ignore', () => {
  expect(true).toBe(true);
});

export class TrackerChecker {
  private sourceNodeName: string;
  private targetNodeName: string;

  constructor(sourceNode: string, targetNode: string) {
    this.sourceNodeName = sourceNode;
    this.targetNodeName = targetNode;
  }

  getSourceNodeName(): string {
    return this.sourceNodeName;
  }

  getTargetNodeName(): string {
    return this.targetNodeName;
  }

  check(tracker: Tracker): string {
    if (!tracker.existsTracer(this.sourceNodeName, this.targetNodeName)) {
      return (
        'Not find the tracer: ' +
        this.sourceNodeName +
        ' - ' +
        this.targetNodeName
      );
    }

    return '';
  }
}
