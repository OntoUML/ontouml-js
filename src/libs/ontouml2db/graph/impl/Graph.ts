/**
 * This class is responsible for keeping in memory the same graph found 
 * in the Turtle file.
 * 
 * Author: Gustavo L. Guidoni
 */

import { IGraph } from "../IGraph";
import { INode } from '../INode';
import { IGraphGeneralization } from '../IGraphGeneralization';
import { IGraphRelation } from '../IGraphRelation';
import { IGraphAssociation } from '../IGraphAssociation';
import { IGraphGeneralizationSet } from '../IGraphGeneralizationSet';
import { Util } from '../util/Util';
import { GraphRelation } from './GraphRelation';
import { GraphGeneralization } from './GraphGeneralization';

export class Graph implements IGraph {
	private nodes: INode[];
	private associations: IGraphAssociation[];
	private generalizationSets: IGraphGeneralizationSet[];

	constructor(nodes?: INode[], associations?: IGraphAssociation[], gs?: IGraphGeneralizationSet[]  ) {
		if(nodes)
			this.nodes = nodes;
		else this.nodes = [];

		if(associations)
			this.associations = associations;
		else this.associations = [];

		if(gs)
			this.generalizationSets = gs;
		else this.generalizationSets = [];
	}

	addNode(newNode: INode): void {
		this.nodes.push(newNode);
	}
	
	getNodeById(id: string): INode {
		for (let val of this.nodes) {
			if(val.getId() == id)	
				return val;
		};
		return null;
	}

	getNodeByName(name: string): INode{
		for (let val of this.nodes) {
			if(val.getName() == name)	
				return val;
		};
		return null;
	}

	getNodes(): INode[] {
		return this.nodes;
	}

	existsNode(node: INode): boolean {
		return this.nodes.includes(node);
	}

	addRelation(relation: IGraphRelation): void{
		if( this.getAssociationByID(relation.getAssociationID()) == null){
			this.associations.push(relation);
		}
	}

	addGeneralization(generalization: IGraphGeneralization): void {
		if( !this.associations.includes(generalization) ){
			this.associations.push(generalization);
		}
	}

	addGeneralizationSet(generalizationSet: IGraphGeneralizationSet): void {
		if( !this.generalizationSets.includes(generalizationSet) ){
			this.generalizationSets.push(generalizationSet);
		}
	}

	getAssociationByID(id: string): IGraphAssociation{
		for (let val of this.associations) {
			if(val.getAssociationID() == id)	
				return val;
		};
		return null;
	}

	getAssociations(): IGraphAssociation[]{
		return this.associations;
	}

	getToplevelNonSortal(): INode {
		for (let node of this.nodes) {
			if (	Util.isNonSortal( node.getStereotype() ) &&
					!node.isSpecialization() &&
					node.hasSpecialization()//Allows the generation of a table with a "non-sortal" without heirs.
				) {
				return node;
			}
		}
		return null;
	}

	getLeafSortalNonKind(): INode {
		for(let node of this.nodes){
			if ( 	Util.isSortalNonKind( node.getStereotype() ) && //is a subkind, phase or role
					! node.hasSpecialization() ) { //is a leaf node
				 	return node;
			}
		}
		return null;
	}

	removeNodes(nodes: INode[]): void{
		for (let node of nodes) {
			this.removeNode(node);
		}
	}

	removeNode(node: INode): void {
		let index = this.nodes.indexOf(node);
		this.nodes.splice(index, 1);

		let relation: IGraphRelation;
		let removeRelations = node.getRelations();
		while( removeRelations.length != 0 ){
			relation = removeRelations[0];
			index = this.associations.indexOf(relation);
			this.associations.splice(index, 1);
			relation.deleteAssociation();
		}

		let generalization: IGraphGeneralization;
		let removeGeneralizations = node.getGeneralizations();
		while( removeGeneralizations.length != 0 ){
			generalization = removeGeneralizations[0];
			index = this.associations.indexOf(generalization);
			this.associations.splice(index, 1);
			generalization.deleteAssociation();
		}
	}

	setAllNodesUnsolved(): void {
		this.nodes.forEach( (node: INode) =>{
			node.setResolved(false);
		});
		this.associations.forEach( (association: IGraphAssociation) =>{
			association.setResolved(false);
		});
	}

	removeAssociation(association: IGraphAssociation): void{
		if( association instanceof GraphRelation ){
			this.removeRelation(association);
		}
		if( association instanceof GraphGeneralization ){
			this.removeGeneralization(association);
		}
		let index = this.associations.indexOf(association);
		if(index != -1)
			this.associations.splice(index, 1);
	}

	private removeRelation(relation: IGraphRelation): void{
		relation.deleteAssociation();
	}

	private removeGeneralization(generalization: IGraphGeneralization): void{
		generalization.deleteAssociation();
	}

	removeAssociations(associations: IGraphAssociation[]): void{
		for (let association of associations) {
			this.removeAssociation(association);
		}
	}

	clone(): IGraph {
		let newNodes: INode[] = [];
		let newAssociations: IGraphAssociation[] = [];
		let newGS: IGraphGeneralizationSet[] = [];
		
		this.nodes.forEach( (node: INode)=>{
			newNodes.push(node.clone());
		});
		
		this.associations.forEach( (association: IGraphAssociation)=>{
			newAssociations.push(association.cloneChangingReferencesTo(newNodes));
		});

		this.generalizationSets.forEach( (gs: IGraphGeneralizationSet)=>{
			newGS.push(gs.cloneChangingReferencesTo(newNodes) as IGraphGeneralizationSet );
		});
		
		return new Graph(newNodes, newAssociations, newGS);
	}	

	toString(): string {
		let msg = "";

		this.nodes.forEach((node: INode) => {
			msg += node.toString()+ "\n";
		});
		return msg;
	}
}