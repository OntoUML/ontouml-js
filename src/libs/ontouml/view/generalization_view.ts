import { OntoumlType, ConnectorView, Path, Generalization } from '..';

export class GeneralizationView extends ConnectorView<Generalization> {
  constructor(base?: Partial<GeneralizationView>) {
    super(OntoumlType.GENERALIZATION_VIEW, base);
  }

  createShape(): Path {
    return new Path();
  }
}
