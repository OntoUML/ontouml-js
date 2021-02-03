import _ from 'lodash';
import { Property, Generalization, GeneralizationSet } from './';

export interface Classifier<T> {
  properties: Property[];
  isAbstract: boolean;
  isDerived: boolean;

  getGeneralizations(): Generalization[];

  getGeneralizationSets(): GeneralizationSet[];

  // TODO: add documentation
  getGeneralizationsWhereGeneral(): Generalization[];

  getGeneralizationsWhereSpecific(): Generalization[];

  getGeneralizationSetsWhereGeneral(): GeneralizationSet[];

  getGeneralizationSetsWhereSpecific(): GeneralizationSet[];

  getParents(): T[];

  getChildren(): T[];

  getAncestors(): T[];

  getDescendants(): T[];

  getFilteredAncestors(filter: (ancestor: T) => boolean): T[];

  getFilteredDescendants(filter: (descendent: T) => boolean): T[];
}
