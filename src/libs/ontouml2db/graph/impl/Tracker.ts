/**
 * This class is responsible for storing the tracked nodes.
 *
 * Author: Gustavo L. Guidoni
 */
import { ITracker } from '../ITracker';
import { INode } from '../INode';
import { INodeProperty } from '../INodeProperty';

export class Tracker implements ITracker {
  private node: INode;
  private property: INodeProperty;
  private value: any;
  private propertyLinkedAtNode: INode;

  constructor(node: INode, property: INodeProperty, value: any) {
    this.node = node;
    this.property = property;
    this.value = value;
  }

  getNode(): INode {
    return this.node;
  }

  setNode(node: INode): void {
    this.node = node;
  }

  getProperty(): INodeProperty {
    return this.property;
  }

  setProperty(property: INodeProperty): void {
    this.property = property;
  }

  getValue() {
    return this.value;
  }

  setValue(value: any): void {
    this.value = value;
  }

  setPropertyLinkedAtNode(node: INode): void {
    this.propertyLinkedAtNode = node;
  }

  getPropertyLinkedAtNode(): INode {
    return this.propertyLinkedAtNode;
  }
}
