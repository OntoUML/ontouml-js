import { IElement } from '@types';
import {
  VerificationAlternative,
  VerificationAlternativeCode,
} from './alternatives';
import pluralize from 'pluralize';

export enum IssueSeverity {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}

export enum VerificationIssueCode {
  CLASS_NOT_UNIQUE_STEREOTYPE = 'CLASS_NOT_UNIQUE_STEREOTYPE',
  CLASS_PLURAL_NAME = 'CLASS_PLURAL_NAME',
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
    this.source = source;
    this.context = context ? context : null;

    switch (code) {
      case VerificationIssueCode.CLASS_NOT_UNIQUE_STEREOTYPE:
        this.title = 'Not unique class stereotype.';
        this.description = `Class ${source.name} must have a unique OntoUML stereotype.`;
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
        this.description = `Class ${
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
      default:
        throw `Unimplemented verification issue code: ${code}.`;
    }
  }
}
