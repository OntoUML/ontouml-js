import { OntoumlElement, OntoumlType, Class, ModelElement } from '..';

export class Literal extends ModelElement {
  constructor(container: Class) {
    super(container.project!);
    container.addLiteral(this);
  }

  public override get container(): Class {
    return this._container as Class;
  }

  override toJSON() {
    return { type: OntoumlType.LITERAL, ...super.toJSON() };
  }
}
