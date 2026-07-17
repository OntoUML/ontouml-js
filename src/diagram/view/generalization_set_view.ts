import {
  GeneralizationSet,
  GeneralizationView,
  OntoumlType,
  View,
  Text,
  Shape
} from '../..';

export class GeneralizationSetView extends View<GeneralizationSet> {
  text: Text;
  generalizations: GeneralizationView[] = [];

  constructor(genSet: GeneralizationSet) {
    super(genSet);

    this.text = new Text();
    this.text.width = 100;
    this.text.height = 50;
  }

  override get shapes(): Shape[] {
    return [this.text];
  }

  override toJSON(): any {
    return {
      type: OntoumlType.GENERALIZATION_SET_VIEW,
      ...super.toJSON(),
      generalizations: this.generalizations.map(view => view.id),
      text: this.text.id
    };
  }
}
