import ModelElement from './model_element';
import Project from './project';
import { OntoumlType } from '@constants/.';
import Container, { getAllContents, getContents } from './container';

export default class Package extends ModelElement implements Container<ModelElement, ModelElement> {
  contents?: ModelElement[];

  constructor(project?: Project) {
    super(project);
    Object.defineProperty(this, 'type', { value: OntoumlType.PACKAGE_TYPE, enumerable: true });
  }

  getContents(): Set<ModelElement> {
    return getContents(this, ['contents']);
  }
  getAllContents(): Set<ModelElement> {
    return getAllContents(this, ['contents']);
  }

  // TODO: do we need some getContent(match) method?
}
