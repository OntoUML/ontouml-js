import {
  IPackage,
  IElement,
  IClass,
  // IRelation,
  // IGeneralization,
  // IGeneralizationSet,
  // IProperty,
  // ILiteral,
} from '@types';
import { OntoUMLType } from '@constants/.';
import { ClassVerification } from './class.verification';
import { VerificationIssue, IssueSeverity } from './issues';
import { ModelManager } from '@libs/model';

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
        case OntoUMLType.PACKAGE_TYPE:
          // const _package = element as IPackage;
          break;
        case OntoUMLType.CLASS_TYPE:
          const _class: IClass = element as IClass;
          const consistencyIssues: VerificationIssue[] = ClassVerification.checkMinimalConsistency(
            _class,
          );
          issues = [...issues, ...consistencyIssues];

          if (
            consistencyIssues &&
            consistencyIssues.find(
              (issue: VerificationIssue) =>
                issue.severity === IssueSeverity.ERROR,
            )
          ) {
            break;
          } else {
            // calls other verifications
          }
          break;
        case OntoUMLType.RELATION_TYPE:
          // const relation = element as IRelation;
          break;
        case OntoUMLType.GENERALIZATION_TYPE:
          // const generalization = element as IGeneralization;
          break;
        case OntoUMLType.GENERALIZATION_SET_TYPE:
          // const generalizationSet = element as IGeneralizationSet;
          break;
        case OntoUMLType.PROPERTY_TYPE:
          // const property = element as IProperty;
          break;
        case OntoUMLType.LITERAL_TYPE:
          // const literal = element as ILiteral;
          break;
        default:
          throw { title: 'Unable to verify element', element: element };
      }
    });

    return issues;
  }
}
