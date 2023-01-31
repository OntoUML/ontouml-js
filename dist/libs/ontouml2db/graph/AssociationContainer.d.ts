import { GraphRelation } from '../../ontouml2db/graph/GraphRelation';
import { GraphGeneralization } from '../../ontouml2db/graph/GraphGeneralization';
import { Node } from '../../ontouml2db/graph/Node';
import { GraphGeneralizationSet } from '../../ontouml2db/graph/GraphGeneralizationSet';
import { AssociationContainerInterface } from '../../ontouml2db/graph/AssociationContainerInterface';
import { GraphAssociation } from '../../ontouml2db/graph/GraphAssociation';
export declare class AssociationContainer implements AssociationContainerInterface {
    private parentNode;
    private relations;
    private generalizations;
    constructor(parentNode: Node);
    addRelation(relation: GraphRelation): void;
    getRelations(): GraphRelation[];
    getAssociationWithNode(nodeID: string): GraphAssociation;
    addGeneralization(generalization: GraphGeneralization): void;
    getGeneralizations(): GraphGeneralization[];
    getGeneralizationSets(): GraphGeneralizationSet[];
    deleteAssociation(association: GraphAssociation): void;
    isSpecialization(): boolean;
    hasSpecialization(): boolean;
    toString(): string;
}
