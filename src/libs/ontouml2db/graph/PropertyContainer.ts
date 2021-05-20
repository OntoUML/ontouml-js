/**
 * Class responsible for storing all properties (attributes) of the class.
 *
 * Author: Gustavo L. Guidoni
 */

import { PropertyContainerInterface } from '@libs/ontouml2db/graph/PropertyContainerInterface';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';

export class PropertyContainer implements PropertyContainerInterface {
  private properties: NodeProperty[];

  constructor() {
    this.properties = [];
  }

  addProperty(property: NodeProperty): void {
    if (!this.existsPropertyName(property.getName())) {
      this.properties.push(property);
    }else{
      throw new Error(
        `The '${property.getName()}' attribute is repeated between two classes of a generalization.[PropertyContainer.addProperty]`
      );
    }
  }

  addProperties(properties: NodeProperty[]): void {
    for (let property of properties) {
      this.addProperty(property);
    }
  }

  addPropertyAt(index: number, property: NodeProperty): void {
    let canPut: boolean = true;
    let existingProperty = this.getPropertyByName(property.getName());
    if (existingProperty !== null) {
      if(existingProperty.getDataType() === property.getDataType()){
        // If the attribute exists with the same type, we assume that it is not a 
        //problem. The attribute is simply not copied.
        canPut = false;
      }
      else{
        throw new Error(
          `The '${property.getName()}' attribute is repeated in the hierarchy.[PropertyContainer.addPropertyAt]`
        );
      }
    }
    if(canPut){
      this.properties.splice(index, 0, property);
    }
  }

  addPropertiesAt(index: number, properties: NodeProperty[]): void {
    properties.forEach((property: NodeProperty) => {
      this.addPropertyAt(index, property);
      index++;
    });
  }

  getPropertyByName(name: string): NodeProperty {
    for (let val of this.properties) {
      if (val.getName() === name) return val;
    }
    return null;
  }

  getProperties(): NodeProperty[] {
    return this.properties;
  }

  removeProperty(id: string): void {
    for (let index = 0; index < this.properties.length; index++) {
      if (this.properties[index].getID() === id) {
        this.properties.splice(index, 1);
        return;
      }
    }
  }

  getPrimaryKey(): NodeProperty {
    for (let property of this.properties) {
      if (property.isPrimaryKey()) return property;
    }
    return null;
  }

  getPKName(): string {
    for (let property of this.properties) {
      if (property.isPrimaryKey()) {
        return property.getName();
      }
    }
    return '[Did not find the pk name]';
  }

  existsPropertyName(propertyName: string): boolean {
    for (let property of this.properties) {
      if (propertyName === property.getName()) return true;
    }
    return false;
  }

  existsProperty(property: NodeProperty): boolean {
    for (let value of this.properties) {
      if (value.getID() === property.getID()) {
        return true;
      }
    }
    return false;
  }

  clonePropertyContainer(): PropertyContainerInterface {
    let container: PropertyContainerInterface = new PropertyContainer();

    this.properties.forEach((property: NodeProperty) => {
      container.addProperty(property.clone());
    });

    return container;
  }

  getFKRelatedOfNodeID(id: string): NodeProperty {
    for (let property of this.properties) {
      if (property.getForeignKeyNodeID() === id) {
        return property;
      }
    }
    return null;
  }

  // toString(): string {
  //   let msg = '';

  //   msg += '\n\t : [ ';
  //   this.properties.forEach((property: NodeProperty) => {
  //     msg += property.toString() + ' | ';
  //   });

  //   msg += ']';

  //   return msg;
  // }
}
