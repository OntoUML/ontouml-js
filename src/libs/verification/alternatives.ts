import { IElement } from '@types';
import { OntoUMLType, ClassStereotype, RelationStereotype } from '@constants/.';
import pluralize from 'pluralize';

export enum VerificationAlternativeCode {
  REPLACE_ONTOUML_CLASS_STEREOTYPE = 'REPLACE_ONTOUML_CLASS_STEREOTYPE',
  ONTOUML_CLASS_NAME_TO_PLURAL = 'ONTOUML_CLASS_NAME_TO_PLURAL',
  REMOVE_LITERALS = 'REMOVE_LITERALS',
  REPLACE_ONTOUML_CLASS_STEREOTYPE_TO_ENUMERATION = 'REPLACE_ONTOUML_CLASS_STEREOTYPE_TO_ENUMERATION',
  REMOVE_PROPERTIES = 'REMOVE_PROPERTIES',
}

/**
 * Utility class for alternatives for the resolution of verification issues
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class VerificationAlternative {
  code: string;
  title: string;
  description: string;
  elements: string;

  constructor(code: string, source: IElement, context?: IElement[]) {
    this.code = code;
    this.title = null;
    this.description = null;
    this.elements = null;

    switch (code) {
      case VerificationAlternativeCode.REPLACE_ONTOUML_CLASS_STEREOTYPE:
        this.title = "Replace element's stereotypes.";
        this.description = `Apply to ${source.name ||
          source.id} a unique stereotype from the set {${getElementStereotypes(
          source,
        ).join(', ')}}.`;
        this.elements = null;
        break;
      case VerificationAlternativeCode.ONTOUML_CLASS_NAME_TO_PLURAL:
        this.title = 'Change name to singular form.';
        this.description = `Change name from ${
          source.name
        } to ${pluralize.singular(source.name)}.`;
        this.elements = null;
        break;
      case VerificationAlternativeCode.REMOVE_LITERALS:
        this.title = 'Remove literals.';
        this.description = `Remove class literals.`;
        this.elements = null;
        break;
      case VerificationAlternativeCode.REMOVE_PROPERTIES:
        this.title = 'Remove properties.';
        this.description = `Remove class properties.`;
        this.elements = null;
        break;
      case VerificationAlternativeCode.REPLACE_ONTOUML_CLASS_STEREOTYPE_TO_ENUMERATION:
        this.title = 'Change stereotype to «enumeration».';
        this.description = `Change stereotype to «enumeration».`;
        this.elements = null;
        break;
      default:
        throw `Unimplemented verification alternative code: ${code}.`;
    }
  }
}

function getElementStereotypes(element: IElement): string[] {
  switch (element.type) {
    case OntoUMLType.CLASS_TYPE:
      return Object.values(ClassStereotype);
    case OntoUMLType.RELATION_TYPE:
      return Object.values(RelationStereotype);
  }
  return null;
}
