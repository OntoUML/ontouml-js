/**
 * This interface provides the necessary methods to manipulate the node's associations.
 * 
 * Author: Gustavo L. Guidoni
 */
import { AssociationType } from './util/enumerations';
import { INode } from './INode';

export interface IGraphAssociation{

	/**
	 * Returns the association ID (Relation, Generalization, Generalization Set, 
	 * or any other association). The ID is the same as found in the source model.
	 */
	getAssociationID(): string;

    /**
	 * Indicates the association name.
	 * 
	 * @param name. Association name.
	 */
    setName(name: string): void;
    
    /**
	 * Returns the association name.
	 * 
	 * @return A string with the association name.
	 */
    getName(): string;
    
    /**
	 * Checks if the current association is the same type as the association 
	 * passed as a parameter.
	 * 
	 * @param associationType. association to be tested.
	 * @return boolean. Returns true if are the same, outerwise false.
	 */
    isAssociationType(associationType: AssociationType): boolean;
    
	/**
	 * Marks the association as visited or not.
	 * 
	 * @param flag. True indicates that the association was visited and false 
	 * as not visited.
	 */
	setResolved(flag: boolean): void;

	/**
	 * Indicates whether the association has already been visited.
	 * 
	 * @return True if the association was visited, otherwise false.
	 */
	isResolved(): boolean;
	
	/**
	 * Clone the association changing the associated nodes to the nodes in 
	 * the array. This method generally used to clone the node.
	 * 
	 * @param nodes. New nodes to be linked.
	 * @return IGraphAssociation
	 */
	cloneChangingReferencesTo(nodes: INode[]): IGraphAssociation;

	/**
	 * Delete the association from the nodes.
	 * 
	 * @param node Node to be checked for its existence in the association.
	 */
	deleteAssociation(): void;
}