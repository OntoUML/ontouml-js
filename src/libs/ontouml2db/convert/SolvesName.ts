/**
 * 
 * Author: Gustavo Ludovico Guidoni
 */

import { IGraph } from '../graph/IGraph';
import { NodePropertyEnumeration } from '../graph/impl/NodePropertyEnumeration';
import { INodePropertyEnumeration } from '../graph/INodePropertyEnumeration';

 export class SolvesName{
     
    public static solves( graph: IGraph ): void{
        for (let node of graph.getNodes()) {
            node.setName( this.adjust( node.getName() ) );
            for(let property of node.getProperties()){
				property.setName( this.adjust( property.getName() ) );
				if( property instanceof NodePropertyEnumeration ) {
                   this.adjustEnumerationValues( property );
				}
			}
		}
	}
	
	private static adjustEnumerationValues( enumeration: INodePropertyEnumeration): void {
        let values = enumeration.getValues();

        for (let index = 0; index < values.length; index++) {
            values[index] = values[index].toUpperCase();
        }
	}
	
	private static adjust( name: string): string {
		let newName = '';// + name.charAt(0);
		let index = 0;//1;
		
		//In order not to add "_" in the properties which are written in uppercase.
		while( index < name.length && name.charAt(index) >= 'A' && name.charAt(index) <= 'Z' ) {
			newName += name.charAt(index);
			index++;
		}

		while( index < name.length ) {
			if ((name.charAt(index) >= 'A') && (name.charAt(index) <= 'Z')) {
				newName += "_";
			}
			newName += name.charAt(index);
			index++;
		}
        return newName.toLowerCase();
	}
 }