import { Project } from '@libs/ontouml';
import { Service } from '@libs/service';
import { ServiceIssue } from '@libs/service_issue';
import { RelOverAntipattern } from '.';

/**
 * @author Tiago Sales
 * @author Mattia Fumagalli
 */

export class AntipatternFinder implements Service {
  project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  run(): { result: any; issues?: ServiceIssue[] } {
    const finder: RelOverAntipattern = new RelOverAntipattern(this.project);
    return finder.run();
  }
}
