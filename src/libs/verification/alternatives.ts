import { IElement } from '@types';
import { OntoUMLType, ClassStereotype, RelationStereotype } from '@constants/.';
import pluralize from 'pluralize';

export enum VerificationAlternativeCode {
  replace_ontouml_class_stereotype = 'replace_ontouml_class_stereotype',
  ontouml_class_name_to_plural = 'ontouml_class_name_to_plural',
  remove_literals = 'remove_literals',
  replace_ontouml_class_stereotype_to_enumeration = 'replace_ontouml_class_stereotype_to_enumeration',
  remove_properties = 'remove_properties',
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

  constructor(code: string, source: IElement) {
    // add context?: IElement[] to params when necessary
    this.code = code;
    this.title = null;
    this.description = null;
    this.elements = null;

    switch (code) {
      case VerificationAlternativeCode.replace_ontouml_class_stereotype:
        this.title = "Replace element's stereotypes.";
        this.description = `Apply to ${source.name ||
          source.id} a unique stereotype from the set {${getElementStereotypes(
          source,
        ).join(', ')}}.`;
        this.elements = null;
        break;
      case VerificationAlternativeCode.ontouml_class_name_to_plural:
        this.title = 'Change name to singular form.';
        this.description = `Change name from ${
          source.name
        } to ${pluralize.singular(source.name)}.`;
        this.elements = null;
        break;
      case VerificationAlternativeCode.remove_literals:
        this.title = 'Remove literals.';
        this.description = `Remove class literals.`;
        this.elements = null;
        break;
      case VerificationAlternativeCode.remove_properties:
        this.title = 'Remove properties.';
        this.description = `Remove class properties.`;
        this.elements = null;
        break;
      case VerificationAlternativeCode.replace_ontouml_class_stereotype_to_enumeration:
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
