import _ from 'lodash';

export type Stereotype =
  | ClassStereotype
  | RelationStereotype
  | PropertyStereotype;

export enum ClassStereotype {
  KIND = 'kind',
  COLLECTIVE = 'collective',
  QUANTITY = 'quantity',
  RELATOR = 'relator',
  QUALITY = 'quality',
  MODE = 'mode',
  SUBKIND = 'subkind',
  ROLE = 'role',
  PHASE = 'phase',
  CATEGORY = 'category',
  MIXIN = 'mixin',
  ROLE_MIXIN = 'roleMixin',
  PHASE_MIXIN = 'phaseMixin',
  EVENT = 'event',
  SITUATION = 'situation',
  HISTORICAL_ROLE = 'historicalRole',
  HISTORICAL_ROLE_MIXIN = 'historicalRoleMixin',
  ENUMERATION = 'enumeration',
  DATATYPE = 'datatype',
  ABSTRACT = 'abstract',
  TYPE = 'type'
}

export const TYPE = ClassStereotype.TYPE;
export const HISTORICAL_ROLE = ClassStereotype.HISTORICAL_ROLE;
export const HISTORICAL_ROLE_MIXIN = ClassStereotype.HISTORICAL_ROLE_MIXIN;
export const EVENT = ClassStereotype.EVENT;
export const SITUATION = ClassStereotype.SITUATION;
export const CATEGORY = ClassStereotype.CATEGORY;
export const MIXIN = ClassStereotype.MIXIN;
export const ROLE_MIXIN = ClassStereotype.ROLE_MIXIN;
export const PHASE_MIXIN = ClassStereotype.PHASE_MIXIN;
export const KIND = ClassStereotype.KIND;
export const COLLECTIVE = ClassStereotype.COLLECTIVE;
export const QUANTITY = ClassStereotype.QUANTITY;
export const RELATOR = ClassStereotype.RELATOR;
export const QUALITY = ClassStereotype.QUALITY;
export const MODE = ClassStereotype.MODE;
export const SUBKIND = ClassStereotype.SUBKIND;
export const ROLE = ClassStereotype.ROLE;
export const PHASE = ClassStereotype.PHASE;
export const ENUMERATION = ClassStereotype.ENUMERATION;
export const DATATYPE = ClassStereotype.DATATYPE;
export const ABSTRACT = ClassStereotype.ABSTRACT;

export const NON_SORTAL_STEREOTYPES: readonly ClassStereotype[] = [
  CATEGORY,
  MIXIN,
  PHASE_MIXIN,
  ROLE_MIXIN,
  HISTORICAL_ROLE_MIXIN
];

export const ULTIMATE_SORTAL_STEREOTYPES: readonly ClassStereotype[] = [
  KIND,
  COLLECTIVE,
  QUANTITY,
  RELATOR,
  QUALITY,
  MODE
];

// TODO: consider renaming "base" to "lower"
export const BASE_SORTAL_STEREOTYPES: readonly ClassStereotype[] = [
  SUBKIND,
  PHASE,
  ROLE,
  HISTORICAL_ROLE
];

export const SORTAL_STEREOTYPES: readonly ClassStereotype[] = [
  ...ULTIMATE_SORTAL_STEREOTYPES,
  ...BASE_SORTAL_STEREOTYPES
];

// TODO: review if we should consider as rigid/anti-rigid/semi-rigid only those stereotypes whose respective types specialize Rigid/Anti-Rigid/Semi-Rigid in UFO. This introduces breaks to the gUFO transformation
export const RIGID_STEREOTYPES: readonly ClassStereotype[] = [
  KIND,
  QUANTITY,
  COLLECTIVE,
  MODE,
  QUALITY,
  RELATOR,
  SUBKIND,
  CATEGORY,
  EVENT,
  SITUATION,
  TYPE,
  ABSTRACT,
  DATATYPE,
  ENUMERATION
];

