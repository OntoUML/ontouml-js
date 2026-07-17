import { Classifier, Package, Project, Stereotype, ModelElement } from '..';

/**
 * The abstract base class of model elements that can be decorated with an
 * OntoUML stereotype, namely classes, relations, and properties. The type
 * parameter `S` determines which family of stereotypes applies (e.g.,
 * {@link ClassStereotype} for classes).
 */
export abstract class Decoratable<S extends Stereotype> extends ModelElement {
  /** The stereotype applied to this element, if any. */
  stereotype?: S;

  /**
   * Indicates whether this element is derived, i.e., whether its instances
   * (or values) can be computed from other elements of the model.
   */
  isDerived: boolean = false;

  constructor(project: Project) {
    super(project);
  }

  /**
   * Lists the stereotypes that OntoUML allows to be applied to this element.
   */
  abstract getAllowedStereotypes(): S[];

  /**
   * Checks whether this element is decorated with a stereotype that OntoUML
   * allows for it.
   *
   * @param allowsNone - whether the absence of a stereotype is also
   *        considered valid.
   */
  hasValidStereotype(allowsNone: boolean = false): boolean {
    return (!this.hasStereotype() && allowsNone) || this.hasAllowedStereotype();
  }

  /** Checks whether this element is decorated with any stereotype. */
  hasStereotype(): boolean {
    return !!this.stereotype;
  }

  /**
   * Checks whether this element is decorated with a stereotype that OntoUML
   * allows for it.
   *
   * @returns `true` if {@link stereotype} is one of the values returned by
   *          {@link getAllowedStereotypes}; `false` when the element has no
   *          stereotype.
   */
  hasAllowedStereotype(): boolean {
    return (
      this.hasStereotype() &&
      this.getAllowedStereotypes().includes(this.stereotype!)
    );
  }

  /**
   * Checks whether this element's stereotype matches the given stereotype or
   * is contained in the given array of stereotypes.
   *
   * @throws an error if the element has no stereotype.
   */
  isStereotypeOneOf(stereotypes: S | readonly S[]): boolean {
    if (!this.stereotype) {
      throw Error('The decoratable does not have a stereotype.');
    }

    return Array.isArray(stereotypes)
      ? stereotypes.includes(this.stereotype)
      : this.stereotype === stereotypes;
  }

  override toJSON(): any {
    const object = {
      stereotype: this.stereotype || null,
      isDerived: this.isDerived
    };

    return { ...super.toJSON(), ...object };
  }
}
