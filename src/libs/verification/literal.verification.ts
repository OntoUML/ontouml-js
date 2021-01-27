import { ILiteral } from '@types';
import { VerificationIssue } from './issues';

export const LiteralVerification = {
  checkMinimalConsistency(literal: ILiteral): VerificationIssue {
    throw 'Unimplemented constraint';
  }
};
