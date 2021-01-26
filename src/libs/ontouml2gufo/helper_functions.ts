// import _ from 'lodash';
// import tags from 'language-tags';

// import {
//   ClassStereotype,
//   AbstractStereotypes,
//   RigidStereotypes,
//   OntoumlType,
//   RelationStereotype,
//   PropertyStereotype,
//   AggregationKind,
//   MomentOnlyStereotypes,
//   MomentNatures,
//   ObjectOnlyStereotypes,
//   ObjectNatures
// } from '@constants/.';
// import {
//   IClass,
//   IDecoratable,
//   IElement,
//   IGeneralization,
//   IGeneralizationSet,
//   ILiteral,
//   IPackage,
//   IProperty,
//   IRelation
// } from '@types';
// import { getUriFromXsdMapping } from './uri_manager';

// // TODO: remove after migrating to the core API
// export const getText = (element: IElement, field: string, languagePreference?: string[]): string => {
//   if (!element || element.name == null) return null;

//   if (typeof element.name === 'string') return element.name as string;

//   if (!languagePreference) languagePreference = ['en'];

//   for (const lang of languagePreference) {
//     if (element[field][lang]) {
//       return element[field][lang];
//     }
//   }

//   // TODO: review if the reference to 'name' is intentional
//   if (typeof element.name !== 'object') return null;

//   // TODO: propose moving tags.check(lang) to verification service
//   const languages = Object.keys(element.name)
//     .filter(lang => tags.check(lang))
//     .sort();
//   if (languages.length > 0) return element.name[languages[0]];

//   return null;
// };

// // TODO: replace by OntoumlElement this.getName()
// export const getName = (element: IElement, languagePreference?: string[]): string => {
//   return getText(element, 'name', languagePreference);
// };

// // TODO: replace by OntoumlElement this.getDescription()
// export const getDescription = (element: IElement, languagePreference?: string[]): string => {
//   return getText(element, 'name', languagePreference);
// };

// //TODO: replace by ModelElement.areClasses(modelElements)
// export function areClasses(elements: IElement[]): boolean {
//   const reducer = (accumulator, currentElement) => accumulator && isClass(currentElement);
//   return elements.reduce(reducer, true);
// }

// //TODO: replace by instanceof Class
// export function isClass(element: IElement): boolean {
//   return element != null && element.type === OntoumlType.CLASS_TYPE;
// }

// //TODO: replace by instanceof Relation
// export function isRelation(element: IElement): boolean {
//   return element != null && element.type === OntoumlType.RELATION_TYPE;
// }

// //TODO: replace by instanceof Property
// export function isProperty(element: IElement): boolean {
//   return element != null && element.type === OntoumlType.PROPERTY_TYPE;
// }

// //TODO: replace by ModelElement this.isDecoratable()
// export function isDecoratable(element: IElement): boolean {
//   return [OntoumlType.RELATION_TYPE, OntoumlType.CLASS_TYPE, OntoumlType.PROPERTY_TYPE].includes(element.type);
// }

// //TODO: replace with Class.areRigid(classes:Class[])
// export function areRigid(classes: IClass[]): boolean {
//   const reducer = (accumulator, currentClass) => accumulator && isRigid(currentClass);
//   return classes.reduce(reducer, true);
// }

// //TODO: replace with Class this.isRigid()
// export function isRigid(element: IElement): boolean {
//   if (!isClass(element)) return false;
//   const stereotype = getStereotype(element as IClass);
//   return RigidStereotypes.includes(stereotype as ClassStereotype);
// }

// //TODO: replace with Class.areAbstract(classes:Class[])
// export function areAbstract(classes: IClass[]): boolean {
//   const reducer = (accumulator, currentClass) => accumulator && isAbstract(currentClass);
//   return classes.reduce(reducer, true);
// }

// export function arePrimitiveDatatype(classes: IClass[]): boolean {
//   const reducer = (accumulator, currentClass) => accumulator && isPrimitiveDatatype(currentClass);
//   return classes.reduce(reducer, true);
// }

// //TODO: replace with Class this.isAbstract
// export function isAbstract(element: IElement): boolean {
//   if (!isClass(element)) return false;
//   const stereotype = getStereotype(element as IClass);
//   return AbstractStereotypes.includes(stereotype as ClassStereotype);
// }

// // TODO: review if this is needed in the core API
// export function isConcrete(element: IElement): boolean {
//   return isClass(element) && hasOntoumlStereotype(element) && !isAbstract(element) && !isType(element);
// }

