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
  PROJECT_TYPE = 'Project',
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

export const NonSortalStereotypes = [
  ClassStereotype.CATEGORY,
  ClassStereotype.MIXIN,
  ClassStereotype.PHASE_MIXIN,
  ClassStereotype.ROLE_MIXIN,
  ClassStereotype.HISTORICAL_ROLE_MIXIN
];

export const UltimateSortalStereotypes = [
  ClassStereotype.KIND,
  ClassStereotype.COLLECTIVE,
  ClassStereotype.QUANTITY,
  ClassStereotype.RELATOR,
  ClassStereotype.QUALITY,
  ClassStereotype.MODE
];

export const BaseSortalStereotypes = [
  ClassStereotype.SUBKIND,
  ClassStereotype.PHASE,
  ClassStereotype.ROLE,
  ClassStereotype.HISTORICAL_ROLE
];

export const SortalStereotypes = [...UltimateSortalStereotypes, ...BaseSortalStereotypes];

export const RigidStereotypes = [
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

export const AntiRigidStereotypes = [
  ClassStereotype.ROLE,
  ClassStereotype.ROLE_MIXIN,
  ClassStereotype.HISTORICAL_ROLE,
  ClassStereotype.HISTORICAL_ROLE_MIXIN,
  ClassStereotype.PHASE,
  ClassStereotype.PHASE_MIXIN
];

export const SemiRigidStereotypes = [ClassStereotype.MIXIN];

export const MomentOnlyStereotypes = [ClassStereotype.MODE, ClassStereotype.QUALITY, ClassStereotype.RELATOR];

// TODO: review this name
export const ObjectOnlyStereotypes = [ClassStereotype.KIND, ClassStereotype.QUANTITY, ClassStereotype.COLLECTIVE];

export const EndurantStereotypes = {
  ...SortalStereotypes,
  ...NonSortalStereotypes
};

export const AbstractStereotypes = [ClassStereotype.ABSTRACT, ClassStereotype.DATATYPE, ClassStereotype.ENUMERATION];

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

// TODO: review the usage of 'type' on OntoumlStereotype
export type OntoumlStereotype = ClassStereotype | RelationStereotype | PropertyStereotype;

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

export const MomentNatures = [
  OntologicalNature.intrinsic_mode,
  OntologicalNature.extrinsic_mode,
  OntologicalNature.quality,
  OntologicalNature.relator
];

export const ObjectNatures = [OntologicalNature.functional_complex, OntologicalNature.collective, OntologicalNature.quantity];

export default {
  ClassStereotype,
  RelationStereotype,
  PropertyStereotype,
  OntologicalNature,
  Rigidity,
  Sortality,
  OntoumlType,
  AggregationKind,
  RigidTypes: RigidStereotypes,
  AntiRigidTypes: AntiRigidStereotypes,
  SemiRigidTypes: SemiRigidStereotypes,
  MomentTypes: MomentOnlyStereotypes,
  ObjectTypes: ObjectOnlyStereotypes,
  MomentNatures,
  ObjectNatures
};
