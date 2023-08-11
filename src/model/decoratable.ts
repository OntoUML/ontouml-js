import { ModelElement, OntoumlType, Stereotype } from '..';

export abstract class Decoratable<S extends Stereotype> extends ModelElement {
  stereotype?: S;
  isDerived: boolean;

  constructor(type: OntoumlType, base?: Partial<Decoratable<S>>) {
    super(type, base);

    this.stereotype = base?.stereotype;
    this.isDerived = false;
  }

  abstract getAllowedStereotypes(): S[];

  isStereotypeValid(allowsNone: boolean = false): boolean {
    return (!this.hasStereotype() && allowsNone) || this.stereotypeIsAllowed();
  }

  hasStereotype(): boolean {
    return !!this.stereotype;
  }

  stereotypeIsAllowed(): boolean {
    return this.hasStereotype() && this.getAllowedStereotypes().includes(this.stereotype!);
  }

  /** Checks if `this.stereotype` is contained in the set of values in `stereotypes`.
   *
   * @throws error when the class has multiple stereotypes
   * */
  stereotypeIsOneOf(stereotypes: S | S[]): boolean {
    if(!this.stereotype){
      return false;
    }

    return Array.isArray(stereotypes) ? stereotypes.includes(this.stereotype) : this.stereotype === stereotypes;
  }
}
