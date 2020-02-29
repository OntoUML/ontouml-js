import {
  IElement,
  IPackage,
  IClassifier,
  IGeneralization,
  IContainer,
  IRelation,
  IGeneralizationSet,
  IProperty,
  IClass,
} from '@types';
import { OntoUMLType } from '@constants/.';
import memoizee from 'memoizee';

export function inject(
  element: IElement,
  enableMemoization: boolean = true,
): void {
  injectFunctions(element, functions._IElement, enableMemoization);

  if (element.hasIContainerType()) {
    injectFunctions(element, functions._IContainer, enableMemoization);
  }

  if (element.hasIClassifierType()) {
    injectFunctions(element, functions._IClassifier, enableMemoization);
  }

  if (element.hasIDecoratableType()) {
    injectFunctions(element, functions._IDecoratable, enableMemoization);
  }

  switch (element.type) {
    case OntoUMLType.PACKAGE_TYPE:
      injectFunctions(element, functions._IPackage, enableMemoization);
      break;
    case OntoUMLType.CLASS_TYPE:
      injectFunctions(element, functions._IClass, enableMemoization);
      break;
    case OntoUMLType.RELATION_TYPE:
      injectFunctions(element, functions._IRelation, enableMemoization);
      break;
    case OntoUMLType.GENERALIZATION_TYPE:
      injectFunctions(element, functions._IGeneralization, enableMemoization);
      break;
    case OntoUMLType.GENERALIZATION_SET_TYPE:
      injectFunctions(
        element,
        functions._IGeneralizationSet,
        enableMemoization,
      );
      break;
    case OntoUMLType.PROPERTY_TYPE:
      injectFunctions(element, functions._IProperty, enableMemoization);
      break;
    case OntoUMLType.LITERAL_TYPE:
      injectFunctions(element, functions._ILiteral, enableMemoization);
      break;
  }
}

export function eject(element: IElement): void {
  Object.keys(element).forEach((elementKey: string) => {
    if (element[elementKey] instanceof Function) {
      delete element[elementKey];
    }
  });
}

function injectFunctions(
  element: IElement,
  functionImplementations: any,
  enableMemoization: boolean = true,
): void {
  Object.keys(functionImplementations).forEach((functionName: string) => {
    element[functionName] = enableMemoization
      ? memoizee(functionImplementations[functionName])
      : functionImplementations[functionName];
  });
}

const functions = {
  _IElement: {
    getRootPackage,
    hasIContainerType,
    hasIDecoratableType,
    hasIClassifierType,
  },
  _IContainer: {
    getAllContents,
    getAllContentsByType,
    getContentById,
  },
  _IClassifier: {
    getParents,
    getChildren,
    getAncestors,
    getDescendants,
    getRelations,
  },
  _IDecoratable: {},
  _IPackage: {},
  _IClass: {},
  _IRelation: {
    isBinary,
    isTernary,
    isDerivation,
    getSource,
    getTarget,
    getDerivingRelation,
    getDerivedClass,
  },
  _IGeneralization: {},
  _IGeneralizationSet: {
    getGeneral,
  },
  _IProperty: {},
  _ILiteral: {},
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

function isBinary(): boolean {
  const self = this as IRelation;
  if (!self.properties || self.properties.length !== 2) return false;

  const source = self.properties[0].propertyType as IClassifier;
  const target = self.properties[1].propertyType as IClassifier;

  return (
    source &&
    target &&
    source.type === OntoUMLType.CLASS_TYPE &&
    target.type === OntoUMLType.CLASS_TYPE
  );
}

function isTernary(): boolean {
  const self = this as IRelation;
  if (!self.properties || self.properties.length < 2) return false;

  return self.properties.every((end: IProperty) => {
    return end.propertyType && end.propertyType.type === OntoUMLType.CLASS_TYPE;
  });
}

function isDerivation(): boolean {
  const self = this as IRelation;
  if (!self.properties || self.properties.length !== 2) return false;

  const source = self.properties[0].propertyType as IClassifier;
  const target = self.properties[1].propertyType as IClassifier;

  return (
    source &&
    target &&
    source.type === OntoUMLType.RELATION_TYPE &&
    target.type === OntoUMLType.CLASS_TYPE
  );
}

function getSource(): IClass {
  const self = this as IRelation;
  return self.isBinary() && self.properties[0]
    ? (self.properties[0].propertyType as IClass)
    : null;
}

function getTarget(): IClass {
  const self = this as IRelation;
  return self.isBinary() && self.properties[1]
    ? (self.properties[1].propertyType as IClass)
    : null;
}

function getDerivingRelation(): IRelation {
  const self = this as IRelation;
  return self.isDerivation() && self.properties[0]
    ? (self.properties[0].propertyType as IRelation)
    : null;
}

function getDerivedClass(): IClass {
  const self = this as IRelation;
  return self.isDerivation() && self.properties[1]
    ? (self.properties[1].propertyType as IClass)
    : null;
}

function getGeneral(): IClassifier {
  const self = this as IGeneralizationSet;
  return (self.generalizations[0] as IGeneralization).general as IClassifier;
}
