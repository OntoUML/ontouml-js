/**
 * Transforms the Class model to the Entity-Relationship model.
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { IGraph } from '../graph/IGraph';
import { SolvesEnumeration } from './SolvesEnumeration';
import { SolvesPrimaryKey } from './SolvesPrimaryKey';
import { SolvesForeignKey } from './SolvesForeignKey';
import { SolvesName } from './SolvesName';
import { SolvesMultivaluedProperty } from './SolvesMultivaluedProperty';

export class ToEntityRelationship {
  public static run(graph: IGraph, applyStandardizeNames: boolean): void {
    SolvesMultivaluedProperty.solves(graph);

    //resolveCardinalityNtoN( targetGraph );

    SolvesEnumeration.solves(graph);

    SolvesPrimaryKey.solves(graph);

    SolvesForeignKey.solves(graph);

    if (applyStandardizeNames) SolvesName.solves(graph);
  }
}
