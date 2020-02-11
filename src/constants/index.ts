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
