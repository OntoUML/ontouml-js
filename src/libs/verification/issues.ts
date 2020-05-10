import { IElement, IReference, IClass } from '@types';
import { VerificationAlternative } from './alternatives';
import pluralize from 'pluralize';
import { ClassStereotype } from '@constants/.';
import { allAllowedNatures } from './class.verification';

export enum IssueSeverity {
  error = 'error',
  warning = 'warning',
}

export enum VerificationIssueCode {
  class_identity_provider_specialization = 'class_identity_provider_specialization',
  class_missing_allowed_natures = 'class_missing_allowed_natures',
  class_missing_identity_provider = 'class_missing_identity_provider',
  class_missing_is_extensional = 'class_missing_is_extensional',
  class_missing_is_powertype = 'class_missing_is_powertype',
  class_missing_order = 'class_missing_order',
  class_multiple_identity_provider = 'class_multiple_identity_provider',
  class_not_unique_stereotype = 'class_not_unique_stereotype',
  class_plural_name = 'class_plural_name',
  class_invalid_ontouml_stereotype = 'class_invalid_ontouml_stereotype',
  class_non_enumeration_with_literals = 'class_non_enumeration_with_literals',
  class_enumeration_with_properties = 'class_enumeration_with_properties',
  class_incompatible_natures = 'class_incompatible_natures',
  relation_missing_is_read_only = 'relation_missing_is_read_only',
  generalization_inconsistent_specialization = 'generalization_inconsistent_specialization',
  generalization_incompatible_natures = 'generalization_incompatible_natures',
  generalization_incompatible_enumeration = 'generalization_incompatible_enumeration',
  generalization_incompatible_datatype = 'generalization_incompatible_datatype',
  generalization_incompatible_class_rigidity = 'generalization_incompatible_class_rigidity',
  generalization_incompatible_class_sortality = 'generalization_incompatible_class_sortality',
  generalization_incompatible_relation_type = 'generalization_incompatible_relation_type',
  relation_multiple_stereotypes = 'relation_multiple_stereotypes',
  relation_improper_derivation = 'relation_improper_derivation',
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

    let aux;

