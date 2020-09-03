/**
 * The process turns the model of the UML file into a graph. This interface 
 * groups all the methods necessary to manipulate the graph.
 * 
 * Author: Gustavo L. Guidoni
 */

import { INode } from './INode';
import { IGraphGeneralization } from './IGraphGeneralization';
import { IGraphRelation } from './IGraphRelation';
import { IGraphAssociation } from './IGraphAssociation';
import { IGraphGeneralizationSet } from './IGraphGeneralizationSet';

export interface IGraph {
    
    /**
	 * Adds a new node (class) on the graph.
	 * 
	 * @param INode. Node to be added in the graph.
	 */
    addNode( newNode : INode  ) : void;

	/**
	 * Returns the node instance. If not find, returns null. 
	 * 
	 * @param id. The class identifier of the original model.
	 */
	getNodeById(id: string): INode;

	/**
	 * Returns the node instance. If not find, returns null. 
	 * 
	 * @param name. The class name to search for.
	 */
	getNodeByName(name: string): INode;
	
	/**
	 * Returns all nodes of the graph.
	 * 
	 * @return An array with all nodes.
	 */
	getNodes(): INode[];
	
	/**
	 * Verifies whether the node exists on the graph.
	 * 
	 * @param node. Node to be verified.
	 * @return True if the node exists in the graph, otherwise false.
	 */
	existsNode(node: INode): boolean;

	/**
	 * Adds a new relation to the graph.
	 * 
	 * @param relation. The relation to be stored.
	 */
	addRelation(relation: IGraphRelation): void;
	
	/**
	 * Adds a new generalization to the graph.
	 * 
	 * @param generalization. The generalization to be stored.
	 */
	addGeneralization(generalization: IGraphGeneralization): void;

	/**
	 * Returns the associaiton of the respective ID.
	 * 
	 * @param id Association ID.
	 */
	getAssociationByID(id: string): IGraphAssociation;
	
	/**
	 * Adds a new Generalization Set to the graph.
	 * 
	 * @param generalizationSet. The generalization set to be stored.
	 */
	addGeneralizationSet(generalizationSet: IGraphGeneralizationSet): void;
	
	/**
	 * Returns a top-level non-sortal in a package and remove it from array.
	 * 
	 * @return An INode with the top-level non-sortal from the graph, or null 
	 * if none can be found
	 */
	getToplevelNonSortal(): INode;
	
	/**
	 * Returns the first node that it finds to be non-kind.
	 * 
	 * @return An INode non-kind.
	 */
	getLeafSortalNonKind(): INode;
	
	/**
	 * Removes an node and its associations of the graph.
	 * 
	 * @param node. Node to be removed.
	 */
	removeNode(node: INode): void;

	/**
	 * Removes set of nodes and its associations of the graph.
	 * 
	 * @param node. Node to be removed.
	 */
	removeNodes(node: INode[]): void;
	
	/**
	 * Removes the association of the graph. The association will be removed from the nodes. 
	 * 
	 * @param association. Association to be removed.
	 */
	removeAssociation(association: IGraphAssociation): void;
	
	/**
	 * Removes the associations of the graph. The associations will be removed from the nodes. 
	 * 
	 * @param associations. Associations to be removed.
	 */
	removeAssociations(associations: IGraphAssociation[]): void;

	/**
	 * Returns all associations of the graph.
	 * 
	 * @return An array with all associations.
	 */
    getAssociations(): IGraphAssociation[];
	
	/**
	 * Marks all nodes as unsolved.
	 */
	setAllNodesUnsolved(): void;
	
	/**
	 * Clone the graph by establishing a reference between the nodes of the current 
	 * graph for the cloned graph.
	 * 
	 * @return An graph identical to the current graph.
	 */
	clone(): IGraph;

	toString(): string;
}
    

