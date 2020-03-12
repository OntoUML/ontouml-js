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
  NONE = 'NONE',
  SHARED = 'SHARED',
  COMPOSITE = 'COMPOSITE',
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
  HISTORICAL_ROLE = 'historicalRole',
  DATATYPE = 'datatype',
  ENUMERATION = 'enumeration',
}

export enum RelationStereotype {
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
}

export const RelationsAsPredicateInGUFO = ['instantiation'];

export const RelationsInvertedInGUFO = [
  'creation',
  'termination',
  'participation',
];

export const RelationStereotypeToGUFOMapping = {
  characterization: 'inheresIn',
  comparative: 'comparativeRelationshipType',
  componentOf: 'isComponentOf',
  creation: 'wasCreatedIn',
  derivation: 'isDerivedFrom',
  externalDependence: 'externallyDependsOn',
  historicalDependence: 'historicallyDependsOn',
  instantiation: 'categorizes',
  manifestation: 'manifestedIn',
  material: 'materialRelationshipType',
  mediation: 'mediates',
  memberOf: 'isCollectionMemberOf',
  participation: 'participatedIn',
  participational: 'isEventProperPartOf',
  subCollectionOf: 'isSubCollectionOf',
  subQuantityOf: 'isSubQuantityOf',
  termination: 'wasTerminatedIn',
};
