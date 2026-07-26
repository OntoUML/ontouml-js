import { Class } from '../model/class';
import { Classifier } from '../model/classifier';
import { ClassStereotype } from '../model/stereotypes';
import { Nature } from '../model/natures';
import { VerificationIssue } from './verification_issue';
import { utils } from './utils';

/**
 * Endurant natures as defined by the original verification service. Note that,
 * unlike the `EndurantNatures` constant of the new ontouml-js, this list does
 * not include the `type` nature, preserving the original semantics of the
 * stereotype/nature compatibility checks.
 */
const EndurantNatures: readonly Nature[] = [
  Nature.FUNCTIONAL_COMPLEX,
  Nature.COLLECTIVE,
  Nature.QUANTITY,
  Nature.INTRINSIC_MODE,
  Nature.EXTRINSIC_MODE,
  Nature.QUALITY,
  Nature.RELATOR
];

const allowedStereotypeRestrictedToMatches: {
  [key in ClassStereotype]: readonly Nature[];
} = {
  [ClassStereotype.ABSTRACT]: [Nature.ABSTRACT],
  [ClassStereotype.DATATYPE]: [Nature.ABSTRACT],
  [ClassStereotype.ENUMERATION]: [Nature.ABSTRACT],

  [ClassStereotype.EVENT]: [Nature.EVENT],
  [ClassStereotype.SITUATION]: [Nature.SITUATION],

  [ClassStereotype.CATEGORY]: EndurantNatures,
  [ClassStereotype.MIXIN]: EndurantNatures,
  [ClassStereotype.ROLE_MIXIN]: EndurantNatures,
  [ClassStereotype.PHASE_MIXIN]: EndurantNatures,
  [ClassStereotype.HISTORICAL_ROLE_MIXIN]: EndurantNatures,

  [ClassStereotype.KIND]: [Nature.FUNCTIONAL_COMPLEX],
  [ClassStereotype.COLLECTIVE]: [Nature.COLLECTIVE],
  [ClassStereotype.QUANTITY]: [Nature.QUANTITY],
  [ClassStereotype.RELATOR]: [Nature.RELATOR],
  [ClassStereotype.MODE]: [Nature.EXTRINSIC_MODE, Nature.INTRINSIC_MODE],
  [ClassStereotype.QUALITY]: [Nature.QUALITY],

  [ClassStereotype.SUBKIND]: EndurantNatures,
  [ClassStereotype.ROLE]: EndurantNatures,
  [ClassStereotype.PHASE]: EndurantNatures,
  [ClassStereotype.HISTORICAL_ROLE]: EndurantNatures,

  [ClassStereotype.TYPE]: [Nature.TYPE]
};

export class ClassVerification {
  static verifyClass(_class: Class): VerificationIssue[] {
    let foundIssues: VerificationIssue[] =
      ClassVerification.checkMinimalConsistency(_class);

    // The verification stops if one of the basic consistency rules are violated
    if (foundIssues.some((issue: VerificationIssue) => issue.isError())) {
      return foundIssues;
    }

    utils.pushItemsToArrayIfNotNull(
      foundIssues,
      ClassVerification.checkKindSpecialization(_class),
      ClassVerification.checkCompatibleNatures(_class),
      ClassVerification.checkMissingNatures(_class),
      ClassVerification.checkMissingIsPowertype(_class),
      ClassVerification.checkMissingOrder(_class)
    );

    return foundIssues;
  }

  static checkMinimalConsistency(_class: Class): VerificationIssue[] {
    const issues: VerificationIssue[] = [];

    if (!_class.stereotype) {
      issues.push(VerificationIssue.createClassNotUniqueStereotype(_class));
    } else if (!_class.getAllowedStereotypes().includes(_class.stereotype)) {
      issues.push(
        VerificationIssue.createClassInvalidOntoumlStereotype(_class)
      );
    }

    if (_class.isEnumeration() && _class.hasAttributes()) {
      issues.push(
        VerificationIssue.createClassEnumerationWithProperties(_class)
      );
    } else if (!_class.isEnumeration() && _class.hasLiterals()) {
      issues.push(
        VerificationIssue.createClassNonEnumerationWithLiterals(_class)
      );
    }

    return issues;
  }

