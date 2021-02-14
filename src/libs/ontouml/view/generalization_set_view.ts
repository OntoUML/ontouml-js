import { GeneralizationSet } from '..';
import { OntoumlType } from '..';
import { ElementView } from '..';
import { Text } from '..';

export class GeneralizationSetView extends ElementView<GeneralizationSet, Text> {
  constructor(base?: Partial<GeneralizationSetView>) {
    super(OntoumlType.GENERALIZATION_SET_VIEW, base);
  }

  createShape(): Text {
    return new Text();
  }
}
