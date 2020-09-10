/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Increment } from '../graph/util/Increment';
import { ClassStereotype } from '@constants/.';
import { NodeProperty } from '../graph/NodeProperty';
import { GraphRelation } from '../graph/GraphRelation';
import { Node } from '../graph/Node';
import { Cardinality } from '../graph/util/enumerations';
import { Graph } from '../graph/Graph';

export class SolvesMultivaluedProperty {
  static solves(graph: Graph): void {
    let idToRemove: string[] = [];

    for (let node of graph.getNodes()) {
      idToRemove.length = 0;
      for (let property of node.getProperties()) {
        if (property.isMultivalued()) {
          SolvesMultivaluedProperty.transformPropertyIntoNode(
            property,
            node,
            graph,
          );
          idToRemove.push(property.getID());
        }
      }

      while (idToRemove.length != 0) {
        node.removeProperty(idToRemove.pop());
      }
    }
  }

  static transformPropertyIntoNode(
    property: NodeProperty,
    node: Node,
    graph: Graph,
  ): void {
    let newNode: Node;
    let relation: GraphRelation;

    newNode = new Node(
      Increment.getNext().toString(),
      property.getName(),
      ClassStereotype.MIXIN,
    );

    newNode.addProperty(
      new NodeProperty(
        property.getID(),
        property.getName(),
        property.getDataType(),
        false,
        false,
      ),
    );

    relation = new GraphRelation(
      Increment.getNext().toString(),
      node,
      Cardinality.C1,
      newNode,
      Cardinality.C0_N,
    );

    newNode.addRelation(relation);

    graph.addNode(newNode);
    graph.addRelation(relation);
  }
}
