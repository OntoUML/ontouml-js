import { IRelation } from '@types';

import Ontouml2Gufo from './ontouml2gufo';
import { transformInverseAnnotations } from './annotation_function';
import {
  getStereotype,
  hasOntoumlStereotype,
  holdsBetweenAspects,
  holdsBetweenEvents,
  holdsBetweenObjects,
  isComparative,
  isDerivation,
  isInstantiation,
  isMaterial,
  isPartWholeRelation
} from './helper_functions';

export function getPartWholeSuperProperty(relation: IRelation): string {
  if (!isPartWholeRelation(relation)) return null;
  if (holdsBetweenObjects(relation)) return 'gufoi:hasObjectProperPart';
  if (holdsBetweenAspects(relation)) return 'gufoi:hasAspectProperPart';
  if (holdsBetweenEvents(relation)) return 'gufoi:hasEventProperPart';
  return 'gufoi:hasProperPart';
}

export function getSuperPropertyFromStereotype(relation: IRelation): string {
  const stereotype = getStereotype(relation);

  const ontoumlRelation2GufoInverseProperty = {
    bringsAbout: 'gufoi:wasBroughtAboutBy',
    characterization: 'gufoi:bears',
    componentOf: 'gufoi:hasComponent',
    creation: 'gufoi:created',
    externalDependence: 'gufoi:hasModeDependee',
    historicalDependence: 'gufoi:hasHistoricalDependee',
    manifestation: 'gufoi:manifested',
    mediation: 'gufoi:isMediatedBy',
    memberOf: 'gufoi:hasCollectionMember',
    participation: 'gufoi:hadParticipant',
    participational: 'gufoi:hasEventProperPart',
    subCollectionOf: 'gufoi:hasSubCollection',
    subQuantityOf: 'gufoi:hasSubQuantity',
    termination: 'gufoi:terminated',
    triggers: 'gufoi:wasTriggeredBy'
  };

  return ontoumlRelation2GufoInverseProperty[stereotype];
}

export function getInverseSuperProperty(relation: IRelation): string {
  return getSuperPropertyFromStereotype(relation) || getPartWholeSuperProperty(relation);
}

export function transformInverseRelation(transformer: Ontouml2Gufo, relation: IRelation) {
  if (isInstantiation(relation) || isDerivation(relation)) {
    return;
  }

  if (isMaterial(relation) || isComparative(relation)) {
    writeInverseBaseRelationAxioms(transformer, relation);
    transformInverseAnnotations(transformer, relation);
    writeInverseRelationTypeAxiom(transformer, relation);
    return;
  }

  if (!isPartWholeRelation(relation) && !hasOntoumlStereotype(relation)) {
    writeInverseBaseRelationAxioms(transformer, relation);
    transformInverseAnnotations(transformer, relation);
    return;
  }

  if (transformer.options.createObjectProperty && transformer.options.createInverses) {
    writeInverseBaseRelationAxioms(transformer, relation);
    transformInverseAnnotations(transformer, relation);
    writeInverseSubPropertyAxiom(transformer, relation);
    return;
  }
}

function writeInverseRelationTypeAxiom(transformer: Ontouml2Gufo, relation: IRelation) {
  const relationUri = transformer.getInverseRelationUri(relation);

  const relationTypeMap = {
    material: 'gufo:MaterialRelationshipType',
    comparative: 'gufo:ComparativeRelationshipType'
  };

  const stereotype = getStereotype(relation);
  const typeUri = relationTypeMap[stereotype];

  transformer.addQuad(relationUri, 'rdf:type', typeUri);
}

function writeInverseBaseRelationAxioms(transformer: Ontouml2Gufo, relation: IRelation) {
  const relationUri = transformer.getInverseRelationUri(relation);

  transformer.addQuad(relationUri, 'rdf:type', 'owl:ObjectProperty');

  const domainUri = transformer.getSourceUri(relation);
  if (domainUri) {
    transformer.addQuad(relationUri, 'rdfs:range', domainUri);
  }

  const rangeUri = transformer.getTargetUri(relation);
  if (rangeUri) {
    transformer.addQuad(relationUri, 'rdfs:domain', rangeUri);
  }
}

function writeInverseSubPropertyAxiom(transformer: Ontouml2Gufo, relation: IRelation) {
  let superProperty = getInverseSuperProperty(relation);

  if (!superProperty) {
    return;
  }

  const relationUri = transformer.getInverseRelationUri(relation);
  transformer.addQuad(relationUri, 'rdfs:subPropertyOf', superProperty);
}
