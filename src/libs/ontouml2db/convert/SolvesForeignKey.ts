/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { Graph } from '@libs/ontouml2db/graph/Graph';
import { GraphRelation } from '@libs/ontouml2db/graph/GraphRelation';
import { Node } from '@libs/ontouml2db/graph/Node';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { Increment } from '@libs/ontouml2db/util/Increment';

export class SolvesForeignKey {
  static solves(graph: Graph): void {
    SolvesForeignKey.removePKFromTargetNode1To1(graph);

    SolvesForeignKey.propagateForeignKey(graph);
  }

  /**
   * Removes the primary key from the destination node, which participates in the 1: 1
   * relationship, because the same primary key from the source node will be added.
   * @param graph
   */
  static removePKFromTargetNode1To1(graph: Graph) {
    let node: Node;
    for (let relation of graph.getAssociations() as GraphRelation[]) {
      if (SolvesForeignKey.is1To1(relation)) {
        node = relation.getTargetNode();
        if (node.getPrimaryKey() !== null) {
          //The primary key has already been removed if the node has more than one superclass.
          node.removeProperty(node.getPrimaryKey().getID());
        }
      }
    }
  }

  static propagateForeignKey(graph: Graph): void {
    let relations: GraphRelation[] = graph.getAssociations().filter(() => {
      return true;
    }) as GraphRelation[];

    SolvesForeignKey.resolve1To1(relations);

    SolvesForeignKey.resolve1ToN(relations);
  }

  static resolve1To1(relations: GraphRelation[]): void {
    let relation: GraphRelation;
    let i = 0;
    while (i < relations.length) {
      relation = relations[i];

      if (SolvesForeignKey.is1To1(relation)) {
        relations.splice(i, 1);

        //It may present a problem if start to solve the subclass primary key.
        if (relation.getSourceNode().getPrimaryKey() !== null) {
          SolvesForeignKey.propagateKey(
            relation.getSourceNode(),
            relation.getTargetCardinality(),
            relation.getTargetNode(),
            relation
          );
        } else {
          //First, resolve the primary key of the superclass, then the primary key of the subclass.
          //Therefore, place the relationship at the end of the vector and resolve the superclass first.
          relations.push(relation);
        }
      } else {
        i++;
      }
    }
  }

  static resolve1ToN(relations: GraphRelation[]): void {
    for (let relation of relations) {
      if (SolvesForeignKey.is1ToN(relation)) {
        SolvesForeignKey.propagateKey(
          relation.getSourceNode(),
          relation.getSourceCardinality(),
          relation.getTargetNode(),
          relation
        );
      } else if (SolvesForeignKey.isNTo1(relation)) {
        SolvesForeignKey.propagateKey(
          relation.getTargetNode(),
          relation.getTargetCardinality(),
          relation.getSourceNode(),
          relation
        );
      }
    }
  }

  static is1ToN(relation: GraphRelation): boolean {
    if (
      (relation.getSourceCardinality() === Cardinality.C0_1 || relation.getSourceCardinality() === Cardinality.C1) &&
      (relation.getTargetCardinality() === Cardinality.C0_N || relation.getTargetCardinality() === Cardinality.C1_N)
    )
      return true;
    else return false;
  }

  static isNTo1(relation: GraphRelation): boolean {
    if (
      (relation.getTargetCardinality() === Cardinality.C0_1 || relation.getTargetCardinality() === Cardinality.C1) &&
      (relation.getSourceCardinality() === Cardinality.C0_N || relation.getSourceCardinality() === Cardinality.C1_N)
    )
      return true;
    else return false;
  }

  static is1To1(relation: GraphRelation): boolean {
    if (
      (relation.getSourceCardinality() === Cardinality.C0_1 || relation.getSourceCardinality() === Cardinality.C1) &&
      (relation.getTargetCardinality() === Cardinality.C0_1 || relation.getTargetCardinality() === Cardinality.C1)
    )
      return true;
    else return false;
  }

  static propagateKey(from: Node, cardinalityFrom: Cardinality, to: Node, relation: GraphRelation): void {
    let fk = from.getPrimaryKey().clone(from.getPrimaryKey().getName() + '_' + Increment.getNext());

    fk.setForeignNodeID(from.getId(), relation);

    if (cardinalityFrom === Cardinality.C0_1 || cardinalityFrom === Cardinality.C0_N) {
      fk.setNullable(true);
    } else {
      fk.setNullable(false);
    }

    if (to.existsPropertyName(fk.getName())) {
      fk.setName(SolvesForeignKey.getNewFKName(fk, relation, from));
    }

    if (SolvesForeignKey.is1To1(relation)) {
      fk.setPrimaryKey(true);
      fk.setPKAutoIncrement(false);
      to.addPropertyAt(0, fk);
    } else {
      fk.setPrimaryKey(false);
      to.addPropertyAt(1, fk);
    }
  }

  static getNewFKName(prop: NodeProperty, relation: GraphRelation, nodeFrom: Node): string {
    let result: string;
    let associationName: string;

    //removes '_id' from the column
    result = prop.getName().substring(0, prop.getName().length - 3);

    associationName = relation.getNodeNameRemoved();

    //There are cases where the node is not removed, especially when the "one table per class"
    //strategy is applied.
    if (associationName == null) {
      associationName = nodeFrom.getName();
    }

    associationName = associationName.trim();
    if (associationName !== '') {
      result += associationName.substring(0, 1).toUpperCase() + associationName.substring(1);
    }

    return result + '_id';
  }
}
