import { ClassStereotype, RelationStereotype, PropertyStereotype } from '@constants/.';

export default interface Decoratable {
  stereotypes: null | string[];

  hasValidStereotype(): boolean;
  getUniqueStereotype(): ClassStereotype | RelationStereotype | PropertyStereotype;
}
