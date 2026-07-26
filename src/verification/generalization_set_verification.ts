import { GeneralizationSet } from '../model/generalization_set';
import { VerificationIssue } from './verification_issue';

export class GeneralizationSetVerification {
  static verifyGeneralizationSet(
    _generalizationSet: GeneralizationSet
  ): VerificationIssue[] {
    const foundIssues: VerificationIssue[] = [];
    return foundIssues;
  }
}
