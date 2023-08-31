import { OntoumlElement, OntoumlType, Class, ModelElement } from '..';

export class Literal extends ModelElement {
  constructor(container: Class) {
    super(container.project!, container);
  }

  public override get container(): Class {
    return this._container as Class;
  }

  public override set container(newContainer: Class) {
    super._container = newContainer;
  }

  getContents(): OntoumlElement[] {
    return [];
  }

  clone(): Literal {
    return { ...this };
  }

  //TODO: DOUBLE CHECK this method
  replace(originalElement: ModelElement, newElement: ModelElement): void {
    if (this.container === originalElement) {
      this.container = newElement as Class;
    }
  }

  override toJSON() {
    return { type: OntoumlType.LITERAL, ...super.toJSON() };
  }
}
