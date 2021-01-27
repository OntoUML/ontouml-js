import {
  IElement,
  IPackage,
  IClassifier,
  IGeneralization,
  IContainer,
  IRelation,
  IGeneralizationSet,
  IProperty,
  IClass
} from '@types';
import { OntoumlType, ClassStereotype, OntologicalNature } from '@constants/.';
import memoizee from 'memoizee';

export function inject(element: IElement, enableMemoization: boolean = true): void {
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
    case OntoumlType.PACKAGE_TYPE:
      injectFunctions(element, functions._IPackage, enableMemoization);
      break;
    case OntoumlType.CLASS_TYPE:
      injectFunctions(element, functions._IClass, enableMemoization);
      break;
    case OntoumlType.RELATION_TYPE:
      injectFunctions(element, functions._IRelation, enableMemoization);
      break;
    case OntoumlType.GENERALIZATION_TYPE:
      injectFunctions(element, functions._IGeneralization, enableMemoization);
      break;
    case OntoumlType.GENERALIZATION_SET_TYPE:
      injectFunctions(element, functions._IGeneralizationSet, enableMemoization);
      break;
    case OntoumlType.PROPERTY_TYPE:
      injectFunctions(element, functions._IProperty, enableMemoization);
      break;
    case OntoumlType.LITERAL_TYPE:
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

function injectFunctions(element: IElement, functionImplementations: any, enableMemoization: boolean = true): void {
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
    hasIClassifierType
  },
  _IContainer: {
    getAllContents,
    getAllContentsByType,
    getContentById
  },
  _IClassifier: {
    getParents,
    getChildren,
    getAncestors,
    getDescendants,
    getRelations
  },
  _IDecoratable: {},
  _IPackage: {},
  _IClass: {
    isSortal,
    isNonSortal,
    isUltimateSortal,
    isRigid,
    isSemiRigid,
    isAntiRigid,
    allowsInstances
  },
  _IRelation: {
    isBinary,
    isTernary,
    isDerivation,
    getSource,
    getTarget,
    getDerivingRelation,
    getDerivedClass
  },
  _IGeneralization: {},
  _IGeneralizationSet: {
    getGeneral
  },
  _IProperty: {},
  _ILiteral: {}
};

function getRootPackage(): IPackage {
  const self = this as IElement;

  if (self._container) {
    const root: IPackage = (self._container as IContainer).getRootPackage();

    if (self.type === OntoumlType.PACKAGE_TYPE && root === self) {
      throw 'Circular containment references';
    } else if (root) {
      return root;
    } else if (self._container.type === OntoumlType.PACKAGE_TYPE) {
      return self._container as IPackage;
    } else {
      return null;
    }
  } else {
    return self as IPackage;
  }
}

function hasIContainerType(): boolean {
  return [OntoumlType.PACKAGE_TYPE, OntoumlType.CLASS_TYPE, OntoumlType.RELATION_TYPE].includes((this as IElement).type);
}

function hasIDecoratableType(): boolean {
  return [OntoumlType.PROPERTY_TYPE, OntoumlType.CLASS_TYPE, OntoumlType.RELATION_TYPE].includes((this as IElement).type);
}

function hasIClassifierType(): boolean {
  return [OntoumlType.CLASS_TYPE, OntoumlType.RELATION_TYPE].includes((this as IElement).type);
}

function getAllContents(): IElement[] {
  if (this.type === OntoumlType.PACKAGE_TYPE) {
    const self = this as IPackage;
    if (!self.contents) {
      return [];
    }

    let allElements = [...self.contents];

    self.contents.forEach((content: IElement) => {
      if (content.type === OntoumlType.PACKAGE_TYPE) {
        const innerContents = (content as IPackage).getAllContents();
        if (innerContents.includes(self)) {
          throw {
            title: 'Circular containment references',
            error: content
          };
        }
        allElements = [...allElements, ...innerContents];
      } else if (content.type === OntoumlType.CLASS_TYPE || content.type === OntoumlType.RELATION_TYPE) {
        allElements = [...allElements, ...((content as IClassifier).properties ? (content as IClassifier).properties : [])];
      }
    });

    return allElements;
  } else if (this.type === OntoumlType.CLASS_TYPE || this.type === OntoumlType.RELATION_TYPE) {
    return (this as IClassifier).properties;
  }

  return null;
}

function getAllContentsByType(types: OntoumlType[]): IElement[] {
  const self = this as IContainer;

  return self.getAllContents().filter((element: IElement) => types.includes(element.type));
}

function getContentById(id: string): IElement {
  const self = this as IContainer;

  return self.getAllContents().find((element: IElement) => element.id === id);
}

function getParents(): IClassifier[] {
  const self = this as IClassifier;

  return self._generalOfGeneralizations
    ? self._generalOfGeneralizations.map((generalization: IGeneralization) => generalization.general as IClassifier)
    : [];
}

function getChildren(): IClassifier[] {
  const self = this as IClassifier;

  return self._specificOfGeneralizations
    ? self._specificOfGeneralizations.map((specialization: IGeneralization) => specialization.specific as IClassifier)
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
    .getAllContentsByType([OntoumlType.RELATION_TYPE])
    .filter(
      (relation: IRelation) =>
        relation.properties[0].propertyType.id === self.id || relation.properties[1].propertyType.id === self.id
    )
    .map((relation: IRelation) => relation);
}

