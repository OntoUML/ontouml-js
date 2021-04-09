/**
 * Transforms an OntoUML model into a model ready for final transformation and its
 * corresponding into a relational schema.
 *
 * The one table per kind approach is used; all non-sortals are flattened to kinds,
 * and sortals lifted to kinds.
 *
 * Author: João Paulo A. Almeida; Gustavo L. Guidoni
 */
import { IStrategy } from '@libs/ontouml2db/approaches/IStrategy';
import { Graph } from '@libs/ontouml2db/graph/Graph';
import { Flatten } from '@libs/ontouml2db/approaches/processes/Flatten';
import { Lifting } from '@libs/ontouml2db/approaches/processes/Lifting';
import { Tracker } from '@libs/ontouml2db/tracker/Tracker';

export class OneTablePerKind implements IStrategy {
  run(graph: Graph, tracker: Tracker): void {
    Flatten.doFlattening(graph, tracker);

    Lifting.doLifting(graph, tracker);
  }
}
