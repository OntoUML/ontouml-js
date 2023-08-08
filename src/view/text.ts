import { OntoumlElement, OntoumlType, RectangularShape } from '..';

export class Text extends RectangularShape {
  value: string;

  constructor(base?: Partial<Text>) {
    super(OntoumlType.TEXT, base);

    this.value = base?.value || null;
  }

  getContents(): OntoumlElement[] {
    return [];
  }
}
