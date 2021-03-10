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
import { Service, ServiceOptions } from './..';
import _ from 'lodash';

export interface VerificationOptions extends ServiceOptions {}

/**
 * Utility class for perform syntactical model verification
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class OntoumlVerification implements Service {
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

  run(): { result: VerificationIssue[] } {
    return {
      result: this.issues = OntoumlVerification.verify(this.elementToVerify)
    };
  }

  static verify(element: ModelElement | Project): VerificationIssue[] {
    switch (element && element.constructor) {
      case Class:
        return ClassVerification.verifyClass(element as Class);
      case GeneralizationSet:
        return GeneralizationSetVerification.verifyGeneralizationSet(element as GeneralizationSet);
      case Generalization:
        return GeneralizationVerification.verifyGeneralization(element as Generalization);
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
