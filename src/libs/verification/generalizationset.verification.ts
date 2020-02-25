import { IGeneralizationSet } from '@types';
import { VerificationIssue } from './issue';

export const GeneralizationSetVerification = {
  checkMinimalConsistency(
    generalizationSet: IGeneralizationSet,
  ): VerificationIssue {
    throw 'Unimplemented constraint';
  },
};
