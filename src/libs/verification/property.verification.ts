import { IProperty } from '@types';
import { VerificationIssue } from './issues';

export const PropertyVerification = {
  checkMinimalConsistency(property: IProperty): VerificationIssue {
    throw 'Unimplemented constraint';
  },
};
