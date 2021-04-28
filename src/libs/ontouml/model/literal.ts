import { OntoumlElement, ModelElement, OntoumlType } from '..';

export class Literal extends ModelElement {
  constructor(base?: Partial<Literal>) {
    super(OntoumlType.LITERAL_TYPE, base);
  }

  getContents(): OntoumlElement[] {
    return [];
  }

  clone(): Literal {
    return new Literal(this);
  }

  replace(originalElement: ModelElement, newElement: ModelElement): void {
    if (this.container === originalElement) {
      this.container = newElement;
    }
  }
}
