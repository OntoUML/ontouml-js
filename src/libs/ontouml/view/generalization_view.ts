import { OntoumlType, ElementView, Path, Generalization } from '@libs/ontouml';

export class GeneralizationView extends ElementView<Generalization, Path> {
  constructor(base?: Partial<GeneralizationView>) {
    super(OntoumlType.GENERALIZATION_VIEW, base);
  }

  createShape(): Path {
    return new Path();
  }
}
