import { ModelElement } from './ModelElement';
import { OntoUMLType } from '@constants/.';
import { Class } from './Class';
import { Generalization } from './Generalization';
import { Relation } from './Relation';
import { IClassifier } from './Classifier';

export class GeneralizationSet extends ModelElement {
  type: OntoUMLType.GENERALIZATION_SET_TYPE;
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
  getGeneral(): IClassifier {
    throw new Error('Method unimplemented!');
  }

  getSpecifics(): IClassifier[] {
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
