/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Increment } from '../graph/util/Increment';
import { NodeProperty } from '../graph/NodeProperty';
import { Graph } from '../graph/Graph';

export class SolvesPrimaryKey {
  static solves(graph: Graph): void {
    let pkName: string;
    let property: NodeProperty;
    let newID: string;

    for (let node of graph.getNodes()) {
      pkName = node.getName() + '_id';
      newID = pkName + Increment.getNext().toString(); //+ Util.getNextID().toString();

      property = new NodeProperty(newID, pkName, 'int', false, false);

      property.setPrimeryKey(true);

      node.addPropertyAt(0, property);
    }
  }
}
