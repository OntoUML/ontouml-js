import _ from 'lodash';
import { Property, Generalization, GeneralizationSet, Class, Relation, ModelElement } from './';

export type ClassifierType = Class | Relation;

function getGeneralizationsInvolvingClassifier<T extends ClassifierType>(classifier: T): Generalization[] {
  const root = classifier.getModelOrRootPackage();
  return root.getAllGeneralizations().filter((gen: Generalization) => classifier === gen.specific || classifier === gen.general);
}

function getGeneralizationsWhereGeneral<T extends ClassifierType>(classifier: T): Generalization[] {
  const root = classifier.getModelOrRootPackage();
  return root.getAllGeneralizations().filter((gen: Generalization) => classifier === gen.general);
}

function getGeneralizationsWhereSpecific<T extends ClassifierType>(classifier: T): Generalization[] {
  const root = classifier.getModelOrRootPackage();
  return root.getAllGeneralizations().filter((gen: Generalization) => classifier === gen.specific);
}

function getGeneralizationSetsInvolvingClassifier<T extends ClassifierType>(classifier: T): GeneralizationSet[] {
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

function getGeneralizationSetsWhereGeneral<T extends ClassifierType>(classifier: T): GeneralizationSet[] {
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

function getGeneralizationSetsWhereSpecific<T extends ClassifierType>(classifier: T): GeneralizationSet[] {
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

function getGeneralizationSetsWhereCategorizer<T extends ClassifierType>(classifier: T): GeneralizationSet[] {
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

function getParents<T extends ClassifierType>(classifier: T): T[] {
  const root = classifier.getModelOrRootPackage();

  return root
    .getAllGeneralizations()
    .filter((gen: Generalization) => classifier === gen.specific)
    .map((gen: Generalization) => gen.general) as T[];
}

function getChildren<T extends ClassifierType>(classifier: T): T[] {
  const root = classifier.getModelOrRootPackage();

  return root
    .getAllGeneralizations()
    .filter((gen: Generalization) => classifier === gen.general)
    .map((gen: Generalization) => gen.specific) as T[];
}

function getAncestors<T extends Classifier<T>>(classifier: T, knownAncestors: T[] = []): T[] {
  const ancestors = [...knownAncestors];

  classifier.getParents().forEach((parent: T) => {
    if (!ancestors.includes(parent)) {
      ancestors.push(parent);
      ancestors.push(...getAncestors(parent, ancestors));
    }
  });

  return [...new Set(ancestors)];
}

function getDescendants<T extends Classifier<T>>(classifier: T, knownDescendants: T[] = []): T[] {
  const descendants = [...knownDescendants];

  classifier.getChildren().forEach((child: T) => {
    if (!descendants.includes(child)) {
      descendants.push(child);
      descendants.push(...getDescendants(child, descendants));
    }
  });

  return [...new Set(descendants)];
}

function getFilteredAncestors<T extends Classifier<T>>(classifier: T, filter: (ancestor: T) => boolean): T[] {
  return getAncestors(classifier).filter(filter);
}

function getFilteredDescendants<T extends Classifier<T>>(classifier: T, filter: (descendent: T) => boolean): T[] {
  return getDescendants(classifier).filter(filter);
}

export const classifierUtils = {
  getGeneralizationsInvolvingClassifier,
  getGeneralizationsWhereGeneral,
  getGeneralizationsWhereSpecific,
  getGeneralizationSetsInvolvingClassifier,
  getGeneralizationSetsWhereGeneral,
  getGeneralizationSetsWhereSpecific,
  getGeneralizationSetsWhereCategorizer,
  getParents,
  getChildren,
  getAncestors,
  getDescendants,
  getFilteredAncestors,
  getFilteredDescendants
};

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
