/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Cardinality } from '../graph/util/enumerations';
import { Graph } from '../graph/Graph';
import { GraphRelation } from '../graph/GraphRelation';
import { Node } from '../graph/Node';
import { NodeProperty } from '../graph/NodeProperty';

export class SolvesForeignKey {
  static solves(graph: Graph): void {
    for (let relation of graph.getAssociations() as GraphRelation[]) {
      if (
        (relation.getSourceCardinality() == Cardinality.C0_1 ||
          relation.getSourceCardinality() == Cardinality.C1) &&
        (relation.getTargetCardinality() == Cardinality.C0_N ||
          relation.getTargetCardinality() == Cardinality.C1_N)
      ) {
        SolvesForeignKey.propagateKey(
          relation.getSourceNode(),
          relation.getSourceCardinality(),
          relation.getTargetNode(),
          relation,
        );
      } else if (
        (relation.getTargetCardinality() == Cardinality.C0_1 ||
          relation.getTargetCardinality() == Cardinality.C1) &&
        (relation.getSourceCardinality() == Cardinality.C0_N ||
          relation.getSourceCardinality() == Cardinality.C1_N)
      ) {
        SolvesForeignKey.propagateKey(
          relation.getTargetNode(),
          relation.getTargetCardinality(),
          relation.getSourceNode(),
          relation,
        );
      }
    }
  }

  static propagateKey(
    from: Node,
    cardinalityFrom: Cardinality,
    to: Node,
    relation: GraphRelation,
  ): void {
    let fk = from.getPrimaryKey().clone();
    let newPropertyName: string;

    if (to.existsPropertyName(fk.getName())) {
      newPropertyName = SolvesForeignKey.getNewFKName(fk, relation);
      fk.setName(newPropertyName);
    }
    fk.setPrimeryKey(false);
    fk.setForeignNodeID(from.getId());

    if (
      cardinalityFrom == Cardinality.C0_1 ||
      cardinalityFrom == Cardinality.C0_N
    )
      fk.setNullable(true);
    else fk.setNullable(false);

    to.addPropertyAt(1, fk);
  }

  static getNewFKName(
    prop: NodeProperty,
    relation: GraphRelation,
  ): string {
    let result: string;
    let associationName: string;

    //removes '_id' from the column
    result = prop.getName().substring(0, prop.getName().length - 3);

    associationName = relation.getName();

    associationName = associationName.trim();
    if (associationName != '') {
      result +=
        associationName.substring(0, 1).toUpperCase() +
        associationName.substring(1);
    }

    return result + '_id';
  }
}

