/**
 * Class responsible for storing all properties (attributes) of the class.
 * 
 * Author: Gustavo L. Guidoni 
 */

import { IPropertyContainer } from '../IPropertyContainer';
import { INodeProperty } from '../INodeProperty';

 export class PropertyContainer implements IPropertyContainer{

    private properties : INodeProperty[];

    constructor(){
        this.properties = [];
    }

    addProperty(property: INodeProperty): void{
        if( !this.existsPropertyName(property.getName()) ){
            this.properties.push(property);
        }
    }

    addProperties(properties: INodeProperty[]): void{
        for(let property of properties){
            this.addProperty(property);
        }
	}

    addPropertyAt(index: number, property: INodeProperty): void{
        if( !this.existsPropertyName(property.getName()) ){
            this.properties.splice(index, 0, property);
        }
    }

    addPropertiesAt(index: number, properties: INodeProperty[]): void{
        properties.forEach( (property: INodeProperty) =>{
            if( !this.existsPropertyName(property.getName()) ){
                this.addPropertyAt(index, property)
                index++;
            }
        });
    }

    getPropertyByName(name: string): INodeProperty{
        for (let val of this.properties) {
            if( val.getName() == name)
                return val;
        }
        return null;
    }

    getProperties(): INodeProperty[] {
        return this.properties;
    }

    removeProperty(id: string): void {
        for (let index = 0; index < this.properties.length; index++) {
            if(this.properties[index].getID() == id){
                this.properties.splice(index, 1);
                return;
            }
        }
    }

    getPrimaryKey(): INodeProperty {
        for(let property of this.properties) {
			if( property.isPrimaryKey() )
				return property;
		}
		return null;
    }

    getPKName(): string {
        for(let property of this.properties){
            if( property.isPrimaryKey() ){
                return property.getName();
            }
        }
        return "[Did not find the pk name]";
    }

    existsPropertyName(propertyName: string): boolean {
        for(let property of this.properties){
            if( propertyName == property.getName())
                return true;
        }
        return false;
    }

    clonePropertyContainer(): IPropertyContainer {
        let container: IPropertyContainer = new PropertyContainer();

        this.properties.forEach( (property: INodeProperty)=>{
            container.addProperty( property.clone() );
        });

        
        return container;
    }
  
    toString(): string{
        let msg = "";
		
        msg += "\n\t : [ ";
        this.properties.forEach((property : INodeProperty) =>{
            msg += property.toString() + " | ";
        });

		msg += "]";
		
		return msg;
    }
}