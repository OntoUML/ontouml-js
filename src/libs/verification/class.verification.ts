import { IClass } from '@types';
import { VerificationIssue, VerificationIssueCode } from './issues';
import { ClassStereotype, OntologicalNature } from '@constants/.';

export const allNatures = [
  OntologicalNature.abstract,
  OntologicalNature.collective,
  OntologicalNature.event,
  OntologicalNature.functional_complex,
  OntologicalNature.intrinsic_mode,
  OntologicalNature.extrinsic_mode,
  OntologicalNature.quality,
  OntologicalNature.quantity,
  OntologicalNature.relator,
  OntologicalNature.situation,
  OntologicalNature.type
];

export const substantialAndMomentNatures = [
  OntologicalNature.collective,
  OntologicalNature.functional_complex,
  OntologicalNature.intrinsic_mode,
  OntologicalNature.extrinsic_mode,
  OntologicalNature.quality,
  OntologicalNature.quantity,
  OntologicalNature.relator
];

export const allAllowedNatures = {
  [ClassStereotype.ABSTRACT]: [OntologicalNature.abstract],
  [ClassStereotype.DATATYPE]: [OntologicalNature.abstract],
  [ClassStereotype.ENUMERATION]: [OntologicalNature.abstract],

  [ClassStereotype.EVENT]: [OntologicalNature.event],
  [ClassStereotype.SITUATION]: [OntologicalNature.situation],

  [ClassStereotype.CATEGORY]: substantialAndMomentNatures,
  [ClassStereotype.MIXIN]: substantialAndMomentNatures,
  [ClassStereotype.ROLE_MIXIN]: substantialAndMomentNatures,
  [ClassStereotype.PHASE_MIXIN]: substantialAndMomentNatures,
  [ClassStereotype.HISTORICAL_ROLE_MIXIN]: substantialAndMomentNatures,

  [ClassStereotype.KIND]: [OntologicalNature.functional_complex],
  [ClassStereotype.COLLECTIVE]: [OntologicalNature.collective],
  [ClassStereotype.QUANTITY]: [OntologicalNature.quantity],
  [ClassStereotype.RELATOR]: [OntologicalNature.relator],
  [ClassStereotype.MODE]: [OntologicalNature.extrinsic_mode, OntologicalNature.intrinsic_mode],
  [ClassStereotype.QUALITY]: [OntologicalNature.quality],

  [ClassStereotype.SUBKIND]: substantialAndMomentNatures,
  [ClassStereotype.ROLE]: substantialAndMomentNatures,
  [ClassStereotype.PHASE]: substantialAndMomentNatures,
  [ClassStereotype.HISTORICAL_ROLE]: substantialAndMomentNatures,

  [ClassStereotype.TYPE]: [OntologicalNature.type]
};

/**
 * Functions for syntactical verification of classes
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export const ClassVerification = {
  check(_class: IClass): VerificationIssue[] {
    const potentialIssues: VerificationIssue[] = [
      // each verification goes here
      this.checkKindSpecialization(_class),
      this.checkCompatibleNatures(_class),
      this.checkMissingNatures(_class),
      this.checkMissingIsExtensional(_class),
      this.checkMissingIsPowertype(_class),
      this.checkMissingOrder(_class)
    ];

    return potentialIssues;
  },

  checkMinimalConsistency(_class: IClass): VerificationIssue[] {
    const consistencyIssues: VerificationIssue[] = [];
    const classStereotypes = Object.values(ClassStereotype) as string[];

    if (!_class.stereotypes || _class.stereotypes.length !== 1) {
      consistencyIssues.push(new VerificationIssue(VerificationIssueCode.class_not_unique_stereotype, _class));
    } else if (!classStereotypes.includes(_class.stereotypes[0])) {
      consistencyIssues.push(new VerificationIssue(VerificationIssueCode.class_invalid_ontouml_stereotype, _class));
    }

    if (_class.stereotypes && _class.stereotypes.includes(ClassStereotype.ENUMERATION) && _class.properties) {
      consistencyIssues.push(new VerificationIssue(VerificationIssueCode.class_enumeration_with_properties, _class));
    } else if (_class.stereotypes && !_class.stereotypes.includes(ClassStereotype.ENUMERATION) && _class.literals) {
      consistencyIssues.push(new VerificationIssue(VerificationIssueCode.class_non_enumeration_with_literals, _class));
    }

    return consistencyIssues;
  },

  checkKindSpecialization(_class: IClass): VerificationIssue {
    if (_class.isSortal()) {
      const kindAncestors = _class.getAncestors().filter((ancestor: IClass) => ancestor.isUltimateSortal());

      if (_class.isUltimateSortal() && kindAncestors.length > 0) {
        return new VerificationIssue(VerificationIssueCode.class_identity_provider_specialization, _class, kindAncestors);
      } else if (!_class.isUltimateSortal() && kindAncestors.length > 1) {
        return new VerificationIssue(VerificationIssueCode.class_multiple_identity_provider, _class, kindAncestors);
      } else if (!_class.isUltimateSortal() && kindAncestors.length === 0 && !_class.allowsInstances([OntologicalNature.type])) {
        return new VerificationIssue(VerificationIssueCode.class_missing_identity_provider, _class);
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
      (nature: OntologicalNature) => allAllowedNatures[stereotype] && !allAllowedNatures[stereotype].includes(nature)
    );

    return incompatibleNatures.length > 0
      ? new VerificationIssue(VerificationIssueCode.class_incompatible_natures, _class)
      : null;
  },

  checkMissingNatures(_class: IClass): VerificationIssue {
    if (!_class.stereotypes) {
      return null;
    }

    return !_class.allowed ? new VerificationIssue(VerificationIssueCode.class_missing_nature_restrictions, _class) : null;
  },

  checkMissingIsExtensional(_class: IClass): VerificationIssue {
    if (!_class.stereotypes || !_class.stereotypes.includes(ClassStereotype.COLLECTIVE)) {
      return null;
    }

    return _class.isExtensional === null
      ? new VerificationIssue(VerificationIssueCode.class_missing_is_extensional, _class)
      : null;
  },

  checkMissingIsPowertype(_class: IClass): VerificationIssue {
    if (!_class.stereotypes || !_class.stereotypes.includes(ClassStereotype.TYPE)) {
      return null;
    }

    return _class.isPowertype === null ? new VerificationIssue(VerificationIssueCode.class_missing_is_powertype, _class) : null;
  },

  checkMissingOrder(_class: IClass): VerificationIssue {
    if (!_class.stereotypes || !_class.stereotypes.includes(ClassStereotype.TYPE)) {
      return null;
    }

    return !_class.order ? new VerificationIssue(VerificationIssueCode.class_missing_order, _class) : null;
  }
};
