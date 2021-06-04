import { GeneralizationSet, Project } from '@libs/ontouml';
import { Service } from '@libs/service';
import { ServiceIssue } from '@libs/service_issue';

/**
 * @author Tiago Sales
 * @author Mattia Fumagalli
 */

export class RelOverAntiPattern implements Service {
  project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  run(): { result: any; issues?: ServiceIssue[] } {
    return null;
  }

  static checkIncompleteGeneralizationSet(project: Project): boolean {
    const genSets = project.getAllGeneralizationSets();

    return Array.isArray(genSets) && genSets.some((genSet: GeneralizationSet) => !genSet.isComplete);
  }
}
