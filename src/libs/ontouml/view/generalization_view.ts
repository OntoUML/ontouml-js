import { OntoumlType, ElementView, Path, Generalization } from '..';

export class GeneralizationView extends ElementView<Generalization, Path> {
  constructor(base?: Partial<GeneralizationView>) {
    super(OntoumlType.GENERALIZATION_VIEW, base);
  }

  createShape(): Path {
    return new Path();
  }
}
