import { ClassStereotype } from '@constants/';
import { RelationStereotype } from '@constants/';

export interface IDecoratable {
  stereotypes: null | string[];

  hasValidStereotype(): boolean;
  getUniqueStereotype(): ClassStereotype | RelationStereotype | PropertyStereotype;
}
