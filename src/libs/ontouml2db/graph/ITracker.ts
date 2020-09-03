/**
 * Responsible for storing the tracking data. A node has one or more trackers.
 * 
 * Author: Gustavo L. Guidoni
 */

import { INode } from './INode';
import { INodeProperty } from './INodeProperty';

 export interface ITracker{
     /**
	 * Returns the tracker node.
	 * 
	 * @return A Node in the target graph.
	 */
	getNode(): INode;

	/**
	 * Informs a node to be tracked in the target graph.
	 * 
	 * @param node. Node to be tracked.
	 */
	setNode(node: INode): void;
	
	/**
	 * Returns the property on which the node is linked.
	 * 
	 * @return The property linked to the tracker node.
	 */
	getProperty(): INodeProperty;
	
	/**
	 * Informs the property linked to the tracker node.
	 * 
	 * @param property. Property to be linked to the tracker node.
	 */
	setProperty(property: INodeProperty): void;
	
	/**
	 * Returns the value of the node tracked in the property.
	 * 
	 * @return The node value in the property.
	 */
	getValue(): any;
	
	/**
	 * Informs the value of the node tracked in the property.
	 * 
	 * @param value. The node value in the property.
	 */
	setValue(value: any): void;
	
	/**
	 * Informs the node to which the property belongs.
	 * 
	 * @param node. The node linked to the property.
	 */
	setPropertyLinkedAtNode(node: INode): void;
	
	
	/**
	 * Returns the node to which the property belongs.
	 * 
	 * @return The node linked to the property.
	 */
	getPropertyLinkedAtNode(): INode;
 }