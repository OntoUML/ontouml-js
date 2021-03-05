// import { ModelManager } from 'src';
import { GraphChecker } from './graph_tester/GraphChecker';
import { Project } from '@libs/ontouml';

export interface TestResource {
  title: string;
  checker: GraphChecker;
  project: Project;
}
