import { GeneralizationSet } from '../model/generalization_set';
import { OntoumlType } from '../ontouml_type';
import { ElementView } from './element_view';
import { Text } from './text';

export class GeneralizationSetView extends ElementView<GeneralizationSet, Text> {
  constructor(base?: Partial<GeneralizationSetView>) {
    super(OntoumlType.GENERALIZATION_SET_VIEW, base);
  }

  createShape(): Text {
    return new Text();
  }
}