  static checkKindSpecialization(_class: Class): VerificationIssue | null {
    if (!!_class.stereotype && _class.isSortal()) {
      const ultimateSortalAncestors =
        ClassVerification.getUltimateSortalAncestors(_class);

      if (_class.isIdentityProvider() && ultimateSortalAncestors.length > 0) {
        return VerificationIssue.createClassIdentityProviderSpecialization(
          _class,
          ultimateSortalAncestors
        );
      } else if (
        !_class.isIdentityProvider() &&
        ultimateSortalAncestors.length > 1
      ) {
        return VerificationIssue.createClassMultipleIdentityProviders(
          _class,
          ultimateSortalAncestors
        );
      } else if (
        !_class.isIdentityProvider() &&
        ultimateSortalAncestors.length === 0 &&
        !_class.isHighOrderType()
      ) {
        // TODO: review this coding based on language updates
        return VerificationIssue.createClassMissingIdentityProvider(_class);
      }
    }

    return null;
  }

  static checkCompatibleNatures(_class: Class): VerificationIssue | null {
    if (!_class.restrictedTo || !_class.stereotype) {
      return null;
    }

    const stereotype = _class.stereotype;
    const allowedNatures = allowedStereotypeRestrictedToMatches[stereotype];
    const incompatibleNatures = !_class.restrictedTo
      ? []
      : _class.restrictedTo.filter(
          (nature: Nature) => allowedNatures && !allowedNatures.includes(nature)
        );

    return incompatibleNatures.length < 1
      ? null
      : VerificationIssue.createClassIncompatibleNatures(_class);
  }

  static checkMissingNatures(_class: Class): VerificationIssue | null {
    if (!_class.stereotype) {
      return null;
    }

    return !Array.isArray(_class.restrictedTo) || !_class.restrictedTo.length
      ? VerificationIssue.createClassMissingNatureRestrictions(_class)
      : null;
  }

  static checkMissingIsPowertype(_class: Class): VerificationIssue | null {
    if (!_class.isType()) {
      return null;
    }

    return (_class.isPowertype as boolean | null) === null
      ? VerificationIssue.createClassMissingIsPowertype(_class)
      : null;
  }

  static checkMissingOrder(_class: Class): VerificationIssue | null {
    // TODO: update this when support to non-sortal types is implemented
    if (!_class.isType()) {
      return null;
    }

    return !_class.order
      ? VerificationIssue.createClassMissingOrder(_class)
      : null;
  }

  /**
   * Retrieves the direct and indirect ancestors of a class that are ultimate
   * sortals. Unlike `Class.getIdentityProviderAncestors()` of the new
   * ontouml-js, this traversal tolerates circular generalization chains and
   * stereotype-less ancestors instead of throwing, preserving the original
   * behavior of the verification service. Relation-typed ancestors — which are
   * reachable through generalizations that irregularly mix classes and
   * relations, a state flagged by the generalization rules — are traversed but
   * never reported, since only classes can be ultimate sortals.
   */
  private static getUltimateSortalAncestors(_class: Class): Class[] {
    const visited = new Set<Classifier<any, any>>();
    const queue: Classifier<any, any>[] = _class.getParents();

    while (queue.length > 0) {
      const ancestor = queue.shift()!;

      if (ancestor !== _class && !visited.has(ancestor)) {
        visited.add(ancestor);
        queue.push(...ancestor.getParents());
      }
    }

    return [...visited].filter(
      (ancestor): ancestor is Class =>
        ancestor instanceof Class &&
        !!ancestor.stereotype &&
        ancestor.isIdentityProvider()
    );
  }
}
