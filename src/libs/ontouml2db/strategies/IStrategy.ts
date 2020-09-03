import { IGraph } from '../graph/IGraph';
/**
 * Interface to the processing methods must implement.
 * 
 * Author: Gustavo Ludovico Guidoni
 */

export interface IStrategy{

    /**
     * Method responsible for performing the transformation of the graph.
     * 
     * @param graph Graph to be modified.
     */
    run(graph: IGraph): void;
}