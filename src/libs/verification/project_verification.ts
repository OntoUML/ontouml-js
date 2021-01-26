import { Project, ModelElement } from '@libs/ontouml';
import { VerificationIssue, OntoumlVerification } from './';
import _ from 'lodash';

export class ProjectVerification {
  static verifyProject(project: Project): VerificationIssue[] {
    let foundIssues: VerificationIssue[] = [];

    project
      .getContents()
      .forEach((element: ModelElement) => (foundIssues = _.concat(foundIssues, OntoumlVerification.verify(element))));

    return foundIssues;
  }
}
