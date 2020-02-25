import { IProperty } from '@types';
import { VerificationIssue } from './issue';

export const PropertyVerification = {
  checkMinimalConsistency(property: IProperty): VerificationIssue {
    throw 'Unimplemented constraint';
  },
};
