import { OntoumlType } from '@constants/.';
import {
  setContainer,
  ModelElement,
  Container,
  addContentToArray,
  getAllContents,
  getContents,
  Class,
  Relation,
  Generalization,
  GeneralizationSet
} from './';

const packageTemplate = {
  contents: null
};

export class Package extends ModelElement implements Container<ModelElement, ModelElement> {
  container: Package;
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

  setContainer(container: Package): void {
    setContainer(this, container);
  }

  // TODO: do we need some getContent(match) method?
}
