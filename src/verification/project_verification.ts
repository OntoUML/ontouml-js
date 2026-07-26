import { Project } from '../project';
import { VerificationIssue } from './verification_issue';
import { OntoumlVerification } from './ontouml_verification';
import _ from 'lodash';

export class ProjectVerification {
  static verifyProject(project: Project): VerificationIssue[] {
    let foundIssues: VerificationIssue[] = [];
    // In the new ontouml-js API, the "model" package of a project is its root package
    const model = project.root;

    if (model) {
      foundIssues = _.concat(foundIssues, OntoumlVerification.verify(model));
    }

    return foundIssues;
  }
}
