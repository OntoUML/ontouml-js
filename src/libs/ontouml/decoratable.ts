import { OntoumlStereotype, ClassStereotype, RelationStereotype, PropertyStereotype } from './';

export function hasValidStereotypeValue<T extends OntoumlStereotype>(
  decoratable: Decoratable<T>,
  validStereotypes: OntoumlStereotype[],
  allowsNoStereotype?: boolean
): boolean {
  try {
    const uniqueStereotype = decoratable.getUniqueStereotype();

    return validStereotypes.includes(uniqueStereotype) || (!uniqueStereotype && allowsNoStereotype);
  } catch (error) {
    return false;
  }
}

export function getUniqueStereotype<Stereotype extends ClassStereotype | RelationStereotype | PropertyStereotype>(
  decoratable: Decoratable<Stereotype>
): Stereotype {
  const nStereotypes = decoratable.stereotypes && decoratable.stereotypes.length;

  if (nStereotypes > 1) {
    throw new Error('Multiple stereotypes');
  }

  return decoratable.stereotypes && decoratable.stereotypes[0];
}

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
