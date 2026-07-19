import { OntoumlType, Class, ModelElement } from '..';

/**
 * A value of an enumeration, i.e., one of the named values admitted by a
 * {@link Class} decorated with «enumeration». For example, an enumeration
 * `Color` may define the literals `red`, `green`, and `blue`.
 */
export class Literal extends ModelElement {
  constructor(container: Class) {
    super(container.project!);
    container.addLiteral(this);
  }

  /** The enumeration class that contains this literal. */
  public override get container(): Class {
    return this._container as Class;
  }

  /** Detaches this literal from the enumeration class that contains it. */
  protected override detach(): void {
    if (this._container instanceof Class) {
      this._container.deleteLiteral(this);
    }

    this._container = undefined;
  }

  override toJSON() {
    return { type: OntoumlType.LITERAL, ...super.toJSON() };
  }
}
