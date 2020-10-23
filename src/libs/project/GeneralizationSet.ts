import { OntoumlType } from '@constants/.';
import Relation from './Relation';
import ModelElement from './ModelElement';
import Class from './Class';
import Generalization from './Generalization';
import Classifier from './Classifier';

export default class GeneralizationSet extends ModelElement {
  type: OntoumlType.GENERALIZATION_SET_TYPE;
  isDisjoint: boolean = false;
  isComplete: boolean = false;
  categorizer: null | Class = null;
  generalizations: Generalization[] = [];
  // TODO: Double check variable initialization in all classes

  constructor() {
    super();
    throw new Error('Class unimplemented');
  }

  /**
   * A disjoint complete set of phase subclasses
   */
  isPhasePartition(): boolean {
    throw new Error('Method unimplemented!');
  }

  /**
   * @throws exception if different generals are present
   */
  getGeneral(): Classifier {
    throw new Error('Method unimplemented!');
  }

  getSpecifics(): Classifier[] {
    throw new Error('Method unimplemented!');
  }

  involvesClasses(): boolean {
    throw new Error('Method unimplemented!');
  }

  involvesRelations(): boolean {
    throw new Error('Method unimplemented!');
  }

  /** Get instantiation relations where the categorizer (or one of its ancestors) is the source */
  getInstantiationRelations(): Relation[] {
    throw new Error('Method unimplemented!');
  }
}
