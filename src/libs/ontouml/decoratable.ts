import { OntoumlStereotype, ClassStereotype, RelationStereotype, PropertyStereotype } from './';

export function hasValidStereotypeValue<T extends OntoumlStereotype>(
  decoratable: Decoratable<T>,
  validStereotypes: OntoumlStereotype[],
  allowsNoStereotype: boolean = false
): boolean {
  try {
    const uniqueStereotype = decoratable.getUniqueStereotype();

    return validStereotypes.includes(uniqueStereotype) || (!uniqueStereotype && allowsNoStereotype);
  } catch (error) {
    return false;
  }
}

/** Returns `this.stereotypes[0]` or throws an exception if multiple
 * stereotypes are defined.
 *
 * @throws error when the class has multiple stereotypes */
export function getUniqueStereotype<Stereotype extends ClassStereotype | RelationStereotype | PropertyStereotype>(
  decoratable: Decoratable<Stereotype>
): Stereotype {
  const nStereotypes = decoratable.stereotypes && decoratable.stereotypes.length;

  if (nStereotypes > 1) {
    throw new Error('Multiple stereotypes');
  }

  return decoratable.stereotypes && decoratable.stereotypes[0];
}

/** Checks if the return of `this.getUniqueStereotype()` is contained in the
 * set of values in `stereotypes`.
 *
 * @throws error when the class has multiple stereotypes
 * */
export function hasStereotypeContainedIn<Stereotype extends ClassStereotype | RelationStereotype | PropertyStereotype>(
  decoratable: Decoratable<Stereotype>,
  stereotypes: Stereotype | Stereotype[]
): boolean {
  const decoratableStereotype: Stereotype = decoratable.getUniqueStereotype();

  if (Array.isArray(stereotypes)) {
    return stereotypes.includes(decoratableStereotype);
  } else {
    return decoratableStereotype === stereotypes;
  }
}

export interface Decoratable<Stereotype extends ClassStereotype | RelationStereotype | PropertyStereotype> {
  stereotypes: Stereotype[];

  hasValidStereotypeValue(): boolean;
  hasStereotypeContainedIn(stereotypes: Stereotype | Stereotype[]): boolean;
  getUniqueStereotype(): Stereotype;
}
