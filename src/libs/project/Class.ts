import { ModelElement, IClassifier } from './ModelElement';
import { Generalization } from './Generalization';
import { Property } from './Property';
import { Relation } from './Relation';

export class Class extends ModelElement implements IClassifier {
  properties: import('./Property').Property[];
  isAbstract: boolean;
  isDerived: boolean;

  _generalOf?: Generalization[];
  _specificOf?: Generalization[];
  _typeOf?: Property[];
  _sourceOf?: Property[];
  _targetOf?: Property[];
  _memberOf?: { position: number; property: Property }[];

  constructor() {
    super();
    throw new Error('Class unimplemented');
  }

  getParents(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getChildren(): Class[] {
    throw new Error('Method unimplemented!');
  }

  getAncestors(knownAncestors?: Class[]): Class[] {
    throw new Error('Method unimplemented!');
  }

  getDescendants(knownDescendants?: Class[]): IClassifier[] {
    throw new Error('Method unimplemented!');
  }

  getRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }
}
