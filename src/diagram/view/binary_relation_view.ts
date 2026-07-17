import { OntoumlType, BinaryConnectorView, Relation, View } from '../..';

/**
 * The view of a binary {@link Relation} in a {@link Diagram}, rendered as a
 * {@link Path} between the views of the relation's source and target
 * classifiers.
 */
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
