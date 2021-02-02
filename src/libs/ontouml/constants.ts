export enum AggregationKind {
  NONE = 'NONE',
  SHARED = 'SHARED',
  COMPOSITE = 'COMPOSITE'
}

export const CARDINALITY_MAX = '*';

export const CARDINALITY_MAX_AS_NUMBER = Infinity;

export enum CardinalityValues {
  ZERO_TO_ONE = '0..1',
  ZERO_TO_MANY = '0..*',
  ONE = '1',
  ONE_TO_ONE = '1..1',
  ONE_TO_MANY = '1..*',
  MANY = '*'
}

export const ORDERLESS_LEVEL = Infinity;

export enum OntologicalNature {
  functional_complex = 'functional-complex',
  collective = 'collective',
  quantity = 'quantity',
  relator = 'relator',
  intrinsic_mode = 'intrinsic-mode',
  extrinsic_mode = 'extrinsic-mode',
  quality = 'quality',
  event = 'event',
  situation = 'situation',
  type = 'type',
  abstract = 'abstract'
}

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
