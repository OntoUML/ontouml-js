/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Node } from '@libs/ontouml2db/graph/Node';
import { Util } from '@libs/ontouml2db/util/Util';
import { Tracer } from '@libs/ontouml2db/tracker/Tracer';

export class GenerateOBDASource {
  static generate(tracer: Tracer, trackedNode: Node): string {
    let text: string = '';

    text += 'source       ';
    text += this.getSelect(tracer.getSourceNode(), trackedNode);
    text += this.getFrom(tracer, trackedNode);
    text += this.getWhere(tracer, trackedNode);

    return text;
  }

  static getSelect(originalNode: Node, trackedNode: Node): string {
    let text: string = '';

    text += 'SELECT ';
    text += trackedNode.getName();
    text += '.';
    text += trackedNode.getPKName();
    for (let property of originalNode.getProperties()) {
      text += ', ';
      text += trackedNode.getName();
      text += '.';
      text += trackedNode.getPropertyByID(property.getID()).getName();
    }

    //put the foreign keys
    for (let property of trackedNode.getProperties()) {
      if (property.isForeignKey()) {
        text += ', ';
        text += trackedNode.getName();
        text += '.';
        text += property.getName();
      }
    }

    text += ' \n';

    return text;
  }

  static getFrom(tracer: Tracer, trackedNode: Node): string {
    let text: string = '';
    let smallTab: string;
    let largeTab: string;

    smallTab = Util.getSpaces('', 12);
    largeTab = Util.getSpaces('', 20);

    text += smallTab;
    text += 'FROM ';
    text += trackedNode.getName();
    text += ' ';

    for (let filter of tracer.getFilters()) {
      if (filter.getBelongToOtherNode() != null) {
        text += '\n';
        text += smallTab;
        text += 'INNER JOIN ';
        text += filter.getBelongToOtherNode().getName();
        text += '\n';
        text += largeTab;
        text += 'ON ';
        text += trackedNode.getName();
        text += '.';
        text += trackedNode.getPKName();
        text += ' = ';
        text += filter.getBelongToOtherNode().getName();
        text += '.';
        text += this.getReferencePkTable(filter.getBelongToOtherNode(), trackedNode.getId());

        text += '\n';
        text += largeTab;
        text += 'AND ';
        text += filter.getBelongToOtherNode().getName();
        text += '.';
        text += filter.getProperty().getName();
        text += ' = ';
        text += this.getStringValue(filter.getValue());
        text += ' ';
      }
    }
    text += '\n';

    return text;
  }

  static getWhere(tracer: Tracer, trackedNode: Node): string {
    let first: boolean = true;
    let text: string = '';
    let smallTab: string = Util.getSpaces('', 12);

    for (let filter of tracer.getFilters()) {
      if (
        filter.getBelongToOtherNode() == null && //Done as inner join
        trackedNode.getId() === filter.getSourceNode().getId()
      ) {
        //only if the rule refers to the tracked node. When a class is flattened, it can reference several classes

        if (first) {
          text += smallTab;
          text += 'WHERE ';
          first = false;
        } else {
          text += smallTab;
          text += 'AND   ';
        }

        text += filter.getProperty().getName();
        text += ' = ';
        text += this.getStringValue(filter.getValue());
        text += ' \n';
      }
    }
    return text;
  }

  static getReferencePkTable(node: Node, fkNodeID: string): string {
    for (let property of node.getProperties()) {
      if (property.isForeignKey()) {
        if (property.getForeignKeyNodeID() === fkNodeID) {
          return property.getName();
        }
      }
    }
    return '[Did not find the pk of the referenced table]';
  }

  static getStringValue(value: any): string {
    let text = value;
    text = text.toString();
    text = text.toUpperCase();

    if (typeof value === 'string') {
      return "'" + text + "'";
    } else {
      return text;
    }
  }
}
