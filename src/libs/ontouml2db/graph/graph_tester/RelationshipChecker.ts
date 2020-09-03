/**
 * Author: Gustavo Ludovico Guidoni
 */

import { Cardinality } from '@libs/ontouml2db/graph/util/enumerations';
import { IGraph } from '@libs/ontouml2db/graph/IGraph';
import { IGraphAssociation } from '@libs/ontouml2db/graph/IGraphAssociation';
import { IGraphRelation } from '@libs/ontouml2db/graph/IGraphRelation';

export class RelationshipChecker{
    private sourceNodeName: string;
	private sourceCardinality: Cardinality;
	private targetNodeName: string;
	private targetCardinality: Cardinality;
	
	constructor (sourceNode: string, sourceCardinality: Cardinality, targetNode: string, targetCardinality: Cardinality) {
		this.sourceNodeName = sourceNode;
		this.sourceCardinality = sourceCardinality;
		this.targetNodeName = targetNode;
		this.targetCardinality = targetCardinality;
    }
    
    public check( graph: IGraph): string{
		
		//Checks whether the associations are the same.
		if( ! this.existsAssociation( graph.getAssociations() ) ) {
			return "The relationship '"+ this.sourceNodeName +" - "+ this.targetNodeName + "' not exists or the cardinalities are not the same.";
		}
        return '';
	}
	
	private existsAssociation( associations: IGraphAssociation[] ): boolean {
		for( let relation of associations as IGraphRelation[] ) {	
			if( (	relation.getSourceNode().getName() == this.sourceNodeName  &&
					relation.getSourceCardinality() == this.sourceCardinality &&
					relation.getTargetNode().getName() == this.targetNodeName &&
					relation.getTargetCardinality() == this.targetCardinality
				) ||
				(	relation.getSourceNode().getName() == this.targetNodeName &&
					relation.getSourceCardinality() == this.targetCardinality &&
					relation.getTargetNode().getName() == this.sourceNodeName &&
					relation.getTargetCardinality() == this.sourceCardinality
				)
			) {
				return true;
			}
		}
		return false;
	}
}