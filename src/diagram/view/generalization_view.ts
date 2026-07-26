import { OntoumlType, BinaryConnectorView, Generalization, View } from '../..';

/**
 * The view of a {@link Generalization} in a {@link Diagram}, rendered as a
 * {@link Path} between the views of the two classifiers it connects. When
 * created via {@link Diagram.addGeneralization}, the source view depicts the
 * general classifier and the target view depicts the specific classifier.
 */
export class GeneralizationView extends BinaryConnectorView<Generalization> {
  constructor(
    generalization: Generalization,
    source: View<any>,
    target: View<any>
  ) {
    super(generalization, source, target);
  }

  override toJSON(): any {
    return {
      type: OntoumlType.GENERALIZATION_VIEW,
      ...super.toJSON()
    };
  }
}
