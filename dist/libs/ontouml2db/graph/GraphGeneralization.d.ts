import { GraphAssociation } from '../../ontouml2db/graph/GraphAssociation';
import { Node } from '../../ontouml2db/graph/Node';
import { GraphGeneralizationSet } from '../../ontouml2db/graph/GraphGeneralizationSet';
export declare class GraphGeneralization extends GraphAssociation {
    private generalizationNode;
    private specializationNode;
    private belongToGS;
    constructor(id: string, generalizationNode: Node, specializationNode: Node);
    getGeneral(): Node;
    getSpecific(): Node;
    setBelongGeneralizationSet(gs: GraphGeneralizationSet): void;
    getBelongGeneralizationSet(): GraphGeneralizationSet;
    isBelongGeneralizationSet(): boolean;
    cloneChangingReferencesTo(nodes: Node[]): GraphGeneralization;
    deleteAssociation(): void;
    toString(): string;
}