    // TODO: enable alternatives again later
    switch (code) {
      case VerificationIssueCode.class_not_unique_stereotype:
        this.title = 'Not unique class stereotype.';
        this.description = `The class ${source.name} must have a unique OntoUML stereotype.`;
        this.severity = IssueSeverity.error;
        // this.alternatives = [
        //   new VerificationAlternative(
        //     VerificationAlternativeCode.REPLACE_ONTOUML_CLASS_STEREOTYPE,
        //     source,
        //   ),
        // ];
        break;
      case VerificationIssueCode.class_invalid_ontouml_stereotype:
        this.title = 'No valid OntoUML stereotype.';
        this.description = `The class ${source.name} must have a unique OntoUML stereotype.`;
        this.severity = IssueSeverity.error;
        // this.alternatives = [
        //   new VerificationAlternative(
        //     VerificationAlternativeCode.REPLACE_ONTOUML_CLASS_STEREOTYPE,
        //     source,
        //   ),
        // ];
        break;
      case VerificationIssueCode.class_plural_name:
        this.title = 'Classes should not have plural names.';
        this.description = `The class ${
          source.name
        } should have its name in the singular form (${pluralize.singular(
          source.name,
        )}).`;
        this.severity = IssueSeverity.warning;
        // this.alternatives = [
        //   new VerificationAlternative(
        //     VerificationAlternativeCode.ONTOUML_CLASS_NAME_TO_PLURAL,
        //     source,
        //   ),
        // ];
        break;
      case VerificationIssueCode.class_non_enumeration_with_literals:
        this.title = 'Only enumerations may have literals.';
        this.description = `The class ${source.name} is not decorated as «${ClassStereotype.ENUMERATION}» and thus cannot have literals.`;
        this.severity = IssueSeverity.error;
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
      case VerificationIssueCode.class_enumeration_with_properties:
        this.title = 'Enumerations may not have attributes.';
        this.description = `The class ${source.name} decorated as «${ClassStereotype.ENUMERATION}» cannot have attributes.`;
        this.severity = IssueSeverity.error;
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
      case VerificationIssueCode.class_missing_allowed_natures:
        // The case of a class missing allowed ontological natures field
        aux = source && source.name ? source.name : source.id;
        this.title = `Missing 'allowed' natures meta-property.`;
        this.description = `The class ${aux} is missing the 'allowed' natures meta-property.`;
        this.severity = IssueSeverity.error;
        break;
      case VerificationIssueCode.class_missing_is_extensional:
        // The case of a class missing "isExtensional" field
        aux = source && source.name ? source.name : source.id;
        this.title = `Missing 'isExtensional' meta-property.`;
        this.description = `The «${ClassStereotype.COLLECTIVE}» class ${aux} is missing the 'isExtensional' meta-property.`;
        this.severity = IssueSeverity.error;
        break;
      case VerificationIssueCode.class_missing_is_powertype:
        // The case of a class missing "isPowertype" field
        aux = source && source.name ? source.name : source.id;
        this.title = `Missing 'isPowertype' meta-property.`;
        this.description = `The «${ClassStereotype.TYPE}» class ${aux} is missing the 'isPowertype' meta-property.`;
        this.severity = IssueSeverity.error;
        break;
      case VerificationIssueCode.class_missing_order:
        // The case of a class missing "order" field
        aux = source && source.name ? source.name : source.id;
        this.title = `Missing 'order' meta-property.`;
        this.description = `The «${ClassStereotype.TYPE}» class ${aux} is missing the 'order' meta-property.`;
        this.severity = IssueSeverity.error;
        break;
      case VerificationIssueCode.class_missing_identity_provider:
        // The case of a sortal class missing an specialization towards a kind or type
        this.title =
          'Every sortal class must specialize a unique ultimate sortal.';
        this.description = `The class ${source.name} must specialize (directly or indirectly) a unique class decorated as one of the following: «kind», «collective», «quantity», «relator», «mode», «quality», «type».`;
        this.severity = IssueSeverity.error;
        break;
      case VerificationIssueCode.class_multiple_identity_provider:
        // The case of a sortal class specializing multiple kinds or types
        aux = context
          .map((element: IElement) => `«${element.name}»`)
          .join(', ');
        this.title =
          'Every sortal class must specialize a unique ultimate sortal.';
        this.description = `The class ${source.name} is specializing multiple classes that represent ultimate sortals: ${aux}.`;
        this.severity = IssueSeverity.error;
        break;
      case VerificationIssueCode.class_identity_provider_specialization:
        // The case of a KIND class specializing other kinds
        aux = context
          .map((element: IElement) => `«${element.name}»`)
          .join(', ');
        this.title =
          'Classes representing ultimate sortals cannot specialize other ultimate sortals.';
        this.description = `The class ${source.name} is specializing other classes that represent ultimate sortals: ${aux}.`;
        this.severity = IssueSeverity.error;
        break;
      case VerificationIssueCode.class_incompatible_natures:
        aux = {};
        aux.stereotype = (source as IClass).stereotypes[0];
        aux.allowed = (source as IClass).allowed[0];
        aux.name = source && source.name ? source.name : source.id;
        this.title = `Incompatible allowed natures.`;
        this.description = `The «${aux.stereotype}» class ${
          aux.name
        } has 'allowed' natures incompatible with its stereotype. For this stereotypes, the compatible natures are: ${
          allAllowedNatures[aux.stereotype]
        }.`;
        this.severity = IssueSeverity.error;
        break;
      case VerificationIssueCode.relation_missing_is_read_only:
        // TODO: The case of a relation missing a required "isReadOnly" field
        this.title = ``;
        this.description = ``;
        this.severity = IssueSeverity.error;
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.relation_multiple_stereotypes:
        // The case of a relation with multiple stereotypes
        this.title = ``;
        this.description = ``;
        this.severity = IssueSeverity.error;
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.relation_improper_derivation:
        // The case of a derivation relation that has stereotypes or is not connecting a relation to a class
        this.title = ``;
        this.description = ``;
        this.severity = IssueSeverity.error;
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.generalization_inconsistent_specialization:
        // TODO: The case of a generalization connecting elements that are not uniquely classes or relations
        this.title = ``;
        this.description = ``;
        this.severity = IssueSeverity.error;
        throw `Unimplemented verification issue code: ${code}.`;
        break;
      case VerificationIssueCode.generalization_incompatible_natures:
        // The case of a class specializing a class of an incompatible nature
        this.title = `Prohibited specialization: incompatible natures.`;
        aux = [];
        aux[0] =
          context[0] && context[0].name ? context[0].name : context[0].id;
        aux[1] =
          context[1] && context[1].name ? context[1].name : context[1].id;
        this.description = `The allowed ontological natures of instances of ${aux[1]} are not among the allowed ontological natures of its superclass ${aux[0]}.`;
        break;
      case VerificationIssueCode.generalization_incompatible_enumeration:
        // The case of an enumeration specializing a non-enumeration class
        // TODO: check if this constraint is consistent
        this.title = `Prohibited specialization: enumeration specialization.`;
        this.description = `A enumeration can only be in generalization relation with other enumerations.`;
        this.severity = IssueSeverity.error;
        break;
      case VerificationIssueCode.generalization_incompatible_datatype:
        // The case of a datatype specializing a non-datatype class
        this.title = `Prohibited specialization: datatype specialization.`;
        this.description = `A datatype can only be in generalization relation with other datatypes.`;
        this.severity = IssueSeverity.error;
        break;
      case VerificationIssueCode.generalization_incompatible_class_rigidity:
        // The case of a rigid or semi-rigid class specializing an anti-rigid one
        this.title = `Prohibited specialization: rigid/semi-rigid specializing an anti-rigid.`;
        aux = [];
        aux[0] =
          context[0] && context[0].name ? context[0].name : context[0].id;
        aux[1] =
          context[1] && context[1].name ? context[1].name : context[1].id;
        this.description = `The rigid/semi-rigid class ${aux[0]} cannot specialize the anti-rigid class ${aux[1]}.`;
        break;
      case VerificationIssueCode.generalization_incompatible_class_sortality:
        // The case of a non-sortal class specializing an sortal one
        this.title = `Prohibited specialization: non-sortal specializing a sortal.`;
        aux = [];
        aux[0] =
          context[0] && context[0].name ? context[0].name : context[0].id;
        aux[1] =
          context[1] && context[1].name ? context[1].name : context[1].id;
        this.description = `The non-sortal class ${aux[0]} cannot specialize the sortal class ${aux[1]}.`;
        this.severity = IssueSeverity.error;
        break;
      case VerificationIssueCode.generalization_incompatible_relation_type:
        // The case of a relation specializing another of a distinct stereotype
        this.title = ``;
        this.description = ``;
        this.severity = IssueSeverity.error;
        throw `Unimplemented verification issue code: ${code}.`;
        break;

      default:
        throw `Unimplemented verification issue code: ${code}.`;
    }
  }
}
