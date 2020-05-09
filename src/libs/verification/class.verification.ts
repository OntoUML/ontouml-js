import { IClass } from '@types';
import { VerificationIssue, VerificationIssueCode } from './issues';
import pluralize from 'pluralize';
import { ClassStereotype, OntologicalNature } from '@constants/.';

const allNatures = [
  OntologicalNature.abstract,
  OntologicalNature.collective,
  OntologicalNature.event,
  OntologicalNature.functional_complex,
  OntologicalNature.mode,
  OntologicalNature.quality,
  OntologicalNature.quantity,
  OntologicalNature.relator,
  OntologicalNature.type,
];

const allAllowedNatures = {};
allAllowedNatures[ClassStereotype.CATEGORY] = allNatures;
allAllowedNatures[ClassStereotype.MIXIN] = allNatures;
allAllowedNatures[ClassStereotype.ROLE_MIXIN] = allNatures;
allAllowedNatures[ClassStereotype.PHASE_MIXIN] = allNatures;
allAllowedNatures[ClassStereotype.KIND] = [
  OntologicalNature.functional_complex,
];
allAllowedNatures[ClassStereotype.QUANTITY] = [OntologicalNature.quantity];
allAllowedNatures[ClassStereotype.COLLECTIVE] = [OntologicalNature.collective];
allAllowedNatures[ClassStereotype.RELATOR] = [OntologicalNature.relator];
allAllowedNatures[ClassStereotype.MODE] = [OntologicalNature.mode];
allAllowedNatures[ClassStereotype.QUALITY] = [OntologicalNature.quality];
allAllowedNatures[ClassStereotype.SUBKIND] = allNatures;
allAllowedNatures[ClassStereotype.ROLE] = allNatures;
allAllowedNatures[ClassStereotype.PHASE] = allNatures;
allAllowedNatures[ClassStereotype.TYPE] = [OntologicalNature.type];
allAllowedNatures[ClassStereotype.EVENT] = [OntologicalNature.event];
allAllowedNatures[ClassStereotype.HISTORICAL_ROLE] = [OntologicalNature.event];
allAllowedNatures[ClassStereotype.DATATYPE] = [OntologicalNature.abstract];
allAllowedNatures[ClassStereotype.ENUMERATION] = [OntologicalNature.abstract];

/**
 * Functions for syntactical verification of classes
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export const ClassVerification = {
  checkMinimalConsistency(_class: IClass): VerificationIssue[] {
    const consistencyIssues: VerificationIssue[] = [];
    const classStereotypes = Object.values(ClassStereotype) as string[];

    if (!_class.stereotypes || _class.stereotypes.length !== 1) {
      consistencyIssues.push(
        new VerificationIssue(
          VerificationIssueCode.class_not_unique_stereotype,
          _class,
        ),
      );
    } else if (!classStereotypes.includes(_class.stereotypes[0])) {
      consistencyIssues.push(
        new VerificationIssue(
          VerificationIssueCode.class_invalid_ontouml_stereotype,
          _class,
        ),
      );
    }

    if (_class.name && pluralize.isPlural(_class.name)) {
      consistencyIssues.push(
        new VerificationIssue(VerificationIssueCode.class_plural_name, _class),
      );
    }

    if (
      _class.stereotypes &&
      _class.stereotypes.includes(ClassStereotype.ENUMERATION) &&
      _class.properties
    ) {
      consistencyIssues.push(
        new VerificationIssue(
          VerificationIssueCode.class_enumeration_with_properties,
          _class,
        ),
      );
    } else if (
      _class.stereotypes &&
      !_class.stereotypes.includes(ClassStereotype.ENUMERATION) &&
      _class.literals
    ) {
      consistencyIssues.push(
        new VerificationIssue(
          VerificationIssueCode.class_non_enumeration_with_literals,
          _class,
        ),
      );
    }

    return consistencyIssues;
  },

  check(_class: IClass): VerificationIssue[] {
    const potentialIssues: VerificationIssue[] = [
      // each verification goes here
      this.checkKindSpecialization(_class),
    ];

    return potentialIssues;
  },

  checkKindSpecialization(_class: IClass): VerificationIssue {
    if (_class.isSortal()) {
      const kindAncestors = _class
        .getAncestors()
        .filter((ancestor: IClass) => ancestor.isUltimateSortal());

      if (_class.isUltimateSortal() && kindAncestors.length > 0) {
        return new VerificationIssue(
          VerificationIssueCode.class_identity_provider_specialization,
          _class,
          kindAncestors,
        );
      } else if (!_class.isUltimateSortal() && kindAncestors.length > 1) {
        return new VerificationIssue(
          VerificationIssueCode.class_multiple_identity_provider,
          _class,
          kindAncestors,
        );
      } else if (!_class.isUltimateSortal() && kindAncestors.length === 0) {
        return new VerificationIssue(
          VerificationIssueCode.class_missing_identity_provider,
          _class,
        );
      }
    }

    return null;
  },

  checkCompatibleNatures(_class: IClass): VerificationIssue {
    if (!_class.allowed || !_class.stereotypes) {
      return null;
    }

    const stereotype = _class.stereotypes[0];

    let incompatibleNatures = _class.allowed.filter(
      (nature: OntologicalNature) =>
        allAllowedNatures[stereotype] &&
        !allAllowedNatures[stereotype].includes(nature),
    );

    return incompatibleNatures.length > 0
      ? new VerificationIssue(
          VerificationIssueCode.class_incompatible_natures,
          _class,
        )
      : null;
  },
};
