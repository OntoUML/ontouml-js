import { Relation, Project, Class, Property, OntoumlElement, Package } from './';

export function setContainer(content: ModelElement, container: ModelElement): void {
  if (content.project !== container.project) {
    throw new Error('Container and content projects do not match');
  }

  content.container = container;
}

export abstract class ModelElement extends OntoumlElement {
  // TODO: decide how to avoid people directly setting project and container fields
  project: Project;
  container: ModelElement;
  propertyAssignments: object;

  constructor(base?: Partial<ModelElement>) {
    super(base);
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

    Object.assign(modelElementSerialization, this);

    delete modelElementSerialization['project'];
    delete modelElementSerialization['container'];

    return modelElementSerialization;
  }

  setProject(project: Project): void {
    if (this.project) {
      throw new Error('Project already defined');
    }

    this.project = project;

    if (typeof (this as any).getContents === 'function') {
      (this as any).getContents().forEach((content: ModelElement) => content.setProject(project));
    }
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

  /** Clones the model element and all its contents. Replaces all references to original contents with references to cloned elements. */
  abstract clone(): ModelElement;

  // TODO: replace references in property assignments
  /** Replaces of references to `originalElement` with references to `newElement`. Designed to be used within clone(). */
  abstract replace(originalElement: ModelElement, newElement: ModelElement): void;

  isDecoratable(): boolean {
    return this instanceof Class || this instanceof Relation || this instanceof Property;
  }

  isClassifier(): boolean {
    return this instanceof Class || this instanceof Relation;
  }
}
