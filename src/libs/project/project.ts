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

  getAllContents(): ModelElement[] {
    return getAllContents(this, ['model']);
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

    this.model = new Package({ container: null, project: this, ...base });
    return this.model;
  }

  getModelElement(): ModelElement {
    throw new Error('Method unimplemented!');
  }

  getAllModelElement(): ModelElement[] {
    throw new Error('Method unimplemented!');
  }

  getAllClasses(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getAllRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }

  getAllGeneralizations(): Generalization[] {
    throw new Error('Method unimplemented!');
  }

  getAllGeneralizationSets(): GeneralizationSet[] {
    throw new Error('Method unimplemented!');
  }

  getAllLiterals(): Literal[] {
    throw new Error('Method unimplemented!');
  }

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
