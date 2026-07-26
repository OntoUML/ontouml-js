import { Literal } from '../model/literal';
import { VerificationIssue } from './verification_issue';

export class LiteralVerification {
  static verifyLiteral(_literal: Literal): VerificationIssue[] {
    const foundIssues: VerificationIssue[] = [];
    return foundIssues;
  }
}
