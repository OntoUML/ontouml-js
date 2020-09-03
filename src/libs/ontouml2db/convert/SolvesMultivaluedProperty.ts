/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { IGraph } from '../graph/IGraph';
import { INodeProperty } from '../graph/INodeProperty';
import { Node } from '../graph/impl/Node';
import { Increment } from '../graph/util/Increment';
import { ClassStereotype } from '@constants/.';
import { NodeProperty } from '../graph/impl/NodeProperty';
import { GraphRelation } from '../graph/impl/GraphRelation';
import { INode } from '../graph/INode';
import { Cardinality } from '../graph/util/enumerations';

export class SolvesMultivaluedProperty {
  public static solves(graph: IGraph): void {
    let idToRemove: string[] = [];

    for (let node of graph.getNodes()) {
      idToRemove.length = 0;
      for (let property of node.getProperties()) {
        if (property.isMultivalued()) {
          this.transformPropertyIntoNode(property, node, graph);
          idToRemove.push(property.getID());
        }
      }

      while (idToRemove.length != 0) {
        node.removeProperty(idToRemove.pop());
      }
    }
  }

  private static transformPropertyIntoNode(
    property: INodeProperty,
    node: INode,
    graph: IGraph,
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
