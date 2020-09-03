/**
 * Author: Gustavo Ludovico Guidoni
 */

import { IGraph } from '../graph/IGraph';
import { INode } from '../graph/INode';
import { IGraphRelation } from '../graph/IGraphRelation';
import { ClassStereotype } from '@constants/.';
import { Cardinality } from '../graph/util/enumerations';

export class SolvesEnumeration {
  public static solves(graph: IGraph): void {
    let nodesToDestroy: INode[] = [];
    let associationsToRemove: IGraphRelation[] = [];

    for (let node of graph.getNodes()) {
      if (node.getStereotype() == ClassStereotype.ENUMERATION) {
        associationsToRemove.length = 0; // clear the array
        for (let relation of node.getRelations()) {
          if (relation.isLowCardinalityOfNode(node)) {
            //Transforms the enumeration into a column in the target node.
            this.addEnumerationColumn(node, relation);
            nodesToDestroy.push(node);
            associationsToRemove.push(relation);
          } else if (relation.isHighCardinalityOfNode(node)) {
            // Transforms the enumeration into a table.
            // This table now represents the intermediate table of the N:N
            // relationship. The cardinality 1 is associated with the ENUM
            // field of the table and N with the table itself.
            //node.setStereotype("table");
            if (relation.getSourceNode() == node)
              relation.setTargetCardinality(Cardinality.C1);
            else relation.setSourceCardinality(Cardinality.C1);
          }
        }
        graph.removeAssociations(associationsToRemove);
      }
    }
    graph.removeNodes(nodesToDestroy);
  }

  private static addEnumerationColumn(
    enumNode: INode,
    relation: IGraphRelation,
  ): void {
    let targetNode: INode;
    let cardinalityOfEnum: Cardinality;
    let isNull: boolean;
    let isMultivalued: boolean;

    targetNode = this.getTargetNode(enumNode, relation);
    cardinalityOfEnum = this.getCardinalityOf(enumNode, relation);

    if (
      cardinalityOfEnum == Cardinality.C0_1 ||
      cardinalityOfEnum == Cardinality.C1
    )
      isMultivalued = false;
    else isMultivalued = true;

    if (
      cardinalityOfEnum == Cardinality.C0_1 ||
      cardinalityOfEnum == Cardinality.C0_N
    )
      isNull = true;
    //accept null
    else isNull = false; //not accept null

    for (let property of enumNode.getProperties()) {
      //if( property instanceof IEnumeration ) {
      property.setNullable(isNull);
      property.setMultivalued(isMultivalued);
      targetNode.addProperty(property);

      targetNode.removeSourcePropertyLinkedAtNode(enumNode.getId());
    }
  }

  private static getTargetNode(node: INode, relation: IGraphRelation): INode {
    if (relation.getSourceNode() == node) return relation.getTargetNode();
    else return relation.getSourceNode();
  }

  private static getCardinalityOf(
    node: INode,
    relation: IGraphRelation,
  ): Cardinality {
    if (relation.getSourceNode() == node)
      return relation.getSourceCardinality();
    else return relation.getTargetCardinality();
  }
}
