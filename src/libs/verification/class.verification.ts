import { IClass } from '@types';
import { VerificationIssue, VerificationIssueCode } from './issues';
import pluralize from 'pluralize';
import { ClassStereotype } from '@constants/.';

export const ClassVerification = {
  checkMinimalConsistency(_class: IClass): VerificationIssue[] {
    const consistencyIssues: VerificationIssue[] = [];
    const classStereotypes = Object.values(ClassStereotype) as string[];

    if (!_class.stereotypes || _class.stereotypes.length !== 1) {
      consistencyIssues.push(
        new VerificationIssue(
          VerificationIssueCode.CLASS_NOT_UNIQUE_STEREOTYPE,
          _class,
        ),
      );
    } else if (!classStereotypes.includes(_class.stereotypes[0])) {
      consistencyIssues.push(
        new VerificationIssue(
          VerificationIssueCode.CLASS_INVALID_ONTOUML_STEREOTYPE,
          _class,
        ),
      );
    }

    if (_class.name && pluralize.isPlural(_class.name)) {
      consistencyIssues.push(
        new VerificationIssue(VerificationIssueCode.CLASS_PLURAL_NAME, _class),
      );
    }

    if (
      _class.stereotypes &&
      _class.stereotypes.includes(ClassStereotype.ENUMERATION) &&
      _class.properties
    ) {
      consistencyIssues.push(
        new VerificationIssue(
          VerificationIssueCode.CLASS_ENUMERATION_WITH_PROPERTIES,
          _class,
        ),
      );
    } else if (
      _class.stereotypes &&
      !_class.stereotypes.includes(ClassStereotype.ENUMERATION) &&
      _class.literals
    ) {
      consistencyIssues.push(
        new VerificationIssue(
          VerificationIssueCode.CLASS_NON_ENUMERATION_WITH_LITERALS,
          _class,
        ),
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
