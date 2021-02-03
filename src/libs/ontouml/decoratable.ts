import { ClassStereotype, RelationStereotype, PropertyStereotype } from './';

export interface Decoratable<Stereotype extends ClassStereotype | RelationStereotype | PropertyStereotype> {
  stereotype: Stereotype;

  hasValidStereotypeValue(): boolean;
  hasStereotypeContainedIn(stereotypes: Stereotype): boolean;
}
