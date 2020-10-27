import { OntoumlStereotype } from '@constants/.';

export function hasValidStereotype<T extends OntoumlStereotype>(
  decoratable: Decoratable<T>,
  validStereotypes: OntoumlStereotype[],
  allowsNoStereotype?: boolean
): boolean {
  const uniqueStereotype = getUniqueStereotype(decoratable);

  return validStereotypes.includes(uniqueStereotype) || (!uniqueStereotype && allowsNoStereotype);
}

export function getUniqueStereotype<T extends OntoumlStereotype>(decoratable: Decoratable<T>): T {
  const nStereotypes = decoratable.stereotypes && decoratable.stereotypes.length;

  if (nStereotypes > 1) {
    throw new Error('Multiple stereotypes');
  }

  return decoratable.stereotypes && decoratable.stereotypes[0];
}

export default interface Decoratable<T extends OntoumlStereotype> {
  stereotypes: null | T[];

  hasValidStereotype(): boolean;
  getUniqueStereotype(): T;
}
