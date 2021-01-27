/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Graph } from '@libs/ontouml2db/graph/Graph';
import { OntoUML2DBOptions } from '@libs/ontouml2db/OntoUML2DBOptions';

export interface IDBMS {
  /**
   * Returns the relational schema script for the graph (ER).
   *
   * @param target Graph (ER) to be generated the script with the relational scheme.
   */
  getSchema(graph: Graph): string;

  /**
   * Returns the connection from the database to Protege.
   */
  getConnectionToProtege(options: OntoUML2DBOptions): string;
}
