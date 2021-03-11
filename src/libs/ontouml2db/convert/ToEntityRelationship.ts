/**
 * Transforms the Class model to the Entity-Relationship model.
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { SolvesEnumeration } from '@libs/ontouml2db/convert/SolvesEnumeration';
import { SolvesPrimaryKey } from '@libs/ontouml2db/convert/SolvesPrimaryKey';
import { SolvesForeignKey } from '@libs/ontouml2db/convert/SolvesForeignKey';
import { SolvesName } from '@libs/ontouml2db/convert/SolvesName';
import { SolvesMultivaluedProperty } from '@libs/ontouml2db/convert/SolvesMultivaluedProperty';
import { SolvesCardinalityNtoN } from '@libs/ontouml2db/convert/SolvesCardinalityNtoN';
import { Graph } from '@libs/ontouml2db/graph//Graph';
import { Tracker } from '@libs/ontouml2db/tracker/Tracker';

export class ToEntityRelationship {
  static run(graph: Graph, tracker: Tracker, applyStandardizeNames: boolean, enumFiledToLookupTable: boolean): void {
    SolvesMultivaluedProperty.solves(graph, tracker);

    SolvesEnumeration.solves(graph, tracker, enumFiledToLookupTable);

    SolvesCardinalityNtoN.solves(graph, tracker);

    SolvesPrimaryKey.solves(graph);

    SolvesForeignKey.solves(graph);

    if (applyStandardizeNames) SolvesName.solves(graph);
  }
}
