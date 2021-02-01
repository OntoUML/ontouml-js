import { Generalization } from '@libs/ontouml';
import { VerificationIssue, utils } from './';

export class GeneralizationVerification {
  static verifyGeneralization(generalization: Generalization): VerificationIssue[] {
    let foundIssues: VerificationIssue[] = GeneralizationVerification.checkMinimalConsistency(generalization);

    if (foundIssues.some((issue: VerificationIssue) => issue.isError())) {
      return foundIssues;
    }

    utils.pushItemsToArrayIfNotNull(
      foundIssues,
      GeneralizationVerification.checkGeneralizationSortality(generalization),
      GeneralizationVerification.checkGeneralizationRigidity(generalization),
      GeneralizationVerification.checkGeneralizationDatatype(generalization),
      GeneralizationVerification.checkGeneralizationEnumeration(generalization),
      GeneralizationVerification.checkGeneralizationCompatibleNatures(generalization)
    );

    return foundIssues;
  }

  static checkMinimalConsistency(generalization: Generalization): VerificationIssue[] {
    const consistencyIssues: VerificationIssue[] = [];
    const general = generalization.general;
    const specific = generalization.specific;

    // TODO: Check whether it is necessary to check if the generalization does strictly involve classes or relations

    if (general.type !== specific.type) {
      consistencyIssues.push(VerificationIssue.createGeneralizationIncompatibleGeneralAndSpecificTypes(generalization));
    }

    if (general.id === specific.id) {
      consistencyIssues.push(VerificationIssue.createGeneralizationCircular(generalization));
    }

    return consistencyIssues;
  }

  static checkGeneralizationSortality(generalization: Generalization): VerificationIssue {
    if (!generalization.involvesClasses()) {
      return null;
    }

    const general = generalization.getGeneralClass();
    const specific = generalization.getSpecificClass();

    return general.hasSortalStereotype() && specific.hasNonSortalStereotype()
      ? VerificationIssue.createGeneralizationIncompatibleClassSortality(generalization)
      : null;
  }

  static checkGeneralizationRigidity(generalization: Generalization): VerificationIssue {
    if (!generalization.involvesClasses()) {
      return null;
    }

    const general = generalization.getGeneralClass();
    const specific = generalization.getSpecificClass();

    return general.hasAntiRigidStereotype() && (specific.hasRigidStereotype() || specific.hasSemiRigidStereotype())
      ? VerificationIssue.createGeneralizationIncompatibleClassRigidity(generalization)
      : null;
  }

  static checkGeneralizationDatatype(generalization: Generalization): VerificationIssue {
    if (!generalization.involvesClasses() || !generalization.general.stereotype || !generalization.specific.stereotype) {
      return null;
    }

    const general = generalization.getGeneralClass();
    const specific = generalization.getSpecificClass();

    return (general.hasDatatypeStereotype() || specific.hasDatatypeStereotype()) && general.stereotype !== specific.stereotype
      ? VerificationIssue.createGeneralizationIncompatibleDatatype(generalization)
      : null;
  }

  static checkGeneralizationEnumeration(generalization: Generalization): VerificationIssue {
    if (!generalization.involvesClasses() || !generalization.general.stereotype || !generalization.specific.stereotype) {
      return null;
    }

    const general = generalization.getGeneralClass();
    const specific = generalization.getSpecificClass();

    return (general.hasEnumerationStereotype() || specific.hasEnumerationStereotype()) &&
      general.stereotype !== specific.stereotype
      ? VerificationIssue.createGeneralizationIncompatibleEnumeration(generalization)
      : null;
  }

  static checkGeneralizationCompatibleNatures(generalization: Generalization): VerificationIssue {
    if (!generalization.involvesClasses()) {
      return null;
    }

    const general = generalization.getGeneralClass();
    const specific = generalization.getSpecificClass();

    return !general.restrictedToContains(specific.restrictedTo)
      ? VerificationIssue.createGeneralizationIncompatibleNatures(generalization)
      : null;
  }
}
