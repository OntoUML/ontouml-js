// Model element type (according to `ontouml-schema`)
export const PACKAGE_TYPE = 'Package';
export const CLASS_TYPE = 'Class';
export const RELATION_TYPE = 'Relation';
export const GENERALIZATION_TYPE = 'Generalization';
export const GENERALIZATION_SET_TYPE = 'GeneralizationSet';
export const PROPERTY_TYPE = 'Property';
export const LITERAL_TYPE = 'Literal';

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
export const QUANTITY: 'quantity' = 'quantity';
export const COLLECTIVE: 'collective' = 'collective';
export const SUBKIND: 'subkind' = 'subkind';
export const ROLE: 'role' = 'role';
export const PHASE: 'phase' = 'phase';
export const CATEGORY: 'category' = 'category';
export const MIXIN: 'mixin' = 'mixin';
export const ROLE_MIXIN: 'roleMixin' = 'roleMixin';
export const PHASE_MIXIN: 'phaseMixin' = 'phaseMixin';
export const RELATOR: 'relator' = 'relator';
export const MODE: 'mode' = 'mode';
export const QUALITY: 'quality' = 'quality';
export const EVENT: 'event' = 'event';

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

export const OntoUMLType = {
  PACKAGE_TYPE,
  CLASS_TYPE,
  RELATION_TYPE,
  GENERALIZATION_TYPE,
  GENERALIZATION_SET_TYPE,
  PROPERTY_TYPE,
  LITERAL_TYPE,
};

export const AggregationKind = {
  AGGREGATIONKIND_NONE,
  AGGREGATIONKIND_SHARED,
  AGGREGATIONKIND_COMPOSITE,
};

export const ClassStereotype = {
  KIND,
  QUANTITY,
  COLLECTIVE,
  SUBKIND,
  ROLE,
  PHASE,
  CATEGORY,
  MIXIN,
  ROLE_MIXIN,
  PHASE_MIXIN,
  RELATOR,
  MODE,
  QUALITY,
  EVENT,
};

export const RelationStereotype = {
  MATERIAL,
  MEDIATION,
  COMPARATIVE,
  HISTORICAL,
  EXTERNAL_DEPENDENCE,
  CHARACTERIZATION,
  DERIVATION,
  COMPONENT_OF,
  SUBQUANTITY_OF,
  MEMBER_OF,
  SUBCOLLECTION_OF,
  CREATION,
  HISTORICAL_DEPENDENCE,
  PARTICIPATION,
  PARTICIPATIONAL,
  TERMINATION,
  INSTANTIATION,
};
