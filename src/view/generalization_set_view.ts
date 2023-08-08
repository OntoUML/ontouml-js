import { GeneralizationSet, OntoumlType, ElementView, Text } from '..';

export class GeneralizationSetView extends ElementView<GeneralizationSet, Text> {
  constructor(base?: Partial<GeneralizationSetView>) {
    super(OntoumlType.GENERALIZATION_SET_VIEW, base);
  }

  createShape(): Text {
    const text = new Text();
    text.width = 100;
    text.height = 50;
    return text;
  }
}
