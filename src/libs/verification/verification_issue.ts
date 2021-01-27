import {
  OntoumlElement,
  Class,
  ClassStereotype,
  Generalization,
  Relation,
  stereotypesUtils,
  OntoumlStereotype
} from '@libs/ontouml';

export enum VerificationIssueCode {
  class_identity_provider_specialization = 'class_identity_provider_specialization',
  class_missing_nature_restrictions = 'class_missing_nature_restrictions',
  class_missing_identity_provider = 'class_missing_identity_provider',
  class_missing_is_extensional = 'class_missing_is_extensional',
  class_missing_is_powertype = 'class_missing_is_powertype',
  class_missing_order = 'class_missing_order',
  class_multiple_identity_providers = 'class_multiple_identity_providers',
  class_not_unique_stereotype = 'class_not_unique_stereotype',
  class_invalid_ontouml_stereotype = 'class_invalid_ontouml_stereotype',
  class_non_enumeration_with_literals = 'class_non_enumeration_with_literals',
  class_enumeration_with_properties = 'class_enumeration_with_properties',
  class_incompatible_natures = 'class_incompatible_natures',
  generalization_inconsistent_specialization = 'generalization_inconsistent_specialization',
  generalization_incompatible_natures = 'generalization_incompatible_natures',
  generalization_incompatible_enumeration = 'generalization_incompatible_enumeration',
  generalization_incompatible_datatype = 'generalization_incompatible_datatype',
  generalization_incompatible_class_rigidity = 'generalization_incompatible_class_rigidity',
  generalization_incompatible_class_sortality = 'generalization_incompatible_class_sortality',
  generalization_incompatible_general_and_specific_types = 'generalization_incompatible_general_and_specific_types',
  generalization_circular = 'generalization_circular',
  generalization_incompatible_relation_type = 'generalization_incompatible_relation_type',
  relation_multiple_stereotypes = 'relation_multiple_stereotypes',
  relation_missing_is_read_only = 'relation_missing_is_read_only',
  relation_improper_derivation = 'relation_improper_derivation'
}

export enum IssueSeverity {
  error = 'error',
  warning = 'warning'
}

function stringifyStereotypes(stereotypes: OntoumlStereotype[]): string {
  return `«${stereotypes.join('», «')}»`;
}

export class VerificationIssue {
  code: VerificationIssueCode;
  title: string;
  description: string;
  source: OntoumlElement;
  context: OntoumlElement[];
  severity: IssueSeverity;

  constructor(
    source: OntoumlElement,
    code: VerificationIssueCode,
    title: string,
    severity: IssueSeverity = IssueSeverity.warning,
    description?: string,
    context?: OntoumlElement[]
  ) {
    this.source = source;
    this.code = code;
    this.title = title;
    this.severity = severity || IssueSeverity.warning;
    this.description = description || null;
    this.context = context || [];
  }

  isError(): boolean {
    return this.severity === IssueSeverity.error;
  }

  isWarning(): boolean {
    return this.severity === IssueSeverity.warning;
  }

  static createClassIdentityProviderSpecialization(source: Class, specializedUltimateSortals: Class[]): VerificationIssue {
    const specializedStereotypes = specializedUltimateSortals
      .map((ultimateSortal: Class) => ultimateSortal.stereotype)
      .reduce((acc: Set<ClassStereotype>, stereotype: ClassStereotype) => acc.add(stereotype), new Set());

    return new VerificationIssue(
      source,
      VerificationIssueCode.class_identity_provider_specialization,
      'Classes representing ultimate sortals cannot specialize other ultimate sortals',
      IssueSeverity.error,
      `The class ${source.getNameOrId()} is specializing other classes that represent ultimate sortals: ${stringifyStereotypes([
        ...specializedStereotypes
      ])}`,
      specializedUltimateSortals
    );
  }

  static createClassMissingNatureRestrictions(source: Class): VerificationIssue {
    const description = `The meta-property 'restrictedTo' of class ${source.getNameOrId()} must specify the possible ontological natures of its instances`;
    return new VerificationIssue(
      source,
      VerificationIssueCode.class_missing_nature_restrictions,
      "The meta-property 'restrictedTo' is not assigned",
      IssueSeverity.error,
      description,
      []
    );
  }

  static createClassMissingIdentityProvider(source: Class): VerificationIssue {
    return new VerificationIssue(
      source,
      VerificationIssueCode.class_missing_identity_provider,
      'Every sortal class must specialize a unique ultimate sortal',
      IssueSeverity.error,
      `The class ${source.getNameOrId()} must specialize (directly or indirectly) a unique class decorated as one of the following: ${stringifyStereotypes(
        stereotypesUtils.UltimateSortalStereotypes
      )}`,
      []
    );
  }

