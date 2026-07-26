import { ModelElement } from '../model/model_element';
import { Package } from '../model/package';
import { VerificationIssue } from './verification_issue';
import { OntoumlVerification } from './ontouml_verification';
import _ from 'lodash';

export class PackageVerification {
  static verifyPackage(_package: Package): VerificationIssue[] {
    let foundIssues: VerificationIssue[] = [];

    _package
      .getContents()
      .forEach(
        element =>
          (foundIssues = _.concat(
            foundIssues,
            OntoumlVerification.verify(element as ModelElement)
          ))
      );

    return foundIssues;
  }
}
