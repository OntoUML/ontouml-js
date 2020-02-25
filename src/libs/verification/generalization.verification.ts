import { IGeneralization } from '@types';
import { VerificationIssue } from './issue';

export const GeneralizationVerification = {
  checkMinimalConsistency(generalization: IGeneralization): VerificationIssue {
    throw 'Unimplemented constraint';
  },
};
