import { Property } from './';

export interface Classifier {
  properties: Property[];
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
