import { OntoumlType } from '@constants/.';
import Relation from './relation';
import ModelElement from './model_element';
import Class from './class';
import Generalization from './generalization';
import Classifier from './classifier';
import Container from './container';

const generalizationSetTemplate = {
  isDisjoint: false,
  isComplete: false,
  categorizer: null,
  generalizations: null
};

export default class GeneralizationSet extends ModelElement {
  isDisjoint: boolean;
  isComplete: boolean;
  categorizer: Class;
  generalizations: Generalization[];
  // TODO: Double check variable initialization in all classes

  constructor(base?: Partial<GeneralizationSet>) {
    super(base);

    Object.defineProperty(this, 'type', { value: OntoumlType.GENERALIZATION_SET_TYPE, enumerable: true });

    this.isDisjoint = this.isDisjoint || false;
    this.isComplete = this.isComplete || false;
  }

  toJSON(): any {
    const generalizationSetSerialization: any = {};

    Object.assign(generalizationSetSerialization, generalizationSetTemplate, super.toJSON());

    generalizationSetSerialization.categorizer = this.categorizer && this.categorizer.getReference();
    generalizationSetSerialization.generalizations = this.generalizations.map((generalization: Generalization) =>
      generalization.getReference()
    );

    return generalizationSetSerialization;
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
