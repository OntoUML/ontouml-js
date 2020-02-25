import { ILiteral } from '@types';
import { VerificationIssue } from './issue';

export const LiteralVerification = {
  checkMinimalConsistency(literal: ILiteral): VerificationIssue {
    throw 'Unimplemented constraint';
  },
};