function isSortal(): boolean {
  const self = this as IClass;

  if (self.stereotypes && self.stereotypes.length === 1) {
    const strs: string[] = [
      ClassStereotype.KIND,
      ClassStereotype.COLLECTIVE,
      ClassStereotype.QUANTITY,
      ClassStereotype.RELATOR,
      ClassStereotype.MODE,
      ClassStereotype.QUALITY,
      ClassStereotype.SUBKIND,
      ClassStereotype.ROLE,
      ClassStereotype.PHASE,
      ClassStereotype.HISTORICAL_ROLE
    ];
    return strs.includes(self.stereotypes[0]);
  }

  return false;
}

function isNonSortal(): boolean {
  const self = this as IClass;

  if (self.stereotypes && self.stereotypes.length === 1) {
    const strs: string[] = [
      ClassStereotype.CATEGORY,
      ClassStereotype.MIXIN,
      ClassStereotype.ROLE_MIXIN,
      ClassStereotype.PHASE_MIXIN,
      ClassStereotype.HISTORICAL_ROLE_MIXIN
    ];
    return strs.includes(self.stereotypes[0]);
  }

  return false;
}

function isUltimateSortal(): boolean {
  const self = this as IClass;

  if (self.stereotypes && self.stereotypes.length === 1) {
    const strs: string[] = [
      ClassStereotype.KIND,
      ClassStereotype.COLLECTIVE,
      ClassStereotype.QUANTITY,
      ClassStereotype.RELATOR,
      ClassStereotype.MODE,
      ClassStereotype.QUALITY
    ];
    return strs.includes(self.stereotypes[0]);
  }

  return false;
}

function isRigid(): boolean {
  const self = this as IClass;

  if (self.stereotypes && self.stereotypes.length === 1) {
    const strs: string[] = [
      ClassStereotype.KIND,
      ClassStereotype.COLLECTIVE,
      ClassStereotype.QUANTITY,
      ClassStereotype.RELATOR,
      ClassStereotype.MODE,
      ClassStereotype.QUALITY,
      ClassStereotype.SUBKIND,
      ClassStereotype.CATEGORY,
      ClassStereotype.TYPE
    ];
    return strs.includes(self.stereotypes[0]);
  }

  return false;
}

function isSemiRigid(): boolean {
  const self = this as IClass;

  if (self.stereotypes && self.stereotypes.length === 1) {
    const strs: string[] = [ClassStereotype.MIXIN];
    return strs.includes(self.stereotypes[0]);
  }

  return false;
}

function isAntiRigid(): boolean {
  const self = this as IClass;

  if (self.stereotypes && self.stereotypes.length === 1) {
    const strs: string[] = [
      ClassStereotype.ROLE_MIXIN,
      ClassStereotype.PHASE_MIXIN,
      ClassStereotype.ROLE,
      ClassStereotype.PHASE,
      ClassStereotype.HISTORICAL_ROLE,
      ClassStereotype.HISTORICAL_ROLE_MIXIN
    ];
    return strs.includes(self.stereotypes[0]);
  }

  return false;
}

function allowsInstances(instancesNatures: OntologicalNature[]): boolean {
  const self = this as IClass;

  if (self.allowed) {
    return instancesNatures.every((instancesNature: OntologicalNature) => self.allowed.includes(instancesNature));
  }

  return false;
}

function isBinary(): boolean {
  const self = this as IRelation;
  if (!self.properties || self.properties.length !== 2) return false;

  const source = self.properties[0].propertyType as IClassifier;
  const target = self.properties[1].propertyType as IClassifier;

  return source && target && source.type === OntoumlType.CLASS_TYPE && target.type === OntoumlType.CLASS_TYPE;
}

function isTernary(): boolean {
  const self = this as IRelation;
  if (!self.properties || self.properties.length < 2) return false;

  return self.properties.every((end: IProperty) => {
    return end.propertyType && end.propertyType.type === OntoumlType.CLASS_TYPE;
  });
}

function isDerivation(): boolean {
  const self = this as IRelation;
  if (!self.properties || self.properties.length !== 2) return false;

  const source = self.properties[0].propertyType as IClassifier;
  const target = self.properties[1].propertyType as IClassifier;

  return source && target && source.type === OntoumlType.RELATION_TYPE && target.type === OntoumlType.CLASS_TYPE;
}

function getSource(): IClass {
  const self = this as IRelation;
  return self.isBinary() && self.properties[0] ? (self.properties[0].propertyType as IClass) : ({} as IClass);
}

function getTarget(): IClass {
  const self = this as IRelation;
  return self.isBinary() && self.properties[1] ? (self.properties[1].propertyType as IClass) : ({} as IClass);
}

function getDerivingRelation(): IRelation {
  const self = this as IRelation;
  return self.isDerivation() && self.properties[0] ? (self.properties[0].propertyType as IRelation) : null;
}

function getDerivedClass(): IClass {
  const self = this as IRelation;
  return self.isDerivation() && self.properties[1] ? (self.properties[1].propertyType as IClass) : null;
}

function getGeneral(): IClassifier {
  const self = this as IGeneralizationSet;
  return (self.generalizations[0] as IGeneralization).general as IClassifier;
}
