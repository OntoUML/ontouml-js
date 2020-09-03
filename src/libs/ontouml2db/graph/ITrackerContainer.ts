/**
 * A TrackerContainer is intended to group all the node's trackers.
 * This interface groups the set of actions to perform the tracking of the
 * original node in the resulting node.
 *
 * Author: Gustavo L. Guidoni
 */

import { INode } from './INode';
import { INodeProperty } from './INodeProperty';
import { ITracker } from './ITracker';

export interface ITrackerContainer {
  /**
   * Informs for the source node that its characteristics can also be
   * found in the node passed as parameter.
   *
   * @param newNodeTracker. New node to be traced by the source node.
   */
  addSourceTrackedNode(newNodeTracker: INode): void;

  /**
   * Adds a node that will be tracked by the current node.
   *
   * @param newNodeReference. Node to be tracked.
   */
  addTrackedNode(newNodeTracker: INode): void;

  /**
   * Adds a set of trackers that will be tracked by the current node.
   *
   * @param trackers. Node that is part of the set of nodes that
   * identify the current node.
   */
  addTracking(trackers: ITracker[]): void;

  /**
   * Removes the current node from the source node, that is, the
   * source node will no longer track the current node.
   */
  removeSourceTracking(): void;

  /**
   * Stop tracking the informed node.
   *
   * @param node. Node that will no longer be tracked.
   */
  removeTracking(node: INode): void;

  /**
   * Informs that the current node will no longer be tracked by
   * the source node and will start tracking the informed node.
   *
   * @param newNodeTracker. Node to be traced in place of the
   * current node.
   */
  changeSourceTracking(newNodeTracker: INode): void;

  /**
   * Changes the tracking to a new node. A node can be associated
   * with several other nodes, so it is necessary to inform the
   * node to be changed (oldNode) and the node (newNode) to be referenced.
   *
   * @param oldNodeTracker. Node that will no longer be tracked.
   * @param newNodeTracker. Node that will be tracked.
   */
  changeTracking(oldNodeTracker: INode, newNodeTracker: INode): void;

  /**
   * Informs for the source node that it is identified in the current
   * node through the property and the value informed.
   *
   * @param property. Property of the current node to be associated with
   * the source node.
   * @param value. Value that identifies the source node in the informed
   * property.
   */
  setSourceTrackerField(property: INodeProperty, value: any): void;

  /**
   * Informs that the current node is associated with the node's property
   * passed as argument.
   *
   * @param node. Node to which the current node is tracked.
   * @param property. Property of the tracked node where the current node
   * is identified.
   * @param value. Property value that identifies the current node.
   */
  setTrackerField(node: INode, property: INodeProperty, value: any): void;

  /**
   * Informs for the source node that the property of the current node is
   * associated with another node, that is, the informed property has its
   * value referenced to the informed node. In other words, the value stored
   * by the property is a foreign key.
   *
   * @param linkedNode. Node responsible for storing the source of the property value.
   */
  setSourcePropertyLinkedAtNode(linkedNode: INode): void;

  /**
   * Informs that the property of the current node is associated with another
   * node, that is, the informed property has its value referenced to the
   * informed node. In other words, the value stored by the property is a
   * foreign key.
   *
   * @param node. Node tracked.
   * @param linkedNode. Node that has the source of the data.
   */
  setPropertyLinkedAtNode(node: INode, linkedNode: INode): void;

  /**
   * Informs for the source node that the current node's property is no
   * longer associated with another node. This method does not exclude the
   * property, it just disassociates the node from the property.
   *
   * @param id. The ID of the Node that will be disassociated.
   */
  removeSourcePropertyLinkedAtNode(id: string): void;

  /**
   * Removes the node's property associated with another node. This method
   * does not exclude the property, it just disassociates the node from
   * the property.
   *
   * @param id. The ID of the Node that will be disassociated.
   */
  removePropertyLinkedAtNode(id: string): void;

  /**
   * Returns the number of nodes tracked by the current node.
   *
   * @return One int with the number of node tracked.
   */
  getAmountNodesTracked(): number;

  /**
   * Returns the column name (from the table) traced to the name of the
   * informed property.
   *
   * @param field. Original name of the property.
   * @return One string with the column name in the database.
   */
  getTargetColumnName(field: string): string;

  /**
   * Returns the primary column name from the current node.
   *
   * @return
   */
  getTargetPKName(): string;

  /**
   * Returns a list of the nodes tracked by the current node. The
   * returned list is not part of the node's storage system.
   *
   * @return One ArrayList with the nodes referenced by the current node.
   */
  getTrackers(): ITracker[];

  /**
   *
   */
  toString(): string;
}
