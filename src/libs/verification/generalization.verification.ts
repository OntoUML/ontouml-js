import { IGeneralization, IClass } from '@types';
import { VerificationIssue, VerificationIssueCode } from './issues';
import { OntoumlType, ClassStereotype, OntologicalNature } from '@constants/.';

export const GeneralizationVerification = {
  checkMinimalConsistency(generalization: IGeneralization): VerificationIssue[] {
    const consistencyIssues: VerificationIssue[] = [];
    const general = generalization.general;
    const specific = generalization.specific;

    if (general.type !== OntoumlType.CLASS_TYPE && general.type !== OntoumlType.RELATION_TYPE) {
      // TODO: Bad general reference
    }

    if (specific.type !== OntoumlType.CLASS_TYPE && specific.type !== OntoumlType.RELATION_TYPE) {
      // TODO: Bad specific reference
    }

    if (general.type !== specific.type) {
      // TODO: Incompatible generalization
    }

    if (general.id === specific.id) {
      // TODO: Circular generalization
    }

    return consistencyIssues;
  },

  check(generalization: IGeneralization): VerificationIssue[] {
    const potentialIssues: VerificationIssue[] = [
      // each verification goes here
      this.checkGeneralizationSortality(generalization),
      this.checkGeneralizationRigidity(generalization),
      // this.checkGeneralizationDatatype(generalization),  TODO: add tests and enable
      // this.checkGeneralizationEnumeration(generalization), TODO: add tests and enable
      this.checkGeneralizationCompatibleNatures(generalization)
    ];

    return potentialIssues;
  },

  checkGeneralizationSortality(generalization: IGeneralization): VerificationIssue {
    const general: IClass = generalization.general as IClass;
    const specific: IClass = generalization.specific as IClass;

    if (general.type !== OntoumlType.CLASS_TYPE || specific.type !== OntoumlType.CLASS_TYPE) {
      return null;
    }

    return general.isSortal() && specific.isNonSortal()
      ? new VerificationIssue(VerificationIssueCode.generalization_incompatible_class_sortality, generalization, [
          general,
          specific
        ])
      : null;
  },

  checkGeneralizationRigidity(generalization: IGeneralization): VerificationIssue {
    const general: IClass = generalization.general as IClass;
    const specific: IClass = generalization.specific as IClass;

    if (general.type !== OntoumlType.CLASS_TYPE || specific.type !== OntoumlType.CLASS_TYPE) {
      return null;
    }

    return general.isAntiRigid() && (specific.isRigid() || specific.isSemiRigid())
      ? new VerificationIssue(VerificationIssueCode.generalization_incompatible_class_rigidity, generalization, [
          general,
          specific
        ])
      : null;
  },

  checkGeneralizationDatatype(generalization: IGeneralization): VerificationIssue {
    const general: IClass = generalization.general as IClass;
    const specific: IClass = generalization.specific as IClass;

    if (
      general.type !== OntoumlType.CLASS_TYPE ||
      specific.type !== OntoumlType.CLASS_TYPE ||
      !general.stereotypes ||
      !specific.stereotypes
    ) {
      return null;
    }

    return (general.stereotypes.includes[ClassStereotype.DATATYPE] || specific.stereotypes.includes[ClassStereotype.DATATYPE]) &&
      general.stereotypes[0] !== specific.stereotypes[0]
      ? new VerificationIssue(VerificationIssueCode.generalization_incompatible_datatype, generalization, [general, specific])
      : null;
  },

  checkGeneralizationEnumeration(generalization: IGeneralization): VerificationIssue {
    const general: IClass = generalization.general as IClass;
    const specific: IClass = generalization.specific as IClass;

    if (
      general.type !== OntoumlType.CLASS_TYPE ||
      specific.type !== OntoumlType.CLASS_TYPE ||
      !general.stereotypes ||
      !specific.stereotypes
    ) {
      return null;
    }

    return (general.stereotypes.includes[ClassStereotype.ENUMERATION] ||
      specific.stereotypes.includes[ClassStereotype.ENUMERATION]) &&
      general.stereotypes[0] !== specific.stereotypes[0]
      ? new VerificationIssue(VerificationIssueCode.generalization_incompatible_enumeration, generalization, [general, specific])
      : null;
  },

  checkGeneralizationCompatibleNatures(generalization: IGeneralization): VerificationIssue {
    const general: IClass = generalization.general as IClass;
    const specific: IClass = generalization.specific as IClass;

    if (
      general.type !== OntoumlType.CLASS_TYPE ||
      specific.type !== OntoumlType.CLASS_TYPE ||
      !general.allowed ||
      !specific.allowed
    ) {
      return null;
    }

    return specific.allowed.find((nature: OntologicalNature) => !general.allowed.includes(nature))
      ? new VerificationIssue(VerificationIssueCode.generalization_incompatible_natures, generalization, [general, specific])
      : null;
  }
};
