import { IElement, IReference } from '@types';
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
  CLASS_MISSING_ALLOWED_NATURES = 'CLASS_MISSING_ALLOWED_NATURES',
  CLASS_MISSING_IS_EXTENSIONAL = 'CLASS_MISSING_IS_EXTENSIONAL',
  CLASS_MISSING_IS_POWERTYPE = 'CLASS_MISSING_IS_POWERTYPE',
  CLASS_MISSING_ORDER = 'CLASS_MISSING_ORDER',
  CLASS_MISSING_IDENTITY_PROVIDER = 'CLASS_MISSING_IDENTITY_PROVIDER',
  CLASS_IDENTITY_PROVIDER_SPECIALIZATION = 'CLASS_IDENTITY_PROVIDER_SPECIALIZATION',
  CLASS_MISSING_IS_READ_ONLY = 'CLASS_MISSING_IS_READ_ONLY',
  GENERALIZATION_INCONSISTENT_SPECIALIZATION = 'GENERALIZATION_INCONSISTENT_SPECIALIZATION',
  GENERALIZATION_INCOMPATIBLE_NATURES = 'GENERALIZATION_INCOMPATIBLE_NATURES',
  GENERALIZATION_INCOMPATIBLE_ENUMERATION = 'GENERALIZATION_INCOMPATIBLE_ENUMERATION',
  GENERALIZATION_INCOMPATIBLE_DATATYPE = 'GENERALIZATION_INCOMPATIBLE_DATATYPE',
  CLASS_MULTIPLE_IDENTITY_PROVIDER = 'CLASS_MULTIPLE_IDENTITY_PROVIDER',
  GENERALIZATION_INCOMPATIBLE_CLASS_RIGIDITY = 'GENERALIZATION_INCOMPATIBLE_CLASS_RIGIDITY',
  GENERALIZATION_INCOMPATIBLE_CLASS_SORTALITY = 'GENERALIZATION_INCOMPATIBLE_CLASS_SORTALITY',
  GENERALIZATION_INCOMPATIBLE_RELATION_TYPE = 'GENERALIZATION_INCOMPATIBLE_RELATION_TYPE',
  RELATION_MULTIPLE_STEREOTYPES = 'RELATION_MULTIPLE_STEREOTYPES',
  RELATION_IMPROPER_DERIVATION = 'RELATION_IMPROPER_DERIVATION',
}

