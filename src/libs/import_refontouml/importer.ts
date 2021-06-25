import { Class, GeneralizationSet, Generalization, Diagram, Project } from '@libs/ontouml';
import { Service } from '@libs/service';
import { ServiceIssue } from '@libs/service_issue';

export class RefOntoumlImporter implements Service {
  refontouml: object;

  constructor(refontouml: object, _options?: any) {
    this.refontouml = refontouml;

    if (_options) {
      console.log('Options ignored: this service does not support options');
    }
  }

  run(): { result: Project; issues?: ServiceIssue[] } {
    const project: Project = this.import();

    return {
      result: project,
      issues: null
    };
  }

  import(): Project {
    return null;
  }
}
