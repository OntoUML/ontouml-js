/**
 * This interface provides the necessary methods to manipulate the generalization sets of the graph.
 * 
 * Author: Gustavo L. Guidoni
 */
import { IGraphAssociation } from './IGraphAssociation';
import { INode } from './INode';
import { IGraphGeneralization } from './IGraphGeneralization';

export interface IGraphGeneralizationSet extends IGraphAssociation{

	/**
	 * Informs the generalist node of the generalizatin set.
	 * 
	 * @param generalizationNode Generalist node.
	 */
	setGenealizationNode(generalizationNode: INode): void;

    /**
	 * Returns the generalization set supernode.
	 * 
	 * @return INode with the supernode.
	 */
    getGeneralizationNode(): INode;
    
    /**
     * Adds a new specialization node to the generalization set.,
     * 
     * @param specialization Specialization node to be add in the generalization set
     */
	addSpecializationNode(specialization: INode): void;
	
	/**
	 * Returns the specializations linked to the genrealization set.
	 * 
	 * @return An ArrayList with all the specialization nodes.
	 */
	getSpecializations(): IGraphGeneralization[];
	
	/**
	 * Returns the specialization nodes linked to the genrealization set.
	 * 
	 * @return An ArrayList with all the specialization nodes.
	 */
	getSpecializationNodes(): INode[];
	
	/**
	 * Checks whether the generalization set is disjoint.
	 * 
	 * @return True if the generalization set is disjoint and false if it 
	 * is overlapping.
	 */
	isDisjoint(): boolean;
	
	/**
	 * Checks whether the generalization set is classified as incomplete.
	 * 
	 * @return True if the generalization set is classified as complete 
	 * and false if it is incomplete.
	 */
	isComplete(): boolean;


	/**
	 * Returns the generalization set formated as string;
	 */
	toString(): string;
}