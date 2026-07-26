import { Project } from './project';

/**
 * An element that belongs to a {@link Project}. Implemented by all elements
 * that exist within the scope of a project, such as model elements and
 * diagrams, giving them access to their owning project.
 */
export interface ProjectElement {
  /** The project that contains this element. */
  get project(): Project;
  set project(value: Project);
}
