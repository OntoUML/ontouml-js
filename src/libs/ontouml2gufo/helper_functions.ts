import _ from 'lodash';
import memoizee from 'memoizee';
import tags from 'language-tags';

import {
  ClassStereotype,
  AbstractTypes,
  RigidTypes,
  OntoumlType,
  RelationStereotype,
  PropertyStereotype,
  AggregationKind,
  MomentTypes,
  MomentNatures,
  ObjectTypes,
  ObjectNatures
} from '@constants/.';
import {
  IClass,
  IDecoratable,
  IElement,
  IGeneralization,
  IGeneralizationSet,
  ILiteral,
  IPackage,
  IProperty,
  IRelation
} from '@types';
import { getdUriFromXsdMapping } from './uri_manager';

export const getText = (element: IElement, field: string, languagePreference?: string[]): string => {
  if (!element || element.name == null) return null;

  if (typeof element.name === 'string') return element.name as string;

  if (!languagePreference) languagePreference = ['en'];

  for (const lang of languagePreference) {
    if (element[field][lang]) {
      return element[field][lang];
    }
  }

  if (typeof element.name !== 'object') return null;

  const languages = Object.keys(element.name)
    .filter(lang => tags.check(lang))
    .sort();
  if (languages.length > 0) return element.name[languages[0]];

  return null;
};

export const getName = (element: IElement, languagePreference?: string[]): string => {
  return getText(element, 'name', languagePreference);
};

export const getDescription = (element: IElement, languagePreference?: string[]): string => {
  return getText(element, 'name', languagePreference);
};

//TODO: Move this method to the core API
export function areClasses(elements: IElement[]): boolean {
  const reducer = (accumulator, currentElement) => accumulator && isClass(currentElement);
  return elements.reduce(reducer, true);
}

//TODO: Move this method to the core API
export function isClass(element: IElement): boolean {
  return element != null && element.type === OntoumlType.CLASS_TYPE;
}

//TODO: Move this method to the core API
export function isRelation(element: IElement): boolean {
  return element != null && element.type === OntoumlType.RELATION_TYPE;
}

//TODO: Move this method to the core API
export function isProperty(element: IElement): boolean {
  return element != null && element.type === OntoumlType.PROPERTY_TYPE;
}

//TODO: Move this method to the core API
export function isDecoratable(element: IElement): boolean {
  return [OntoumlType.RELATION_TYPE, OntoumlType.CLASS_TYPE, OntoumlType.PROPERTY_TYPE].includes(element.type);
}

//TODO: Move this method to the core API
export function areRigid(classes: IClass[]): boolean {
  const reducer = (accumulator, currentClass) => accumulator && isRigid(currentClass);
  return classes.reduce(reducer, true);
}

//TODO: Move this method to the core API
export function isRigid(element: IElement): boolean {
  if (!isClass(element)) return false;
  const stereotype = getStereotype(element as IClass);
  return RigidTypes.includes(stereotype as ClassStereotype);
}

//TODO: Move this method to the core API
export function areAbstract(classes: IClass[]): boolean {
  const reducer = (accumulator, currentClass) => accumulator && isAbstract(currentClass);
  return classes.reduce(reducer, true);
}

export function arePrimitiveDatatype(classes: IClass[]): boolean {
  const reducer = (accumulator, currentClass) => accumulator && isPrimitiveDatatype(currentClass);
  return classes.reduce(reducer, true);
}

//TODO: Move this method to the core API
export function isAbstract(element: IElement): boolean {
  if (!isClass(element)) return false;
  const stereotype = getStereotype(element as IClass);
  return AbstractTypes.includes(stereotype as ClassStereotype);
}

export function isConcrete(element: IElement): boolean {
  return isClass(element) && hasOntoumlStereotype(element) && !isAbstract(element) && !isType(element);
}

export function isMoment(element: IElement): boolean {
  if (!isClass(element)) {
    return false;
  }

  const stereotype = getStereotype(element);
  if (MomentTypes.includes(stereotype as ClassStereotype)) {
    return true;
  }

  return hasMomentNature(element);
}

export function hasMomentNature(element: IElement): boolean {
  if (!isClass(element)) {
    return false;
  }

  const classNatures = (element as IClass).allowed;
  return includesAll(MomentNatures, classNatures);
}

export function isObject(element: IElement): boolean {
  if (!isClass(element)) {
    return false;
  }

  const stereotype = getStereotype(element);
  if (ObjectTypes.includes(stereotype as ClassStereotype)) {
    return true;
  }

  return hasObjectNature(element);
}

