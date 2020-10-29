import ModelElement from './model_element';
import Project from './project';
import { OntoumlType } from '@constants/.';
import Container, { addContentToArray, getAllContents, getContents } from './container';
import Class from './class';
import Relation from './relation';
import Generalization from './generalization';
import GeneralizationSet from './generalization_set';

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

  getContents(): ModelElement[] {
    return getContents(this, ['contents']);
  }

  getAllContents(): ModelElement[] {
    return getAllContents(this, ['contents']);
  }

  toJSON(): any {
    const packageSerialization = {} as Package;

    Object.assign(packageSerialization, packageTemplate, super.toJSON());

    return packageSerialization;
  }

  createPackage(base?: Partial<Package>): Package {
    return addContentToArray<ModelElement, Package>(
      this,
      'contents',
      new Package({ container: this, project: this.project, ...base })
    );
  }

  createClass(base?: Partial<Class>): Class {
    return addContentToArray<ModelElement, Class>(
      this,
      'contents',
      new Class({ container: this, project: this.project, ...base })
    );
  }

  createRelation(base?: Partial<Relation>): Relation {
    return addContentToArray<ModelElement, Relation>(
      this,
      'contents',
      new Relation({ container: this, project: this.project, ...base })
    );
  }

  createGeneralization(base?: Partial<Generalization>): Generalization {
    return addContentToArray<ModelElement, Generalization>(
      this,
      'contents',
      new Generalization({ container: this, project: this.project, ...base })
    );
  }

  createGeneralizationSet(base?: Partial<GeneralizationSet>): GeneralizationSet {
    return addContentToArray<ModelElement, GeneralizationSet>(
      this,
      'contents',
      new GeneralizationSet({ container: this, project: this.project, ...base })
    );
  }

  // TODO: do we need some getContent(match) method?
}
