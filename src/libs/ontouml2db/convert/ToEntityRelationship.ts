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
import { SolvesIndex } from '@libs/ontouml2db/convert/SolvesIndex';
import { Graph } from '@libs/ontouml2db/graph//Graph';
import { Tracker } from '@libs/ontouml2db/tracker/Tracker';
import { Util } from '@libs/ontouml2db/util/Util';

export class ToEntityRelationship {
  static run(graph: Graph, tracker: Tracker, applyStandardizeNames: boolean, enumFiledToLookupTable: boolean, generateIndex: boolean): void {

    Util.transformGeneralizationToRelation1to1(graph);
    
    SolvesMultivaluedProperty.solves(graph, tracker);

    SolvesEnumeration.solves(graph, tracker, enumFiledToLookupTable);

    SolvesCardinalityNtoN.solves(graph, tracker);

    SolvesPrimaryKey.solves(graph);

    SolvesForeignKey.solves(graph);

    SolvesIndex.solves(graph, generateIndex);

    if (applyStandardizeNames) SolvesName.solves(graph);
  }
}
