import { IRelation } from '@types';

import { Ontouml2Gufo } from './ontouml2gufo';
import { transformAnnotations } from './annotation_function';
import {
  getStereotype,
  isDerivation,
  isInstantiation,
  isMaterial,
  isComparative,
  isPartWholeRelation,
  holdsBetweenObjects,
  holdsBetweenAspects,
  holdsBetweenEvents,
  hasOntoumlStereotype
} from './helper_functions';

export function transformRelation(transformer: Ontouml2Gufo, relation: IRelation) {
  if (isInstantiation(relation)) {
    transformInstantiation(transformer, relation);
    return;
  }

  if (isDerivation(relation)) {
    transformDerivation(transformer, relation);
    return;
  }

  if (isMaterial(relation) || isComparative(relation)) {
    writeBaseRelationAxioms(transformer, relation);
    transformAnnotations(transformer, relation);
    writeRelationTypeAxiom(transformer, relation);
    return;
  }

  if (!isPartWholeRelation(relation) && !hasOntoumlStereotype(relation)) {
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

function writeBaseRelationAxioms(transformer: Ontouml2Gufo, relation: IRelation) {
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

export function getPartWholeSuperProperty(relation: IRelation): string {
  if (!isPartWholeRelation(relation)) return null;
  if (holdsBetweenObjects(relation)) return 'gufo:isObjectProperPartOf';
  if (holdsBetweenAspects(relation)) return 'gufo:isAspectProperPartOf';
  if (holdsBetweenEvents(relation)) return 'gufo:isEventProperPartOf';
  return 'gufo:isProperPartOf';
}

export function getSuperPropertyFromStereotype(relation: IRelation): string {
  const stereotype = getStereotype(relation);
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

export function getSuperProperty(relation: IRelation): string {
  return getSuperPropertyFromStereotype(relation) || getPartWholeSuperProperty(relation);
}

function writeSubPropertyAxiom(transformer: Ontouml2Gufo, relation: IRelation) {
  let superProperty = getSuperProperty(relation);

  if (!superProperty) {
    return;
  }

  const relationUri = transformer.getUri(relation);
  transformer.addQuad(relationUri, 'rdfs:subPropertyOf', superProperty);
}

function writeRelationTypeAxiom(transformer: Ontouml2Gufo, relation: IRelation) {
  const relationUri = transformer.getUri(relation);

  const relationTypeMap = {
    material: 'gufo:MaterialRelationshipType',
    comparative: 'gufo:ComparativeRelationshipType'
  };

  const stereotype = getStereotype(relation);
  const typeUri = relationTypeMap[stereotype];

  transformer.addQuad(relationUri, 'rdf:type', typeUri);
}

function transformInstantiation(transformer: Ontouml2Gufo, relation: IRelation): boolean {
  const domainUri = transformer.getTargetUri(relation);
  const rangeUri = transformer.getSourceUri(relation);

  if (!domainUri || !rangeUri) {
    return false;
  }

  transformer.addQuad(domainUri, 'gufo:categorizes', rangeUri);
  return true;
}

function transformDerivation(transformer: Ontouml2Gufo, relation: IRelation): boolean {
  const domainUri = transformer.getSourceUri(relation);
  const rangeUri = transformer.getTargetUri(relation);

  if (!domainUri || !rangeUri) {
    return false;
  }

  transformer.addQuad(domainUri, 'gufo:isDerivedFrom', rangeUri);

  return true;
}
