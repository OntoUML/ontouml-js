/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Node } from '@libs/ontouml2db/graph/Node';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { GraphAssociation } from '@libs/ontouml2db/graph/GraphAssociation';
import { GraphRelation } from '@libs/ontouml2db/graph/GraphRelation';

export class GenerateOBDATarget {
  public static generate(originalNode: Node, project: string, trackedNode: Node): string {
    if (originalNode.getAssociationNameNtoN() == null) {
      return 'target       ' + this.generateTarget(originalNode, project, trackedNode);
    } else {
      return 'target       ' + this.generateTargetNtoN(originalNode, project, trackedNode);
    }
  }

  static generateTarget(originalNode: Node, project: string, trackedNode: Node): string {
    let text: string = '';

    text += this.generateSource(originalNode, project, trackedNode);

    text += this.generatePredicateAndObjects(originalNode, trackedNode);

    text += this.generateForeignKeyAssociations(project, trackedNode);

    text += '.\n';

    return text;
  }

  static generateSource(originalNode: Node, project: string, trackedNode: Node): string {
    let text: string = '';
    text += ':';
    text += project;
    text += '/';
    text += trackedNode.getName();
    text += '/';
    text += '{';
    text += trackedNode.getPKName();
    text += '}';
    text += ' a ';
    text += ':';
    text += originalNode.getName();
    text += ' ';
    return text;
  }

  static generatePredicateAndObjects(originalNode: Node, trackedNode: Node): string {
    let text: string = '';

    for (let property of originalNode.getProperties()) {
      if (!property.isPrimaryKey()) {
        text += '; ';
        text += this.generatePredicateFromProperty(property);
        text += ' ';
        text += this.generateObject(property, trackedNode);
      }
    }
    return text;
  }

  static generatePredicateFromProperty(property: NodeProperty): string {
    let text: string = ':';
    text += property.getName();
    return text;
  }

  static generateObject(property: NodeProperty, trackedNode: Node): string {
    let text: string = '';
    text += '{';
    text += trackedNode.getPropertyByID(property.getID()).getName();
    text += '}';
    text += this.getType(property);
    text += ' ';

    return text;
  }

  static generateForeignKeyAssociations(project: string, trackedNode: Node): string {
    let text: string = '';
    let association: GraphRelation;

    for (let property of trackedNode.getProperties()) {
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
        text += this.generateReferencedObject(property, trackedNode);
        text += ' ';
      }
    }
    return text;
  }

  static generateReferencedObject(property: NodeProperty, trackedNode: Node): string {
    let text: string = '';
    text += '{';
    text += trackedNode.getPropertyByID(property.getID()).getName();
    text += '}';
    text += ' ';

    return text;
  }

  static generatePredicateFromAssociation(association: GraphAssociation): string {
    let text: string = ':';
    text += association.getName() != null ? association.getName() : 'unnamed_association';
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

  static generateTargetNtoN(originalNode: Node, project: string, trackedNode: Node): string {
    let text: string = '';
    let association: GraphRelation;

    let propertiesFK = trackedNode.getProperties().filter((element: NodeProperty) => {
      return element.isForeignKey();
    });

    if (propertiesFK.length != 2) {
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
    text += originalNode.getAssociationNameNtoN();
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
