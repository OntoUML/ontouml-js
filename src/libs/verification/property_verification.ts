import { Property } from '@libs/ontouml';
import { VerificationIssue } from './';

export class PropertyVerification {
  static verifyProperty(_property: Property): VerificationIssue[] {
    const foundIssues: VerificationIssue[] = [];
    return foundIssues;
  }
}
