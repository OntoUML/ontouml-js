/**
 * Transforms an OntoUML model into a model ready for final transformation and its
 * corresponding into a relational schema.
 *
 * The one table per concrete class approach is used: all non-sortals are flattened to kinds.
 *
 * Author: Gustavo L. Guidoni
 */

import { IStrategy } from '@libs/ontouml2db/approaches/IStrategy';
import { Graph } from '@libs/ontouml2db/graph/Graph';
import { Flatten } from '@libs/ontouml2db/approaches/processes/Flatten';
import { Tracker } from '@libs/ontouml2db/tracker/Tracker';
import { Util } from '@libs/ontouml2db/util/Util';

export class OneTablePerConcreteClass implements IStrategy {
  run(graph: Graph, tracker: Tracker): void {
    Flatten.doFlattening(graph, tracker);

    Util.transformGeneralizationToRelation1to1(graph);
  }
}
