import {
  IElement,
  IPackage,
  IClassifier,
  IGeneralization,
  IContainer,
} from '@types';
import { OntoUMLType } from '@constants/.';

export default {
  IElement_functions: { getRootPackage },
  IContainer_functions: {
    getAllContents,
    getAllContentsByType,
    getContentById,
  },
  IClassifier_functions: {
    getParents,
    getChildren,
    getAncestors,
    getDescendents,
  },
};

function getRootPackage(): IPackage {
  const self = this as IElement;

  if (self.container) {
    let root: IPackage;
    root = self.container.getRootPackage();

    if (this instanceof Package && root === this) {
      throw 'Circular containment references';
    } else if (root) {
      return root;
    } else if (this.container instanceof Package) {
      return this.container;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

function getAllContents(): IElement[] {
  if (this.type === OntoUMLType.PACKAGE_TYPE) {
    let self = this as IPackage;
    let allElements = self.elements ? [...self.elements] : [];

    self.elements.forEach(content => {
      allElements.push(content);
      if (content.type === OntoUMLType.PACKAGE_TYPE) {
        const innerContents = (content as IPackage).getAllContents();
        if (innerContents.includes(self)) {
          throw 'Circular containment references';
        }
        allElements = [...allElements, ...innerContents];
      } else if (
        content.type === OntoUMLType.CLASS_TYPE ||
        content.type === OntoUMLType.RELATION_TYPE
      ) {
        allElements = [...allElements, ...(content as IClassifier).properties];
      }
    });

    return allElements;
  } else if (
    this.type === OntoUMLType.CLASS_TYPE ||
    this.type === OntoUMLType.RELATION_TYPE
  ) {
    return (this as IClassifier).properties;
  }

  return null;
}

function getAllContentsByType(types: OntoUMLType[]): IElement[] {
  const self = this as IContainer;

  return self.getAllContents().filter(element => types.includes(element.type));
}

function getContentById(id: string): IElement {
  const self = this as IContainer;

  return self.getAllContents().find((element: IElement) => element.id === id);
}

function getParents(): IClassifier[] {
  const self = this as IClassifier;
  return self
    .getRootPackage()
    .getAllContentsByType([OntoUMLType.GENERALIZATION_TYPE])
    .filter(
      (generalization: IGeneralization) => generalization.specific === this,
    )
    .map((generalization: IGeneralization) => generalization.general);
}

function getChildren(): IClassifier[] {
  const self = this as IClassifier;
  return this.getRootPackage()
    .getAllContentsByType([OntoUMLType.GENERALIZATION_TYPE])
    .filter(
      (generalization: IGeneralization) => generalization.general === this,
    )
    .map((generalization: IGeneralization) => generalization.specific);
}

function getAncestors(knownAncestors?: IClassifier[]): IClassifier[] {
  const self = this as IClassifier;
  let ancestors = [...knownAncestors];

  this.getParentClassifiers().forEach((parent: IClassifier) => {
    if (!ancestors.includes(parent)) {
      ancestors.push(parent);
      ancestors = [...ancestors, ...self.getAncestors(ancestors)];
    }
  });

  return ancestors;
}

function getDescendents(knownDescendents?: IClassifier[]): IClassifier[] {
  const self = this as IClassifier;
  let descendents = [] || [...knownDescendents];

  this.getChildClassifiers().forEach((child: IClassifier) => {
    if (!descendents.includes(child)) {
      descendents.push(child);
      descendents = [...descendents, ...self.getDescendents(descendents)];
    }
  });

  return descendents;
}
