import { OntoumlElement } from '..';
import { OntoumlType } from '..';
import { RectangularShape } from '..';

export class Text extends RectangularShape {
  constructor(base?: Partial<Text>) {
    super(OntoumlType.TEXT, base);
  }

  getContents(): OntoumlElement[] {
    return [];
  }
}
