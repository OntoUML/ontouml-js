export const DefaultPrefixes = {
  gufo: 'http://purl.org/nemo/gufo#',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  owl: 'http://www.w3.org/2002/07/owl#',
  xsd: 'http://www.w3.org/2001/XMLSchema#'
};

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
  'termination'
];

export const HideReadOnlyObjectPropertyCreationList = ['componentOf', 'memberOf', 'subCollectionOf', 'subQuantityOf'];

export const AspectProperPartClassStereotypeList = ['relator', 'mode', 'quality'];

export const ObjectProperPartClassStereotypeList = ['kind', 'collective', 'quantity'];

export const IgnoreCardinalityCreationList = ['comparative', 'material'];

export const NormalRelationStereotypeMapping = {
  bringsAbout: 'broughtAbout',
  characterization: 'inheresIn',
  comparative: 'comparativeRelationshipType',
  componentOf: 'isComponentOf',
  creation: 'wasCreatedIn',
  derivation: 'isDerivedFrom',
  externalDependence: 'externallyDependsOn',
  historicalDependence: 'historicallyDependsOn',
  instantiation: 'categorizes',
  isProperPartOf: 'isProperPartOf',
  isEventProperPartOf: 'isEventProperPartOf',
  isAspectProperPartOf: 'isAspectProperPartOf',
  isObjectProperPartOf: 'isObjectProperPartOf',
  manifestation: 'manifestedIn',
  material: 'materialRelationshipType',
  mediation: 'mediates',
  memberOf: 'isCollectionMemberOf',
  participation: 'participatedIn',
  participational: 'isEventProperPartOf',
  subCollectionOf: 'isSubCollectionOf',
  subQuantityOf: 'isSubQuantityOf',
  termination: 'wasTerminatedIn',
  triggers: 'contributedToTrigger'
};

export const IgonoredInverseRelations = ['derivation', 'instantiation'];

export const IgnoredGUFOInverseRelations = ['comparative', 'material'];

export const InverseRelationStereotypeMapping = {
  characterization: 'bears',
  comparative: 'comparativeRelationshipType',
  componentOf: 'hasComponent',
  creation: 'created',
  derivation: null,
  externalDependence: 'hasDependant',
  historicalDependence: 'hasHistoricalDependant',
  instantiation: null,
  manifestation: 'isManifestationOf',
  material: 'materialRelationshipType',
  mediation: 'isMediatedBy',
  memberOf: 'hasCollectionMember',
  participation: 'hasParticipant',
  participational: 'hasEventProperPart',
  subCollectionOf: 'hasSubCollection',
  subQuantityOf: 'hasSubQuantity',
  termination: 'terminated',
  isProperPartOf: 'hasProperPart',
  isEventProperPartOf: 'hasEventProperPart',
  isAspectProperPartOf: 'hasAspectProperPart',
  isObjectProperPartOf: 'hasObjectProperPart'
};

export const AvailableLanguages = ['en', 'pt', 'it', 'de', 'nl'];
