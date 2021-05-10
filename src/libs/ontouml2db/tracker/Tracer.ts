/**
 * This class is responsible for storing the tracked nodes.
 * A node can trace more than one node on the target graph.
 *
 * Author: Gustavo L. Guidoni
 */

import { Node } from '@libs/ontouml2db/graph/Node';
import { NodeProperty } from '@libs/ontouml2db/graph/NodeProperty';
import { Filter } from '@libs/ontouml2db/tracker/Filter';
import { TracedNode } from './TracedNode';

export class Tracer {
  private sourceNode: Node;
  private filters: Filter[];
  private targetNodes: Map<string, TracedNode>;

  constructor(newNode: Node) {
    this.sourceNode = newNode;
    this.targetNodes = new Map();
    this.filters = [];
  }

  // /**
  //  * Returns the tracked nodes from the original node.
  //  */
  // getTargetNodes(): Node[] {
  //   let nodes: Node[] = [];
  //   for(let tracedNode of this.targetNodes.values()){
  //     nodes = nodes.concat(tracedNode.getNodes());
  //   }
  //   return nodes;
  // }
  /**
   * Returns the tracked nodes from the original node.
   */
  getTargetNodes(): Map<string, TracedNode> {
    return this.targetNodes;
  }

  /**
   * Adds a new node to be tracked from the original node.
   * @param newNode. Node to be tracked.
   */
  addTargetNode(newNode: Node): void {
    this.targetNodes.set(newNode.getId(), new TracedNode(newNode));
  }

  /**
   * Informs that a join between the traced node and another node must be performed.
   *
   * @param tracedNode
   * @param joinedNode
   * @param innerJoin
   */
  addJoinedNode(tracedNode: Node, joinedNode: Node, innerJoin: boolean): void {
    for (let trace of this.targetNodes.values()) {
      if (trace.isNodeTraced(tracedNode)) {
        trace.addJoinedNode(joinedNode, innerJoin);
      }
    }
  }

  /**
   * Informs if the node is a tracer node.
   * @param id. Identifier to be verified.
   */
  existsTraceFor(node: Node): boolean {
    return this.targetNodes.has(node.getId());
  }

  /**
   * Informs if the node is traced from the source node.
   * @param node
   * @returns
   */
  isNodeTraced(node: Node): boolean {
    for (let tracedNode of this.targetNodes.values()) {
      if (tracedNode.isNodeTraced(node)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Removes the tracked node. If the node is tracked, it will be removed and will
   * return true. If the node is not tracked, this method do nothing and return false.
   * @param id Node identifier to be removed
   */
  removeTrace(node: Node): boolean {
    if (this.targetNodes.has(node.getId())) {
      this.targetNodes.delete(node.getId());
      return true;
    }
    return false;
  }

  /**
   * Returns the tracker node.
   *
   * @return A Node in the target graph.
   */
  getSourceNode(): Node {
    return this.sourceNode;
  }

  /**
   * Informs a node to be tracked in the target graph.
   *
   * @param node. Node to be tracked.
   */
  setSourceNode(node: Node): void {
    this.sourceNode = node;
  }

  /**
   * Create end put a new filter in the tracer.
   *
   * @param sourceNode
   * @param property
   * @param value
   * @param propertyBelongsToOtherNode
   */
  newFilter(sourceNode: Node, property: NodeProperty, value: any, propertyBelongsToOtherNode: Node): void {
    this.filters.push(new Filter(sourceNode, property, value, propertyBelongsToOtherNode));
  }

  /**
   * Adds a filter in the tracer if not exists
   * @param filter
   */
  addFilter(filter: Filter): void {
    if (!this.existsFilter(filter)) {
      this.filters.push(filter);
    }
  }

  /**
   * Checks whether the filter exists in the tracer.
   *
   * @param newFilter
   */
  existsFilter(newFilter: Filter): boolean {
    for (let filter of this.filters) {
      if (newFilter.getId() === filter.getId()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns the filter of the tracer.
   */
  getFilters(): Filter[] {
    return this.filters;
  }

  /**
   * Changes the class in which the rule will be applied.
   *
   * @param fromNode
   * @param toNode
   */
  updateSourceRulesToFrom(fromNode: Node, toNode: Node): void {
    for (let filter of this.filters) {
      if (filter.getSourceNode().getId() === fromNode.getId()) {
        filter.setSourceNode(toNode);
      }
    }
  }

  isNodeToApplyFilter(node: Node): boolean {
    for (let filter of this.filters) {
      if (filter.isNodeToApplyFilter(node)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Informs that it will be necessary to make a junction with one more node for the
   * filter to be made in the desired node from the tracked node.
   *
   * @param nodoFilter
   * @param joinedNode
   */
  addJoinedNodeToDoFilter(nodoFilter: Node, joinedNode: Node): void {
    for (let filter of this.filters) {
      if (filter.isNodeToApplyFilter(nodoFilter)) {
        filter.addJoinedNodeToDoFilter(joinedNode);
      }
    }
  }

  /**
   * Change the field in which the filter will be performed.
   *
   * @param oldProperty
   * @param newProperty
   */
  changeFieldToFilter(oldProperty: NodeProperty, newProperty: NodeProperty) {
    for (let filter of this.filters) {
      if (filter.getProperty().getID() === oldProperty.getID()) {
        filter.setProperty(newProperty);
      }
    }
  }

  /**
   * Informs if the informed property is used in any filter.
   *
   * @param property
   * @returns
   */
  isFiltredByProperty(property: NodeProperty): boolean {
    for (let filter of this.filters) {
      if (filter.isFiltredByProperty(property)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Removes the property belongs to another Node.
   *
   * @param node
   */
  removeNodeToApplyFilter(node: Node): void {
    for (let filter of this.filters) {
      if (filter.getNodeToApplyFilter() !== null) {
        if (filter.getNodeToApplyFilter().getId() === node.getId()) {
          filter.removeNodeToApplyFilter();
        }
      }
    }
  }

  /**
   * Informs if there is a node tracer between the given source and target node name.
   *
   * @param sourceNodeName
   * @param targetNodeName
   * @returns
   */
  existsTracerByName(sourceNodeName: string, targetNodeName: string): boolean {
    if (this.sourceNode.getName() === sourceNodeName) {
      for (let tracedNode of this.targetNodes.values()) {
        if (tracedNode.existsTracedNodeByName(targetNodeName)) {
          return true;
        }
      }
    }
    return false;
  }

  toString(): string {
    let msg: string = this.sourceNode.getName() + ' -> ';
    for (let tracedNode of this.targetNodes.values()) {
      msg += tracedNode.toString();
    }

    this.filters.forEach(filter => {
      msg += filter.toString();
    });
    return msg;
  }
}
