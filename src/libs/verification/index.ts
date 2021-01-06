import { IPackage, IElement, IClass, IGeneralization } from '@types';
import { OntoumlType } from '@constants/.';
import { ClassVerification } from './class.verification';
import { VerificationIssue, IssueSeverity } from './issues';
import { ModelManager } from '@libs/model';
import { GeneralizationVerification } from './generalization.verification';

/**
 * Utility class for perform syntactical model verification
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class OntoUML2Verification {
  model: IPackage;

  constructor(modelManager: ModelManager) {
    this.model = modelManager.rootPackage;
  }

  async run(): Promise<VerificationIssue[]> {
    const allElements = [...this.model.getAllContents(), this.model];
    let issues: VerificationIssue[] = [];

    allElements.forEach((element: IElement) => {
      switch (element.type) {
        case OntoumlType.CLASS_TYPE:
          const _class: IClass = element as IClass;
          const classConsistencyIssues: VerificationIssue[] = ClassVerification.checkMinimalConsistency(_class);
          issues = [...issues, ...classConsistencyIssues];

          if (
            classConsistencyIssues &&
            classConsistencyIssues.find((issue: VerificationIssue) => issue.severity === IssueSeverity.error)
          ) {
            break;
          } else {
            issues = [...issues, ...ClassVerification.check(_class)];
          }
          break;

        case OntoumlType.GENERALIZATION_TYPE:
          const generalization: IGeneralization = element as IGeneralization;
          const genConsistencyIssues: VerificationIssue[] = GeneralizationVerification.checkMinimalConsistency(generalization);
          issues = [...issues, ...genConsistencyIssues];

          if (
            genConsistencyIssues &&
            genConsistencyIssues.find((issue: VerificationIssue) => issue.severity === IssueSeverity.error)
          ) {
            break;
          } else {
            issues = [...issues, ...GeneralizationVerification.check(generalization)];
          }
          break;

        case OntoumlType.PACKAGE_TYPE:
          break;
        case OntoumlType.RELATION_TYPE:
          break;
        case OntoumlType.GENERALIZATION_SET_TYPE:
          break;
        case OntoumlType.PROPERTY_TYPE:
          break;
        case OntoumlType.LITERAL_TYPE:
          break;

        default:
          throw { title: 'Unable to verify element', element: element };
      }
    });

    return issues.filter((issue: VerificationIssue) => (issue ? true : false));
  }
}

export * from './verification_issue';
export * from './ontouml2verification';
export * from './class_verification';
export * from './generalization_set_verification';
export * from './generalization_verification';
export * from './literal_verification';
export * from './package_verification';
export * from './project_verification';
export * from './property_verification';
export * from './relation_verification';
