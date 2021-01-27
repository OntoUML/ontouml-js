/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { Node } from '@libs/ontouml2db/graph/Node';
import { NodePropertyEnumeration } from '@libs/ontouml2db/graph/NodePropertyEnumeration';

it('should ignore', () => {
  expect(true).toBe(true);
});

export class PropertyChecker {
  private name: string;
  private nullable: boolean;
  private enumValues: string[];

  constructor(name: string, nullable: boolean, enumValues?: string[]) {
    this.name = name;
    this.nullable = nullable;
    this.enumValues = enumValues;
  }

  check(node: Node): string {
    let property: NodeProperty;

    property = node.getPropertyByName(this.name);

    if (property === null)
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
        "' table is different form the graph."
      );
    }

    if (this.enumValues != null) {
      let enumProperty = property as NodePropertyEnumeration;

      for (let val of this.enumValues) {
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
