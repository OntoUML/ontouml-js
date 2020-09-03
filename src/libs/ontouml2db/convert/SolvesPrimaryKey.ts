/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { IGraph } from '../graph/IGraph';
import { INodeProperty } from '../graph/INodeProperty';
import { Increment } from '../graph/util/Increment';
import { NodeProperty } from '../graph/impl/NodeProperty';

export class SolvesPrimaryKey {
  public static solves(graph: IGraph): void {
    let pkName: string;
    let property: INodeProperty;
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
