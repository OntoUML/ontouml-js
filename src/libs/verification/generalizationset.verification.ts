import { IGeneralizationSet } from '@types';
import { VerificationIssue } from './issues';

export const GeneralizationSetVerification = {
  checkMinimalConsistency(generalizationSet: IGeneralizationSet): VerificationIssue {
    throw 'Unimplemented constraint';
  },
};
