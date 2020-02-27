// Model element type (according to `ontouml-schema`)

export enum Rigidity {
  RIGID = 'RIGID',
  ANTI_RIGID = 'ANTI_RIGID',
  SEMI_RIGID = 'SEMI_RIGID',
}

export enum Sortality {
  SORTAL = 'SORTAL',
  NON_SORTAL = 'NON_SORTAL',
}

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
  EVENT = 'event',
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
