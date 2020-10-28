import ModelElement from './model_element';
import Project from './project';
import { OntoumlType } from '@constants/.';
import Container, { getAllContents, getContents } from './container';

const packageTemplate = {
  contents: null
};

export default class Package extends ModelElement implements Container<ModelElement, ModelElement> {
  container: Package | Project;
  contents: ModelElement[];

  constructor(base?: Partial<Package>) {
    super(base);
    Object.defineProperty(this, 'type', { value: OntoumlType.PACKAGE_TYPE, enumerable: true });
  }

  getContents(): Set<ModelElement> {
    return getContents(this, ['contents']);
  }
  getAllContents(): Set<ModelElement> {
    return getAllContents(this, ['contents']);
  }

  toJSON(): any {
    const packageSerialization = {} as Package;

    Object.assign(packageSerialization, packageTemplate, super.toJSON());

    return packageSerialization;
  }

  // TODO: do we need some getContent(match) method?
}
