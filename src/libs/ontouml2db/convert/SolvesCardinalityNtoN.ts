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

import { ClassStereotype } from '@libs/ontouml';

export class SolvesCardinalityNtoN {
  static solves(graph: Graph, tracker: Tracker): void {
    let relations = graph.getAssociations().filter(this.filterNtoN) as GraphRelation[];

    for (let relation of relations) {
      SolvesCardinalityNtoN.resolveNtoN(relation, graph, tracker);
    }
  }

  static resolveNtoN(relation: GraphRelation, graph: Graph, tracker: Tracker): void {
    let newNode: Node = new Node(
      Increment.getNext().toString(),
      relation.getSourceNode().getName() + relation.getTargetNode().getName(),
      ClassStereotype.MIXIN
    );

    let nodeName: string = SolvesCardinalityNtoN.getAssociationName(relation);

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

    //tracker.putNewNode(newNode);
    SolvesCardinalityNtoN.adjustTraceability(tracker, relation, newNode);
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

  static getAssociationName(relation: GraphRelation): string {
    let associationName: string;
    if (relation.getName() !== null) {
      associationName = relation.getName();
    } else {
      associationName =
        relation.getSourceNode().getName().substring(0, 1).toLowerCase() +
        relation.getSourceNode().getName().substring(1) +
        'Has' +
        relation.getTargetNode().getName();
    }
    return associationName;
  }

  static adjustTraceability(tracker: Tracker, relation: GraphRelation, newNode: Node): void {
    // To create a join between the classes of the N:N relation
    tracker.createNewTracerForTheSourceNode(newNode);

    // Adjust to do a join (filter) with the enumeration
    if (!this.existsEnumAtRelation(relation)) return;

    let enumNode = this.getEnumNode(relation);
    tracker.addJoinedNodeToApplyFilter(enumNode, newNode);
  }

  static existsEnumAtRelation(relation: GraphRelation): boolean {
    if (
      relation.getSourceNode().getStereotype() === ClassStereotype.ENUMERATION ||
      relation.getTargetNode().getStereotype() === ClassStereotype.ENUMERATION
    )
      return true;
    else return false;
  }

  static getEnumNode(relation: GraphRelation): Node {
    if (relation.getSourceNode().getStereotype() === ClassStereotype.ENUMERATION) {
      return relation.getSourceNode();
    }
    if (relation.getTargetNode().getStereotype() === ClassStereotype.ENUMERATION) {
      return relation.getTargetNode();
    }
    return null;
  }
}
