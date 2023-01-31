import { ConnectorView, Relation, OntoumlElement } from '..';
export declare class RelationView extends ConnectorView<Relation> {
    constructor(base?: Partial<RelationView>);
    getContents(): OntoumlElement[];
}
