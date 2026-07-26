import { Anchor } from '../model/anchor';
import { Class } from '../model/class';
import { Generalization } from '../model/generalization';
import { GeneralizationSet } from '../model/generalization_set';
import { Literal } from '../model/literal';
import { ModelElement } from '../model/model_element';
import { Note } from '../model/note';
import { Package } from '../model/package';
import { Property } from '../model/property';
import { Relation } from '../model/relation';
import { Project } from '../project';
import { Service } from '../service/service';
import { ServiceOptions } from '../service/service_options';
import { VerificationIssue } from './verification_issue';
import { ClassVerification } from './class_verification';
import { GeneralizationVerification } from './generalization_verification';
import { GeneralizationSetVerification } from './generalization_set_verification';
import { LiteralVerification } from './literal_verification';
import { PackageVerification } from './package_verification';
import { ProjectVerification } from './project_verification';
import { PropertyVerification } from './property_verification';
import { RelationVerification } from './relation_verification';

export interface VerificationOptions extends ServiceOptions {}

/**
 * Utility class for perform syntactical model verification
 *
 * @author Claudenir Fonseca
 * @author Lucas Bassetti
 */
export class OntoumlVerification implements Service {
  elementToVerify: ModelElement | Project;
  options: VerificationOptions | null;
  issues: VerificationIssue[];

  constructor(project: Project, options?: Partial<VerificationOptions>);
  constructor(
    elementToVerify: ModelElement,
    options?: Partial<VerificationOptions>
  );
  constructor(
    input: ModelElement | Project,
    options?: Partial<VerificationOptions>
  ) {
    this.options = options || null;
    this.issues = [];
    this.elementToVerify = input;
  }

  run(): { result: VerificationIssue[] } {
    return {
      result: (this.issues = OntoumlVerification.verify(this.elementToVerify))
    };
  }

  static verify(element: ModelElement | Project): VerificationIssue[] {
    // In the new ontouml-js API, `Relation` is abstract with `BinaryRelation` and
    // `NaryRelation` subclasses, so dispatching is based on `instanceof` rather
    // than on the element's constructor.
    if (element instanceof Class) {
      return ClassVerification.verifyClass(element);
    } else if (element instanceof GeneralizationSet) {
      return GeneralizationSetVerification.verifyGeneralizationSet(element);
    } else if (element instanceof Generalization) {
      return GeneralizationVerification.verifyGeneralization(element);
    } else if (element instanceof Literal) {
      return LiteralVerification.verifyLiteral(element);
    } else if (element instanceof Package) {
      return PackageVerification.verifyPackage(element);
    } else if (element instanceof Project) {
      return ProjectVerification.verifyProject(element);
    } else if (element instanceof Property) {
      return PropertyVerification.verifyProperty(element);
    } else if (element instanceof Relation) {
      return RelationVerification.verifyRelation(element);
    } else if (element instanceof Note || element instanceof Anchor) {
      // Notes and anchors are documentation elements introduced by the new
      // ontouml-js API and are not subject to syntactical verification.
      return [];
    } else {
      throw new Error(`Unexpected element to be verified.`);
    }
  }
}
