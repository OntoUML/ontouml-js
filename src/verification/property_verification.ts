import { Property } from '../model/property';
import { VerificationIssue } from './verification_issue';

export class PropertyVerification {
  static verifyProperty(_property: Property): VerificationIssue[] {
    const foundIssues: VerificationIssue[] = [];
    return foundIssues;
  }
}
