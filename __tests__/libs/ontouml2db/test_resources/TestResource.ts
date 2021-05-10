// import { ModelManager } from 'src';
import { GraphChecker } from './graph_tester/GraphChecker';
import { Project } from '@libs/ontouml';
import { OntoUML2DBOptions } from '@libs/ontouml2db';

export interface TestResource {
  title: string;
  checker: GraphChecker;
  project: Project;
  options: Partial<OntoUML2DBOptions>;
}
