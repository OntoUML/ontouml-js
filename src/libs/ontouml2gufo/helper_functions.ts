import { ClassStereotype, AbstractTypes, RigidTypes, OntoumlType, RelationStereotype, PropertyStereotype } from '@constants/.';
import { IClass, IDecoratable, IElement, IGeneralization, IGeneralizationSet, IPackage, IProperty, IRelation } from '@types';
import { getXsdUri } from './uri_manager';

export const getText = (element: IElement, field: string, languagePreference?: string[]): string => {
  if (!element || element.name == null) return null;

  if (typeof element.name === 'string') return element.name as string;

  if (!languagePreference) languagePreference = ['en'];

  for (const lang of languagePreference) {
    if (element[field][lang]) {
      return element[field][lang];
    }
  }

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

export function isType(element: IElement): boolean {
  return isClass(element) && getStereotype(element) === ClassStereotype.TYPE;
}

//TODO: Move this method to the core API
export function isDatatype(element: IElement): boolean {
  return isClass(element) && getStereotype(element) === ClassStereotype.DATATYPE;
}

//TODO: Move this method to the core API
export function isEnumeration(element: IClass): boolean {
  return isClass(element) && getStereotype(element) === ClassStereotype.ENUMERATION;
}

//TODO: Move this method to the core API
export function isPrimitiveDatatype(element: IElement): boolean {
  return isDatatype(element) && !hasAttributes(element as IClass) && getXsdUri(element) !== null;
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

  if (!stereotypes || stereotypes.length !== 1) return null;
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
function isClassStereotype(stereotype: string): boolean {
  return Object.values(ClassStereotype).includes(stereotype as ClassStereotype);
}

//TODO: Move this method to the core API
function isRelationStereotype(stereotype: string): boolean {
  return Object.values(RelationStereotype).includes(stereotype as RelationStereotype);
}

//TODO: Move this method to the core API
function isPropertyStereotype(stereotype: string): boolean {
  return Object.values(PropertyStereotype).includes(stereotype as PropertyStereotype);
}

export function getAllClasses(model: IPackage): IClass[] {
  return model.getAllContentsByType([OntoumlType.CLASS_TYPE]) as IClass[];
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

export function isTypeDefined(attribute: IProperty): boolean {
  return attribute.propertyType !== null;
}
