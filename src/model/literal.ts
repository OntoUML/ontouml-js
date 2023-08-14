import { OntoumlElement, ModelElement, OntoumlType } from '..';

export class Literal extends ModelElement {
  constructor(project) {
    super(OntoumlType.LITERAL, base);
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

  toJSON() {
    const object: any = {
      type: OntoumlType.LITERAL,
    };

    Object.assign(object, super.toJSON());

    return object;
  }
}