  static createClassMissingIsExtensional(source: Class): VerificationIssue {
    return new VerificationIssue(
      source,
      VerificationIssueCode.class_missing_is_extensional,
      "The meta-property 'isExtensional' is not assigned",
      IssueSeverity.error,
      `The meta-property 'isExtensional' of «${ClassStereotype.COLLECTIVE}» class ${source.getNameOrId()} must be assigned`,
      []
    );
  }

  static createClassMissingIsPowertype(source: Class): VerificationIssue {
    return new VerificationIssue(
      source,
      VerificationIssueCode.class_missing_is_powertype,
      "The meta-property 'isPowertype' is not assigned",
      IssueSeverity.error,
      `The meta-property 'isPowertype' of «${ClassStereotype.TYPE}» class ${source.getNameOrId()} must be assigned.`,
      []
    );
  }

  static createClassMissingOrder(source: Class): VerificationIssue {
    return new VerificationIssue(
      source,
      VerificationIssueCode.class_missing_order,
      "The meta-property 'order' is not assigned",
      IssueSeverity.error,
      `The meta-property 'order' of «${ClassStereotype.TYPE}» class ${source.getNameOrId()} must be assigned.`,
      []
    );
  }

  static createClassMultipleIdentityProviders(source: Class, specializedUltimateSortals: Class[]): VerificationIssue {
    const specializedStereotypes = specializedUltimateSortals
      .map((ultimateSortal: Class) => ultimateSortal.stereotype)
      .reduce((acc: Set<ClassStereotype>, stereotype: ClassStereotype) => acc.add(stereotype), new Set());

    return new VerificationIssue(
      source,
      VerificationIssueCode.class_multiple_identity_providers,
      'Every sortal class must specialize a unique ultimate sortal',
      IssueSeverity.error,
      `The class ${source.getNameOrId()} is specializing multiple classes that represent ultimate sortals: ${stringifyStereotypes(
        [...specializedStereotypes]
      )}`,
      specializedUltimateSortals
    );
  }

  static createClassNotUniqueStereotype(source: Class): VerificationIssue {
    return new VerificationIssue(
      source,
      VerificationIssueCode.class_not_unique_stereotype,
      'Not unique class stereotype',
      IssueSeverity.error,
      `The class ${source.getNameOrId()} must have a unique OntoUML stereotype.`,
      []
    );
  }

  static createClassInvalidOntoumlStereotype(source: Class): VerificationIssue {
    return new VerificationIssue(
      source,
      VerificationIssueCode.class_invalid_ontouml_stereotype,
      'No valid OntoUML stereotype',
      IssueSeverity.error,
      `The class ${source.getNameOrId()} must have a unique OntoUML stereotype.`,
      []
    );
  }

  static createClassNonEnumerationWithLiterals(source: Class): VerificationIssue {
    return new VerificationIssue(
      source,
      VerificationIssueCode.class_non_enumeration_with_literals,
      'Only enumerations may have literals',
      IssueSeverity.error,
      `The class ${source.getNameOrId()} is not decorated as «${ClassStereotype.ENUMERATION}» and thus cannot have literals.`,
      []
    );
  }

  static createClassEnumerationWithProperties(source: Class): VerificationIssue {
    return new VerificationIssue(
      source,
      VerificationIssueCode.class_enumeration_with_properties,
      'Enumerations may not have attributes',
      IssueSeverity.error,
      `The class ${source.getNameOrId()} decorated as «${ClassStereotype.ENUMERATION}» cannot have attributes.`,
      []
    );
  }

  static createClassIncompatibleNatures(source: Class): VerificationIssue {
    return new VerificationIssue(
      source,
      VerificationIssueCode.class_incompatible_natures,
      "Incompatible stereotype and 'restrictedTo' combination",
      IssueSeverity.error,
      `The «${
        source.stereotype
      }» class ${source.getNameOrId()} has its value for 'restrictedTo' incompatible with the stereotype`,
      []
    );
    // TODO: complement description with list of compatible natures
    // The compatible natures are: ${allAllowedNatures[aux.stereotype]}
  }

  static createGeneralizationInconsistentSpecialization(source: Generalization): VerificationIssue {
    throw new Error('Unimplemented: generalization_inconsistent_specialization');

    return new VerificationIssue(
      source,
      VerificationIssueCode.generalization_inconsistent_specialization,
      '',
      IssueSeverity.error,
      '',
      []
    );
  }

