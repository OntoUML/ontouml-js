import Options from './options';
import { IRelation } from '@types';
import { Writer } from 'n3';
import { transformInverseAnnotations } from './annotation_function';
import { getInverseRelationUri, getSourceUri, getTargetUri } from './uri_manager';

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

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, quad } = DataFactory;

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

export function transformInverseRelation(writer: Writer, relation: IRelation, options: Options) {
  if (isInstantiation(relation) || isDerivation(relation)) {
    return;
  }

  if (isMaterial(relation) || isComparative(relation)) {
    writeInverseBaseRelationAxioms(writer, relation, options);
    transformInverseAnnotations(writer, relation, options);
    writeInverseRelationTypeAxiom(writer, relation, options);
    return;
  }

  if (!isPartWholeRelation(relation) && !hasOntoumlStereotype(relation)) {
    writeInverseBaseRelationAxioms(writer, relation, options);
    transformInverseAnnotations(writer, relation, options);
    return;
  }

  if (options.createObjectProperty && options.createInverses) {
    writeInverseBaseRelationAxioms(writer, relation, options);
    transformInverseAnnotations(writer, relation, options);
    writeInverseSubPropertyAxiom(writer, relation, options);
    return;
  }
}

function writeInverseRelationTypeAxiom(writer: Writer, relation: IRelation, options: Options) {
  const relationUri = getInverseRelationUri(relation, options);

  const relationTypeMap = {
    material: 'gufo:MaterialRelationshipType',
    comparative: 'gufo:ComparativeRelationshipType'
  };

  const stereotype = getStereotype(relation);
  const typeUri = relationTypeMap[stereotype];

  writer.addQuad(quad(namedNode(relationUri), namedNode('rdf:type'), namedNode(typeUri)));
}

function writeInverseBaseRelationAxioms(writer: Writer, relation: IRelation, options: Options) {
  const relationUri = getInverseRelationUri(relation, options);

  writer.addQuad(quad(namedNode(relationUri), namedNode('rdf:type'), namedNode('owl:ObjectProperty')));

  const domainUri = getSourceUri(relation, options);
  if (domainUri) {
    writer.addQuad(quad(namedNode(relationUri), namedNode('rdfs:range'), namedNode(domainUri)));
  }

  const rangeUri = getTargetUri(relation, options);
  if (rangeUri) {
    writer.addQuad(quad(namedNode(relationUri), namedNode('rdfs:domain'), namedNode(rangeUri)));
  }
}

function writeInverseSubPropertyAxiom(writer: Writer, relation: IRelation, options: Options) {
  let superProperty = getInverseSuperProperty(relation);

  if (!superProperty) {
    return;
  }

  const relationUri = getInverseRelationUri(relation, options);
  writer.addQuad(quad(namedNode(relationUri), namedNode('rdfs:subPropertyOf'), namedNode(superProperty)));
}
