import { IElement } from '@types';
import {
  VerificationAlternative,
  VerificationAlternativeCode,
} from './alternatives';
import pluralize from 'pluralize';
import { ClassStereotype } from '@constants/.';

export enum IssueSeverity {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}

export enum VerificationIssueCode {
  CLASS_NOT_UNIQUE_STEREOTYPE = 'CLASS_NOT_UNIQUE_STEREOTYPE',
  CLASS_PLURAL_NAME = 'CLASS_PLURAL_NAME',
  CLASS_INVALID_ONTOUML_STEREOTYPE = 'CLASS_INVALID_ONTOUML_STEREOTYPE',
  CLASS_NON_ENUMERATION_WITH_LITERALS = 'CLASS_NON_ENUMERATION_WITH_LITERALS',
  CLASS_ENUMERATION_WITH_PROPERTIES = 'CLASS_ENUMERATION_WITH_PROPERTIES',
}

export class VerificationIssue {
  code: VerificationIssueCode;
  title: string;
  description: string;
  source: IElement;
  context: IElement[] | null;
  severity: IssueSeverity;
  alternatives: VerificationAlternative[] | null;

  constructor(
    code: VerificationIssueCode,
    source: IElement,
    context?: IElement[],
  ) {
    this.code = code;
    this.title = null;
    this.description = null;
    this.source = source;
    this.context = context ? context : null;
    this.severity = null;
    this.alternatives = null;

    switch (code) {
      case VerificationIssueCode.CLASS_NOT_UNIQUE_STEREOTYPE:
        this.title = 'Not unique class stereotype.';
        this.description = `The class ${source.name} must have a unique OntoUML stereotype.`;
        this.severity = IssueSeverity.ERROR;
        this.alternatives = [
          new VerificationAlternative(
            VerificationAlternativeCode.REPLACE_ONTOUML_CLASS_STEREOTYPE,
            source,
          ),
        ];
        break;
      case VerificationIssueCode.CLASS_INVALID_ONTOUML_STEREOTYPE:
        this.title = 'No valid OntoUML stereotype.';
        this.description = `The class ${source.name} must have a unique OntoUML stereotype.`;
        this.severity = IssueSeverity.ERROR;
        this.alternatives = [
          new VerificationAlternative(
            VerificationAlternativeCode.REPLACE_ONTOUML_CLASS_STEREOTYPE,
            source,
          ),
        ];
        break;
      case VerificationIssueCode.CLASS_PLURAL_NAME:
        this.title = 'Classes should not have plural names.';
        this.description = `The class ${
          source.name
        } should have its name in the singular form (${pluralize.singular(
          source.name,
        )}).`;
        this.severity = IssueSeverity.WARNING;
        this.alternatives = [
          new VerificationAlternative(
            VerificationAlternativeCode.ONTOUML_CLASS_NAME_TO_PLURAL,
            source,
          ),
        ];
        break;
      case VerificationIssueCode.CLASS_NON_ENUMERATION_WITH_LITERALS:
        this.title = 'Only enumerations may have literals.';
        this.description = `The class ${source.name} is not decorated as «${ClassStereotype.ENUMERATION}» and thus cannot have literals.`;
        this.severity = IssueSeverity.ERROR;
        this.alternatives = [
          new VerificationAlternative(
            VerificationAlternativeCode.REPLACE_ONTOUML_CLASS_STEREOTYPE,
            source,
          ),
          new VerificationAlternative(
            VerificationAlternativeCode.REMOVE_LITERALS,
            source,
          ),
        ];
        break;
      case VerificationIssueCode.CLASS_ENUMERATION_WITH_PROPERTIES:
        this.title = 'Enumerations may not have attributes.';
        this.description = `The class ${source.name} decorated as «${ClassStereotype.ENUMERATION}» cannot have attributes.`;
        this.severity = IssueSeverity.ERROR;
        this.alternatives = [
          new VerificationAlternative(
            VerificationAlternativeCode.REPLACE_ONTOUML_CLASS_STEREOTYPE_TO_ENUMERATION,
            source,
          ),
          new VerificationAlternative(
            VerificationAlternativeCode.REMOVE_PROPERTIES,
            source,
          ),
        ];
        break;
      default:
        throw `Unimplemented verification issue code: ${code}.`;
    }
  }
}
