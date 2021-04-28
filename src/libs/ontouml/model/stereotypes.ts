import _ from 'lodash';

export type Stereotype = ClassStereotype | RelationStereotype | PropertyStereotype;

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

// TODO: consider renaming "base" to "lower"
const BaseSortalStereotypes = [
  ClassStereotype.SUBKIND,
  ClassStereotype.PHASE,
  ClassStereotype.ROLE,
  ClassStereotype.HISTORICAL_ROLE
];

const SortalStereotypes = [...UltimateSortalStereotypes, ...BaseSortalStereotypes];

// TODO: review if we should consider as rigid/anti-rigid/semi-rigid only those stereotypes whose respective types specialize Rigid/Anti-Rigid/Semi-Rigid in UFO. This introduces breaks to the gUFO transformation
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
  ClassStereotype.TYPE,
  ClassStereotype.ABSTRACT,
  ClassStereotype.DATATYPE,
  ClassStereotype.ENUMERATION
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

const EndurantStereotypes = [...SortalStereotypes, ...NonSortalStereotypes];

const AbstractStereotypes = [ClassStereotype.ABSTRACT, ClassStereotype.DATATYPE, ClassStereotype.ENUMERATION];

const ClassStereotypes = [
  ...EndurantStereotypes,
  ...AbstractStereotypes,
  ClassStereotype.EVENT,
  ClassStereotype.SITUATION,
  ClassStereotype.TYPE
];

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

{
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

  stereotypeArrays.forEach(array => Object.freeze(array));
}

function isNonSortalClassStereotype(stereotype: ClassStereotype): boolean {
  return NonSortalStereotypes.includes(stereotype);
}

function isSortalClassStereotype(stereotype: ClassStereotype): boolean {
  return SortalStereotypes.includes(stereotype);
}

function isUltimateSortalClassStereotype(stereotype: ClassStereotype): boolean {
  return UltimateSortalStereotypes.includes(stereotype);
}

function isBaseSortalClassStereotype(stereotype: ClassStereotype): boolean {
  return BaseSortalStereotypes.includes(stereotype);
}

function isRigidClassStereotype(stereotype: ClassStereotype): boolean {
  return RigidStereotypes.includes(stereotype);
}

function isAntiRigidClassStereotype(stereotype: ClassStereotype): boolean {
  return AntiRigidStereotypes.includes(stereotype);
}

function isSemiRigidClassStereotype(stereotype: ClassStereotype): boolean {
  return SemiRigidStereotypes.includes(stereotype);
}

function isAbstractClassStereotype(stereotype: ClassStereotype): boolean {
  return AbstractStereotypes.includes(stereotype);
}

function isEndurantClassStereotype(stereotype: ClassStereotype): boolean {
  return EndurantStereotypes.includes(stereotype);
}

function isSubstantialClassStereotype(stereotype: ClassStereotype): boolean {
  return SubstantialOnlyStereotypes.includes(stereotype);
}

function isMomentClassStereotype(stereotype: ClassStereotype): boolean {
  return MomentOnlyStereotypes.includes(stereotype);
}

function isEventClassStereotype(stereotype: ClassStereotype): boolean {
  return stereotype === ClassStereotype.EVENT;
}

function isSituationClassStereotype(stereotype: ClassStereotype): boolean {
  return stereotype === ClassStereotype.SITUATION;
}

function isTypeClassStereotype(stereotype: ClassStereotype): boolean {
  return stereotype === ClassStereotype.TYPE;
}

export const stereotypeUtils = {
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
  // ClassStereotype utility methods
  isNonSortalClassStereotype,
  isSortalClassStereotype,
  isUltimateSortalClassStereotype,
  isBaseSortalClassStereotype,
  isRigidClassStereotype,
  isAntiRigidClassStereotype,
  isSemiRigidClassStereotype,
  isAbstractClassStereotype,
  isEndurantClassStereotype,
  isSubstantialClassStereotype,
  isMomentClassStereotype,
  isEventClassStereotype,
  isSituationClassStereotype,
  isTypeClassStereotype
};