/**
 * Utility class for verification issues
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class VerificationIssue {
  code: VerificationIssueCode;
  title: string;
  description: string;
  source: IElement | IReference;
  context: IElement[] | IReference[] | null;
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
    this.source = {
      type: source.type,
      id: source.id,
    };
    this.context = context
      ? context.map((element: IElement) => {
          return { type: element.type, id: element.id };
        })
      : null;
    this.severity = null;
    this.alternatives = null;

    // TODO: enable alternatives again later
    switch (code) {
      case VerificationIssueCode.CLASS_NOT_UNIQUE_STEREOTYPE:
        this.title = 'Not unique class stereotype.';
        this.description = `The class ${source.name} must have a unique OntoUML stereotype.`;
        this.severity = IssueSeverity.ERROR;
        // this.alternatives = [
        //   new VerificationAlternative(
        //     VerificationAlternativeCode.REPLACE_ONTOUML_CLASS_STEREOTYPE,
        //     source,
        //   ),
        // ];
        break;
      case VerificationIssueCode.CLASS_INVALID_ONTOUML_STEREOTYPE:
        this.title = 'No valid OntoUML stereotype.';
        this.description = `The class ${source.name} must have a unique OntoUML stereotype.`;
        this.severity = IssueSeverity.ERROR;
        // this.alternatives = [
        //   new VerificationAlternative(
        //     VerificationAlternativeCode.REPLACE_ONTOUML_CLASS_STEREOTYPE,
        //     source,
        //   ),
        // ];
        break;
      case VerificationIssueCode.CLASS_PLURAL_NAME:
        this.title = 'Classes should not have plural names.';
        this.description = `The class ${
          source.name
        } should have its name in the singular form (${pluralize.singular(
          source.name,
        )}).`;
        this.severity = IssueSeverity.WARNING;
        // this.alternatives = [
        //   new VerificationAlternative(
        //     VerificationAlternativeCode.ONTOUML_CLASS_NAME_TO_PLURAL,
        //     source,
        //   ),
        // ];
        break;
      case VerificationIssueCode.CLASS_NON_ENUMERATION_WITH_LITERALS:
        this.title = 'Only enumerations may have literals.';
        this.description = `The class ${source.name} is not decorated as «${ClassStereotype.ENUMERATION}» and thus cannot have literals.`;
        this.severity = IssueSeverity.ERROR;
        // this.alternatives = [
        //   new VerificationAlternative(
        //     VerificationAlternativeCode.REPLACE_ONTOUML_CLASS_STEREOTYPE,
        //     source,
        //   ),
        //   new VerificationAlternative(
        //     VerificationAlternativeCode.REMOVE_LITERALS,
        //     source,
        //   ),
        // ];
        break;
      case VerificationIssueCode.CLASS_ENUMERATION_WITH_PROPERTIES:
        this.title = 'Enumerations may not have attributes.';
        this.description = `The class ${source.name} decorated as «${ClassStereotype.ENUMERATION}» cannot have attributes.`;
        this.severity = IssueSeverity.ERROR;
        // this.alternatives = [
        //   new VerificationAlternative(
        //     VerificationAlternativeCode.REPLACE_ONTOUML_CLASS_STEREOTYPE,
        //     source,
        //   ),
        //   new VerificationAlternative(
        //     VerificationAlternativeCode.REMOVE_PROPERTIES,
        //     source,
        //   ),
        // ];
        break;
      case VerificationIssueCode.CLASS_MISSING_ALLOWED_NATURES:
        // The case of a class missing allowed ontological natures field
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.CLASS_MISSING_IS_EXTENSIONAL:
        // The case of a class missing "isExtensional" field
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.CLASS_MISSING_IS_POWERTYPE:
        // The case of a class missing "isPowertype" field
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.CLASS_MISSING_ORDER:
        // The case of a class missing "order" field
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.CLASS_MISSING_IDENTITY_PROVIDER:
        // The case of a sortal class missing an specialization towards a kind or type
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.CLASS_MULTIPLE_IDENTITY_PROVIDER:
        // The case of a sortal class specializing multiple kinds or types
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.CLASS_IDENTITY_PROVIDER_SPECIALIZATION:
        // The case of a KIND class specializing other kinds
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.CLASS_MISSING_IS_READ_ONLY:
        // The case of a class missing "iReadOnly" field
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.RELATION_MULTIPLE_STEREOTYPES:
        // The case of a relation with multiple stereotypes
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.RELATION_IMPROPER_DERIVATION:
        // The case of a derivation relation that has stereotypes or is not connecting a relation to a class
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.GENERALIZATION_INCONSISTENT_SPECIALIZATION:
        // The case of a generalization connecting elements that are not uniquely classes or relations
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.GENERALIZATION_INCOMPATIBLE_NATURES:
        // The case of a class specializing a class of an incompatible nature
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.GENERALIZATION_INCOMPATIBLE_ENUMERATION:
        // The case of an enumeration specializing a non-enumeration class
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.GENERALIZATION_INCOMPATIBLE_DATATYPE:
        // The case of a datatype specializing a non-datatype class
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.GENERALIZATION_INCOMPATIBLE_CLASS_RIGIDITY:
        // The case of a rigid or semi-rigid class specializing an anti-rigid one
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.GENERALIZATION_INCOMPATIBLE_CLASS_SORTALITY:
        // The case of a non-sortal class specializing an sortal one
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.GENERALIZATION_INCOMPATIBLE_RELATION_TYPE:
        // The case of a relation specializing another of a distinct stereotype
        throw `Unimplemented verification issue code: ${code}.`;
        break;

      default:
        throw `Unimplemented verification issue code: ${code}.`;
    }
  }
}
