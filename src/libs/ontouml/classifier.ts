import _ from 'lodash';
import { Property, Generalization, GeneralizationSet, Class, Relation, ModelElement } from './';

export type ClassifierType = Class | Relation;

export function getGeneralizationsInvolvingClassifier<T extends ClassifierType>(classifier: T): Generalization[] {
  const root = classifier.getModelOrRootPackage();
  return root.getAllGeneralizations().filter((gen: Generalization) => classifier === gen.specific || classifier === gen.general);
}

export function getGeneralizationsWhereGeneral<T extends ClassifierType>(classifier: T): Generalization[] {
  const root = classifier.getModelOrRootPackage();
  return root.getAllGeneralizations().filter((gen: Generalization) => classifier === gen.general);
}

export function getGeneralizationsWhereSpecific<T extends ClassifierType>(classifier: T): Generalization[] {
  const root = classifier.getModelOrRootPackage();
  return root.getAllGeneralizations().filter((gen: Generalization) => classifier === gen.specific);
}

export function getGeneralizationSetsInvolvingClassifier<T extends ClassifierType>(classifier: T): GeneralizationSet[] {
  const root = classifier.getModelOrRootPackage();
  const generalizationSets = root.getAllGeneralizationSets();
  const generalizationSetsInvolvingClassifier: GeneralizationSet[] = [];

  if (generalizationSets) {
    generalizationSets.forEach((genset: GeneralizationSet) => {
      if (genset.getInvolvedClassifiers().includes(classifier)) {
        generalizationSetsInvolvingClassifier.push(genset);
      }
    });
  }

  return generalizationSetsInvolvingClassifier;
}

export function getGeneralizationSetsWhereGeneral<T extends ClassifierType>(classifier: T): GeneralizationSet[] {
  const root = classifier.getModelOrRootPackage();
  const generalizationSets = root.getAllGeneralizationSets();
  const generalizationSetsInvolvingClassifier: GeneralizationSet[] = [];

  if (generalizationSets) {
    generalizationSets.forEach((genset: GeneralizationSet) => {
      if (genset.getGeneral() === classifier) {
        generalizationSetsInvolvingClassifier.push(genset);
      }
    });
  }

  return generalizationSetsInvolvingClassifier;
}

export function getGeneralizationSetsWhereSpecific<T extends ClassifierType>(classifier: T): GeneralizationSet[] {
  const root = classifier.getModelOrRootPackage();
  const generalizationSets = root.getAllGeneralizationSets();
  const generalizationSetsInvolvingClassifier: GeneralizationSet[] = [];

  if (generalizationSets) {
    generalizationSets.forEach((genset: GeneralizationSet) => {
      if (genset.getSpecifics().includes(classifier)) {
        generalizationSetsInvolvingClassifier.push(genset);
      }
    });
  }

  return generalizationSetsInvolvingClassifier;
}

export function getGeneralizationSetsWhereCategorizer<T extends ClassifierType>(classifier: T): GeneralizationSet[] {
  const root = classifier.getModelOrRootPackage();
  const generalizationSets = root.getAllGeneralizationSets();
  const generalizationSetsInvolvingClassifier: GeneralizationSet[] = [];

  if (generalizationSets) {
    generalizationSets.forEach((genset: GeneralizationSet) => {
      if (genset.categorizer === classifier) {
        generalizationSetsInvolvingClassifier.push(genset);
      }
    });
  }

  return generalizationSetsInvolvingClassifier;
}

export function getParents<T extends ClassifierType>(classifier: T): T[] {
  const root = classifier.getModelOrRootPackage();

  return root
    .getAllGeneralizations()
    .filter((gen: Generalization) => classifier === gen.specific)
    .map((gen: Generalization) => gen.general) as T[];
}

export function getChildren<T extends ClassifierType>(classifier: T): T[] {
  const root = classifier.getModelOrRootPackage();

  return root
    .getAllGeneralizations()
    .filter((gen: Generalization) => classifier === gen.general)
    .map((gen: Generalization) => gen.specific) as T[];
}

export function getAncestors<T extends ClassifierType>(classifier: T, knownAncestors: T[] = []): T[] {
  const ancestors = new Set<ModelElement>(knownAncestors);

  classifier.getParents().forEach((parent: ClassifierType) => {
    if (!ancestors.has(classifier)) {
      parent.getAncestors().forEach(ancestors.add);
      ancestors.add(parent);
    }
  });

  return [...ancestors] as T[];
}

export function getDescendants<T extends ClassifierType>(classifier: T, knownDescendants: T[] = []): T[] {
  const descendants = new Set<ModelElement>(knownDescendants);

  classifier.getChildren().forEach((child: ClassifierType) => {
    if (!descendants.has(classifier)) {
      child.getDescendants().forEach(descendants.add);
      descendants.add(child);
    }
  });

  return [...descendants] as T[];
}

export function getFilteredAncestors<T extends ClassifierType>(classifier: T, filter: (ancestor: T) => boolean): T[] {
  return getAncestors(classifier).filter(filter);
}

export function getFilteredDescendants<T extends ClassifierType>(classifier: T, filter: (descendent: T) => boolean): T[] {
  return getAncestors(classifier).filter(filter);
}

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
