import { ModelElement, OntoumlElement, Shape } from '../..';

export abstract class View<T extends ModelElement> extends OntoumlElement {
  readonly element: T;

  constructor(element: T) {
    super();

    this.element = element;
  }

  abstract get shapes(): Shape[];

  override getContents(): OntoumlElement[] {
    return this.shapes;
  }

  override resolveReferences(
    elementReferenceMap: Map<string, OntoumlElement>
  ): void {
    throw new Error('Method not implemented.');
  }

  override toJSON(): any {
    return {
      ...super.toJSON(),
      isViewOf: this.element.id
    };
  }
}
