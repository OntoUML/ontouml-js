export const RelationsAsPredicate = ['instantiation', 'derivation'];

export const HideObjectPropertyCreationList = [
  'characterization',
  'creation',
  'externalDependence',
  'historicalDependence',
  'manifestation',
  'mediation',
  'participation',
  'participational',
  'termination',
];

export const HideReadOnlyObjectPropertyCreationList = [
  'componentOf',
  'memberOf',
  'subCollectionOf',
  'subQuantityOf',
];

export const AspectProperPartClassStereotypeList = [
  'relator',
  'mode',
  'quality',
];

export const ObjectProperPartClassStereotypeList = [
  'kind',
  'collective',
  'quantity',
];

export const IgnoreCardinalityCreationList = ['comparative', 'material'];

export const RelationsInverted = ['creation', 'termination', 'participation'];

export const RelationStereotypeMapping = {
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

export const AvailableLanguages = ['en', 'pt', 'it', 'de', 'nl'];
