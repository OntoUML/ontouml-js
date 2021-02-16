import { GeneralizationSet, OntoumlType, ElementView, Text } from '..';

export class GeneralizationSetView extends ElementView<GeneralizationSet, Text> {
  constructor(base?: Partial<GeneralizationSetView>) {
    super(OntoumlType.GENERALIZATION_SET_VIEW, base);
  }

  createShape(): Text {
    return new Text();
  }
}
