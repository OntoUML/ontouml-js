import { OntoumlElement } from '../ontouml_element';
import { OntoumlType } from '../ontouml_type';
import { RectangularShape } from './rectangular_shape';

export class Rectangle extends RectangularShape {
  constructor(base?: Partial<Rectangle>) {
    super(OntoumlType.RECTANGLE, base);
  }

  getContents(): OntoumlElement[] {
    return [];
  }
}
