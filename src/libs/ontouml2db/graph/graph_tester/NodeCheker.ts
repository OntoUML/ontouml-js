/**
 * 
 * Author: Gustavo Ludovico Guidoni
 */

import { PropertyChecker } from './PropertyChecker';
import { INode } from '@libs/ontouml2db/graph/INode';
import { IGraph } from '@libs/ontouml2db/graph/IGraph';

export class NodeChecker{
    private name: string;
    private properties: PropertyChecker[];

    constructor(name: string){
        this.name = name;
        this.properties = [];
    }

    public addProperty(property: PropertyChecker): NodeChecker{
        this.properties.push(property);
        return this;
    }

    public check(graph: IGraph): string{
        let result = '';
        let node: INode;

        node = graph.getNodeByName(this.name);

        if( node == null ){
            return "The node '"+ this.name +"' was not found.";
        }

        for (let val of this.properties) {
            result = val.check( node );
            if( result != '' )
                return result;
        }

        if( this.properties.length != node.getProperties().length ){
            return "The amount of properties does not match for the node '" + this.name + "'.";
        }

        return result;
    }

}