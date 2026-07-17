import { OntoumlType, BinaryConnectorView, Relation, View } from '../..';

export class BinaryRelationView extends BinaryConnectorView<Relation> {
  constructor(relation: Relation, source: View<any>, target: View<any>) {
    super(relation, source, target);
  }

  override toJSON(): any {
    return {
      type: OntoumlType.BINARY_RELATION_VIEW,
      ...super.toJSON()
    };
  }
}
