import { Relation, Project, Class, Property, OntoumlElement } from './';

const modelElementTemplate = {
  propertyAssignments: null
};

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
    const modelElementSerialization = {};

    Object.assign(modelElementSerialization, modelElementTemplate, this);

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

  abstract setContainer(container: ModelElement): void;

  isDecoratable(): boolean {
    return this instanceof Class || this instanceof Relation || this instanceof Property;
  }

  isClassifier(): boolean {
    return this instanceof Class || this instanceof Relation;
  }
}
