/**
 * Stores all values of an enumeration.
 * 
 * Author: Gustavo Ludovico Guidoni
 */

import { INodePropertyEnumeration } from '../INodePropertyEnumeration';
import { NodeProperty } from './NodeProperty';

export class NodePropertyEnumeration extends NodeProperty implements INodePropertyEnumeration{

    private values: string[];

    constructor (id: string, name: string, dataType: string, isNull: boolean, multValues: boolean) {
		super(id, name, dataType, isNull, multValues);
		this.values = [];
    }
    
    addValue(value: string): void {
        this.values.push(value);
    }

    getValues(): string[] {
        return this.values;
    }

    toString(): string{
        let result = this.getName() + ": " + this.getDataType() + " [" ;

        for(let str of this.values) {
			result += str + " | ";
		}
		result += "]";

        return  result ;
    }
    
}