export function hasObjectNature(element: IElement): boolean {
  if (!isClass(element)) {
    return false;
  }

  const classNatures = (element as IClass).allowed;
  return includesAll(ObjectNatures, classNatures);
}

function includesAll(superset: any[], subset: any[]): boolean {
  return _.difference(subset, superset).length === 0;
}

export function isType(element: IElement): boolean {
  return isClass(element) && getStereotype(element) === ClassStereotype.TYPE;
}

export function isEvent(element: IElement): boolean {
  return isClass(element) && getStereotype(element) === ClassStereotype.EVENT;
}

export function isSituation(element: IElement): boolean {
  return isClass(element) && getStereotype(element) === ClassStereotype.SITUATION;
}

//TODO: Move this method to the core API
export function isDatatype(element: IElement): boolean {
  return isClass(element) && getStereotype(element) === ClassStereotype.DATATYPE;
}

//TODO: Move this method to the core API
export function isEnumeration(element: IClass): boolean {
  return isClass(element) && getStereotype(element) === ClassStereotype.ENUMERATION;
}

//THIS FUNCTION SHOULD NOT BE MOVED TO THE CORE API
export function isPrimitiveDatatype(element: IElement): boolean {
  return isDatatype(element) && !hasAttributes(element as IClass) && getdUriFromXsdMapping(element) !== null;
}

//TODO: Move this method to the core API
export function isComplexDatatype(element: IElement): boolean {
  return isDatatype(element) && hasAttributes(element as IClass);
}

//TODO: Move this method to the core API
export function hasAttributes(_class: IClass): boolean {
  return _class.properties && _class.properties.length > 0;
}

//TODO: Move this method to the core API
export function getStereotype(element: IElement): string {
  if (!isDecoratable(element)) return null;

  const decoratable: IDecoratable = element as IDecoratable;
  const stereotypes = decoratable.stereotypes;

  if (!stereotypes || stereotypes.length !== 1) {
    return null;
  }

  const stereotype = stereotypes[0];

  if (
    (isClass(decoratable) && isClassStereotype(stereotype)) ||
    (isRelation(decoratable) && isRelationStereotype(stereotype)) ||
    (isProperty(decoratable) && isPropertyStereotype(stereotype))
  )
    return stereotype;

  return null;
}

//TODO: Move this method to the core API
export function hasOntoumlStereotype(element: IElement): boolean {
  const stereotype = getStereotype(element);
  return stereotype !== null;
}

//TODO: Move this method to the core API
export function isClassStereotype(stereotype: string): boolean {
  return Object.values(ClassStereotype).includes(stereotype as ClassStereotype);
}

//TODO: Move this method to the core API
export function isRelationStereotype(stereotype: string): boolean {
  return Object.values(RelationStereotype).includes(stereotype as RelationStereotype);
}

//TODO: Move this method to the core API
export function isPropertyStereotype(stereotype: string): boolean {
  return Object.values(PropertyStereotype).includes(stereotype as PropertyStereotype);
}

export function isInstantiation(relation: IRelation): boolean {
  return getStereotype(relation) === RelationStereotype.INSTANTIATION;
}

export function isDerivation(relation: IRelation): boolean {
  return getStereotype(relation) === RelationStereotype.DERIVATION;
}

export function isMaterial(relation: IRelation): boolean {
  return getStereotype(relation) === RelationStereotype.MATERIAL;
}

export function isComparative(relation: IRelation): boolean {
  return getStereotype(relation) === RelationStereotype.COMPARATIVE;
}

export function getAllClasses(model: IPackage): IClass[] {
  return model.getAllContentsByType([OntoumlType.CLASS_TYPE]) as IClass[];
}

export function getAllAttributes(model: IPackage): IProperty[] {
  const properties = model.getAllContentsByType([OntoumlType.PROPERTY_TYPE]) as IProperty[];
  const attributes = properties.filter(prop => prop._container.type === OntoumlType.CLASS_TYPE);
  return attributes;
}

export function getAllAssociationEnds(model: IPackage): IProperty[] {
  const properties = model.getAllContentsByType([OntoumlType.PROPERTY_TYPE]) as IProperty[];
  const relationEnds = properties.filter(prop => prop._container.type === OntoumlType.RELATION_TYPE);
  return relationEnds;
}

export function getAllRelations(model: IPackage): IRelation[] {
  return model.getAllContentsByType([OntoumlType.RELATION_TYPE]) as IRelation[];
}

