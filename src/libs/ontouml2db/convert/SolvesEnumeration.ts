/**
 * Author: Gustavo Ludovico Guidoni
 */

import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { Graph } from '@libs/ontouml2db/graph/Graph';
import { GraphRelation } from '@libs/ontouml2db/graph/GraphRelation';
import { Node } from '@libs/ontouml2db/graph/Node';
import { Tracker } from '@libs/ontouml2db/tracker/Tracker';

import { ClassStereotype } from '@libs/ontouml';
import { NodePropertyEnumeration } from '../graph/NodePropertyEnumeration';
import { NodeProperty } from '../graph/NodeProperty';
import { Increment } from '../util/Increment';

export class SolvesEnumeration {
  static solves(graph: Graph, tracker: Tracker, enumFiledToLookupTable: boolean): void {
    if (enumFiledToLookupTable) {
      this.transformEnumToLookupTables(graph, tracker);
    } else {
      this.applyEnumToFilds(graph, tracker);
    }
  }

  // **********************************************************
  // *** Methodos to apply enumerations to fields
  // **********************************************************
  static applyEnumToFilds(graph: Graph, tracker: Tracker) {
    let nodesToDestroy: Node[] = [];
    let associationsToRemove: GraphRelation[] = [];

    for (let node of graph.getNodes()) {
      if (node.getStereotype() === ClassStereotype.ENUMERATION) {
        associationsToRemove.length = 0; // clear the array
        for (let relation of node.getRelations()) {
          if (relation.isLowCardinalityOfNode(node)) {
            //Transforms the enumeration into a column in the target node.
            SolvesEnumeration.addEnumerationColumn(node, relation, tracker);
            nodesToDestroy.push(node);
            associationsToRemove.push(relation);
          } else {
            // if (relation.isHighCardinalityOfNode(node)) {
            // Let the enumeration be a table.
            // This table now represents the intermediate table of the N:N
            // relationship. The cardinality 1 is associated with the ENUM
            // field of the table and N with the table itself.
            if (relation.getSourceNode() === node) relation.setTargetCardinality(Cardinality.C1);
            else relation.setSourceCardinality(Cardinality.C1);
          }
        }
        graph.removeAssociations(associationsToRemove);
      }
    }
    graph.removeNodes(nodesToDestroy);
  }

  static addEnumerationColumn(enumNode: Node, relation: GraphRelation, tracker: Tracker): void {
    let targetNode: Node;
    let cardinalityOfEnum: Cardinality;
    let isNull: boolean;
    let isMultivalued: boolean;

    targetNode = SolvesEnumeration.getTargetNode(enumNode, relation);
    cardinalityOfEnum = SolvesEnumeration.getCardinalityOf(enumNode, relation);

    if (cardinalityOfEnum === Cardinality.C0_1 || cardinalityOfEnum === Cardinality.C1) isMultivalued = false;
    else isMultivalued = true;

    if (cardinalityOfEnum === Cardinality.C0_1 || cardinalityOfEnum === Cardinality.C0_N) isNull = true;
    //accept null
    else isNull = false; //not accept null

    for (let property of enumNode.getProperties()) {
      property.setNullable(isNull);
      property.setMultivalued(isMultivalued);
      targetNode.addProperty(property);
    }

    //for the tracking
    tracker.removePropertyBelongsToOtherNode(enumNode);
  }

  static getTargetNode(node: Node, relation: GraphRelation): Node {
    if (relation.getSourceNode() === node) return relation.getTargetNode();
    else return relation.getSourceNode();
  }

  static getCardinalityOf(node: Node, relation: GraphRelation): Cardinality {
    if (relation.getSourceNode() === node) return relation.getSourceCardinality();
    else return relation.getTargetCardinality();
  }

  // **********************************************************
  // *** Methodos to transform enumerations to lookup tables
  // **********************************************************
  static transformEnumToLookupTables(graph: Graph, tracker: Tracker) {
    let newField: NodeProperty;

    for (let node of graph.getNodes()) {
      if (node.getStereotype() === ClassStereotype.ENUMERATION) {
        for (let property of node.getProperties()) {
          if (property instanceof NodePropertyEnumeration) {
            node.removeProperty(property.getID());
            newField = new NodeProperty(Increment.getNext().toString(), node.getName(), 'string', false, false);
            node.addProperty(newField);
            tracker.changeFieldToFilter(property, newField);
          }
        }
      }
    }
  }
}
