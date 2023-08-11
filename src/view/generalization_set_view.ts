import { GeneralizationSet, OntoumlType, View } from '..';
import { Text } from '../shape/text';

export class GeneralizationSetView extends View<GeneralizationSet> {
  text: Text;

  constructor(genSet: GeneralizationSet) {
    super(genSet);
    
    this.text = new Text();
    this.text.width = 100;
    this.text.height = 50;
  }

  override toJSON(): any {
    const object = {
      type: OntoumlType.GENERALIZATION_SET_VIEW,
      text: this.text.id
    };
    
    return { ...object, ...super.toJSON() };
  }

}