export const ANTI_RIGID_STEREOTYPES: readonly ClassStereotype[] = [
  ROLE,
  ROLE_MIXIN,
  HISTORICAL_ROLE,
  HISTORICAL_ROLE_MIXIN,
  PHASE,
  PHASE_MIXIN
];

export const SEMI_RIGID_STEREOTYPES: readonly ClassStereotype[] = [MIXIN];

export const MOMENT_STEREOTYPES: readonly ClassStereotype[] = [
  MODE,
  QUALITY,
  RELATOR
];

export const SUBSTANTIAL_STEREOTYPES: readonly ClassStereotype[] = [
  KIND,
  QUANTITY,
  COLLECTIVE
];

export const ENDURANT_STEREOTYPES: readonly ClassStereotype[] = [
  ...SORTAL_STEREOTYPES,
  ...NON_SORTAL_STEREOTYPES
];

export const ABSTRACT_STEREOTYPES: readonly ClassStereotype[] = [
  ABSTRACT,
  DATATYPE,
  ENUMERATION
];

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

export const MATERIAL = RelationStereotype.MATERIAL;
export const DERIVATION = RelationStereotype.DERIVATION;
export const COMPARATIVE = RelationStereotype.COMPARATIVE;
export const MEDIATION = RelationStereotype.MEDIATION;
export const CHARACTERIZATION = RelationStereotype.CHARACTERIZATION;
export const EXTERNAL_DEPENDENCE = RelationStereotype.EXTERNAL_DEPENDENCE;
export const COMPONENT_OF = RelationStereotype.COMPONENT_OF;
export const MEMBER_OF = RelationStereotype.MEMBER_OF;
export const SUBCOLLECTION_OF = RelationStereotype.SUBCOLLECTION_OF;
export const SUBQUANTITY_OF = RelationStereotype.SUBQUANTITY_OF;
export const INSTANTIATION = RelationStereotype.INSTANTIATION;
export const TERMINATION = RelationStereotype.TERMINATION;
export const PARTICIPATIONAL = RelationStereotype.PARTICIPATIONAL;
export const PARTICIPATION = RelationStereotype.PARTICIPATION;
export const HISTORICAL_DEPENDENCE = RelationStereotype.HISTORICAL_DEPENDENCE;
export const CREATION = RelationStereotype.CREATION;
export const MANIFESTATION = RelationStereotype.MANIFESTATION;
export const BRINGS_ABOUT = RelationStereotype.BRINGS_ABOUT;
export const TRIGGERS = RelationStereotype.TRIGGERS;

export const EXISTENTIAL_DEPENDENCE_ON_SOURCE_STEREOTYPES = [
  BRINGS_ABOUT,
  CREATION,
  MANIFESTATION,
  PARTICIPATION,
  PARTICIPATIONAL,
  TERMINATION,
  TRIGGERS
];

export const EXISTENTIAL_DEPENDENCE_ON_TARGET_STEREOTYPES = [
  BRINGS_ABOUT,
  CHARACTERIZATION,
  CREATION,
  EXTERNAL_DEPENDENCE,
  HISTORICAL_DEPENDENCE,
  MEDIATION,
  PARTICIPATIONAL
];

export const EXISTENTIAL_DEPENDENCE_STEREOTYPES = [
  ...new Set([
    ...EXISTENTIAL_DEPENDENCE_ON_SOURCE_STEREOTYPES,
    ...EXISTENTIAL_DEPENDENCE_ON_TARGET_STEREOTYPES
  ])
];

export const PartWholeRelationStereotypes = [
  COMPONENT_OF,
  MEMBER_OF,
  SUBCOLLECTION_OF,
  SUBQUANTITY_OF,
  PARTICIPATIONAL
];

export enum PropertyStereotype {
  BEGIN = 'begin',
  END = 'end'
}

export const BEGIN = PropertyStereotype.BEGIN;
export const END = PropertyStereotype.END;

export const ONTOUML_STEREOTYPES = [
  ...Object.values(ClassStereotype),
  ...Object.values(RelationStereotype),
  ...Object.values(PropertyStereotype)
];
