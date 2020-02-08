import {
  IElement,
  IPackage,
  IClassifier,
  IGeneralization,
  IContainer,
} from '@types';
import { OntoUMLType } from '@constants/.';
import memoizee from 'memoizee';

export default {
  IElement_functions: {
    getRootPackage: getRootPackage,
    // getRootPackage: memoizee(getRootPackage),
    hasIContainerType,
    hasIDecoratableType,
    hasIClassifierType,
  },
  IContainer_functions: {
    getAllContents: getAllContents,
    // getAllContents: memoizee(getAllContents),
    getAllContentsByType: getAllContentsByType,
    // getAllContentsByType: memoizee(getAllContentsByType),
    getContentById: getContentById,
    // getContentById: memoizee(getContentById),
  },
  IClassifier_functions: {
    getParents: getParents,
    // getParents: memoizee(getParents),
    getChildren: getChildren,
    // getChildren: memoizee(getChildren),
    getAncestors: getAncestors,
    // getAncestors: memoizee(getAncestors),
    getDescendents: getDescendents,
    // getDescendents: memoizee(getDescendents),
  },
};

function getRootPackage(): IPackage {
  const self = this as IElement;

  if (self.container) {
    let root: IPackage;

    root = (self.container as IContainer).getRootPackage();

    if (self.type === OntoUMLType.PACKAGE_TYPE && root === self) {
      throw 'Circular containment references';
    } else if (root) {
      return root;
    } else if (self.container.type === OntoUMLType.PACKAGE_TYPE) {
      return self.container as IPackage;
    } else {
      return null;
    }
  } else {
    return self as IPackage;
  }
}

function hasIContainerType(): boolean {
  return [
    OntoUMLType.PACKAGE_TYPE,
    OntoUMLType.CLASS_TYPE,
    OntoUMLType.RELATION_TYPE,
  ].includes((this as IElement).type);
}

function hasIDecoratableType(): boolean {
  return [
    OntoUMLType.PROPERTY_TYPE,
    OntoUMLType.CLASS_TYPE,
    OntoUMLType.RELATION_TYPE,
  ].includes((this as IElement).type);
}

function hasIClassifierType(): boolean {
  return [OntoUMLType.CLASS_TYPE, OntoUMLType.RELATION_TYPE].includes(
    (this as IElement).type,
  );
}

function getAllContents(): IElement[] {
  if (this.type === OntoUMLType.PACKAGE_TYPE) {
    let self = this as IPackage;
    if (!self.contents) {
      return [];
    }

    let allElements = [...self.contents];

    self.contents.forEach(content => {
      if (content.type === OntoUMLType.PACKAGE_TYPE) {
        const innerContents = (content as IPackage).getAllContents();
        if (innerContents.includes(self)) {
          throw {
            title: 'Circular containment references',
            error: content,
          };
        }
        allElements = [...allElements, ...innerContents];
      } else if (
        content.type === OntoUMLType.CLASS_TYPE ||
        content.type === OntoUMLType.RELATION_TYPE
      ) {
        allElements = [
          ...allElements,
          ...((content as IClassifier).properties
            ? (content as IClassifier).properties
            : []),
        ];
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
    .filter((generalization: IGeneralization) => {
      return generalization.specific === self;
    })
    .map((generalization: IGeneralization) => {
      return generalization.general as IClassifier;
    });
}

function getChildren(): IClassifier[] {
  return this.getRootPackage()
    .getAllContentsByType([OntoUMLType.GENERALIZATION_TYPE])
    .filter(
      (generalization: IGeneralization) => generalization.general === this,
    )
    .map((generalization: IGeneralization) => generalization.specific);
}

function getAncestors(knownAncestors?: IClassifier[]): IClassifier[] {
  const self = this as IClassifier;
  let ancestors = [...(knownAncestors ? knownAncestors : [])];

  self.getParents().forEach((parent: IClassifier) => {
    if (!ancestors.includes(parent)) {
      ancestors = [...ancestors, ...parent.getAncestors(ancestors)];
      ancestors.push(parent);
    }
  });

  return ancestors;
}

function getDescendents(knownDescendents?: IClassifier[]): IClassifier[] {
  const self = this as IClassifier;
  let descendents = [] || [...(knownDescendents ? knownDescendents : [])];

  self.getChildren().forEach((child: IClassifier) => {
    if (!descendents.includes(child)) {
      descendents = [...descendents, ...child.getDescendents(descendents)];
      descendents.push(child);
    }
  });

  return descendents;
}
