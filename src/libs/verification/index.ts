import {
  IPackage,
  IElement,
  IClass,
  IGeneralization,
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
        case OntoUMLType.PACKAGE_TYPE:
          // const _package = element as IPackage;
          // const _package: IPackage = element as IPackage;
          break;

        case OntoUMLType.CLASS_TYPE:
          const _class: IClass = element as IClass;
          const classConsistencyIssues: VerificationIssue[] = ClassVerification.checkMinimalConsistency(
            _class
          );
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

        case OntoUMLType.RELATION_TYPE:
          // const relation = element as IRelation;
          // const relation: IRelation = element as IRelation;
          break;

        case OntoUMLType.GENERALIZATION_TYPE:
          // const generalization = element as IGeneralization;
          const generalization: IGeneralization = element as IGeneralization;
          const genConsistencyIssues: VerificationIssue[] = GeneralizationVerification.checkMinimalConsistency(
            generalization
          );
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

        case OntoUMLType.GENERALIZATION_SET_TYPE:
          // const generalizationSet = element as IGeneralizationSet;
          // const generalizationSet: IGeneralizationSet = element as IGeneralizationSet;
          break;

        case OntoUMLType.PROPERTY_TYPE:
          // const property = element as IProperty;
          // const property: IProperty = element as IProperty;
          break;

        case OntoUMLType.LITERAL_TYPE:
          // const literal = element as ILiteral;
          // const literal: ILiteral = element as ILiteral;
          break;

        default:
          throw { title: 'Unable to verify element', element: element };
      }
    });

    return issues.filter((issue: VerificationIssue) => (issue ? true : false));
  }
}
