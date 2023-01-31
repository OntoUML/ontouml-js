import { GraphRelation } from '../../ontouml2db/graph/GraphRelation';
import { GraphGeneralization } from '../../ontouml2db/graph/GraphGeneralization';
import { GraphAssociation } from '../../ontouml2db/graph/GraphAssociation';
import { GraphGeneralizationSet } from '../../ontouml2db/graph/GraphGeneralizationSet';
export interface AssociationContainerInterface {
    addRelation(relation: GraphRelation): void;
    getRelations(): GraphRelation[];
    getAssociationWithNode(nodeID: string): GraphAssociation;
    addGeneralization(generalization: GraphGeneralization): any;
    getGeneralizations(): GraphGeneralization[];
    getGeneralizationSets(): GraphGeneralizationSet[];
    deleteAssociation(association: GraphAssociation): void;
    isSpecialization(): boolean;
    hasSpecialization(): boolean;
    toString(): string;
}
