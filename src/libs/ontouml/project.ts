import {
  Relation,
  OntoumlElement,
  containerUtils,
  Package,
  Diagram,
  Class,
  Generalization,
  GeneralizationSet,
  Literal,
  ModelElement,
  Property,
  PackageContainer,
  OntoumlType
} from './';

export class Project extends OntoumlElement implements PackageContainer<Package, ModelElement> {
  type: OntoumlType.PROJECT_TYPE;
  model: Package;
  diagrams: Diagram[];

  constructor(base?: Partial<Project>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.PROJECT_TYPE, enumerable: true });
  }

  // TODO: add support to diagrams element
  getContents(): Package[] {
    return this.model ? [this.model] : [];
  }

  getAllContents(contentsFilter?: (modelElement: ModelElement) => boolean): ModelElement[] {
    return containerUtils.getAllContents(this, ['model'], contentsFilter);
  }

  getAllAttributes(): Property[] {
    return this.model.getAllAttributes();
  }

  getAllRelationEnds(): Property[] {
    return this.model.getAllRelationEnds();
  }

  getAllRelations(): Relation[] {
    return this.model.getAllRelations();
  }

  getAllGeneralizations(): Generalization[] {
    return this.model.getAllGeneralizations();
  }

  getAllGeneralizationSets(): GeneralizationSet[] {
    return this.model.getAllGeneralizationSets();
  }

  getAllPackages(): Package[] {
    const packagesFilter = (modelElement: ModelElement) => modelElement instanceof Package;
    return this.getAllContents(packagesFilter) as Package[];
  }

  getAllClasses(): Class[] {
    return this.model.getAllClasses();
  }

  getAllEnumerations(): Class[] {
    return this.model.getAllEnumerations();
  }

  getAllLiterals(): Literal[] {
    return this.model.getAllLiterals();
  }

  toJSON(): any {
    const projectSerialization = {
      model: null,
      diagrams: null
    };

    Object.assign(projectSerialization, super.toJSON());

    return projectSerialization;
  }

  createModel(base?: Partial<Package>): Package {
    if (this.model) {
      throw new Error('Model already defined');
    }

    this.model = new Package({ ...base, container: null, project: this });
    return this.model;
  }

  lock(): void {
    throw new Error('Unimplemented method');
  }

  unlock(): void {
    throw new Error('Unimplemented method');
  }

  getClassesByNature(): Class[] {
    throw new Error('Method unimplemented!');
  }
}
