import { IPackage } from '@types';
import { VerificationIssue } from './issues';

export const PackageVerification = {
  checkMinimalConsistency(_package: IPackage): VerificationIssue {
    throw 'Unimplemented constraint';
  }
};
