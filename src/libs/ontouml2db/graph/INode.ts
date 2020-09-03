/**
 * A node represents the existence of a class in the OntoUML model, its properties and 
 * associations. A node is an composition of properties and associations, therefore, 
 * the node serves as an interface for manipulating properties and associations. The 
 * node has the capacity to tell which nodes it has been transformed to.
 * 
 * Author: Gustavo L. Guidoni
 */

import { ClassStereotype } from '@constants/index';
import { IPropertyContainer } from './IPropertyContainer';
import { IAssociationContainer } from './IAssociationContainer';
import { ITrackerContainer } from './ITrackerContainer';

export interface INode extends IPropertyContainer, IAssociationContainer, ITrackerContainer{

	/**
	 * Returns the class identifier of the original model.
	 */
	getId(): string;

    /**
	 * Informs the node name.
	 * 
	 * @param name. Name of the node.
	 */
	 setName(name: string ): void;
	
	/**
	 * Returns the node name.
	 * 
	 * @return The name of the node.
	 */
	getName(): string;
	
	/**
	 * Informs the node stereotype.
	 * 
	 * @param stereotype. The stereotype name.
	 */
	setStereotype(stereotype: ClassStereotype): void;
	
	/**
	 * Returns the stereotype name. 
	 * 
	 * @return The name of the stereotype.
	 */
	getStereotype(): ClassStereotype;

	/**
	 * Informs the node's properties container.
	 * 
	 * @param container Container to be put on the node.
	 */
	setPropertyContainer(container: IPropertyContainer): void;
	
	/**
	 * Creates a new node with the same properties values.
	 * 
	 * @return A new node identical to the current one.
	 */
	clone(): INode;
	
	/**
	 * Informs that the node has been resolved. Used in the transformation 
	 * processes to walk in the graph produced by the Nodes.
	 * 
	 * @param flag. True reports that the node was resolved, false not.
	 */
	setResolved(flag: boolean): void;
	
	/**
	 * Returns if the node was resolved.
	 * 
	 * @return A boolean indicating whether the node has been resolved.
	 */
	isResolved(): boolean;
	
	/**
	 * Returns a string containing the description of the trace.
	 * 
	 * @return A string with tracking of the node.
	 */
	trackingToString(): string;

	toString(): string;
}