// // TODO: review code; isMoment should only check if "allowed" includes solely "MomentNatures"
// // TODO: replace with Class this.isMoment()
// export function isMoment(element: IElement): boolean {
//   if (!isClass(element)) {
//     return false;
//   }

//   const stereotype = getStereotype(element);
//   if (MomentOnlyStereotypes.includes(stereotype as ClassStereotype)) {
//     return true;
//   }

//   return hasMomentNature(element);
// }

// // TODO: replace with Class this.restrictedToContainedIn(MomentNatures)
// export function hasMomentNature(element: IElement): boolean {
//   if (!isClass(element)) {
//     return false;
//   }

//   const classNatures = (element as IClass).allowed;
//   return includesAll(MomentNatures, classNatures);
// }

// // TODO: review code; isMoment should only check if "allowed" includes solely "ObjectNatures"
// // TODO: replace with Class this.isSubstantial()
// export function isObject(element: IElement): boolean {
//   if (!isClass(element)) {
//     return false;
//   }

//   const stereotype = getStereotype(element);
//   if (ObjectOnlyStereotypes.includes(stereotype as ClassStereotype)) {
//     return true;
//   }

//   return hasObjectNature(element);
// }

// // TODO: replace with Class this.restrictedToContainedIn(ObjectNatures)
// export function hasObjectNature(element: IElement): boolean {
//   if (!isClass(element)) {
//     return false;
//   }

//   const classNatures = (element as IClass).allowed;
//   return includesAll(ObjectNatures, classNatures);
// }

// // TODO: replace with 'project/utils' utils.includesAll<T>(superSet:T,subSet:T)
// function includesAll(superset: any[], subset: any[]): boolean {
//   return _.difference(subset, superset).length === 0;
// }

// // TODO: replace with Class this.isTpe()
// export function isType(element: IElement): boolean {
//   return isClass(element) && getStereotype(element) === ClassStereotype.TYPE;
// }

// // TODO: replace with Class this.isEvent()
// export function isEvent(element: IElement): boolean {
//   return isClass(element) && getStereotype(element) === ClassStereotype.EVENT;
// }

// // TODO: replace with Class this.isSituation()
// export function isSituation(element: IElement): boolean {
//   return isClass(element) && getStereotype(element) === ClassStereotype.SITUATION;
// }

// // TODO: replace with Class this.isDatatype()
// export function isDatatype(element: IElement): boolean {
//   return isClass(element) && getStereotype(element) === ClassStereotype.DATATYPE;
// }

// // TODO: replace with Class this.isEnumeration()
// export function isEnumeration(element: IClass): boolean {
//   return isClass(element) && getStereotype(element) === ClassStereotype.ENUMERATION;
// }

// //THIS FUNCTION SHOULD NOT BE MOVED TO THE CORE API
// export function isPrimitiveDatatype(element: IElement): boolean {
//   return isDatatype(element) && !hasAttributes(element as IClass) && getUriFromXsdMapping(element) !== null;
// }

// //TODO: replace with Class this.isComplexDatatype()
// export function isComplexDatatype(element: IElement): boolean {
//   return isDatatype(element) && hasAttributes(element as IClass);
// }

// //TODO: replace with Class this.hasAttributes()
// export function hasAttributes(_class: IClass): boolean {
//   return _class.properties && _class.properties.length > 0;
// }

// //TODO: replace with Decoratable (Class | Relation | Property) this.getUniqueStereotype()
// // WARNING: it may necessary to call ModelElement this.isDecoratable() beforehand
// export function getStereotype(element: IElement): string {
//   if (!isDecoratable(element)) return null;

//   const decoratable: IDecoratable = element as IDecoratable;
//   const stereotypes = decoratable.stereotypes;

//   if (!stereotypes || stereotypes.length !== 1) {
//     return null;
//   }

//   const stereotype = stereotypes[0];

//   if (
//     (isClass(decoratable) && isClassStereotype(stereotype)) ||
//     (isRelation(decoratable) && isRelationStereotype(stereotype)) ||
//     (isProperty(decoratable) && isPropertyStereotype(stereotype))
//   )
//     return stereotype;

//   return null;
// }

// //TODO: replace with Decoratable (Class | Relation | Property) this.hasValidStereotypeValue()
// // WARNING: it may necessary to call ModelElement this.isDecoratable() beforehand
// export function hasOntoumlStereotype(element: IElement): boolean {
//   const stereotype = getStereotype(element);
//   return stereotype !== null;
// }

// // TODO: replace with 'project/stereotypes' stereotypes.isClassStereotype(stereotype)
// export function isClassStereotype(stereotype: string): boolean {
//   return Object.values(ClassStereotype).includes(stereotype as ClassStereotype);
// }

