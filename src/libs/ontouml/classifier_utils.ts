import _ from 'lodash';
import { Classifier, Generalization, GeneralizationSet, Class, Relation } from './';

function getGeneralizationsInvolvingClassifier<T extends Class | Relation>(classifier: T): Generalization[] {
  const root = classifier.getModelOrRootPackage();
  return root.getAllGeneralizations().filter((gen: Generalization) => classifier === gen.specific || classifier === gen.general);
}

function getGeneralizationsWhereGeneral<T extends Class | Relation>(classifier: T): Generalization[] {
  const root = classifier.getModelOrRootPackage();
  return root.getAllGeneralizations().filter((gen: Generalization) => classifier === gen.general);
}

function getGeneralizationsWhereSpecific<T extends Class | Relation>(classifier: T): Generalization[] {
  const root = classifier.getModelOrRootPackage();
  return root.getAllGeneralizations().filter((gen: Generalization) => classifier === gen.specific);
}

function getGeneralizationSetsInvolvingClassifier<T extends Class | Relation>(classifier: T): GeneralizationSet[] {
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

function getGeneralizationSetsWhereGeneral<T extends Class | Relation>(classifier: T): GeneralizationSet[] {
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

function getGeneralizationSetsWhereSpecific<T extends Class | Relation>(classifier: T): GeneralizationSet[] {
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

function getGeneralizationSetsWhereCategorizer<T extends Class | Relation>(classifier: T): GeneralizationSet[] {
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

function getParents<T extends Class | Relation>(classifier: T): T[] {
  const root = classifier.getModelOrRootPackage();

  return root
    .getAllGeneralizations()
    .filter((gen: Generalization) => classifier === gen.specific)
    .map((gen: Generalization) => gen.general) as T[];
}

function getChildren<T extends Class | Relation>(classifier: T): T[] {
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
