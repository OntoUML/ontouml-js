/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Increment } from '@libs/ontouml2db/util/Increment';
import { Node } from '@libs/ontouml2db/graph/Node';

export class GenerateOBDAMappingID {
  static generate(node: Node, project: string, first: boolean): string {
    let text: string = '';

    text += 'mappingId    ';
    text += project;
    text += '-';
    if (node.getAssociationNameNtoN() == null) {
      //when the class is generated from an N:N relationship
      text += node.getName();
    } else {
      text += node.getAssociationNameNtoN();
    }
    if (!first) {
      //when a class is mapped to multiple classes.
      text += Increment.getNext();
    }
    text += '\n';

    return text;
  }
}
