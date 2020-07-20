import { IElement, IReference, IClass, IDecoratable } from '@types';
import { VerificationAlternative } from './alternatives';
import { ClassStereotype } from '@constants/.';
import { allAllowedNatures } from './class.verification';

export enum IssueSeverity {
  error = 'error',
  warning = 'warning',
}

export enum VerificationIssueCode {
  class_identity_provider_specialization = 'class_identity_provider_specialization',
  class_missing_nature_restrictions = 'class_missing_nature_restrictions',
  class_missing_identity_provider = 'class_missing_identity_provider',
  class_missing_is_extensional = 'class_missing_is_extensional',
  class_missing_is_powertype = 'class_missing_is_powertype',
  class_missing_order = 'class_missing_order',
  class_multiple_identity_provider = 'class_multiple_identity_provider',
  class_not_unique_stereotype = 'class_not_unique_stereotype',
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
      case VerificationIssueCode.class_missing_nature_restrictions:
        // The case of a class missing allowed ontological natures field
        aux = {
          name: source && source.name ? source.name : source.id,
          stereotype:
            source && (source as IDecoratable).stereotypes
              ? (source as IDecoratable).stereotypes[0]
              : '',
        };
        this.title = `The meta-property 'restrictedTo' is not assigned.`;
        this.description = ![
          ClassStereotype.SUBKIND,
          ClassStereotype.PHASE,
          ClassStereotype.ROLE,
          ClassStereotype.HISTORICAL_ROLE,
        ].includes(aux.stereotype)
          ? `The meta-property 'restrictedTo' of class ${aux.name} must specify the possible ontological natures of its instances.`
          : `The meta-property 'restrictedTo' of class ${aux.name} must specify the possible ontological natures of its instances. Classes decorated with «${aux.stereotype}» must inherit this value through specialization (i.e. they must specify the same value as the ultimate sortal they specialize).`;
        // this.description = `The meta-property 'restrictedTo' of class ${aux} must specify the possible ontological natures of its instances. Classes with `;
        this.severity = IssueSeverity.error;
        break;
      case VerificationIssueCode.class_missing_is_extensional:
        // The case of a class missing "isExtensional" field
        aux = source && source.name ? source.name : source.id;
        this.title = `The meta-property 'isExtensional' is not assigned.`;
        this.description = `The meta-property 'isExtensional' of «${ClassStereotype.COLLECTIVE}» class ${aux} must be assigned.`;
        this.severity = IssueSeverity.error;
        break;
      case VerificationIssueCode.class_missing_is_powertype:
        // The case of a class missing "isPowertype" field
        aux = source && source.name ? source.name : source.id;
        this.title = `The meta-property 'isPowertype' is not assigned.`;
        this.description = `The meta-property 'isPowertype' of «${ClassStereotype.TYPE}» class ${aux} must be assigned.`;
        this.severity = IssueSeverity.error;
        break;
      case VerificationIssueCode.class_missing_order:
        // The case of a class missing "order" field
        aux = source && source.name ? source.name : source.id;
        this.title = `The meta-property 'order' is not assigned.`;
        this.description = `The meta-property 'order' of «${ClassStereotype.TYPE}» class ${aux} must be assigned.`;
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
        this.title = `Incompatible stereotype and 'restrictedTo' combination.`;
        this.description = `The «${aux.stereotype}» class ${
          aux.name
        } has its value for 'restrictedTo' incompatible with the stereotype. The compatible natures are: ${
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
        this.title = `Prohibited specialization: incompatible 'restrictedTo' values.`;
        aux = [];
        aux[0] =
          context[0] && context[0].name ? context[0].name : context[0].id;
        aux[1] =
          context[1] && context[1].name ? context[1].name : context[1].id;
        this.description = `The value of 'restrictedTo' in ${aux[1]} is incompatible the value of 'restrictedTo' in the specialized class ${aux[0]}. Make sure that ${aux[1]} only specializes classes that include its own value for 'restrictedTo'.`;
        this.severity = IssueSeverity.error;
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
        this.severity = IssueSeverity.error;
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
