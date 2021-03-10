import { Relation } from '@libs/ontouml';
import { VerificationIssue } from './';

export class RelationVerification {
  static verifyRelation(_relation: Relation): VerificationIssue[] {
    const foundIssues: VerificationIssue[] = [];
    return foundIssues;
  }
}
