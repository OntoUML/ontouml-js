import { ServiceIssueSeverity } from './';

/**
 * An interface that describes issue objects. Issues are designed to support the description of problems identified during the
 * execution of service.
 *
 * @field id: unique identifier of an issue in the context of a service request
 * @field code: code that identifies a single issue type
 * @field severity: severity level of the issue
 * @field title: human-readable title that is equal to all occurrences of a certain issue type
 * @field description: human-readable description of an issue that is specific to a single occurrence of an issue type
 * @field data: data related to the issue that may be used on the identification of the issue's source and its resolution
 */
export interface ServiceIssue {
  id: string;
  code: string;
  severity: ServiceIssueSeverity;
  title: string;
  description: string;
  data: any;
}
