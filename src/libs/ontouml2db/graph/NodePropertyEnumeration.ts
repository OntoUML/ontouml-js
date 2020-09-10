/**
 * The Enumeration is treated as a special type of Property. In addition to
 * having all the features of OntoProperty, it is also capable of adding
 * several values of the same type.
 *
 * Author: Gustavo Ludovido Guidoni
 */


import { NodeProperty } from './NodeProperty';

export class NodePropertyEnumeration extends NodeProperty {
  private values: string[];

  constructor(
    id: string,
    name: string,
    dataType: string,
    isNull: boolean,
    multValues: boolean,
  ) {
    super(id, name, dataType, isNull, multValues);
    this.values = [];
  }

  /**
   * Adds a new value belonging to the Enumeration.
   *
   * @param value. Name to be added.
   */
  addValue(value: string): void {
    this.values.push(value);
  }

  /**
   * Returns the names belonging to the Enumeration.
   *
   * @return The ArrayList with the names.
   */
  getValues(): string[] {
    return this.values;
  }

  /**
   * Returns the enumeratins as string.
   */
  toString(): string {
    let result = this.getName() + ': ' + this.getDataType() + ' [';

    for (let str of this.values) {
      result += str + ' | ';
    }
    result += ']';

    return result;
  }
}