export function getAllGeneralizations(model: IPackage): IGeneralization[] {
  return model.getAllContentsByType([OntoumlType.GENERALIZATION_TYPE]) as IGeneralization[];
}

export function getAllGeneralizationSets(model: IPackage): IGeneralizationSet[] {
  return model.getAllContentsByType([OntoumlType.GENERALIZATION_SET_TYPE]) as IGeneralizationSet[];
}

export function getAllPackages(model: IPackage): IPackage[] {
  return model.getAllContentsByType([OntoumlType.PACKAGE_TYPE]) as IPackage[];
}

export function getAllEnumerations(model: IPackage): IClass[] {
  return (model.getAllContentsByType([OntoumlType.CLASS_TYPE]) as IClass[]).filter(c => isEnumeration(c));
}

export function getAllLiterals(model: IPackage): ILiteral[] {
  let literals: ILiteral[] = [];
  getAllEnumerations(model).forEach(e => (literals = literals.concat(e.literals)));
  return literals;
}

export function isTypeDefined(attribute: IProperty): boolean {
  return attribute.propertyType !== null;
}

export function isPartWholeRelation(relation: IRelation) {
  const partWholeKinds = [AggregationKind.SHARED, AggregationKind.COMPOSITE];
  return (
    partWholeKinds.includes(relation.properties[0].aggregationKind) ||
    partWholeKinds.includes(relation.properties[1].aggregationKind)
  );
}

export function getSourceStereotype(relation: IRelation) {
  const sourceClass = relation.getSource();
  return getStereotype(sourceClass);
}

export function getTargetStereotype(relation: IRelation) {
  const targetClass = relation.getTarget();
  return getStereotype(targetClass);
}

export function holdsBetweenEvents(relation: IRelation) {
  return isEvent(relation.getSource()) && isEvent(relation.getTarget());
}

export function holdsBetweenAspects(relation: IRelation) {
  return isMoment(relation.getSource()) && isMoment(relation.getTarget());
}

export function holdsBetweenObjects(relation: IRelation) {
  return isObject(relation.getSource()) && isObject(relation.getTarget());
}

export function isExistentialDependency(relation: IRelation) {
  return relation.properties[0].isReadOnly || relation.properties[1].isReadOnly;
}

export function isBounded(property: IProperty): boolean {
  return property.cardinality !== '*' && property.cardinality !== '0..*';
}

export function isBinary(relation: IRelation): boolean {
  return relation.properties.length == 2;
}

export function sourceExistentiallyDependsOnTarget(relation: IRelation): boolean {
  const sourceProperty = relation.properties[0];

  const stereotype = getStereotype(relation);
  const existentialDependecyOnSource: string[] = [
    RelationStereotype.BRINGS_ABOUT,
    RelationStereotype.CREATION,
    RelationStereotype.MANIFESTATION,
    RelationStereotype.PARTICIPATION,
    RelationStereotype.PARTICIPATIONAL,
    RelationStereotype.TERMINATION,
    RelationStereotype.TRIGGERS
  ];

  return sourceProperty.isReadOnly || existentialDependecyOnSource.includes(stereotype);
}

export function targetExistentiallyDependsOnSource(relation: IRelation): boolean {
  const targetProperty = relation.properties[1];

  const stereotype = getStereotype(relation);
  const existentialDependecyOnTarget: string[] = [
    RelationStereotype.BRINGS_ABOUT,
    RelationStereotype.CHARACTERIZATION,
    RelationStereotype.CREATION,
    RelationStereotype.EXTERNAL_DEPENDENCE,
    RelationStereotype.HISTORICAL_DEPENDENCE,
    RelationStereotype.MEDIATION,
    RelationStereotype.PARTICIPATIONAL
  ];

  return targetProperty.isReadOnly || existentialDependecyOnTarget.includes(stereotype);
}

export function impliesExistentialDependency(relation: IRelation): boolean {
  return sourceExistentiallyDependsOnTarget(relation) || targetExistentiallyDependsOnSource(relation);
}

export const getLowerboundCardinality = memoizee((cardinality: string): number => {
  const cardinalities = cardinality.split('..');
  const lowerbound = cardinalities[0];

  return lowerbound === '*' ? 0 : Number(lowerbound);
});

export const UNBOUNDED_CARDINALITY = 99999;

export const getUpperboundCardinality = memoizee((cardinality: string): number => {
  const cardinalities = cardinality.split('..');
  const upperbound = cardinalities[1] || cardinalities[0];

  return upperbound === '*' ? UNBOUNDED_CARDINALITY : Number(upperbound);
});