// // TODO: replace with 'project/stereotypes' stereotypes.isRelationStereotype(stereotype)
// export function isRelationStereotype(stereotype: string): boolean {
//   return Object.values(RelationStereotype).includes(stereotype as RelationStereotype);
// }

// // TODO: replace with 'project/stereotypes' stereotypes.isPropertyStereotype(stereotype)
// export function isPropertyStereotype(stereotype: string): boolean {
//   return Object.values(PropertyStereotype).includes(stereotype as PropertyStereotype);
// }

// // TODO: replace with Relation this.isInstantiation()
// export function isInstantiation(relation: IRelation): boolean {
//   return getStereotype(relation) === RelationStereotype.INSTANTIATION;
// }

// // TODO: replace with Relation this.isDerivation()
// export function isDerivation(relation: IRelation): boolean {
//   return getStereotype(relation) === RelationStereotype.DERIVATION;
// }

// // TODO: replace with Relation this.isMaterial()
// export function isMaterial(relation: IRelation): boolean {
//   return getStereotype(relation) === RelationStereotype.MATERIAL;
// }

// // TODO: replace with Relation this.isComparative()
// export function isComparative(relation: IRelation): boolean {
//   return getStereotype(relation) === RelationStereotype.COMPARATIVE;
// }

// // TODO: replace with Project this.getAllClasses() or Package this.getAllClasses()
// export function getAllClasses(model: IPackage): IClass[] {
//   return model.getAllContentsByType([OntoumlType.CLASS_TYPE]) as IClass[];
// }

// // TODO: replace with Project this.getAllAttributes() or Package this.getAllAttributes()
// export function getAllAttributes(model: IPackage): IProperty[] {
//   const properties = model.getAllContentsByType([OntoumlType.PROPERTY_TYPE]) as IProperty[];
//   const attributes = properties.filter(prop => prop._container.type === OntoumlType.CLASS_TYPE);
//   return attributes;
// }

// // TODO: replace with Project this.getAllRelationEnds() or Package this.getAllRelationEnds()
// export function getAllAssociationEnds(model: IPackage): IProperty[] {
//   const properties = model.getAllContentsByType([OntoumlType.PROPERTY_TYPE]) as IProperty[];
//   const relationEnds = properties.filter(prop => prop._container.type === OntoumlType.RELATION_TYPE);
//   return relationEnds;
// }

// // TODO: replace with Project this.getAllRelations() or Package this.getAllRelations()
// export function getAllRelations(model: IPackage): IRelation[] {
//   return model.getAllContentsByType([OntoumlType.RELATION_TYPE]) as IRelation[];
// }

// // TODO: replace with Project this.getAllGeneralizations() or Package this.getAllGeneralizations()
// export function getAllGeneralizations(model: IPackage): IGeneralization[] {
//   return model.getAllContentsByType([OntoumlType.GENERALIZATION_TYPE]) as IGeneralization[];
// }

// // TODO: replace with Project this.getAllGeneralizationSets() or Package this.getAllGeneralizationSets()
// export function getAllGeneralizationSets(model: IPackage): IGeneralizationSet[] {
//   return model.getAllContentsByType([OntoumlType.GENERALIZATION_SET_TYPE]) as IGeneralizationSet[];
// }

// // TODO: replace with Project this.getAllPackages() or Package this.getAllPackages()
// export function getAllPackages(model: IPackage): IPackage[] {
//   return model.getAllContentsByType([OntoumlType.PACKAGE_TYPE]) as IPackage[];
// }

// // TODO: replace with Project this.getAllEnumerations() or Package this.getAllEnumerations()
// export function getAllEnumerations(model: IPackage): IClass[] {
//   return (model.getAllContentsByType([OntoumlType.CLASS_TYPE]) as IClass[]).filter(c => isEnumeration(c));
// }

// // TODO: replace with Project this.getAllLiterals() or Package this.getAllLiterals()
// export function getAllLiterals(model: IPackage): ILiteral[] {
//   let literals: ILiteral[] = [];
//   getAllEnumerations(model).forEach(e => (literals = literals.concat(e.literals)));
//   return literals;
// }

// // TODO: replace with Property this.isPropertyTypeDefined()
// // I guess this method isn't that necessary...
// export function isTypeDefined(attribute: IProperty): boolean {
//   return attribute.propertyType !== null;
// }

// // TODO: replace with Relation this.isPartWholeRelation()
// export function isPartWholeRelation(relation: IRelation) {
//   const partWholeKinds = [AggregationKind.SHARED, AggregationKind.COMPOSITE];
//   return (
//     partWholeKinds.includes(relation.properties[0].aggregationKind) ||
//     partWholeKinds.includes(relation.properties[1].aggregationKind)
//   );
// }

