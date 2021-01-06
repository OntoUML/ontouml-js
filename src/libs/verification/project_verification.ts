import { Project, ModelElement } from '@libs/ontouml';
import { VerificationIssue, Ontouml2Verification } from './';
import _ from 'lodash';

export class ProjectVerification {
  static verifyProject(project: Project): VerificationIssue[] {
    let foundIssues: VerificationIssue[] = [];

    project
      .getAllContents()
      .forEach((element: ModelElement) => (foundIssues = _.concat(foundIssues, Ontouml2Verification.verify(element))));

    return foundIssues;
  }
}
