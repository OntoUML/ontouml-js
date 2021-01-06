import { Package } from '@libs/ontouml';
import { VerificationIssue } from './';

export class PackageVerification {
  static verifyPackage(_package: Package): VerificationIssue[] {
    const foundIssues: VerificationIssue[] = [];
    return foundIssues;
  }
}
