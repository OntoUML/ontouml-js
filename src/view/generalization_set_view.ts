import { GeneralizationSet, OntoumlElement, OntoumlType, View, Text } from '..';

export class GeneralizationSetView extends View<GeneralizationSet> {
  text: Text;

  constructor(genSet: GeneralizationSet) {
    super(genSet);

    this.text = new Text();
    this.text.width = 100;
    this.text.height = 50;
  }

  override getContents(): OntoumlElement[] {
    return [this.text];
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.GENERALIZATION_SET_VIEW,
      text: this.text.id
    };

    return { ...object, ...super.toJSON() };
  }
}
