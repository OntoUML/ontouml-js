/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { NodeProperty } from "@libs/ontouml2db/graph/NodeProperty";
import { Graph } from "@libs/ontouml2db/graph/Graph";
import { Node } from "@libs/ontouml2db/graph/Node";


export class SolvesIndex {

    static solves(graph: Graph, createIndexes: boolean): void {
        //The process informs the candidate fields to be indexes. 
        //So, it does nothing if it is to create indexes.
        if(createIndexes){
            return;
        }
        //Tells properties not to generate index.
        graph.getNodes().forEach((node: Node) => {
            node.getProperties().forEach( (property: NodeProperty) =>{
                if(property.isCreateIndex()){
                    property.setCreateIndex(createIndexes);
                }
            } );
        });
    }
}