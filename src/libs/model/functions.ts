import {
  IElement,
  IPackage,
  IClassifier,
  IGeneralization,
  IContainer,
  IRelation,
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
    getDescendants,
    getRelations,
  },
};

function getRootPackage(): IPackage {
  const self = this as IElement;

  if (self._container) {
    const root: IPackage = (self._container as IContainer).getRootPackage();

    if (self.type === OntoUMLType.PACKAGE_TYPE && root === self) {
      throw 'Circular containment references';
    } else if (root) {
      return root;
    } else if (self._container.type === OntoUMLType.PACKAGE_TYPE) {
      return self._container as IPackage;
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

  return self._generalOfGeneralizations
    ? self._generalOfGeneralizations.map(
        (generalization: IGeneralization) =>
          generalization.general as IClassifier,
      )
    : [];
}

function getChildren(): IClassifier[] {
  const self = this as IClassifier;

  return self._specificOfGeneralizations
    ? self._specificOfGeneralizations.map(
        (specialization: IGeneralization) =>
          specialization.specific as IClassifier,
      )
    : [];
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

function getDescendants(knownDescendants?: IClassifier[]): IClassifier[] {
  const self = this as IClassifier;
  let descendants = [...(knownDescendants ? knownDescendants : [])];

  self.getChildren().forEach((child: IClassifier) => {
    if (!descendants.includes(child)) {
      descendants = [...child.getDescendants(descendants)];
      descendants.push(child);
    }
  });

  return descendants;
}

function getRelations(): IRelation[] {
  const self = this as IClassifier;

  return self
    .getRootPackage()
    .getAllContentsByType([OntoUMLType.RELATION_TYPE])
    .filter(
      (relation: IRelation) =>
        relation.properties[0].propertyType.id === self.id ||
        relation.properties[1].propertyType.id === self.id,
    )
    .map((relation: IRelation) => relation);
}
