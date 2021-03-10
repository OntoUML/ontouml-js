import { ServiceIssue } from './';

/**
 * An interface to be implemented by services processing OntoUML projects.
 *
 * **ATTENTION**: every service implementation is expected to include a constructor
 * with the following signature:
 * constructor(project: Project, options?: ServiceOptions)
 */
export interface Service {
  // I tried, but it is not possible to add to the interface a signature
  // for the constructor of an implementation class
  run(): { result: any; issues?: ServiceIssue[] };
}
