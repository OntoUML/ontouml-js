import { ModelElement, Package } from '@libs/ontouml';
import { VerificationIssue, OntoumlVerification } from './';
import _ from 'lodash';

export class PackageVerification {
  static verifyPackage(_package: Package): VerificationIssue[] {
    let foundIssues: VerificationIssue[] = [];

    _package
      .getContents()
      .forEach((element: ModelElement) => (foundIssues = _.concat(foundIssues, OntoumlVerification.verify(element))));

    return foundIssues;
  }
}
