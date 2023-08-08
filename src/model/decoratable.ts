import { ModelElement, OntoumlType, Stereotype } from '..';

export abstract class Decoratable<S extends Stereotype> extends ModelElement {
  stereotype?: S;

  constructor(type: OntoumlType, base?: Partial<Decoratable<S>>) {
    super(type, base);

    this.stereotype = base?.stereotype;
  }

  abstract getAllowedStereotypes(): S[];

  isStereotypeValid(allowsNone: boolean = false): boolean {
    return (!this.hasStereotype() && allowsNone) || this.hasAllowedStereotype();
  }

  hasStereotype(): boolean {
    return !!this.stereotype;
  }

  hasAllowedStereotype(): boolean {
    return !!this.stereotype && this.getAllowedStereotypes().includes(this.stereotype);
  }

  /** Checks if `this.stereotype` is contained in the set of values in `stereotypes`.
   *
   * @throws error when the class has multiple stereotypes
   * */
  hasAnyStereotype(stereotypes: S | S[]): boolean {
    if(!this.stereotype){
      return false;
    }

    return Array.isArray(stereotypes) ? stereotypes.includes(this.stereotype) : this.stereotype === stereotypes;
  }
}
