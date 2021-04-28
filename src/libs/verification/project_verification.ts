import { Project, ModelElement } from '@libs/ontouml';
import { VerificationIssue, OntoumlVerification } from './';
import _ from 'lodash';

export class ProjectVerification {
  static verifyProject(project: Project): VerificationIssue[] {
    let foundIssues: VerificationIssue[] = [];
    const model = project.model;

    if (model) {
      foundIssues = _.concat(foundIssues, OntoumlVerification.verify(model));
    }

    return foundIssues;
  }
}
