import { IElement } from '@types';
import { OntoUMLType, ClassStereotype, RelationStereotype } from '@constants/.';
import pluralize from 'pluralize';

export enum VerificationAlternativeCode {
  REPLACE_ONTOUML_CLASS_STEREOTYPE = 'REPLACE_ONTOUML_CLASS_STEREOTYPE',
  ONTOUML_CLASS_NAME_TO_PLURAL = 'ONTOUML_CLASS_NAME_TO_PLURAL',
}

export class VerificationAlternative {
  code: string;
  title: string;
  description: string;
  elements: string;

  constructor(code: string, source: IElement, context?: IElement[]) {
    this.code = code;

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
