import { OntoumlElement, OntoumlType, RectangularShape } from '..';

export class Rectangle extends RectangularShape {
  constructor(base?: Partial<Rectangle>) {
    super(OntoumlType.RECTANGLE, base);
  }

  getContents(): OntoumlElement[] {
    return [];
  }
}
