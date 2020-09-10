/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { NodePropertyEnumeration } from '../graph/NodePropertyEnumeration';
import { Graph } from '../graph/Graph';

export class SolvesName {
  static solves(graph: Graph): void {
    for (let node of graph.getNodes()) {
      node.setName(SolvesName.adjust(node.getName()));
      for (let property of node.getProperties()) {
        property.setName(SolvesName.adjust(property.getName()));
        if (property instanceof NodePropertyEnumeration) {
          SolvesName.adjustEnumerationValues(property);
        }
      }
    }
  }

  static adjustEnumerationValues(enumeration: NodePropertyEnumeration): void {
    let values = enumeration.getValues();

    for (let index = 0; index < values.length; index++) {
      values[index] = values[index].toUpperCase();
    }
  }

  static adjust(name: string): string {
    let newName = ''; // + name.charAt(0);
    let index = 0; //1;

    //In order not to add "_" in the properties which are written in uppercase.
    while (
      index < name.length &&
      name.charAt(index) >= 'A' &&
      name.charAt(index) <= 'Z'
    ) {
      newName += name.charAt(index);
      index++;
    }

    while (index < name.length) {
      if (name.charAt(index) >= 'A' && name.charAt(index) <= 'Z') {
        newName += '_';
      }
      newName += name.charAt(index);
      index++;
    }
    return newName.toLowerCase();
  }
}
