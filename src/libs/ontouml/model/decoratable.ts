import { ClassStereotype, PropertyStereotype, RelationStereotype } from './constants';
import { ModelElement } from './model_element';

export abstract class Decoratable<S extends ClassStereotype | RelationStereotype | PropertyStereotype> extends ModelElement {
  stereotype: S;

  constructor(type: string, base: Partial<Decoratable<S>>) {
    super(type, base);

    this.stereotype = this.stereotype || null;
  }

  abstract getAllowedStereotypes(): S[];

  isStereotypeValid(allowsNone: boolean = false): boolean {
    return this.getAllowedStereotypes().includes(this.stereotype) || (!this.stereotype && allowsNone);
  }

  /** Checks if `this.stereotype` is contained in the set of values in `stereotypes`.
   *
   * @throws error when the class has multiple stereotypes
   * */
  hasAnyStereotype(stereotypes: S | S[]): boolean {
    return Array.isArray(stereotypes) ? stereotypes.includes(this.stereotype) : this.stereotype === stereotypes;
  }
}