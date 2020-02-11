import {
  IElement,
  IPackage,
  IClassifier,
  IGeneralization,
  IContainer,
} from '@types';
import { OntoUMLType } from '@constants/.';

export default {
  IElement_functions: {
    getRootPackage,
    hasIContainerType,
    hasIDecoratableType,
    hasIClassifierType,
  },
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
    const root: IPackage = (self.container as IContainer).getRootPackage();

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
    const self = this as IPackage;
    if (!self.contents) {
      return [];
    }

    let allElements = [...self.contents];

    self.contents.forEach((content: IElement) => {
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

  return self
    .getAllContents()
    .filter((element: IElement) => types.includes(element.type));
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
  const self = this as IClassifier;

  return self
    .getRootPackage()
    .getAllContentsByType([OntoUMLType.GENERALIZATION_TYPE])
    .filter(
      (generalization: IGeneralization) => generalization.general === self,
    )
    .map((generalization: IGeneralization) => {
      return generalization.specific as IClassifier;
    });
}

function getAncestors(knownAncestors?: IClassifier[]): IClassifier[] {
  const self = this as IClassifier;
  let ancestors = [...(knownAncestors ? knownAncestors : [])];

  self.getParents().forEach((parent: IClassifier) => {
    if (!ancestors.includes(parent)) {
      ancestors = [...parent.getAncestors(ancestors)];
      ancestors.push(parent);
    }
  });

  return ancestors;
}

function getDescendents(knownDescendents?: IClassifier[]): IClassifier[] {
  const self = this as IClassifier;
  let descendents = [...(knownDescendents ? knownDescendents : [])];

  self.getChildren().forEach((child: IClassifier) => {
    if (!descendents.includes(child)) {
      descendents = [...child.getDescendents(descendents)];
      descendents.push(child);
    }
  });

  return descendents;
}
