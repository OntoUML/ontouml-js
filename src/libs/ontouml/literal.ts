import { Class, ModelElement, setContainer, OntoumlType } from './';

export class Literal extends ModelElement {
  constructor(base?: Partial<Literal>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.LITERAL_TYPE, enumerable: true });
  }

  setContainer(container: Class): void {
    setContainer(this, container);
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
