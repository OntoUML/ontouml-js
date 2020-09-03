/**
 * 
 * 
 * Author: João Paulo A. Almeida; Gustavo L. Guidoni
 */

import { INode } from '@libs/ontouml2db/graph/INode';
import { IGraph } from '@libs/ontouml2db/graph/IGraph';
import { INodeProperty } from '@libs/ontouml2db/graph/INodeProperty';
import { NodeProperty } from '@libs/ontouml2db/graph/impl/NodeProperty';
import { Node } from '@libs/ontouml2db/graph/impl/Node';
import { Increment } from '@libs/ontouml2db/graph/util/Increment';
import { IGraphGeneralizationSet } from '@libs/ontouml2db/graph/IGraphGeneralizationSet';
import { INodePropertyEnumeration } from '@libs/ontouml2db/graph/INodePropertyEnumeration';
import { NodePropertyEnumeration } from '@libs/ontouml2db/graph/impl/NodePropertyEnumeration';
import { ClassStereotype } from '@constants/.';
import { GraphRelation } from '@libs/ontouml2db/graph/impl/GraphRelation';
import { IGraphRelation } from '@libs/ontouml2db/graph/IGraphRelation';
import { Cardinality } from '@libs/ontouml2db/graph/util/enumerations';

export class Lifting{

    public static doLifting(graph: IGraph): void {
		
		let node = graph.getLeafSortalNonKind();

		while (node != null) {
			this.liftNode(node, graph);
			graph.removeNode( node );
			node = graph.getLeafSortalNonKind();
		}
	}
	
	private static liftNode(node: INode, graph: IGraph): void {
		
		this.resolveGeneralization( node );
		
		this.resolveGeneralizationSet( node, graph );
		
        this.liftAtributes( node );
        
        this.remakeReferences( node );
	}

    // **************************************************************************************
    // *********** Resolve the nodes generalizations
    // **************************************************************************************
	private static resolveGeneralization( node: INode ):void {
		let newProperty: INodeProperty;
		node.setResolved(true);
		//here, each node must have only one generaization node
		//Generalization Sets are resolved by "resolveGeneralizatinSet
		let generalization = node.getGeneralizations()[0];
		
		if( ! generalization.isBelongGeneralizationSet() ){
            //create a boolean for the specialization
            newProperty = new NodeProperty(
                    Increment.getNext().toString(),
                    "is" + generalization.getSpecializationNode().getName(), 
                    "boolean",
                    false,
                    false);
            newProperty.setDefaultValue(false);
            
            //The new property is put in the generalizaiton node node by liftAttribute method.
            node.addProperty( newProperty );
            
            node.setSourceTrackerField(newProperty, true);
        }
	}
    
    // **************************************************************************************
    // *********** Resolve the node attributes
    // **************************************************************************************
	//must be called after creating all attributes on the specialization nodes.
	private static liftAtributes( node: INode ):void {
        //here, each note must have only one generaization
        
        if( node.getGeneralizations().length == 0 )
            return;

		let generalization = node.getGeneralizations()[0];
		
		let properties = generalization.getSpecializationNode().getProperties();
        
        for (let property of properties) {
			if(property.getDefaultValue() == null)//Does not change nullability for columns with default values (eg is_employee default false)
				property.setNullable(true);
		}
		generalization.getGeneralizationNode().addProperties(properties);
    }

    // **************************************************************************************
    // *********** Resolve the node generalization sets
    // **************************************************************************************
	private static resolveGeneralizationSet( node: INode, graph: IGraph ): void {
		let enumTableName: string;
		let enumFieldName: string;
		let associationName: string;
		let newEnumerationField: INodePropertyEnumeration;
		let newNode: INode;
		let newRelation: IGraphRelation;

        for( let gs of node.getGeneralizationSets() ){
			//The Generalization Set is resolved as soon as it is identified and marked as resolved. This is  
			//necessary because the "lifting" process will call the other subclasses to resolve their attributes 
			//and associations, not being able to repeat the process of solving the generalization set.
			if( ! gs.isResolved() ) {
			
				enumTableName = this.getEnumName(gs);
                enumFieldName = enumTableName + "Enum" ;
				associationName = "enum_" + Increment.getNext();
				
				newEnumerationField = new NodePropertyEnumeration(Increment.getNext().toString(), enumFieldName, "int", false, false );
				newNode = new Node( Increment.getNext().toString(), enumTableName, ClassStereotype.ENUMERATION );
				newNode.addProperty(newEnumerationField);
				
				newRelation = new GraphRelation(
						associationName, 
						newNode, 
						this.getNewSourceCardinality(gs),
						gs.getGeneralizationNode(),  
						Cardinality.C0_N);
				
				gs.getGeneralizationNode().addRelation(newRelation);
				newNode.addRelation(newRelation);
				
				graph.addNode(newNode);
				graph.addRelation(newRelation);
                
                for(let specializationNode of gs.getSpecializationNodes()){
                    newEnumerationField.addValue(specializationNode.getName());
					specializationNode.setSourceTrackerField( newEnumerationField, specializationNode.getName());
					specializationNode.setSourcePropertyLinkedAtNode(newNode);
				}
				gs.setResolved(true);
			}
		}
	}
	
	private static getEnumName( gs: IGraphGeneralizationSet): string {
		if(gs.getName() == null || gs.getName().trim() == '')
			return "Enum"+ Increment.getNext();
		else return gs.getName();
	}
	
	private static getNewSourceCardinality(gs: IGraphGeneralizationSet): Cardinality {
		
		if( gs.isDisjoint() && gs.isComplete() ) {
			return Cardinality.C1;
		}
		else if( gs.isDisjoint() && !gs.isComplete() ) {
			return Cardinality.C0_1;
		}
		else if( !gs.isDisjoint() && gs.isComplete() ) {
			return Cardinality.C1_N;
		}
		else if( !gs.isDisjoint() && !gs.isComplete() ) {
			return Cardinality.C0_N;
		}
		return null;
    }
    
    // **************************************************************************************
    // *********** Resolve the references
    // **************************************************************************************
	private static remakeReferences( node: INode): void {
		//here, each node must have only one generaization node
		let generalization = node.getGeneralizations()[0];
		
		let superNode = generalization.getGeneralizationNode();
        
		while(node.getRelations().length != 0){
			let relation = node.getRelations()[0];
			if( relation.getSourceNode() == node ) {
				relation.setSourceNode(superNode);
				relation.setTargetCardinality( this.getNewCardinality( relation.getTargetCardinality() ) );
			}
			else {
				relation.setTargetNode(superNode);
				relation.setSourceCardinality( this.getNewCardinality( relation.getSourceCardinality() ) );
			}
			superNode.addRelation(relation);
			node.deleteAssociation(relation);
		}
		node.changeSourceTracking(superNode);
	}
	
	private static getNewCardinality(oldCardinality: Cardinality): Cardinality {
		if( oldCardinality == Cardinality.C1_N ) {
			return Cardinality.C0_N;
		}
		else if( oldCardinality == Cardinality.C1 ) {
			return Cardinality.C0_1;
		}
		else return oldCardinality;
	}

}