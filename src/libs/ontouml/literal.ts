import { Class, ModelElement, containerUtils, OntoumlType } from './';

export class Literal extends ModelElement {
  constructor(base?: Partial<Literal>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.LITERAL_TYPE, enumerable: true });
  }

  setContainer(newContainer: Class): void {
    containerUtils.setContainer(this, newContainer, 'literals', true);
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
