
import { Project } from '@libs/ontouml';

export interface TestResource {
  title: string;
  project: Project;
  scripts: string[];
  obdaMapping: string[];
}
