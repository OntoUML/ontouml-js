import { Project } from '@libs/ontouml';
import { Service } from '@libs/service';
import { ServiceIssue } from '@libs/service_issue';
import { RelOverFinder } from '.';

/**
 * @author Tiago Sales
 * @author Mattia Fumagalli
 */

export class AntiPatternFinder implements Service {
  project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  run(): { result: any; issues?: ServiceIssue[] } {
    const finder: RelOverFinder = new RelOverFinder(this.project);
    return finder.run();
  }
}