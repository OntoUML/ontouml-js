import { Class, ClassStereotype, OntologicalNature, stereotypeUtils, natureUtils } from '@libs/ontouml';
import { VerificationIssue, utils } from './';

const allowedStereotypeRestrictedToMatches = {
  [ClassStereotype.ABSTRACT]: [OntologicalNature.abstract],
  [ClassStereotype.DATATYPE]: [OntologicalNature.abstract],
  [ClassStereotype.ENUMERATION]: [OntologicalNature.abstract],

  [ClassStereotype.EVENT]: [OntologicalNature.event],
  [ClassStereotype.SITUATION]: [OntologicalNature.situation],

  [ClassStereotype.CATEGORY]: natureUtils.EndurantNatures,
  [ClassStereotype.MIXIN]: natureUtils.EndurantNatures,
  [ClassStereotype.ROLE_MIXIN]: natureUtils.EndurantNatures,
  [ClassStereotype.PHASE_MIXIN]: natureUtils.EndurantNatures,
  [ClassStereotype.HISTORICAL_ROLE_MIXIN]: natureUtils.EndurantNatures,

  [ClassStereotype.KIND]: [OntologicalNature.functional_complex],
  [ClassStereotype.COLLECTIVE]: [OntologicalNature.collective],
  [ClassStereotype.QUANTITY]: [OntologicalNature.quantity],
  [ClassStereotype.RELATOR]: [OntologicalNature.relator],
  [ClassStereotype.MODE]: [OntologicalNature.extrinsic_mode, OntologicalNature.intrinsic_mode],
  [ClassStereotype.QUALITY]: [OntologicalNature.quality],

  [ClassStereotype.SUBKIND]: natureUtils.EndurantNatures,
  [ClassStereotype.ROLE]: natureUtils.EndurantNatures,
  [ClassStereotype.PHASE]: natureUtils.EndurantNatures,
  [ClassStereotype.HISTORICAL_ROLE]: natureUtils.EndurantNatures,

  [ClassStereotype.TYPE]: [OntologicalNature.type]
};

export class ClassVerification {
  static verifyClass(_class: Class): VerificationIssue[] {
    let foundIssues: VerificationIssue[] = ClassVerification.checkMinimalConsistency(_class);

    // The verification stops if one of the basic consistency rules are violated
    if (foundIssues.some((issue: VerificationIssue) => issue.isError())) {
      return foundIssues;
    }

    utils.pushItemsToArrayIfNotNull(
      foundIssues,
      ClassVerification.checkKindSpecialization(_class),
      ClassVerification.checkCompatibleNatures(_class),
      ClassVerification.checkMissingNatures(_class),
      ClassVerification.checkMissingIsExtensional(_class),
      ClassVerification.checkMissingIsPowertype(_class),
      ClassVerification.checkMissingOrder(_class)
    );

    return foundIssues;
  }

  static checkMinimalConsistency(_class: Class): VerificationIssue[] {
    const issues: VerificationIssue[] = [];
    const classStereotypes = stereotypeUtils.ClassStereotypes;

    if (!_class.stereotype) {
      issues.push(VerificationIssue.createClassNotUniqueStereotype(_class));
    } else if (!classStereotypes.includes(_class.stereotype)) {
      issues.push(VerificationIssue.createClassInvalidOntoumlStereotype(_class));
    }

    if (_class.hasEnumerationStereotype() && _class.hasAttributes()) {
      issues.push(VerificationIssue.createClassEnumerationWithProperties(_class));
    } else if (!_class.hasEnumerationStereotype() && _class.hasLiterals()) {
      issues.push(VerificationIssue.createClassNonEnumerationWithLiterals(_class));
    }

    return issues;
  }

  static checkKindSpecialization(_class: Class): VerificationIssue {
    if (_class.hasSortalStereotype()) {
      const ultimateSortalAncestors = _class.getUltimateSortalAncestors();

      if (_class.hasUltimateSortalStereotype() && ultimateSortalAncestors.length > 0) {
        return VerificationIssue.createClassIdentityProviderSpecialization(_class, ultimateSortalAncestors);
      } else if (!_class.hasUltimateSortalStereotype() && ultimateSortalAncestors.length > 1) {
        return VerificationIssue.createClassMultipleIdentityProviders(_class, ultimateSortalAncestors);
      } else if (!_class.hasUltimateSortalStereotype() && ultimateSortalAncestors.length === 0 && !_class.isRestrictedToType()) {
        // TODO: review this coding based on language updates
        return VerificationIssue.createClassMissingIdentityProvider(_class);
      }
    }

    return null;
  }

  static checkCompatibleNatures(_class: Class): VerificationIssue {
    if (!_class.restrictedTo || !_class.stereotype) {
      return null;
    }

    const stereotype = _class.stereotype;
    const incompatibleNatures = !_class.restrictedTo
      ? []
      : _class.restrictedTo.filter(
          (nature: OntologicalNature) =>
            allowedStereotypeRestrictedToMatches[stereotype] && !allowedStereotypeRestrictedToMatches[stereotype].includes(nature)
        );

    return incompatibleNatures.length < 1 ? null : VerificationIssue.createClassIncompatibleNatures(_class);
  }

  static checkMissingNatures(_class: Class): VerificationIssue {
    if (!_class.stereotype) {
      return null;
    }

    return !Array.isArray(_class.restrictedTo) || !_class.restrictedTo.length
      ? VerificationIssue.createClassMissingNatureRestrictions(_class)
      : null;
  }

  static checkMissingIsExtensional(_class: Class): VerificationIssue {
    if (!_class.hasEndurantOnlyStereotype()) {
      return null;
    }

    return _class.isExtensional === null ? VerificationIssue.createClassMissingIsExtensional(_class) : null;
  }

  static checkMissingIsPowertype(_class: Class): VerificationIssue {
    if (!_class.hasTypeStereotype()) {
      return null;
    }

    return _class.isPowertype === null ? VerificationIssue.createClassMissingIsPowertype(_class) : null;
  }

  static checkMissingOrder(_class: Class): VerificationIssue {
    // TODO: update this when support to non-sortal types is implemented
    if (!_class.hasTypeStereotype()) {
      return null;
    }

    return !_class.order ? VerificationIssue.createClassMissingOrder(_class) : null;
  }
}
