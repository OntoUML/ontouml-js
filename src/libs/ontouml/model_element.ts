import { Relation, Project, Class, Property, OntoumlElement, Package } from './';
import { Container } from './container';

export abstract class ModelElement extends OntoumlElement {
  // TODO: decide how to avoid people directly setting project and container fields
  project: Project;
  container: ModelElement;
  propertyAssignments: object;

  constructor(base?: Partial<ModelElement>) {
    super(base);

    this.project = this.project || null;
    this.container = this.container || null;

    this.propertyAssignments = this.propertyAssignments || null;
  }

  lock(): void {
    throw new Error('Method unimplemented!');
  }

  unlock(): void {
    throw new Error('Method unimplemented!');
  }

  isLocked(): boolean {
    throw new Error('Method unimplemented!');
  }

  toJSON(): any {
    const modelElementSerialization = {
      propertyAssignments: null
    };

    Object.assign(modelElementSerialization, super.toJSON());

    delete modelElementSerialization['project'];
    delete modelElementSerialization['container'];

    return modelElementSerialization;
  }

  setProject(project: Project): void {
    if (this.project) {
      throw new Error('Project already defined');
    }

    if (!project.model) {
      throw new Error('Project already defined');
    }

    if (this.container) {
      throw new Error('Cannot set a project while a container is defined (setting the project on the container is possible)');
    }

    this.project = project;

    if (this.isContainer()) {
      ((this as unknown) as Container<any, any>).getContents().forEach((content: ModelElement) => (content.project = project));
    }

    this.setContainer(project.model);
  }

  // TODO: add documentation
  getModelOrRootPackage(): Package {
    if (this.project) {
      return this.project.model;
    }

    let packageReference = this.container;

    while (packageReference && packageReference.container) {
      packageReference = packageReference.container;
    }

    if (packageReference instanceof Package) {
      return packageReference;
    } else if (this instanceof Package) {
      return this;
    } else {
      return null;
    }
  }

  abstract setContainer(container: ModelElement): void;

  /** Clones the model element and all its contents. Replaces all references to
   * original contents with references to cloned elements. */
  abstract clone(): ModelElement;

  // TODO: replace references in property assignments
  /** Replaces references to `originalElement` with references to `newElement`.
   * Designed to be used within clone(). */
  abstract replace(originalElement: ModelElement, newElement: ModelElement): void;

  isDecoratable(): boolean {
    return this instanceof Class || this instanceof Relation || this instanceof Property;
  }

  isClassifier(): boolean {
    return this instanceof Class || this instanceof Relation;
  }
}
