/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Increment } from '@libs/ontouml2db//util/Increment';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { GraphRelation } from '@libs/ontouml2db/graph/GraphRelation';
import { Node } from '@libs/ontouml2db/graph/Node';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { Graph } from '@libs/ontouml2db/graph//Graph';
import { Tracker } from '@libs/ontouml2db/tracker/Tracker';

import { ClassStereotype } from '@libs/ontouml';

export class SolvesMultivaluedProperty {
  static solves(graph: Graph, tracker: Tracker): void {
    let idToRemove: string[] = [];

    for (let node of graph.getNodes()) {
      idToRemove.length = 0;
      for (let property of node.getProperties()) {
        if (property.isMultivalued()) {
          SolvesMultivaluedProperty.transformPropertyIntoNode(property, node, graph, tracker);
          idToRemove.push(property.getID());
        }
      }

      while (idToRemove.length !== 0) {
        node.removeProperty(idToRemove.pop());
      }
    }
  }

  static transformPropertyIntoNode(property: NodeProperty, node: Node, graph: Graph, tracker: Tracker): void {
    let newNode: Node;
    let relation: GraphRelation;

    newNode = new Node(Increment.getNext().toString(), property.getName(), ClassStereotype.MIXIN);

    newNode.addProperty(new NodeProperty(property.getID(), property.getName(), property.getDataType(), false, false));

    relation = new GraphRelation(
      Increment.getNext().toString(),
      'has' + property.getName() + '_' + Increment.getNext().toString(),
      node,
      Cardinality.C1,
      newNode,
      Cardinality.C0_N
    );

    newNode.addRelation(relation);

    graph.addNode(newNode);
    graph.addRelation(relation);

    SolvesMultivaluedProperty.doTracking(node, newNode, property, graph, tracker);
  }

  static doTracking(tracedNode: Node, joinedNode: Node, property: NodeProperty, graph: Graph, tracker: Tracker): void {
    let sourceNodes: Node[] = graph.getSourceNodes();

    sourceNodes.forEach(tracerNode => {
      if (tracerNode.existsProperty(property)) {
        if (property.isNullable()) {
          tracker.addJoinedNode(tracerNode, tracedNode, joinedNode, false);
        } else {
          tracker.addJoinedNode(tracerNode, tracedNode, joinedNode, true);
        }
      }
    });
  }
}
