export enum Rigidity {
  RIGID = 'RIGID',
  ANTI_RIGID = 'ANTI_RIGID',
  SEMI_RIGID = 'SEMI_RIGID'
}

export enum Sortality {
  SORTAL = 'SORTAL',
  NON_SORTAL = 'NON_SORTAL'
}

export enum OntoumlType {
  PACKAGE_TYPE = 'Package',
  CLASS_TYPE = 'Class',
  RELATION_TYPE = 'Relation',
  GENERALIZATION_TYPE = 'Generalization',
  GENERALIZATION_SET_TYPE = 'GeneralizationSet',
  PROPERTY_TYPE = 'Property',
  LITERAL_TYPE = 'Literal'
}

export enum AggregationKind {
  NONE = 'NONE',
  SHARED = 'SHARED',
  COMPOSITE = 'COMPOSITE'
}

export enum ClassStereotype {
  KIND = 'kind',
  QUANTITY = 'quantity',
  COLLECTIVE = 'collective',
  SUBKIND = 'subkind',
  ROLE = 'role',
  PHASE = 'phase',
  CATEGORY = 'category',
  MIXIN = 'mixin',
  ROLE_MIXIN = 'roleMixin',
  PHASE_MIXIN = 'phaseMixin',
  RELATOR = 'relator',
  MODE = 'mode',
  QUALITY = 'quality',
  TYPE = 'type',
  EVENT = 'event',
  SITUATION = 'situation',
  HISTORICAL_ROLE = 'historicalRole',
  HISTORICAL_ROLE_MIXIN = 'historicalRoleMixin',
  ABSTRACT = 'abstract',
  DATATYPE = 'datatype',
  ENUMERATION = 'enumeration'
}

export const RigidTypes = [
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

export const AntiRigidTypes = [
  ClassStereotype.ROLE,
  ClassStereotype.ROLE_MIXIN,
  ClassStereotype.HISTORICAL_ROLE,
  ClassStereotype.HISTORICAL_ROLE_MIXIN,
  ClassStereotype.PHASE,
  ClassStereotype.PHASE_MIXIN
];

export const SemiRigidTypes = [ClassStereotype.MIXIN];

export const AbstractTypes = [ClassStereotype.ABSTRACT, ClassStereotype.DATATYPE, ClassStereotype.ENUMERATION];

export enum RelationStereotype {
  BRINGS_ABOUT = 'bringsAbout',
  CHARACTERIZATION = 'characterization',
  COMPARATIVE = 'comparative',
  COMPONENT_OF = 'componentOf',
  CREATION = 'creation',
  DERIVATION = 'derivation',
  EXTERNAL_DEPENDENCE = 'externalDependence',
  HISTORICAL_DEPENDENCE = 'historicalDependence',
  INSTANTIATION = 'instantiation',
  MANIFESTATION = 'manifestation',
  MATERIAL = 'material',
  MEDIATION = 'mediation',
  MEMBER_OF = 'memberOf',
  PARTICIPATION = 'participation',
  PARTICIPATIONAL = 'participational',
  SUBCOLLECTION_OF = 'subCollectionOf',
  SUBQUANTITY_OF = 'subQuantityOf',
  TERMINATION = 'termination',
  TRIGGERS = 'triggers'
}

export enum PropertyStereotype {
  BEGIN = 'begin',
  END = 'end'
}

export enum OntologicalNature {
  functional_complex = 'functional-complex',
  collective = 'collective',
  quantity = 'quantity',
  relator = 'relator',
  intrinsic_mode = 'intrinsic-mode',
  extrinsic_mode = 'extrinsic-mode',
  quality = 'quality',
  type = 'type',
  event = 'event',
  situation = 'situation',
  abstract = 'abstract'
}

export default {
  ClassStereotype,
  RelationStereotype,
  PropertyStereotype,
  OntologicalNature,
  Rigidity,
  Sortality,
  OntoumlType,
  AggregationKind,
  RigidTypes,
  AntiRigidTypes,
  SemiRigidTypes
};
