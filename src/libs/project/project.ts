import { OntoumlType } from '@constants/.';
import {
  Relation,
  OntoumlElement,
  Container,
  getAllContents,
  Package,
  Diagram,
  Class,
  Generalization,
  GeneralizationSet,
  Literal,
  ModelElement,
  Property
} from './';

const projectTemplate = {
  model: null,
  diagrams: null
};

export class Project extends OntoumlElement implements Container<Package, ModelElement> {
  type: OntoumlType.PROJECT_TYPE;
  model: Package;
  diagrams: Diagram[];

  constructor(base?: Partial<Project>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.PROJECT_TYPE, enumerable: true });
  }

  // TODO: add support to model element
  getContents(): Package[] {
    return this.model ? [this.model] : [];
  }

  getAllContents(contentsFilter?: (modelElement: ModelElement) => boolean): ModelElement[] {
    return getAllContents(this, ['model'], contentsFilter);
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
    const projectSerialization = {} as Project;

    Object.assign(projectSerialization, projectTemplate, super.toJSON());

    return projectSerialization;
  }

  createModel(base?: Partial<Package>): Package {
    if (this.model) {
      throw new Error('Model already defined');
    }

    this.model = new Package({ ...base, container: null, project: this });
    return this.model;
  }

  getModelElement(): ModelElement {
    throw new Error('Method unimplemented!');
  }

  getAllModelElement(): ModelElement[] {
    throw new Error('Method unimplemented!');
  }

  // getAllClasses(): Class[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getAllRelations(): Relation[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getAllGeneralizations(): Generalization[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getAllGeneralizationSets(): GeneralizationSet[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getAllLiterals(): Literal[] {
  //   throw new Error('Method unimplemented!');
  // }

  getAllProperties(): Property[] {
    throw new Error('Method unimplemented!');
  }

  getAllBinaryRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getAllTernaryRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getAllDerivationRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  // get locked(): boolean {
  //   return this._locked;
  // }

  set locked(value: boolean) {
    throw new Error('Method unimplemented!');
    // TODO: implement a loop that changes the "isWritable" property in all fields
    // this._locked = value;
  }

  getClassesByNature(): Class[] {
    throw new Error('Method unimplemented!');
  }
}
