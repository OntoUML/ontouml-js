import { OntoumlType, ConnectorView, Relation, OntoumlElement } from '..';

//TODO: This only works for binary relations. We still need to create a view for n-ary relations.
export class RelationView extends ConnectorView<Relation> {
  constructor(base?: Partial<RelationView>) {
    super(OntoumlType.RELATION_VIEW, base);
  }

  getContents(): OntoumlElement[] {
    return super.getContents();
  }
}
