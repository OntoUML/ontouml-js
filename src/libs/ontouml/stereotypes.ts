import _ from 'lodash';

export enum ClassStereotype {
  TYPE = 'type',
  HISTORICAL_ROLE = 'historicalRole',
  HISTORICAL_ROLE_MIXIN = 'historicalRoleMixin',
  EVENT = 'event',
  SITUATION = 'situation',
  CATEGORY = 'category',
  MIXIN = 'mixin',
  ROLE_MIXIN = 'roleMixin',
  PHASE_MIXIN = 'phaseMixin',
  KIND = 'kind',
  COLLECTIVE = 'collective',
  QUANTITY = 'quantity',
  RELATOR = 'relator',
  QUALITY = 'quality',
  MODE = 'mode',
  SUBKIND = 'subkind',
  ROLE = 'role',
  PHASE = 'phase',
  ENUMERATION = 'enumeration',
  DATATYPE = 'datatype',
  ABSTRACT = 'abstract'
}

export enum RelationStereotype {
  MATERIAL = 'material',
  DERIVATION = 'derivation',
  COMPARATIVE = 'comparative',
  MEDIATION = 'mediation',
  CHARACTERIZATION = 'characterization',
  EXTERNAL_DEPENDENCE = 'externalDependence',
  COMPONENT_OF = 'componentOf',
  MEMBER_OF = 'memberOf',
  SUBCOLLECTION_OF = 'subCollectionOf',
  SUBQUANTITY_OF = 'subQuantityOf',
  INSTANTIATION = 'instantiation',
  TERMINATION = 'termination',
  PARTICIPATIONAL = 'participational',
  PARTICIPATION = 'participation',
  HISTORICAL_DEPENDENCE = 'historicalDependence',
  CREATION = 'creation',
  MANIFESTATION = 'manifestation',
  BRINGS_ABOUT = 'bringsAbout',
  TRIGGERS = 'triggers'
}

export enum PropertyStereotype {
  BEGIN = 'begin',
  END = 'end'
}

export type OntoumlStereotype = ClassStereotype | RelationStereotype | PropertyStereotype;

const NonSortalStereotypes = [
  ClassStereotype.CATEGORY,
  ClassStereotype.MIXIN,
  ClassStereotype.PHASE_MIXIN,
  ClassStereotype.ROLE_MIXIN,
  ClassStereotype.HISTORICAL_ROLE_MIXIN
];

const UltimateSortalStereotypes = [
  ClassStereotype.KIND,
  ClassStereotype.COLLECTIVE,
  ClassStereotype.QUANTITY,
  ClassStereotype.RELATOR,
  ClassStereotype.QUALITY,
  ClassStereotype.MODE
];

const BaseSortalStereotypes = [
  ClassStereotype.SUBKIND,
  ClassStereotype.PHASE,
  ClassStereotype.ROLE,
  ClassStereotype.HISTORICAL_ROLE
];

const SortalStereotypes = [...UltimateSortalStereotypes, ...BaseSortalStereotypes];

const RigidStereotypes = [
  ClassStereotype.KIND,
  ClassStereotype.QUANTITY,
  ClassStereotype.COLLECTIVE,
  ClassStereotype.MODE,
  ClassStereotype.QUALITY,
  ClassStereotype.RELATOR,
  ClassStereotype.SUBKIND,
  ClassStereotype.CATEGORY,
  ClassStereotype.EVENT,
  ClassStereotype.SITUATION,
  ClassStereotype.TYPE
];

const AntiRigidStereotypes = [
  ClassStereotype.ROLE,
  ClassStereotype.ROLE_MIXIN,
  ClassStereotype.HISTORICAL_ROLE,
  ClassStereotype.HISTORICAL_ROLE_MIXIN,
  ClassStereotype.PHASE,
  ClassStereotype.PHASE_MIXIN
];

const SemiRigidStereotypes = [ClassStereotype.MIXIN];

const MomentOnlyStereotypes = [ClassStereotype.MODE, ClassStereotype.QUALITY, ClassStereotype.RELATOR];

const SubstantialOnlyStereotypes = [ClassStereotype.KIND, ClassStereotype.QUANTITY, ClassStereotype.COLLECTIVE];

const EndurantStereotypes = {
  ...SortalStereotypes,
  ...NonSortalStereotypes
};

const AbstractStereotypes = [ClassStereotype.ABSTRACT, ClassStereotype.DATATYPE, ClassStereotype.ENUMERATION];

const ClassStereotypes = [...EndurantStereotypes, ...AbstractStereotypes, ClassStereotype.EVENT, ClassStereotype.SITUATION];

