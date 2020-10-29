import { OntoumlStereotype } from '@constants/.';
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

export function getUniqueStereotype<T extends OntoumlStereotype>(decoratable: Decoratable<T>): T {
  const nStereotypes = decoratable.stereotypes && decoratable.stereotypes.length;

  if (nStereotypes > 1) {
    throw new Error('Multiple stereotypes');
  }

  return decoratable.stereotypes && decoratable.stereotypes[0];
}

export default interface Decoratable<T extends OntoumlStereotype> {
  stereotypes: T[];

  hasValidStereotypeValue(): boolean;
  getUniqueStereotype(): T;
}
