/**
 * This class is responsible for storing the tracked nodes.
 * This class has the property of referencing more than one node. However, this
 * property should only occur when the node is divided into two other nodes. This
 * happens exclusively when a node has multivalued attributes, thus when referencing
 * the target node "always" there will be a join between the divided nodes.
 *
 * It is important to note that this property does not occur for enumerations, as
 * they exist in the model as classes and only compose the OBDA file when a subclass
 * of the generalization set is requested. That is, there will not always be a junction
 * between the enumeration and the owner class.
 *
 * Author: Gustavo L. Guidoni
 */

import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { Node } from '@libs/ontouml2db/graph/Node';

export class TracedNode {
  private nodes: Node[];
  private innerJoin: boolean; //true do a join; false do a left join

  constructor(node: Node) {
    this.nodes = [];
    this.nodes.push(node);
    this.innerJoin = true;
  }

  /**
   * Return the nodes traced. The result is a clone of the original structure.
   *
   * @returns
   */
  getNodes(): Node[] {
    return [...this.nodes];
    //return this.nodes;
  }

  /**
   * Returns the main node of traced nodes. The main node is the first node added.
   * @returns
   */
  getMainNode(): Node {
    if (this.nodes.length > 0) {
      return this.nodes[0];
    }
    return null;
  }

  /**
   * Informs if the node is traced.
   *
   * @param node
   * @returns
   */
  isNodeTraced(node: Node): boolean {
    let result: boolean = false;
    this.nodes.forEach(value => {
      if (value.getId() === node.getId()) {
        result = true;
      }
    });
    return result;
  }

  /**
   * Adds a new node belonging to the first node added, that is, when the
   * main node is divided into other nodes.
   *
   * @param joinedNode
   * @param innerJoin
   */
  addJoinedNode(joinedNode: Node, innerJoin: boolean): void {
    this.nodes.push(joinedNode);
    this.innerJoin = innerJoin;
  }

  /**
   * Returns the property of the given ID.
   *
   * @param id
   * @returns
   */
  getPropertyByID(id: string): NodeProperty {
    for (let node of this.nodes) {
      for (let property of node.getProperties()) {
        if (property.getID() === id) {
          return property;
        }
      }
    }
    return null;
  }

  /**
   * Returns the FKs properties of the main node. The main node is the first node added.
   * @returns
   */
  getFKPropertiesOfMainNode(): NodeProperty[] {
    let array: NodeProperty[] = [];
    let node: Node = this.getMainNode();
    for (let property of node.getProperties()) {
      if (property.isForeignKey()) {
        array.push(property);
      }
    }
    return array;
  }

  /**
   * Returns the node of the given property ID.
   *
   * @param id
   * @returns
   */
  getNodeProperty(id: string): Node {
    for (let node of this.nodes) {
      for (let property of node.getProperties()) {
        if (property.getID() === id) {
          return node;
        }
      }
    }
    return null;
  }

  /**
   * Informs if there is a node traced to the given node name.
   *
   * @param nodeName
   * @returns
   */
  existsTracedNodeByName(nodeName: string): boolean {
    for (let node of this.nodes) {
      if (node.getName() === nodeName) {
        return true;
      }
    }

    return false;
  }

  toString(): string {
    let msg: string = '';
    let first: boolean = true;
    for (let node of this.nodes) {
      if (first) {
        msg += node.getName();
        first = false;
      } else {
        if (this.innerJoin) {
          msg += ' JOIN ' + node.getName();
        } else {
          msg += ' LEFT JOIN ' + node.getName();
        }
      }
    }
    return msg;
  }
}