const RelationStereotypes = [
  RelationStereotype.MATERIAL,
  RelationStereotype.DERIVATION,
  RelationStereotype.COMPARATIVE,
  RelationStereotype.MEDIATION,
  RelationStereotype.CHARACTERIZATION,
  RelationStereotype.EXTERNAL_DEPENDENCE,
  RelationStereotype.COMPONENT_OF,
  RelationStereotype.MEMBER_OF,
  RelationStereotype.SUBCOLLECTION_OF,
  RelationStereotype.SUBQUANTITY_OF,
  RelationStereotype.INSTANTIATION,
  RelationStereotype.TERMINATION,
  RelationStereotype.PARTICIPATIONAL,
  RelationStereotype.PARTICIPATION,
  RelationStereotype.HISTORICAL_DEPENDENCE,
  RelationStereotype.CREATION,
  RelationStereotype.MANIFESTATION,
  RelationStereotype.BRINGS_ABOUT,
  RelationStereotype.TRIGGERS
];

const ExistentialDependentSourceRelationStereotypes = [
  RelationStereotype.BRINGS_ABOUT,
  RelationStereotype.CREATION,
  RelationStereotype.MANIFESTATION,
  RelationStereotype.PARTICIPATION,
  RelationStereotype.PARTICIPATIONAL,
  RelationStereotype.TERMINATION,
  RelationStereotype.TRIGGERS
];

const ExistentialDependentTargetRelationStereotypes = [
  RelationStereotype.BRINGS_ABOUT,
  RelationStereotype.CHARACTERIZATION,
  RelationStereotype.CREATION,
  RelationStereotype.EXTERNAL_DEPENDENCE,
  RelationStereotype.HISTORICAL_DEPENDENCE,
  RelationStereotype.MEDIATION,
  RelationStereotype.PARTICIPATIONAL
];

const ExistentialDependencyRelationStereotypes = [
  ...new Set([...ExistentialDependentSourceRelationStereotypes, ...ExistentialDependentTargetRelationStereotypes])
];

const PartWholeRelationStereotypes = [
  RelationStereotype.COMPONENT_OF,
  RelationStereotype.MEMBER_OF,
  RelationStereotype.SUBCOLLECTION_OF,
  RelationStereotype.SUBQUANTITY_OF,
  RelationStereotype.PARTICIPATIONAL
];

const PropertyStereotypes = [PropertyStereotype.BEGIN, PropertyStereotype.END];

const OntoumlStereotypes = [...ClassStereotypes, ...RelationStereotypes, ...PropertyStereotypes];

const stereotypeArrays = [
  // Class stereotypes arrays
  NonSortalStereotypes,
  UltimateSortalStereotypes,
  BaseSortalStereotypes,
  SortalStereotypes,
  RigidStereotypes,
  AntiRigidStereotypes,
  SemiRigidStereotypes,
  MomentOnlyStereotypes,
  SubstantialOnlyStereotypes,
  EndurantStereotypes,
  AbstractStereotypes,
  ClassStereotypes,
  // Relation stereotypes arrays
  RelationStereotypes,
  ExistentialDependentSourceRelationStereotypes,
  ExistentialDependentTargetRelationStereotypes,
  ExistentialDependencyRelationStereotypes,
  PartWholeRelationStereotypes,
  // Property stereotypes arrays
  PropertyStereotypes,
  // OntoUML stereotypes arrays
  OntoumlStereotypes
];
stereotypeArrays.forEach((array: OntoumlStereotype[]) => Object.freeze(array));

function isClassStereotype(stereotype: OntoumlStereotype): boolean {
  return ClassStereotypes.includes(stereotype as any);
}

function isRelationStereotype(stereotype: OntoumlStereotype): boolean {
  return RelationStereotypes.includes(stereotype as any);
}

function isPropertyStereotype(stereotype: OntoumlStereotype): boolean {
  return PropertyStereotypes.includes(stereotype as any);
}

export const stereotypes = {
  // Class stereotypes arrays
  ClassStereotypes,
  AbstractStereotypes,
  EndurantStereotypes,
  SubstantialOnlyStereotypes,
  MomentOnlyStereotypes,
  NonSortalStereotypes,
  SortalStereotypes,
  UltimateSortalStereotypes,
  BaseSortalStereotypes,
  RigidStereotypes,
  AntiRigidStereotypes,
  SemiRigidStereotypes,
  // Relation stereotypes arrays
  RelationStereotypes,
  ExistentialDependencyRelationStereotypes,
  ExistentialDependentSourceRelationStereotypes,
  ExistentialDependentTargetRelationStereotypes,
  PartWholeRelationStereotypes,
  // Property stereotypes arrays
  PropertyStereotypes,
  // Utility functions
  isClassStereotype,
  isRelationStereotype,
  isPropertyStereotype
};
