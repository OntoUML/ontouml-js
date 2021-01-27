/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Graph } from '@libs/ontouml2db/graph/Graph';
import { Node } from '@libs/ontouml2db/graph/Node';
import { Tracker } from '@libs/ontouml2db/tracker/Tracker';
import { Cardinality } from '../constants/enumerations';
import { GraphAssociation } from '../graph/GraphAssociation';
import { GraphRelation } from '../graph/GraphRelation';
import { Increment } from '../util/Increment';

// import { ClassStereotype } from '@constants/.';

import { ClassStereotype } from '@libs/ontouml';

export class SolvesCardinalityNtoN {
  static solves(graph: Graph, tracker: Tracker): void {
    let relations = graph.getAssociations().filter(this.filterNtoN) as GraphRelation[];

    for (let relation of relations) {
      SolvesCardinalityNtoN.resolveNtoN(relation, graph, tracker);
    }
  }

  static filterNtoN(element: GraphAssociation) {
    if (!(element instanceof GraphRelation)) return false;
    if (
      (element.getSourceCardinality() === Cardinality.C0_N || element.getSourceCardinality() === Cardinality.C1_N) &&
      (element.getTargetCardinality() === Cardinality.C0_N || element.getTargetCardinality() === Cardinality.C1_N)
    )
      return true;
    else return false;
  }

  static resolveNtoN(relation: GraphRelation, graph: Graph, tracker: Tracker): void {
    let newNode: Node = new Node(
      Increment.getNext().toString(),
      relation.getSourceNode().getName() + relation.getTargetNode().getName(),
      ClassStereotype.RELATOR
    );
    let nodeName: string;
    if (relation.getName() != null) {
      nodeName = relation.getName();
    } else {
      nodeName =
        relation
          .getSourceNode()
          .getName()
          .substring(0, 1)
          .toLowerCase() +
        relation
          .getSourceNode()
          .getName()
          .substring(1) +
        'Has' +
        relation.getTargetNode().getName();
    }

    newNode.setAssociationNameNtoN(nodeName);

    let newRelation1: GraphRelation = new GraphRelation(
      Increment.getNext().toString(), //ID
      'has_' + relation.getSourceNode().getName(), //name
      relation.getSourceNode(), //sourceNode
      Cardinality.C1, //sourceCardinality
      newNode, //targetNode
      Cardinality.C0_N
    );

    let newRelation2: GraphRelation = new GraphRelation(
      Increment.getNext().toString(), //ID
      'has_' + relation.getTargetNode().getName(), //name
      relation.getTargetNode(), //sourceNode
      Cardinality.C1, //sourceCardinality
      newNode, //targetNode
      Cardinality.C0_N
    );

    newNode.addRelation(newRelation1);
    newNode.addRelation(newRelation2);
    relation.getSourceNode().addRelation(newRelation1);
    relation.getTargetNode().addRelation(newRelation2);

    graph.addNode(newNode);
    graph.addRelation(newRelation1);
    graph.addRelation(newRelation2);

    graph.removeAssociation(relation);

    tracker.putNewNode(newNode);
  }
}
