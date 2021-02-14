import { OntoumlElement } from '..';
import { OntoumlType } from '..';
import { RectangularShape } from '..';

export class Rectangle extends RectangularShape {
  constructor(base?: Partial<Rectangle>) {
    super(OntoumlType.RECTANGLE, base);
  }

  getContents(): OntoumlElement[] {
    return [];
  }
}
