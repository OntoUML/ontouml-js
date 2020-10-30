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
  Property,
  Generalization,
  GeneralizationSet,
  Literal
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

  getContents(contentsFilter?: (modelElement: ModelElement) => boolean): ModelElement[] {
    return getContents(this, ['contents'], contentsFilter);
  }

  getAllContents(contentsFilter?: (modelElement: ModelElement) => boolean): ModelElement[] {
    return getAllContents(this, ['contents'], contentsFilter);
  }

  getAllAttributes(): Property[] {
    const attributesFilter = (modelElement: ModelElement) =>
      modelElement instanceof Property && (modelElement as Property).isAttribute();
    return this.getAllContents(attributesFilter) as Property[];
  }

  getAllRelationEnds(): Property[] {
    const relationEndsFilter = (modelElement: ModelElement) =>
      modelElement instanceof Property && (modelElement as Property).isRelationEnd();
    return this.getAllContents(relationEndsFilter) as Property[];
  }

  getAllRelations(): Relation[] {
    const relationsFilter = (modelElement: ModelElement) => modelElement instanceof Relation;
    return this.getAllContents(relationsFilter) as Relation[];
  }

  getAllGeneralizations(): Generalization[] {
    const generalizationsFilter = (modelElement: ModelElement) => modelElement instanceof Generalization;
    return this.getAllContents(generalizationsFilter) as Generalization[];
  }

  getAllGeneralizationSets(): GeneralizationSet[] {
    const generalizationSetsFilter = (modelElement: ModelElement) => modelElement instanceof GeneralizationSet;
    return this.getAllContents(generalizationSetsFilter) as GeneralizationSet[];
  }

  getAllPackages(): Package[] {
    const packagesFilter = (modelElement: ModelElement) => modelElement instanceof Package;
    return this.getAllContents(packagesFilter) as Package[];
  }

  getAllClasses(): Class[] {
    const classesFilter = (modelElement: ModelElement) => modelElement instanceof Class;
    return this.getAllContents(classesFilter) as Class[];
  }

  getAllEnumerations(): Class[] {
    const classesFilter = (modelElement: ModelElement) =>
      modelElement instanceof Class && (modelElement as Class).isEnumeration();
    return this.getAllContents(classesFilter) as Class[];
  }

  getAllLiterals(): Literal[] {
    const literalsFilter = (modelElement: ModelElement) => modelElement instanceof Literal;
    return this.getAllContents(literalsFilter) as Literal[];
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
      new Package({ ...base, container: this, project: this.project })
    );
  }

  createClass(base?: Partial<Class>): Class {
    return addContentToArray<ModelElement, Class>(
      this,
      'contents',
      new Class({ ...base, container: this, project: this.project })
    );
  }

  createRelation(base?: Partial<Relation>): Relation {
    return addContentToArray<ModelElement, Relation>(
      this,
      'contents',
      new Relation({ ...base, container: this, project: this.project })
    );
  }

  createGeneralization(base?: Partial<Generalization>): Generalization {
    return addContentToArray<ModelElement, Generalization>(
      this,
      'contents',
      new Generalization({ ...base, container: this, project: this.project })
    );
  }

  createGeneralizationSet(base?: Partial<GeneralizationSet>): GeneralizationSet {
    return addContentToArray<ModelElement, GeneralizationSet>(
      this,
      'contents',
      new GeneralizationSet({ ...base, container: this, project: this.project })
    );
  }

  setContainer(container: Package): void {
    setContainer(this, container);
  }

  // TODO: do we need some getContent(match) method?
}
