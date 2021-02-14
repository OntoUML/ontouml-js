import { OntoumlElement } from '../ontouml_element';
import { OntoumlType } from '../ontouml_type';
import { RectangularShape } from './rectangular_shape';

export class Text extends RectangularShape {
  constructor(base?: Partial<Text>) {
    super(OntoumlType.TEXT, base);
  }

  getContents(): OntoumlElement[] {
    return [];
  }
}
