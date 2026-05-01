import { ServiceIssue, ServiceIssueSeverity } from '..';
import { OntoumlElement } from '@libs/ontouml';

export const IssueType = {
  UNKNOWN_CLASS_STEREOTYPE: {
    code: 'UNKNOWN_CLASS_STEREOTYPE',
    severity: ServiceIssueSeverity.ERROR,
    title: 'Unknown Class Stereotype'
  },
  MISSING_VALUE_DEFAULTED: {
    code: 'MISSING_VALUE_DEFAULTED',
    severity: ServiceIssueSeverity.WARNING,
    title: 'Missing Value Defaulted'
  },
  UNSUPPORTED_ELEMENT_REMOVED: {
    code: 'UNSUPPORTED_ELEMENT_REMOVED',
    severity: ServiceIssueSeverity.WARNING,
    title: 'Unsupported Element Removed'
  },
  INCOMPLETE_RELATOR_PATTERN: {
    code: 'INCOMPLETE_RELATOR_PATTERN',
    severity: ServiceIssueSeverity.WARNING,
    title: 'Incomplete Relator Pattern'
  },
  DATATYPE_NOT_FOUND: {
    code: 'DATATYPE_NOT_FOUND',
    severity: ServiceIssueSeverity.WARNING,
    title: 'Datatype Not Found'
  }
};

export function createIssue(
  element: OntoumlElement,
  issueType: Pick<ServiceIssue, 'code' | 'severity' | 'title'>,
  description: string
): ServiceIssue {
  return {
    id: element.id,
    ...issueType,
    description,
    data: element
  };
}
