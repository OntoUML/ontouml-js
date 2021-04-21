/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Graph } from '@libs/ontouml2db/graph/Graph';
import { Ontouml2DbOptions } from '@libs/ontouml2db/Ontouml2DbOptions';

export interface DbmsInterface {
  /**
   * Returns the relational schema script for the graph (ER).
   *
   * @param target Graph (ER) to be generated the script with the relational scheme.
   */
  getSchema(graph: Graph): string;

  /**
   * Returns the connection from the database to Protege.
   */
  getConnectionToProtege(options: Ontouml2DbOptions): string;
}
