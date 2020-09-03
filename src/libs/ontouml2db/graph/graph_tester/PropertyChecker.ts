/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { INodeProperty } from '@libs/ontouml2db/graph/INodeProperty';
import { INode } from '@libs/ontouml2db/graph/INode';
import { INodePropertyEnumeration } from '@libs/ontouml2db/graph/INodePropertyEnumeration';

export class PropertyChecker {
  private name: string;
  private nullable: boolean;
  private enumValues: string[];

  constructor(name: string, nullable: boolean, enumValues?: string[]) {
    this.name = name;
    this.nullable = nullable;
    this.enumValues = enumValues;
  }

  public check(node: INode): string {
    let property: INodeProperty;

    property = node.getPropertyByName(this.name);

    if (property == null)
      return (
        "The '" +
        this.name +
        "' property was not found in '" +
        node.getName() +
        "' node."
      );

    if (this.nullable != property.isNullable()) {
      return (
        "The annulability of '" +
        this.name +
        "' in '" +
        node.getName() +
        "' table is diferente form the graph."
      );
    }

    if (this.enumValues != null) {
      let enumProperty = property as INodePropertyEnumeration;

      //for( let val of enumProperty.getValues() ){
      for (let val of this.enumValues) {
        //if( !this.enumValues.includes(val) ){
        if (!enumProperty.getValues().includes(val)) {
          return (
            "The enumeration '" +
            this.name +
            "' does not include the value + '" +
            val +
            "'."
          );
        }
      }
      if (this.enumValues.length != enumProperty.getValues().length)
        return (
          "The number of values in the '" +
          this.name +
          "' enumeration does not match."
        );
    }

    return '';
  }
}
