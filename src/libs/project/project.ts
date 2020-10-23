import uniqid from 'uniqid';

import { OntoumlType, OntologicalNature } from '@constants/.';
import Package from './package';
import Diagram from './diagram';
import Class from './class';
import Generalization from './generalization';
import GeneralizationSet from './generalization_set';
import Literal from './literal';
import ModelElement from './model_element';
import Property from './property';
import Relation from './relation';

export default class Project {
  type: OntoumlType.PROJECT_TYPE;
  id: string;
  name?: string | object;
  description?: string | object;
  model?: Package;
  diagrams?: Diagram[];

  _locked: boolean;
  _elementsMap: Map<OntoumlType, Map<string, ModelElement>>;

  constructor() {
    this.id = uniqid();
    this._locked = false;
    this._elementsMap = new Map();

    for (let ontoUmlType in OntoumlType) {
      console.log('Initializing map for tyoe: ' + ontoUmlType);
      this._elementsMap.set(OntoumlType[ontoUmlType], new Map());
    }

    this.model = this.createPackage();
  }

  register(element: ModelElement) {
    const id = element.id;
    const type = element.type;
    const selectedMap = this._elementsMap.get(type);

    console.log(selectedMap, type, id, this._elementsMap);

    if (!selectedMap) {
      throw new Error('Invalid OntoumlType');
    } else if (selectedMap.get(element.id)) {
      throw new Error('Model element ID conflict.');
    } else {
      selectedMap.set(id, element);
    }
  }

  createPackage(): Package {
    const pkg = new Package(this);
    this.register(pkg);
    return pkg;
  }

  getModelElement(match: object): ModelElement {
    throw new Error('Method unimplemented!');
  }

  getAllModelElement(match: object): ModelElement[] {
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

  toJSON(): object {
    throw new Error('Method unimplemented!');
  }

  get locked(): boolean {
    return this._locked;
  }

  set locked(value: boolean) {
    throw new Error('Method unimplemented!');
    // TODO: implement a loop that changes the "isWritable" property in all fields
    // this._locked = value;
  }

  getClassesByNature(nature: OntologicalNature | OntologicalNature[]): Class[] {
    throw new Error('Method unimplemented!');
  }
}
