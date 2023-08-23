import { OntoumlElement, OntoumlType, Class } from '..';
import { ModelElement } from './model_element';

export class Literal extends ModelElement {
  constructor(container: Class) {
    super(container.project!, container);
  }

  public override get container(): Class {
    return this.container as Class;
  }

  public override set container(newContainer: Class) {
    super.container = newContainer;
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
    const object: any = {
      type: OntoumlType.LITERAL
    };

    return { ...object, ...super.toJSON() };
  }
}
