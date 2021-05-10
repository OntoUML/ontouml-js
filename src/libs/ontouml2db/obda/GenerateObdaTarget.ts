/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Node } from '@libs/ontouml2db/graph/Node';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { GraphAssociation } from '@libs/ontouml2db/graph/GraphAssociation';
import { GraphRelation } from '@libs/ontouml2db/graph/GraphRelation';
import { TracedNode } from '../tracker/TracedNode';

export class GenerateObdaTarget {
  //public static generate(originalNode: Node, project: string, trackedNode: Node): string {
  public static generate(sourceNode: Node, project: string, tracedNode: TracedNode): string {
    if (sourceNode.getAssociationNameNtoN() == null) {
      return 'target       ' + this.generateTarget(sourceNode, project, tracedNode);
    } else {
      return 'target       ' + this.generateTargetNtoN(sourceNode, project, tracedNode);
    }
  }

  static generateTarget(sourceNode: Node, project: string, tracedNode: TracedNode): string {
    let text: string = '';

    text += this.generateSource(sourceNode, project, tracedNode);

    text += this.generatePredicateAndObjects(sourceNode, tracedNode);

    text += this.generateForeignKeyAssociations(project, tracedNode);

    text += '.\n';

    return text;
  }

  static generateSource(sourceNode: Node, project: string, tracedNode: TracedNode): string {
    let text: string = '';
    text += ':';
    text += project;
    text += '/';
    text += tracedNode.getNodes()[0].getName();
    text += '/';
    text += '{';
    text += tracedNode.getNodes()[0].getPKName();
    text += '}';
    text += ' a ';
    text += ':';
    text += sourceNode.getName();
    text += ' ';
    return text;
  }

  static generatePredicateAndObjects(sourceNode: Node, tracedNode: TracedNode): string {
    let text: string = '';

    for (let property of sourceNode.getProperties()) {
      if (!property.isPrimaryKey()) {
        text += '; ';
        text += this.generatePredicateFromProperty(property);
        text += ' ';
        text += this.generateObject(property, tracedNode);
      }
    }
    return text;
  }

  static generatePredicateFromProperty(property: NodeProperty): string {
    let text: string = ':';
    text += property.getName();
    return text;
  }

  static generateObject(property: NodeProperty, tracedNode: TracedNode): string {
    let text: string = '';
    let targetProperty: string = '';
    let tracedProperty: NodeProperty = tracedNode.getPropertyByID(property.getID());

    if (tracedProperty !== null) {
      targetProperty = tracedProperty.getName();
    } else {
      targetProperty = '[CAN NOT FIND ' + property.getName() + ' property at the target node.]';
    }

    text += '{';
    text += targetProperty; //tracedNode.getPropertyByID(property.getID()).getName();
    text += '}';
    text += this.getType(property);
    text += ' ';

    return text;
  }

  static generateForeignKeyAssociations(project: string, tracedNode: TracedNode): string {
    let text: string = '';
    let association: GraphRelation;

    for (let property of tracedNode.getMainNode().getProperties()) {
      if (property.isForeignKey()) {
        association = property.getAssociationRelatedOfFK() as GraphRelation;

        text += '; ';
        text += this.generatePredicateFromAssociation(association);
        text += ' :';
        text += project;
        text += '/';
        text +=
          association.getSourceNode().getId() === property.getForeignKeyNodeID()
            ? association.getSourceNode().getName()
            : association.getTargetNode().getName();
        text += '/';
        text += this.generateReferencedObject(property, tracedNode);
        text += ' ';
      }
    }
    return text;
  }

  static generateReferencedObject(property: NodeProperty, tracedNode: TracedNode): string {
    let text: string = '';
    text += '{';
    text += tracedNode.getPropertyByID(property.getID()).getName();
    text += '}';
    text += ' ';

    return text;
  }

  static generatePredicateFromAssociation(association: GraphAssociation): string {
    let text: string = ':';
    text += association.getName() !== null ? association.getName() : 'unnamed_association';
    return text;
  }

  static getType(property: NodeProperty): string {
    if (property.getDataType() === 'Date') {
      return '^^xsd:dateTime';
    } else if (property.getDataType() === 'DateTime') {
      return '^^xsd:dateTime';
    } else if (property.getDataType() === 'float') {
      return '^^xsd:decimal';
    } else if (property.getDataType() === 'double') {
      return '^^xsd:decimal';
    } else if (property.getDataType() === 'long') {
      return '^^xsd:decimal';
    }

    return '^^xsd:' + property.getDataType();
  }

  static generateTargetNtoN(sourceNode: Node, project: string, tracedNode: TracedNode): string {
    let text: string = '';
    let association: GraphRelation;

    let propertiesFK = tracedNode.getFKPropertiesOfMainNode();

    if (propertiesFK.length !== 2) {
      return '[ERROR: must exists tow FKs]';
    }

    association = propertiesFK[0].getAssociationRelatedOfFK() as GraphRelation;
    text += ':';
    text += project;
    text += '/';
    text += association.getSourceNode().getName();
    text += '/';
    text += '{';
    text += propertiesFK[0].getName();
    text += '}';

    text += ' ';
    text += ':';
    text += sourceNode.getAssociationNameNtoN();
    text += ' ';

    association = propertiesFK[1].getAssociationRelatedOfFK() as GraphRelation;
    text += ':';
    text += project;
    text += '/';
    text += association.getSourceNode().getName();
    text += '/';
    text += '{';
    text += propertiesFK[1].getName();
    text += '}';

    text += '.\n';

    return text;
  }
}
