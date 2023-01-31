import { AssociationType } from '../../ontouml2db/constants/enumerations';
import { Node } from '../../ontouml2db/graph/Node';
export declare class GraphAssociation {
    private id;
    private name;
    private associationType;
    private resolved;
    private nodeNameRemoved;
    constructor(id: string, name: string, associationType: AssociationType);
    getAssociationID(): string;
    setName(name: string): void;
    getName(): string;
    isAssociationType(associationType: AssociationType): boolean;
    setResolved(flag: boolean): void;
    isResolved(): boolean;
    setNodeNameRemoved(nodeName: string): void;
    getNodeNameRemoved(): string;
    cloneChangingReferencesTo(nodes: Node[]): GraphAssociation;
    deleteAssociation(): void;
}
