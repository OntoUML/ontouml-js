/**
 * Author: Gustavo Ludovico Guidoni
 */

import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { Graph } from '@libs/ontouml2db/graph/Graph';
import { GraphAssociation } from '@libs/ontouml2db/graph/GraphAssociation';
import { GraphRelation } from '@libs/ontouml2db/graph/GraphRelation';

export class RelationshipChecker {
  private sourceNodeName: string;
  private sourceCardinality: Cardinality;
  private targetNodeName: string;
  private targetCardinality: Cardinality;

  constructor(sourceNode: string, sourceCardinality: Cardinality, targetNode: string, targetCardinality: Cardinality) {
    this.sourceNodeName = sourceNode;
    this.sourceCardinality = sourceCardinality;
    this.targetNodeName = targetNode;
    this.targetCardinality = targetCardinality;
  }

  check(graph: Graph): string {
    //Checks whether the associations are the same.
    if (!this.existsAssociation(graph.getAssociations())) {
      return (
        "The relationship '" +
        this.sourceNodeName +
        ' - ' +
        this.targetNodeName +
        "' not exists or the cardinalities are not the same."
      );
    }
    return '';
  }

  existsAssociation(associations: GraphAssociation[]): boolean {
    for (let relation of associations as GraphRelation[]) {
      if (
        (relation.getSourceNode().getName() === this.sourceNodeName &&
          relation.getSourceCardinality() === this.sourceCardinality &&
          relation.getTargetNode().getName() === this.targetNodeName &&
          relation.getTargetCardinality() === this.targetCardinality) ||
        (relation.getSourceNode().getName() === this.targetNodeName &&
          relation.getSourceCardinality() === this.targetCardinality &&
          relation.getTargetNode().getName() === this.sourceNodeName &&
          relation.getTargetCardinality() === this.sourceCardinality)
      ) {
        return true;
      }
    }
    return false;
  }
}
