/**
 * The Enumeration is treated as a special type of Property. In addition to
 * having all the features of OntoProperty, it is also capable of adding
 * several values of the same type.
 *
 * Author: Gustavo Ludovido Guidoni
 */

import { INodeProperty } from './INodeProperty';

export interface INodePropertyEnumeration extends INodeProperty {
  /**
   * Adds a new value belonging to the Enumeration.
   *
   * @param value. Name to be added.
   */
  addValue(value: string): void;

  /**
   * Returns the names belonging to the Enumeration.
   *
   * @return The ArrayList with the names.
   */
  getValues(): string[];

  /**
   * Returns the enumeratins as string.
   */
  toString(): string;
}
