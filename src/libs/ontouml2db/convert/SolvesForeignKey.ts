/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { IGraph } from '../graph/IGraph';
import { IGraphRelation } from '../graph/IGraphRelation';
import { Cardinality } from '../graph/util/enumerations';
import { INode } from '../graph/INode';
import { INodeProperty } from '../graph/INodeProperty';

export class SolvesForeignKey {
  public static solves(graph: IGraph): void {
    for (let relation of graph.getAssociations() as IGraphRelation[]) {
      if (
        (relation.getSourceCardinality() == Cardinality.C0_1 ||
          relation.getSourceCardinality() == Cardinality.C1) &&
        (relation.getTargetCardinality() == Cardinality.C0_N ||
          relation.getTargetCardinality() == Cardinality.C1_N)
      ) {
        this.propagateKey(
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
        this.propagateKey(
          relation.getTargetNode(),
          relation.getTargetCardinality(),
          relation.getSourceNode(),
          relation,
        );
      }
    }
  }

  private static propagateKey(
    from: INode,
    cardinalityFrom: Cardinality,
    to: INode,
    relation: IGraphRelation,
  ): void {
    let fk = from.getPrimaryKey().clone();
    let newPropertyName: string;

    if (to.existsPropertyName(fk.getName())) {
      newPropertyName = this.getNewFKName(fk, relation);
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

  private static getNewFKName(
    prop: INodeProperty,
    relation: IGraphRelation,
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
