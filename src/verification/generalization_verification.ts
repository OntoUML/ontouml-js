import { Class } from '../model/class';
import { Generalization } from '../model/generalization';
import { VerificationIssue } from './verification_issue';
import { utils } from './utils';

export class GeneralizationVerification {
  static verifyGeneralization(
    generalization: Generalization
  ): VerificationIssue[] {
    let foundIssues: VerificationIssue[] =
      GeneralizationVerification.checkMinimalConsistency(generalization);

    if (foundIssues.some((issue: VerificationIssue) => issue.isError())) {
      return foundIssues;
    }

    utils.pushItemsToArrayIfNotNull(
      foundIssues,
      GeneralizationVerification.checkGeneralizationSortality(generalization),
      GeneralizationVerification.checkGeneralizationRigidity(generalization),
      GeneralizationVerification.checkGeneralizationDatatype(generalization),
      GeneralizationVerification.checkGeneralizationEnumeration(generalization),
      GeneralizationVerification.checkGeneralizationCompatibleNatures(
        generalization
      )
    );

    return foundIssues;
  }

  static checkMinimalConsistency(
    generalization: Generalization
  ): VerificationIssue[] {
    const consistencyIssues: VerificationIssue[] = [];
    const general = generalization.general;
    const specific = generalization.specific;

    // TODO: Check whether it is necessary to check if the generalization does strictly involve classes or relations

    if (
      !generalization.involvesClasses() &&
      !generalization.involvesRelations()
    ) {
      consistencyIssues.push(
        VerificationIssue.createGeneralizationIncompatibleGeneralAndSpecificTypes(
          generalization
        )
      );
    }

    if (general.id === specific.id) {
      consistencyIssues.push(
        VerificationIssue.createGeneralizationCircular(generalization)
      );
    }

    return consistencyIssues;
  }

  static checkGeneralizationSortality(
    generalization: Generalization
  ): VerificationIssue | null {
    if (!generalization.involvesClasses()) {
      return null;
    }

    const general = generalization.general as Class;
    const specific = generalization.specific as Class;

    return !!general.stereotype &&
      general.isSortal() &&
      !!specific.stereotype &&
      specific.isNonSortal()
      ? VerificationIssue.createGeneralizationIncompatibleClassSortality(
          generalization
        )
      : null;
  }

  static checkGeneralizationRigidity(
    generalization: Generalization
  ): VerificationIssue | null {
    if (!generalization.involvesClasses()) {
      return null;
    }

    const general = generalization.general as Class;
    const specific = generalization.specific as Class;

    return !!general.stereotype &&
      general.isAntiRigid() &&
      !!specific.stereotype &&
      (specific.isRigid() || specific.isSemiRigid())
      ? VerificationIssue.createGeneralizationIncompatibleClassRigidity(
          generalization
        )
      : null;
  }

  static checkGeneralizationDatatype(
    generalization: Generalization
  ): VerificationIssue | null {
    if (
      !generalization.involvesClasses() ||
      !generalization.general.stereotype ||
      !generalization.specific.stereotype
    ) {
      return null;
    }

    const general = generalization.general as Class;
    const specific = generalization.specific as Class;

    return (general.isDatatype() || specific.isDatatype()) &&
      general.stereotype !== specific.stereotype
      ? VerificationIssue.createGeneralizationIncompatibleDatatype(
          generalization
        )
      : null;
  }

  static checkGeneralizationEnumeration(
    generalization: Generalization
  ): VerificationIssue | null {
    if (
      !generalization.involvesClasses() ||
      !generalization.general.stereotype ||
      !generalization.specific.stereotype
    ) {
      return null;
    }

    const general = generalization.general as Class;
    const specific = generalization.specific as Class;

    return (general.isEnumeration() || specific.isEnumeration()) &&
      general.stereotype !== specific.stereotype
      ? VerificationIssue.createGeneralizationIncompatibleEnumeration(
          generalization
        )
      : null;
  }

  static checkGeneralizationCompatibleNatures(
    generalization: Generalization
  ): VerificationIssue | null {
    if (!generalization.involvesClasses()) {
      return null;
    }

    const general = generalization.general as Class;
    const specific = generalization.specific as Class;

    return !general.allowsAll(specific.restrictedTo)
      ? VerificationIssue.createGeneralizationIncompatibleNatures(
          generalization
        )
      : null;
  }
}
