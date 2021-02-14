import { OntoumlElement } from '../ontouml_element';
import { OntoumlType } from '../ontouml_type';
import { ModelElement } from './model_element';

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
