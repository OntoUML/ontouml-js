/**
 * Interface to the processing methods must implement.
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Graph } from '@libs/ontouml2db/graph/Graph';
import { Tracker } from '@libs/ontouml2db/tracker/Tracker';

export interface IStrategy {
  /**
   * Method responsible for performing the transformation of the graph.
   *
   * @param graph Graph to be modified.
   */
  run(graph: Graph, tracker: Tracker): void;
}
