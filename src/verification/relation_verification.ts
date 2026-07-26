import { Relation } from '../model/relation';
import { VerificationIssue } from './verification_issue';

export class RelationVerification {
  static verifyRelation(_relation: Relation): VerificationIssue[] {
    const foundIssues: VerificationIssue[] = [];
    return foundIssues;
  }
}
