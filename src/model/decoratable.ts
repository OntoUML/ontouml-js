import { Class, ModelElement, OntoumlType, Package, Project, Stereotype } from '..';

export abstract class Decoratable<S extends Stereotype> extends ModelElement {
  stereotype?: S;
  isDerived: boolean;

  constructor(project: Project, container?: Package | Class) {
    super(project, container);
    this.isDerived = false;
  }

  /**
   * 
   * @returns a list of stereotypes that could be applied to the decoratable. 
   */
  abstract getAllowedStereotypes(): S[];

  /**
   * 
   * @returns true if (i) the decoratable has a stereotype that is defined in OntoUML, or (ii) the decoratable has no stereotype and ${@param allowsNone} is true. 
   */
  hasValidStereotype(allowsNone: boolean = false): boolean {
    return (!this.hasStereotype() && allowsNone) || this.hasAllowedStereotype();
  }


  /**
   * 
   * @returns true if the decoratable has any stereotype. 
   */
  hasStereotype(): boolean {
    return !!this.stereotype;
  }

  /**
   * 
   * @returns true if the decoratable has a stereotype that is defined in OntoUML. Returns false if the decoratable has no stereotype. 
   */
  hasAllowedStereotype(): boolean {
    return this.hasStereotype() && this.getAllowedStereotypes().includes(this.stereotype!);
  }

  /** 
   * @returns true if ${@field stereotype} is contained in ${@param stereotypes}.
   * @throws an error if the class has no stereotype
   * */
  isStereotypeOneOf(stereotypes: S | S[]): boolean {
    if(!this.stereotype){
      throw Error("The decoratable does not have a stereotype. ");
    }

    return Array.isArray(stereotypes) ? stereotypes.includes(this.stereotype) : this.stereotype === stereotypes;
  }

  override toJSON(): any {
    const object = {
      stereotype: this.stereotype || null,
      isDerived: this.isDerived
    };

    return { ...object, ...super.toJSON() };
  }
}
