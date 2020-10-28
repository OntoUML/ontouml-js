import Property from './property';
import Generalization from './generalization';
import ModelElement from './model_element';
import Decoratable from './decoratable';
import { OntoumlStereotype } from '@constants/.';

export default interface Classifier {
  properties: null | Property[];
  isAbstract: boolean;
  isDerived: boolean;

  // TODO: adds navigation methods
  // getGeneralizationAsGeneral(): Generalization[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getGeneralizationAsSpecific(): Generalization[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getParents(): Classifier[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getChildren(): Classifier[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getAncestors(knownAncestors?: Classifier[]): Classifier[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getDescendants(knownDescendants?: Classifier[]): Classifier[] {
  //   throw new Error('Method unimplemented!');
  // }

  // getFilteredAncestors(filter: (ancestor: Classifier) => boolean): Classifier[] {
  //   // return this.getAncestors().filter(filter);
  //   throw new Error('Method unimplemented!');
  // }

  // getFilteredDescendants(filter: (descendent: Classifier) => boolean): Classifier[] {
  //   // return this.getDescendants().filter(filter);
  //   throw new Error('Method unimplemented!');
  // }
}
