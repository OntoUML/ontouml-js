import Project from './project';
import { OntoumlType } from '@constants/.';
import { getText } from './multilingual_text';
import Class from './class';
import Relation from './relation';
import Property from './property';
import OntoumlElement from './ontouml_element';

const modelElementTemplate = {
  type: null,
  id: null,
  name: null,
  description: null,
  propertyAssignments: null
};

export function setContainer(content: ModelElement, container: ModelElement): void {
  if (content.project !== container.project) {
    throw new Error('Container and content projects do not match');
  }

  content.container = container;
}

export default abstract class ModelElement extends OntoumlElement {
  propertyAssignments: object;
  // TODO: decide how to avoid people directly setting project and container fields
  project: Project;
  container: ModelElement;

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
