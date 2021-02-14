import { Relation } from '@libs/ontouml';
import { Ontouml2Gufo, transformAnnotations } from './';

export function transformRelation(transformer: Ontouml2Gufo, relation: Relation) {
  if (relation.hasInstantiationStereotype()) {
    transformInstantiation(transformer, relation);
    return;
  }

  if (relation.hasDerivationStereotype()) {
    transformDerivation(transformer, relation);
    return;
  }

  if (relation.hasMaterialStereotype() || relation.hasComparativeStereotype()) {
    writeBaseRelationAxioms(transformer, relation);
    transformAnnotations(transformer, relation);
    writeRelationTypeAxiom(transformer, relation);
    return;
  }

  if (!relation.isPartWholeRelation() && !relation.stereotype) {
    writeBaseRelationAxioms(transformer, relation);
    transformAnnotations(transformer, relation);
    return;
  }

  if (transformer.options.createObjectProperty) {
    writeBaseRelationAxioms(transformer, relation);
    transformAnnotations(transformer, relation);
    writeSubPropertyAxiom(transformer, relation);
    return;
  }
}

function writeBaseRelationAxioms(transformer: Ontouml2Gufo, relation: Relation) {
  const relationUri = transformer.getUri(relation);
  transformer.addQuad(relationUri, 'rdf:type', 'owl:ObjectProperty');

  const domainUri = transformer.getSourceUri(relation);
  if (domainUri) {
    transformer.addQuad(relationUri, 'rdfs:domain', domainUri);
  }

  const rangeUri = transformer.getTargetUri(relation);
  if (rangeUri) {
    transformer.addQuad(relationUri, 'rdfs:range', rangeUri);
  }
}

export function getPartWholeSuperProperty(relation: Relation): string {
  if (!relation.isPartWholeRelation()) return null;
  if (relation.holdsBetweenSubstantials()) return 'gufo:isObjectProperPartOf';
  if (relation.holdsBetweenMoments()) return 'gufo:isAspectProperPartOf';
  if (relation.holdsBetweenEvents()) return 'gufo:isEventProperPartOf';
  return 'gufo:isProperPartOf';
}

export function getSuperPropertyFromStereotype(relation: Relation): string {
  const stereotype = relation.stereotype;
  const ontoumlRelation2GufoProperty = {
    bringsAbout: 'gufo:broughtAbout',
    characterization: 'gufo:inheresIn',
    componentOf: 'gufo:isComponentOf',
    creation: 'gufo:wasCreatedIn',
    derivation: 'gufo:isDerivedFrom',
    externalDependence: 'gufo:externallyDependsOn',
    historicalDependence: 'gufo:historicallyDependsOn',
    instantiation: 'gufo:categorizes',
    manifestation: 'gufo:manifestedIn',
    mediation: 'gufo:mediates',
    memberOf: 'gufo:isCollectionMemberOf',
    participation: 'gufo:participatedIn',
    participational: 'gufo:isEventProperPartOf',
    subCollectionOf: 'gufo:isSubCollectionOf',
    subQuantityOf: 'gufo:isSubQuantityOf',
    termination: 'gufo:wasTerminatedIn',
    triggers: 'gufo:contributedToTrigger'
  };

  return ontoumlRelation2GufoProperty[stereotype];
}

export function getSuperProperty(relation: Relation): string {
  return getSuperPropertyFromStereotype(relation) || getPartWholeSuperProperty(relation);
}

function writeSubPropertyAxiom(transformer: Ontouml2Gufo, relation: Relation) {
  let superProperty = getSuperProperty(relation);

  if (!superProperty) {
    return;
  }

  const relationUri = transformer.getUri(relation);
  transformer.addQuad(relationUri, 'rdfs:subPropertyOf', superProperty);
}

function writeRelationTypeAxiom(transformer: Ontouml2Gufo, relation: Relation) {
  const relationUri = transformer.getUri(relation);

  const relationTypeMap = {
    material: 'gufo:MaterialRelationshipType',
    comparative: 'gufo:ComparativeRelationshipType'
  };

  const stereotype = relation.stereotype;
  const typeUri = relationTypeMap[stereotype];

  transformer.addQuad(relationUri, 'rdf:type', typeUri);
}

function transformInstantiation(transformer: Ontouml2Gufo, relation: Relation): boolean {
  const domainUri = transformer.getTargetUri(relation);
  const rangeUri = transformer.getSourceUri(relation);

  if (!domainUri || !rangeUri) {
    return false;
  }

  transformer.addQuad(domainUri, 'gufo:categorizes', rangeUri);
  return true;
}

function transformDerivation(transformer: Ontouml2Gufo, relation: Relation): boolean {
  const domainUri = transformer.getSourceUri(relation);
  const rangeUri = transformer.getTargetUri(relation);

  if (!domainUri || !rangeUri) {
    return false;
  }

  transformer.addQuad(domainUri, 'gufo:isDerivedFrom', rangeUri);

  return true;
}