  static createGeneralizationIncompatibleNatures(source: Generalization): VerificationIssue {
    const general: OntoumlElement = (source.general as unknown) as OntoumlElement;
    const specific: OntoumlElement = (source.specific as unknown) as OntoumlElement;

    return new VerificationIssue(
      source,
      VerificationIssueCode.generalization_incompatible_natures,
      "Prohibited generalization: incompatible 'restrictedTo' values",
      IssueSeverity.error,
      `The allowed ontological natures of instances of ${specific.getNameOrId()} are not among the allowed ontological natures of its superclass ${general.getNameOrId()}`,
      [general, specific]
    );
  }

  static createGeneralizationIncompatibleEnumeration(source: Generalization): VerificationIssue {
    const general: OntoumlElement = (source.general as unknown) as OntoumlElement;
    const specific: OntoumlElement = (source.specific as unknown) as OntoumlElement;

    return new VerificationIssue(
      source,
      VerificationIssueCode.generalization_incompatible_enumeration,
      'Prohibited generalization: enumeration specialization',
      IssueSeverity.error,
      `An enumeration can only be in generalization relation with other enumerations`,
      [general, specific]
    );
  }

  static createGeneralizationIncompatibleDatatype(source: Generalization): VerificationIssue {
    const general: OntoumlElement = (source.general as unknown) as OntoumlElement;
    const specific: OntoumlElement = (source.specific as unknown) as OntoumlElement;

    return new VerificationIssue(
      source,
      VerificationIssueCode.generalization_incompatible_datatype,
      'Prohibited generalization: datatype specialization',
      IssueSeverity.error,
      'A datatype can only be in generalization relation with other datatypes',
      [general, specific]
    );
  }

  static createGeneralizationIncompatibleClassRigidity(source: Generalization): VerificationIssue {
    const general: OntoumlElement = (source.general as unknown) as OntoumlElement;
    const specific: OntoumlElement = (source.specific as unknown) as OntoumlElement;

    return new VerificationIssue(
      source,
      VerificationIssueCode.generalization_incompatible_class_rigidity,
      'Prohibited generalization: rigid/semi-rigid specializing an anti-rigid',
      IssueSeverity.error,
      `The rigid/semi-rigid class ${specific.getNameOrId()} cannot specialize the anti-rigid class ${general.getNameOrId()}`,
      [general, specific]
    );
  }

  static createGeneralizationIncompatibleClassSortality(source: Generalization): VerificationIssue {
    const general: OntoumlElement = (source.general as unknown) as OntoumlElement;
    const specific: OntoumlElement = (source.specific as unknown) as OntoumlElement;

    return new VerificationIssue(
      source,
      VerificationIssueCode.generalization_incompatible_class_sortality,
      'Prohibited generalization: non-sortal specializing a sortal',
      IssueSeverity.error,
      `The non-sortal class ${specific.getNameOrId()} cannot specialize the sortal class ${general.getNameOrId()}`,
      [general, specific]
    );
  }

  static createGeneralizationIncompatibleGeneralAndSpecificTypes(source: Generalization): VerificationIssue {
    return new VerificationIssue(
      source,
      VerificationIssueCode.generalization_incompatible_general_and_specific_types,
      'Prohibited generalization: specific and general of distinct types',
      IssueSeverity.error,
      `Generalizations must exclusively involve classes or relations, never a combination`,
      [source.general, source.specific]
    );
  }

  static createGeneralizationCircular(source: Generalization): VerificationIssue {
    return new VerificationIssue(
      source,
      VerificationIssueCode.generalization_circular,
      'Prohibited generalization: circular generalization',
      IssueSeverity.error,
      `Generalizations must be defined between two distinct classes/relations`,
      [source.general, source.specific]
    );
  }

  static createGeneralizationIncompatibleRelationType(source: Generalization): VerificationIssue {
    throw new Error('Unimplemented: generalization_incompatible_relation_type');

    return new VerificationIssue(
      source,
      VerificationIssueCode.generalization_incompatible_relation_type,
      '',
      IssueSeverity.error,
      '',
      []
    );
  }

  static createRelationMultipleStereotypes(source: Relation): VerificationIssue {
    throw new Error('Unimplemented: relation_multiple_stereotypes');

    return new VerificationIssue(source, VerificationIssueCode.relation_multiple_stereotypes, '', IssueSeverity.error, '', []);
  }

  static createRelationMissingIsReadOnly(source: Relation): VerificationIssue {
    throw new Error('Unimplemented: relation_missing_is_read_only');

    return new VerificationIssue(source, VerificationIssueCode.relation_missing_is_read_only, '', IssueSeverity.error, '', []);
  }

  static createRelationImproperDerivation(source: Relation): VerificationIssue {
    throw new Error('Unimplemented: relation_improper_derivation');

    return new VerificationIssue(source, VerificationIssueCode.relation_improper_derivation, '', IssueSeverity.error, '', []);
  }
}
