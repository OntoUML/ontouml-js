import _ from 'lodash';
import { Property, Generalization, GeneralizationSet, Class, Relation, ModelElement } from './';

type ClassifierTypes = Class | Relation;

export function getGeneralizationsInvolvingClassifier<T extends ClassifierTypes>(classifier: T): Generalization[] {
  const root = classifier.getModelOrRootPackage();
  return root.getAllGeneralizations().filter((gen: Generalization) => classifier === gen.specific || classifier === gen.general);
}

export function getGeneralizationsWhereGeneral<T extends ClassifierTypes>(classifier: T): Generalization[] {
  const root = classifier.getModelOrRootPackage();
  return root.getAllGeneralizations().filter((gen: Generalization) => classifier === gen.general);
}

export function getGeneralizationsWhereSpecific<T extends ClassifierTypes>(classifier: T): Generalization[] {
  const root = classifier.getModelOrRootPackage();
  return root.getAllGeneralizations().filter((gen: Generalization) => classifier === gen.specific);
}

export function getGeneralizationSetsInvolvingClassifier<T extends ClassifierTypes>(classifier: T): GeneralizationSet[] {
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

export function getGeneralizationSetsWhereGeneral<T extends ClassifierTypes>(classifier: T): GeneralizationSet[] {
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

export function getGeneralizationSetsWhereSpecific<T extends ClassifierTypes>(classifier: T): GeneralizationSet[] {
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

export function getGeneralizationSetsWhereCategorizer<T extends ClassifierTypes>(classifier: T): GeneralizationSet[] {
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

export function getParents<T extends ClassifierTypes>(classifier: T): T[] {
  const root = classifier.getModelOrRootPackage();

  return root
    .getAllGeneralizations()
    .filter((gen: Generalization) => classifier === gen.specific)
    .map((gen: Generalization) => gen.general) as T[];
}

export function getChildren<T extends ClassifierTypes>(classifier: T): T[] {
  const root = classifier.getModelOrRootPackage();

  return root
    .getAllGeneralizations()
    .filter((gen: Generalization) => classifier === gen.general)
    .map((gen: Generalization) => gen.specific) as T[];
}

export function getAncestors<T extends ClassifierTypes>(classifier: T, knownAncestors: T[] = []): T[] {
  const ancestors = new Set<ModelElement>(knownAncestors);

  classifier.getParents().forEach((parent: ClassifierTypes) => {
    if (!ancestors.has(classifier)) {
      parent.getAncestors().forEach(ancestors.add);
      ancestors.add(parent);
    }
  });

  return [...ancestors] as T[];
}

export function getDescendants<T extends ClassifierTypes>(classifier: T, knownDescendants: T[] = []): T[] {
  const descendants = new Set<ModelElement>(knownDescendants);

  classifier.getChildren().forEach((child: ClassifierTypes) => {
    if (!descendants.has(classifier)) {
      child.getDescendants().forEach(descendants.add);
      descendants.add(child);
    }
  });

  return [...descendants] as T[];
}

export function getFilteredAncestors<T extends ClassifierTypes>(classifier: T, filter: (ancestor: T) => boolean): T[] {
  return getAncestors(classifier).filter(filter);
}

export function getFilteredDescendants<T extends ClassifierTypes>(classifier: T, filter: (descendent: T) => boolean): T[] {
  return getAncestors(classifier).filter(filter);
}

export interface Classifier<ClassifierType> {
  properties: Property[];
  isAbstract: boolean;
  isDerived: boolean;

  getGeneralizations(): Generalization[];

  getGeneralizationSets(): GeneralizationSet[];

  getGeneralizationsWhereGeneral(): Generalization[];

  getGeneralizationsWhereSpecific(): Generalization[];

  getGeneralizationSetsWhereGeneral(): GeneralizationSet[];

  getGeneralizationSetsWhereSpecific(): GeneralizationSet[];

  getParents(): ClassifierType[];

  getChildren(): ClassifierType[];

  getAncestors(): ClassifierType[];

  getDescendants(): ClassifierType[];

  getFilteredAncestors(filter: (ancestor: ClassifierType) => boolean): ClassifierType[];

  getFilteredDescendants(filter: (descendent: ClassifierType) => boolean): ClassifierType[];
}
