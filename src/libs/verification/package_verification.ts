import { ModelElement, Package } from '@libs/ontouml';
import { VerificationIssue, Ontouml2Verification } from './';
import _ from 'lodash';

export class PackageVerification {
  static verifyPackage(_package: Package): VerificationIssue[] {
    let foundIssues: VerificationIssue[] = [];

    _package
      .getContents()
      .forEach((element: ModelElement) => (foundIssues = _.concat(foundIssues, Ontouml2Verification.verify(element))));

    return foundIssues;
  }
}
