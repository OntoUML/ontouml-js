/**
 * 
 * Author: Gustavo Ludovico Guidoni
 */

import { IGraph } from '@libs/ontouml2db/graph/IGraph';


export interface IDBMSSchema{

    /**
     * Returns the relational schema script for the graph (ER).
     * 
     * @param target Graph (ER) to be generated the script with the relational scheme.
     */
    getSchema(target: IGraph): string;
}