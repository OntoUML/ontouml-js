import { IClass } from '@types';
import { VerificationIssue, VerificationIssueCode } from './issue';
import pluralize from 'pluralize';

export const ClassVerification = {
  checkMinimalConsistency(_class: IClass): VerificationIssue[] {
    const consistencyIssues: VerificationIssue[] = [];

    if (!_class.stereotypes || _class.stereotypes.length !== 1) {
      consistencyIssues.push(
        new VerificationIssue(
          VerificationIssueCode.CLASS_NOT_UNIQUE_STEREOTYPE,
          _class,
        ),
      );
    }

    if (_class.name && pluralize.isPlural(_class.name)) {
      consistencyIssues.push(
        new VerificationIssue(VerificationIssueCode.CLASS_PLURAL_NAME, _class),
      );
    }

    return consistencyIssues;
  },

  async check(_class: IClass): Promise<VerificationIssue[]> {
    const potentialIssues: VerificationIssue[] = [
      // each verification goes here
    ];

    return potentialIssues;
  },
};
