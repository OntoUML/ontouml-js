import { Project, Class } from '@libs/ontouml';
import { Service } from '@libs/service';
import { ServiceIssue } from '@libs/service_issue';
import { RelOverOccurrence } from './relover_occurrence';

/**
 * A class designed to find occurrences of the RelOver antipattern in an OntoUML project.
 *
 * RelOver is described in the paper XYZ.
 *
 * @author Tiago Sales
 * @author Mattia Fumagalli
 */

export class RelOverFinder implements Service {
  project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  run(): { result: RelOverOccurrence[]; issues?: ServiceIssue[] } {
    let relators = this.project.getClassesWithRelatorStereotype();

    let occurrences = relators
      .filter(relator => true /** replace with condition that*/)

      .map(relator => new RelOverOccurrence(relator));

    return { result: occurrences };
  }
}
