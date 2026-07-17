import { Project } from './project';

export interface ProjectElement {
  get project(): Project;
  set project(value: Project);
}
