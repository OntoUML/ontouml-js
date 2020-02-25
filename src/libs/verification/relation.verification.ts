import { IRelation } from '@types';
import { VerificationIssue } from './issue';

export const RelationVerification = {
  checkMinimalConsistency(relation: IRelation): VerificationIssue {
    throw 'Unimplemented constraint';
  },
};
