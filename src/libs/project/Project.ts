import schemas from 'ontouml-schema';
import Ajv from 'ajv';
import randomId from 'random-id';

import { OntoUMLType, OntologicalNature } from '@constants/.';
import { Package } from './Package';
import { Diagram } from './Diagram';
import { Class } from './Class';
import { Relation } from './Relation';
import { Generalization } from './Generalization';
import { GeneralizationSet } from './GeneralizationSet';
import { Literal } from './Literal';
import { Property } from './Property';
import { ModelElement } from './ModelElement';

export class Project {
  type: OntoUMLType.PROJECT_TYPE;
  id: string;
  name?: string | object;
  description?: string | object;
  model?: Package;
  diagrams?: Diagram[];

  _locked: boolean;
  _elementsMap: Map<OntoUMLType, Map<string, ModelElement>>;

  constructor(ontoumlSchemaInstance?: object) {
    this.id = randomId();
    this._locked = false;
    this._elementsMap = new Map();

    for (let ontoUmlType in OntoUMLType) {
      console.log('Initializing map for tyoe: ' + ontoUmlType);
      this._elementsMap.set(OntoUMLType[ontoUmlType], new Map());
    }

    this.model = this.createPackage();
  }

  register(element: ModelElement) {
    const id = element.id;
    const type = element.type;
    const selectedMap = this._elementsMap.get(type);

    console.log(selectedMap, type, id, this._elementsMap);

    if (!selectedMap) {
      throw new Error('Invalid OntoUMLType');
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
