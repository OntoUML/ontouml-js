import {
  OntoumlType,
  BinaryConnectorView,
  Path,
  Generalization,
  View,
} from "..";

export class GeneralizationView extends BinaryConnectorView<Generalization> {
  constructor(
    generalization: Generalization,
    source: View<any>,
    target: View<any>,
  ) {
    super(generalization, source, target);
  }

  override toJSON(): any {
    const object: any = {
      type: OntoumlType.GENERALIZATION_VIEW,
    };

    return { ...object, ...super.toJSON() };
  }
}
