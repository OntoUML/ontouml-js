/**
 * This class is responsible for storing the data to perform the filter in the where clause.
 *
 * Author: Gustavo L. Guidoni
 */

import { Node } from '@libs/ontouml2db/graph/Node';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { Increment } from '@libs/ontouml2db/util/Increment';

export class Filter {
  private id: string;
  private sourceNode: Node;
  private property: NodeProperty;
  private value: any;
  private belongsToOtherNode: Node;

  constructor(sourceNode: Node, property: NodeProperty, value: any, belongsToOtherNode: Node) {
    this.id = Increment.getNext().toString();
    this.sourceNode = sourceNode;
    this.property = property;
    this.value = value;
    this.belongsToOtherNode = belongsToOtherNode;
  }

  /**
   * Return the filter identifier.
   */
  getId(): string {
    return this.id;
  }

  /**
   * Informs the class in which the rule will be applied.
   */
  setSourceNode(node: Node): void {
    this.sourceNode = node;
  }

  /**
   * Returns the class in which the rule will be applied.
   */
  getSourceNode(): Node {
    return this.sourceNode;
  }

  /**
   * Informs the property to be filtered.
   * @param property
   */
  setProperty(property: NodeProperty): void {
    this.property = property;
  }

  /**
   * Returns the property to be filtered.
   */
  getProperty(): NodeProperty {
    return this.property;
  }

  /**
   * Informs the value of the property.
   * @param value
   */
  setValue(value: any): void {
    this.value = value;
  }

  /**
   * Return the value of the property.
   */
  getValue(): any {
    return this.value;
  }

  /**
   * Informs that the filter must be applied in another class. This occurs when the
   * property to be filtered has been transferred to another class, requiring a join.
   * @param node
   */
  setBelongToOtherNode(node: Node): void {
    this.belongsToOtherNode = node;
  }

  /**
   * Returns the linked class where the filter will be applied.
   */
  getBelongToOtherNode(): Node {
    return this.belongsToOtherNode;
  }

  toString(): string {
    let msg: string;

    msg = '[' + this.property.getName() + ' = ' + this.value;

    if (this.belongsToOtherNode != null) {
      msg += ' linked to ' + this.belongsToOtherNode.getName();
    }

    msg += ' (' + this.sourceNode.getName() + ') ';
    msg += '] ';
    return msg;
  }
}
