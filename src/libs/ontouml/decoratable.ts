import { ClassStereotype, RelationStereotype, PropertyStereotype } from './';

function hasValidStereotypeValue<T extends ClassStereotype | RelationStereotype | PropertyStereotype>(
  decoratable: Decoratable<T>,
  validStereotypes: T[],
  allowsNoStereotype: boolean = false
): boolean {
  try {
    const uniqueStereotype = decoratable.stereotype;

    return validStereotypes.includes(uniqueStereotype) || (!uniqueStereotype && allowsNoStereotype);
  } catch (error) {
    return false;
  }
}

/** Checks if `this.stereotype` is contained in the set of values in `stereotypes`.
 *
 * @throws error when the class has multiple stereotypes
 * */
function hasStereotypeContainedIn<Stereotype extends ClassStereotype | RelationStereotype | PropertyStereotype>(
  decoratable: Decoratable<Stereotype>,
  stereotypes: Stereotype | Stereotype[]
): boolean {
  const decoratableStereotype: Stereotype = decoratable.stereotype;

  if (Array.isArray(stereotypes)) {
    return stereotypes.includes(decoratableStereotype);
  } else {
    return decoratableStereotype === stereotypes;
  }
}

export const decoratableUtils = {
  hasValidStereotypeValue,
  hasStereotypeContainedIn
};

export interface Decoratable<Stereotype extends ClassStereotype | RelationStereotype | PropertyStereotype> {
  stereotype: Stereotype;

  hasValidStereotypeValue(): boolean;
  hasStereotypeContainedIn(stereotypes: Stereotype): boolean;
}
