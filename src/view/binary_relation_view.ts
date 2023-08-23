import { OntoumlType, BinaryConnectorView, Relation, View } from '..';

export class BinaryRelationView extends BinaryConnectorView<Relation> {
  constructor(relation: Relation, source: View<any>, target: View<any>) {
    super(relation, source, target);
  }

  override toJSON(): any {
    const object: any = {
      type: OntoumlType.BINARY_RELATION_VIEW
    };

    return { ...object, ...super.toJSON() };
  }
}
