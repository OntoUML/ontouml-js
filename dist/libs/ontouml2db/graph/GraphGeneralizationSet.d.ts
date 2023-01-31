import { GraphAssociation } from '../../ontouml2db/graph/GraphAssociation';
import { Node } from '../../ontouml2db/graph/Node';
export declare class GraphGeneralizationSet extends GraphAssociation {
    private generalizationNode;
    private specializationNodes;
    private disjoint;
    private complete;
    constructor(id: string, name: string, disjoint: boolean, complete: boolean);
    setGeneral(generalizationNode: Node): void;
    getGeneral(): Node;
    addSpecific(specialization: Node): void;
    getSpecific(): Node[];
    isDisjoint(): boolean;
    isComplete(): boolean;
    cloneChangingReferencesTo(nodes: Node[]): GraphGeneralizationSet;
    private getGeneralization;
    toString(): string;
}
