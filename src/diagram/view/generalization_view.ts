import { OntoumlType, BinaryConnectorView, Generalization, View } from '../..';

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
