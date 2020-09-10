/**
 * This class is responsible for storing the tracked nodes.
 *
 * Author: Gustavo L. Guidoni
 */

 import { NodeProperty } from './NodeProperty';
 import { Node } from './Node';

export class Tracker  {
  private node: Node;
  private property: NodeProperty;
  private value: any;
  private propertyLinkedAtNode: Node;

  constructor(node: Node, property: NodeProperty, value: any) {
    this.node = node;
    this.property = property;
    this.value = value;
  }

  /**
   * Returns the tracker node.
   *
   * @return A Node in the target graph.
   */
  getNode(): Node {
    return this.node;
  }

  /**
   * Informs a node to be tracked in the target graph.
   *
   * @param node. Node to be tracked.
   */
  setNode(node: Node): void {
    this.node = node;
  }

  /**
   * Returns the property on which the node is linked.
   *
   * @return The property linked to the tracker node.
   */
  getProperty(): NodeProperty {
    return this.property;
  }

  /**
   * Informs the property linked to the tracker node.
   *
   * @param property. Property to be linked to the tracker node.
   */
  setProperty(property: NodeProperty): void {
    this.property = property;
  }

  /**
   * Returns the value of the node tracked in the property.
   *
   * @return The node value in the property.
   */
  getValue() {
    return this.value;
  }

  /**
   * Informs the value of the node tracked in the property.
   *
   * @param value. The node value in the property.
   */
  setValue(value: any): void {
    this.value = value;
  }

  /**
   * Informs the node to which the property belongs.
   *
   * @param node. The node linked to the property.
   */
  setPropertyLinkedAtNode(node: Node): void {
    this.propertyLinkedAtNode = node;
  }

  /**
   * Returns the node to which the property belongs.
   *
   * @return The node linked to the property.
   */
  getPropertyLinkedAtNode(): Node {
    return this.propertyLinkedAtNode;
  }
}

