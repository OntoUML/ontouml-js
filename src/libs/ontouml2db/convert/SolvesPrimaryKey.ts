/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Increment } from '@libs/ontouml2db/util/Increment';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { Graph } from '@libs/ontouml2db/graph/Graph';

export class SolvesPrimaryKey {
  static solves(graph: Graph): void {
    let pkName: string;
    let property: NodeProperty;
    let newID: string;

    for (let node of graph.getNodes()) {
      pkName = node.getName() + '_id';
      newID = pkName + Increment.getNext().toString();

      property = new NodeProperty(newID, pkName, 'int', false, false);

      property.setPrimaryKey(true);

      node.addPropertyAt(0, property);
    }
  }
}
