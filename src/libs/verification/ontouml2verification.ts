import {
  Class,
  Generalization,
  GeneralizationSet,
  Literal,
  ModelElement,
  OntoumlType,
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

export class Ontouml2Verification {
  elementToVerify: ModelElement;
  options: VerificationOptions;
  issues: VerificationIssue[];

  constructor(elementToVerify: ModelElement, options: Partial<VerificationOptions>) {
    this.options = options;
    this.elementToVerify = elementToVerify;
    this.issues = [];
  }

  run(): VerificationIssue[] {
    return Ontouml2Verification.verify(this.elementToVerify);
  }

  static verify(_class: Class): VerificationIssue[];
  static verify(generalization: Generalization): VerificationIssue[];
  static verify(generalizationSet: GeneralizationSet): VerificationIssue[];
  static verify(literal: Literal): VerificationIssue[];
  static verify(_package: Package): VerificationIssue[];
  static verify(Project: Project): VerificationIssue[];
  static verify(property: Property): VerificationIssue[];
  static verify(relation: Relation): VerificationIssue[];
  static verify(element: ModelElement | Project): VerificationIssue[] {
    switch (element.type) {
      case OntoumlType.CLASS_TYPE:
        return ClassVerification.verifyClass(element as Class);
      case OntoumlType.GENERALIZATION_SET_TYPE:
        return GeneralizationVerification.verifyGeneralization(element as Generalization);
      case OntoumlType.GENERALIZATION_TYPE:
        return GeneralizationSetVerification.verifyGeneralizationSet(element as GeneralizationSet);
      case OntoumlType.LITERAL_TYPE:
        return LiteralVerification.verifyLiteral(element as Literal);
      case OntoumlType.PACKAGE_TYPE:
        return PackageVerification.verifyPackage(element as Package);
      case OntoumlType.PROJECT_TYPE:
        return ProjectVerification.verifyProject(element as Project);
      case OntoumlType.PROPERTY_TYPE:
        return PropertyVerification.verifyProperty(element as Property);
      case OntoumlType.RELATION_TYPE:
        return RelationVerification.verifyRelation(element as Relation);
      default:
        throw new Error(`Unexpected element to be verified.`);
    }
  }
}
