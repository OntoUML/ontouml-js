/**
 * Class responsable for making the flatten processo on the One Table per Kind mapping.
 * 
 * Author: João Paulo A. Almeida; Gustavo L. Guidoni
 */
import { IGraph } from '@libs/ontouml2db/graph/IGraph';
import { INode } from '@libs/ontouml2db/graph/INode';
import { IGraphGeneralization } from '@libs/ontouml2db/graph/IGraphGeneralization';
import { IGraphRelation } from '@libs/ontouml2db/graph/IGraphRelation';
import { Cardinality } from '@libs/ontouml2db/graph/util/enumerations';
import { Increment } from '@libs/ontouml2db/graph/util/Increment';

export class Flatten{

    public static doFlattening(graph: IGraph): void{
        let node: INode;
		
		// flattens all top-level non-sortals
        node = graph.getToplevelNonSortal();
        
		while (node != null) {
			this.flattenNode(node, graph);
			graph.removeNode(node);
			node = graph.getToplevelNonSortal();
        }
    }
	
	private static flattenNode(node: INode, graph: IGraph): void {

        for(let generalization of node.getGeneralizations()){
            this.flattenGeneralization( generalization );
		}
		
        for(let relation of node.getRelations()){
			this.flattenAssociation( node, relation, graph );
		}
		
	}
	
	private static flattenGeneralization(generalization: IGraphGeneralization): void{
		//The generalization is not removed from the node here because when removing the 
		//node, its associations are also removed.
		generalization.getSpecializationNode().addPropertiesAt(
				0,
				generalization.getGeneralizationNode().getProperties()
				);
		
		//for tracking between graphs
		generalization.getGeneralizationNode().addSourceTrackedNode( generalization.getSpecializationNode() );
		generalization.getSpecializationNode().addTracking(generalization.getGeneralizationNode().getTrackers());
		generalization.getGeneralizationNode().removeSourceTracking( );	
	}
	
	private static flattenAssociation(flattenNode: INode, relation: IGraphRelation, graph: IGraph ): void {
        for(let generalization of flattenNode.getGeneralizations()){
            this.flattenAssociationWith( flattenNode, generalization.getSpecializationNode(), relation, graph );
        }
	}
	
	private static flattenAssociationWith (flattenNode: INode, toNode: INode, relation: IGraphRelation, graph: IGraph ): void {
		let newRelation = relation.clone( Increment.getNext().toString( ) );

		newRelation.setName( flattenNode.getName() );

		if( relation.getSourceNode() == flattenNode ) {
			newRelation.setSourceNode(toNode);
			newRelation.setSourceCardinality( this.getNewCardinality( relation.getSourceCardinality() ) );
			newRelation.getTargetNode().addRelation(newRelation);
			newRelation.getTargetNode().deleteAssociation(relation);
		}
		else {
			newRelation.setTargetNode(toNode);
			newRelation.setTargetCardinality( this.getNewCardinality( relation.getTargetCardinality() ) );
			newRelation.getSourceNode().addRelation(newRelation);
			newRelation.getSourceNode().deleteAssociation(relation);
		}
		//remove the association from the node so that it is not removed from the graph when deleting the node.
		toNode.addRelation(newRelation);
		graph.addRelation(newRelation);
	}
	
	private static getNewCardinality(oldCardinality: Cardinality): Cardinality {
		if( oldCardinality == Cardinality.C1 ) {
			return Cardinality.C0_1;
		}
		else if( oldCardinality == Cardinality.C1_N ) {
			return Cardinality.C0_N;
		}
		else return oldCardinality; 
	}

}