/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Node } from '@libs/ontouml2db/graph/Node';
import { Util } from '@libs/ontouml2db/util/Util';
import { Tracer } from '@libs/ontouml2db/tracker/Tracer';
import { TracedNode } from '@libs/ontouml2db/tracker/TracedNode';
import { NodeProperty } from '../graph/NodeProperty';

export class GenerateObdaSource {
  static generate(tracer: Tracer, tracedNode: TracedNode): string {
    let text: string = '';

    text += 'source       ';
    text += this.getSelect(tracer.getSourceNode(), tracedNode);
    text += this.getFrom(tracer, tracedNode);
    text += this.getWhere(tracer, tracedNode);

    return text;
  }

  static getSelect(sourceNode: Node, tracedNode: TracedNode): string {
    let text: string = '';

    // In the source node there is no PK, however it must be added to the query.
    text += 'SELECT ';
    text += tracedNode.getMainNode().getName();
    text += '.';
    text += tracedNode.getMainNode().getPKName();

    for (let sourceProperty of sourceNode.getProperties()) {
      text += ', ';
      text += tracedNode.getNodeProperty(sourceProperty.getID()).getName();
      text += '.';
      text += tracedNode.getPropertyByID(sourceProperty.getID()).getName();
    }

    //put the foreign keys
    for (let property of tracedNode.getFKPropertiesOfMainNode()) {
      text += ', ';
      text += tracedNode.getMainNode().getName();
      text += '.';
      text += property.getName();
    }
    text += ' \n';

    return text;
  }

  static getFrom(tracer: Tracer, tracedNode: TracedNode): string {
    let text: string = '';
    let smallTab: string;
    let largeTab: string;
    let first: boolean = true;
    let lastNode: Node;

    smallTab = Util.getSpaces('', 12);
    largeTab = Util.getSpaces('', 20);

    text += smallTab;
    first = true;
    // To dismembered nodes (when a multivalued attribute occurs, for example).
    for (let node of tracedNode.getNodes()) {
      if (first) {
        text += 'FROM ';
        text += node.getName();
        text += ' ';
        first = false;
        lastNode = node;
      } else {
        text += '\n';
        text += smallTab;
        text += 'INNER JOIN ';
        text += node.getName();
        text += '\n';
        text += largeTab;
        text += 'ON ';
        text += lastNode.getName();
        text += '.';
        text += lastNode.getPKName();
        text += ' = ';
        text += node.getName();
        text += '.';
        text += node.getFKRelatedOfNodeID(lastNode.getId()).getName();
        text += ' ';
        lastNode = node;
      }
    }

    let fkField: string; // The name of the FK is always the same in both tables.
    for (let filter of tracer.getFilters()) {
      if (filter.getNodeToApplyFilter() !== null) {
        let lastNode = tracedNode.getMainNode();
        for (let joinedNode of filter.getChainOfNodesToApplyFilter()) {
          fkField = this.getFKFields(lastNode, joinedNode);
          text += '\n';
          text += smallTab;
          text += 'INNER JOIN ';
          text += joinedNode.getName();
          text += '\n';
          text += largeTab;
          text += 'ON ';
          text += lastNode.getName();
          text += '.';
          text += fkField;
          text += ' = ';
          text += joinedNode.getName();
          text += '.';
          text += fkField;
          lastNode = joinedNode;
        }
        text += '\n';
        text += largeTab;
        text += 'AND ';
        text += lastNode.getName();
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

  static getWhere(tracer: Tracer, tracedNode: TracedNode): string {
    let first: boolean = true;
    let text: string = '';
    let smallTab: string = Util.getSpaces('', 12);

    for (let filter of tracer.getFilters()) {
      if (
        filter.getNodeToApplyFilter() == null && //Done as inner join
        tracedNode.getMainNode().getId() === filter.getSourceNode().getId()
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

  static getFKFields(sourceNode: Node, targetNode: Node): string {
    let fk: NodeProperty;

    fk = sourceNode.getFKRelatedOfNodeID(targetNode.getId());
    if (fk !== null) {
      return fk.getName();
    } else {
      fk = targetNode.getFKRelatedOfNodeID(sourceNode.getId());
      if (fk !== null) {
        return fk.getName();
      }
    }
    return 'Did not find the fk of the referenced table';
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
