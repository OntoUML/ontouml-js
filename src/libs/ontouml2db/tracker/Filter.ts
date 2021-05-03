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
  private filterProperty: NodeProperty;
  private value: any;
  private nodeToApplyFilter: Node;
  private chainOfNodesToApplyFilter: Node[];

  constructor(sourceNode: Node, property: NodeProperty, value: any, belongsToOtherNode: Node) {
    this.id = Increment.getNext().toString();
    this.sourceNode = sourceNode;
    this.filterProperty = property;
    this.value = value;
    this.nodeToApplyFilter = belongsToOtherNode;
    this.chainOfNodesToApplyFilter = [];
    if (belongsToOtherNode !== null) {
      this.chainOfNodesToApplyFilter.push(belongsToOtherNode);
    }
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
    this.filterProperty = property;
  }

  /**
   * Returns the property to be filtered.
   */
  getProperty(): NodeProperty {
    return this.filterProperty;
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
   * If the given node is null, it will have the same behavior as removeNodeToApplayFilter()
   * methodo.
   *
   * @param node
   */
  setNodeToApplyFilter(node: Node): void {
    if (node !== null) {
      this.nodeToApplyFilter = node;
      this.chainOfNodesToApplyFilter.push(node);
    } else {
      this.removeNodeToApplyFilter();
    }
  }

  /**
   * Informs that the filter will be applied to the node it belongs to.
   */
  removeNodeToApplyFilter(): void {
    this.nodeToApplyFilter = null;
    this.chainOfNodesToApplyFilter = [];
  }

  /**
   * Adds an intermediate node to perform the filter. The tracking process will make joins
   * from the source node until it arrives at the node to be carried out the filter. The
   * node is added at the beginning of the chain, that is, the node to be filtered is the
   * last one in the chain.
   * @param node
   */
  addJoinedNodeToDoFilter(node: Node): void {
    this.chainOfNodesToApplyFilter.unshift(node);
  }

  /**
   * Returns the linked class where the filter will be applied.
   */
  //getBelongToOtherNode(): Node {
  getNodeToApplyFilter(): Node {
    return this.nodeToApplyFilter;
  }

  /**
   * Informs if the nodo is the same as the filter will be applied.
   * @param node
   * @returns
   */
  isNodeToApplyFilter(node: Node): boolean {
    if (this.nodeToApplyFilter == null) {
      return false;
    }
    if (this.nodeToApplyFilter.getId() === node.getId()) return true;
    else return false;
  }

  /**
   * Returns the nodes that make the connection between the tracked node and the node
   * that will be applied to the filter (including).
   *
   * @returns
   */
  getChainOfNodesToApplyFilter(): Node[] {
    return this.chainOfNodesToApplyFilter;
  }

  /**
   * Informs if the filter will be applied on the informed property.
   *
   * @param property
   * @returns
   */
  isFiltredByProperty(property: NodeProperty): boolean {
    if (this.filterProperty.getID() === property.getID()) {
      return true;
    }
    return false;
  }

  toString(): string {
    let msg: string;

    msg = '[' + this.filterProperty.getName() + ' = ' + this.value;

    if (this.nodeToApplyFilter !== null) {
      for (let node of this.chainOfNodesToApplyFilter) {
        msg += ' linked to ' + node.getName();
      }
    }

    msg += ' (' + this.sourceNode.getName() + ') ';
    msg += '] ';
    return msg;
  }
}
