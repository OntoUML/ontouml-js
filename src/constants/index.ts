// Model element type (according to `ontouml-schema`)
export const PACKAGE_TYPE = 'Package';
export const CLASS_TYPE = 'Class';
export const RELATION_TYPE = 'Relation';
export const GENERALIZATION_TYPE = 'Generalization';
export const GENERALIZATION_SET_TYPE = 'GeneralizationSet';
export const PROPERTY_TYPE = 'Property';
export const ENUMERATION_TYPE = 'Enumeration';

// Aggregation kind
export const AGGREGATIONKIND_NONE = 'NONE';
export const AGGREGATIONKIND_SHARED = 'SHARED';
export const AGGREGATIONKIND_COMPOSITE = 'COMPOSITE';

// Rigidity
export const RIGID: 'RIGID' = 'RIGID';
export const ANTI_RIGID: 'ANTI_RIGID' = 'ANTI_RIGID';
export const SEMI_RIGID: 'SEMI_RIGID' = 'SEMI_RIGID';

// Sortality
export const SORTAL: 'SORTAL' = 'SORTAL';
export const NON_SORTAL: 'NON_SORTAL' = 'NON_SORTAL';

// Class Stereotypes
export const KIND: 'kind' = 'kind';
export const QUANTITY_KIND: 'quantityKind' = 'quantityKind';
export const COLLECTIVE_KIND: 'collectiveKind' = 'collectiveKind';
export const SUBKIND: 'subkind' = 'subkind';
export const ROLE: 'role' = 'role';
export const PHASE: 'phase' = 'phase';
export const CATEGORY: 'category' = 'category';
export const MIXIN: 'mixin' = 'mixin';
export const ROLE_MIXIN: 'roleMixin' = 'roleMixin';
export const PHASE_MIXIN: 'phaseMixin' = 'phaseMixin';
export const RELATOR_KIND: 'relatorKind' = 'relatorKind';
export const MODE_KIND: 'modeKind' = 'modeKind';
export const QUALITY_KIND: 'qualityKind' = 'qualityKind';

// Relation Stereotypes
export const MATERIAL: 'material' = 'material';
export const MEDIATION: 'mediation' = 'mediation';
export const COMPARATIVE: 'comparative' = 'comparative';
export const HISTORICAL: 'historical' = 'historical';
export const EXTERNAL_DEPENDENCE: 'externalDependence' = 'externalDependence';
export const CHARACTERIZATION: 'characterization' = 'characterization';
export const DERIVATION: 'derivation' = 'derivation';
export const COMPONENT_OF: 'componentOf' = 'componentOf';
export const SUBQUANTITY_OF: 'subQuantityOf' = 'subQuantityOf';
export const MEMBER_OF: 'memberOf' = 'memberOf';
export const SUBCOLLECTION_OF: 'subCollectionOf' = 'subCollectionOf';
export const CREATION: 'creation' = 'creation';
export const HISTORICAL_DEPENDENCE: 'historicalDependence' =
  'historicalDependence';
export const PARTICIPATION: 'participation' = 'participation';
export const PARTICIPATIONAL: 'participational' = 'participational';
export const TERMINATION: 'termination' = 'termination';
export const INSTANTIATION: 'instantiation' = 'instantiation';

export enum OntoUMLType {
  PACKAGE_TYPE = 'Package',
  CLASS_TYPE = 'Class',
  RELATION_TYPE = 'Relation',
  GENERALIZATION_TYPE = 'Generalization',
  GENERALIZATION_SET_TYPE = 'GeneralizationSet',
  PROPERTY_TYPE = 'Property',
  LITERAL_TYPE = 'Literal',
}

export enum AggregationKind {
  AGGREGATIONKIND_NONE = 'NONE',
  AGGREGATIONKIND_SHARED = 'SHARED',
  AGGREGATIONKIND_COMPOSITE = 'COMPOSITE',
}

export enum ClassStereotype {
  KIND = 'kind',
  QUANTITY_KIND = 'quantityKind',
  COLLECTIVE_KIND = 'collectiveKind',
  SUBKIND = 'subkind',
  ROLE = 'role',
  PHASE = 'phase',
  CATEGORY = 'category',
  MIXIN = 'mixin',
  ROLE_MIXIN = 'roleMixin',
  PHASE_MIXIN = 'phaseMixin',
  RELATOR_KIND = 'relatorKind',
  MODE_KIND = 'modeKind',
  QUALITY_KIND = 'qualityKind',
}

export enum RelationStereotype {
  MATERIAL = 'material',
  MEDIATION = 'mediation',
  COMPARATIVE = 'comparative',
  HISTORICAL = 'historical',
  EXTERNAL_DEPENDENCE = 'externalDependence',
  CHARACTERIZATION = 'characterization',
  DERIVATION = 'derivation',
  COMPONENT_OF = 'componentOf',
  SUBQUANTITY_OF = 'subQuantityOf',
  MEMBER_OF = 'memberOf',
  SUBCOLLECTION_OF = 'subCollectionOf',
  CREATION = 'creation',
  HISTORICAL_DEPENDENCE = 'historicalDependence',
  PARTICIPATION = 'participation',
  PARTICIPATIONAL = 'participational',
  TERMINATION = 'termination',
  INSTANTIATION = 'instantiation',
}