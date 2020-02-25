import { IPackage } from '@types';
import { VerificationIssue } from './issue';

export const PackageVerification = {
  checkMinimalConsistency(_package: IPackage): VerificationIssue {
    throw 'Unimplemented constraint';
  },
};
