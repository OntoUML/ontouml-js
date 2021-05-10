/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { PropertyChecker } from './PropertyChecker';
import { Node } from '@libs/ontouml2db/graph/Node';
import { Graph } from '@libs/ontouml2db/graph/Graph';

export class NodeChecker {
  private name: string;
  private properties: PropertyChecker[];

  constructor(name: string) {
    this.name = name;
    this.properties = [];
  }

  addProperty(property: PropertyChecker): NodeChecker {
    this.properties.push(property);
    return this;
  }

  check(graph: Graph): string {
    let result = '';
    let node: Node;

    node = graph.getNodeByName(this.name);

    if (node === null) {
      return "The node '" + this.name + "' was not found.";
    }

    for (let val of this.properties) {
      result = val.check(node);
      if (result != '') return result;
    }

    if (this.properties.length != node.getProperties().length) {
      return "The amount of properties does not match for the node '" + this.name + "'.";
    }

    return result;
  }
}
