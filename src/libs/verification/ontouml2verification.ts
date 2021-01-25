import {
  Class,
  Generalization,
  GeneralizationSet,
  Literal,
  ModelElement,
  Package,
  Project,
  Property,
  Relation
} from '@libs/ontouml';
import {
  VerificationIssue,
  ClassVerification,
  GeneralizationVerification,
  GeneralizationSetVerification,
  LiteralVerification,
  PackageVerification,
  ProjectVerification,
  PropertyVerification,
  RelationVerification
} from '@libs/verification';
import _ from 'lodash';

export interface VerificationOptions {}

/**
 * Utility class for perform syntactical model verification
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class Ontouml2Verification {
  elementToVerify: ModelElement | Project;
  options: VerificationOptions;
  issues: VerificationIssue[];

  constructor(project: Project, options?: Partial<VerificationOptions>);
  constructor(elementToVerify: ModelElement, options?: Partial<VerificationOptions>);
  constructor(input: ModelElement | Project, options?: Partial<VerificationOptions>) {
    this.options = options || null;
    this.issues = [];
    this.elementToVerify = input;
  }

  run(): VerificationIssue[] {
    return (this.issues = Ontouml2Verification.verify(this.elementToVerify));
  }

  static verify(element: ModelElement | Project): VerificationIssue[] {
    switch (element.constructor) {
      case Class:
        return ClassVerification.verifyClass(element as Class);
      case GeneralizationSet:
        return GeneralizationVerification.verifyGeneralization(element as Generalization);
      case Generalization:
        return GeneralizationSetVerification.verifyGeneralizationSet(element as GeneralizationSet);
      case Literal:
        return LiteralVerification.verifyLiteral(element as Literal);
      case Package:
        return PackageVerification.verifyPackage(element as Package);
      case Project:
        return ProjectVerification.verifyProject(element as Project);
      case Property:
        return PropertyVerification.verifyProperty(element as Property);
      case Relation:
        return RelationVerification.verifyRelation(element as Relation);
      default:
        throw new Error(`Unexpected element to be verified.`);
    }
  }
}
