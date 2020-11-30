import {
  Relation,
  OntoumlElement,
  container,
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
    return container.getAllContents(this, ['model'], contentsFilter);
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

  // getAllProperties(): Property[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getAllBinaryRelations(): Relation[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getAllTernaryRelations(): Relation[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getAllDerivationRelations(): Relation[] {
  //   throw new Error('Method unimplemented!');
  // }

  // get locked(): boolean {
  //   return this._locked;
  // }

  // set locked(value: boolean) {
  //   throw new Error('Method unimplemented!');
  //   // TODO: implement a loop that changes the "isWritable" property in all fields
  //   // this._locked = value;
  // }

  getClassesByNature(): Class[] {
    throw new Error('Method unimplemented!');
  }
}
