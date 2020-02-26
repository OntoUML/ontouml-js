import { IRelation } from '@types';
import { VerificationIssue } from './issues';

export const RelationVerification = {
  checkMinimalConsistency(relation: IRelation): VerificationIssue {
    throw 'Unimplemented constraint';
  },
};