// // TODO: replace with Relation this.getSourceClassStereotype()
// export function getSourceStereotype(relation: IRelation) {
//   const sourceClass = relation.getSource();
//   return getStereotype(sourceClass);
// }

// // TODO: replace with Relation this.getTargetClassStereotype()
// export function getTargetStereotype(relation: IRelation) {
//   const targetClass = relation.getTarget();
//   return getStereotype(targetClass);
// }

// // TODO: replace with Relation this.holdsBetweenEvents()
// export function holdsBetweenEvents(relation: IRelation) {
//   return isEvent(relation.getSource()) && isEvent(relation.getTarget());
// }

// // TODO: replace with Relation this.holdsBetweenMoments()
// export function holdsBetweenAspects(relation: IRelation) {
//   return isMoment(relation.getSource()) && isMoment(relation.getTarget());
// }

// // TODO: replace with Relation this.holdsBetweenSubstantials()
// export function holdsBetweenObjects(relation: IRelation) {
//   return isObject(relation.getSource()) && isObject(relation.getTarget());
// }

// // TODO: replace with Relation this.isExistentialDependency()
// export function isExistentialDependency(relation: IRelation) {
//   return relation.properties[0].isReadOnly || relation.properties[1].isReadOnly;
// }

// // TODO: replace with Relation this.isBounded()
// export function isBounded(property: IProperty): boolean {
//   return property.cardinality !== '*' && property.cardinality !== '0..*';
// }

// // TODO: replace with Relation this.isBinary()
// export function isBinary(relation: IRelation): boolean {
//   return relation.properties.length == 2;
// }

// // TODO: review code! "source existentially dependent on target" means that the target end is read only!
// // TODO: review code; the verification must guarantee the value of isReadonly for the stereotypes below
// // TODO: replace with Relation this.isSourceExistentiallyDependent()
// export function sourceExistentiallyDependsOnTarget(relation: IRelation): boolean {
//   const sourceProperty = relation.properties[0];

//   const stereotype = getStereotype(relation);
//   const existentialDependecyOnSource: string[] = [
//     RelationStereotype.BRINGS_ABOUT,
//     RelationStereotype.CREATION,
//     RelationStereotype.MANIFESTATION,
//     RelationStereotype.PARTICIPATION,
//     RelationStereotype.PARTICIPATIONAL,
//     RelationStereotype.TERMINATION,
//     RelationStereotype.TRIGGERS
//   ];

//   return sourceProperty.isReadOnly || existentialDependecyOnSource.includes(stereotype);
// }

// // TODO: review code! "target existentially dependent on source" means that the source end is read only!
// // TODO: review code; the verification must guarantee the value of isReadonly for the stereotypes below
// // TODO: replace with Relation this.isTargetExistentiallyDependent()
// export function targetExistentiallyDependsOnSource(relation: IRelation): boolean {
//   const targetProperty = relation.properties[1];

//   const stereotype = getStereotype(relation);
//   const existentialDependecyOnTarget: string[] = [
//     RelationStereotype.BRINGS_ABOUT,
//     RelationStereotype.CHARACTERIZATION,
//     RelationStereotype.CREATION,
//     RelationStereotype.EXTERNAL_DEPENDENCE,
//     RelationStereotype.HISTORICAL_DEPENDENCE,
//     RelationStereotype.MEDIATION,
//     RelationStereotype.PARTICIPATIONAL
//   ];

//   return targetProperty.isReadOnly || existentialDependecyOnTarget.includes(stereotype);
// }

// // TODO: replace with Relation this.isExistentialDependenceRelation()
// export function impliesExistentialDependency(relation: IRelation): boolean {
//   return sourceExistentiallyDependsOnTarget(relation) || targetExistentiallyDependsOnSource(relation);
// }

// // TODO: replace with Property this.cardinality.lowerBound
// export function getLowerboundCardinality(cardinality: string): number {
//   const cardinalities = cardinality.split('..');
//   const lowerbound = cardinalities[0];

//   return lowerbound === '*' ? 0 : Number(lowerbound);
// }

// // TODO: replace with Property.UNBOUNDED_CARDINALITY
// export const UNBOUNDED_CARDINALITY = 99999;

// // TODO: replace with Property this.cardinality.upperBound
// export function getUpperboundCardinality(cardinality: string): number {
//   const cardinalities = cardinality.split('..');
//   const upperbound = cardinalities[1] || cardinalities[0];

//   return upperbound === '*' ? UNBOUNDED_CARDINALITY : Number(upperbound);
// }
