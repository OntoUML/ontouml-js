import { IGeneralization } from '@types';
import { VerificationIssue } from './issues';

export const GeneralizationVerification = {
  checkMinimalConsistency(generalization: IGeneralization): VerificationIssue {
    throw 'Unimplemented constraint';
  },
};
