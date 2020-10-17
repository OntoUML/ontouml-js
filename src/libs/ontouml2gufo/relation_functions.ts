import { Writer } from 'n3';
import { IRelation } from '@types';
import { getSourceUri, getTargetUri, getUri } from './uri_manager';
import { transformAnnotations } from './annotation_function';
import Options from './options';
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

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, quad } = DataFactory;

export function transformRelation(writer: Writer, relation: IRelation, options: Options) {
  if (isInstantiation(relation)) {
    transformInstantiation(writer, relation, options);
    return;
  }

  if (isDerivation(relation)) {
    transformDerivation(writer, relation, options);
    return;
  }

  if (isMaterial(relation) || isComparative(relation)) {
    writeBaseRelationAxioms(writer, relation, options);
    transformAnnotations(writer, relation, options);
    writeRelationTypeAxiom(writer, relation, options);
    return;
  }

  if (!isPartWholeRelation(relation) && !hasOntoumlStereotype(relation)) {
    writeBaseRelationAxioms(writer, relation, options);
    transformAnnotations(writer, relation, options);
    return;
  }

  if (options.createObjectProperty) {
    writeBaseRelationAxioms(writer, relation, options);
    transformAnnotations(writer, relation, options);
    writeSubPropertyAxiom(writer, relation, options);
    return;
  }
}

function writeBaseRelationAxioms(writer: Writer, relation: IRelation, options: Options) {
  const relationUri = getUri(relation, options);
  writer.addQuad(quad(namedNode(relationUri), namedNode('rdf:type'), namedNode('owl:ObjectProperty')));

  const domainUri = getSourceUri(relation, options);
  if (domainUri) {
    writer.addQuad(quad(namedNode(relationUri), namedNode('rdfs:domain'), namedNode(domainUri)));
  }

  const rangeUri = getTargetUri(relation, options);
  if (rangeUri) {
    writer.addQuad(quad(namedNode(relationUri), namedNode('rdfs:range'), namedNode(rangeUri)));
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

function writeSubPropertyAxiom(writer: Writer, relation: IRelation, options: Options) {
  let superProperty = getSuperProperty(relation);

  if (!superProperty) {
    return;
  }

  const relationUri = getUri(relation, options);
  writer.addQuad(quad(namedNode(relationUri), namedNode('rdfs:subPropertyOf'), namedNode(superProperty)));
}

function writeRelationTypeAxiom(writer: Writer, relation: IRelation, options: Options) {
  const relationUri = getUri(relation, options);

  const relationTypeMap = {
    material: 'gufo:MaterialRelationshipType',
    comparative: 'gufo:ComparativeRelationshipType'
  };

  const stereotype = getStereotype(relation);
  const typeUri = relationTypeMap[stereotype];

  writer.addQuad(quad(namedNode(relationUri), namedNode('rdf:type'), namedNode(typeUri)));
}

function transformInstantiation(writer: Writer, relation: IRelation, options: Options): boolean {
  const domainUri = getTargetUri(relation, options);
  const rangeUri = getSourceUri(relation, options);

  if (!domainUri || !rangeUri) return false;

  writer.addQuad(quad(namedNode(domainUri), namedNode('gufo:categorizes'), namedNode(rangeUri)));
  return true;
}

function transformDerivation(writer: Writer, relation: IRelation, options: Options): boolean {
  const domainUri = getSourceUri(relation, options);
  const rangeUri = getTargetUri(relation, options);

  if (!domainUri || !rangeUri) return false;

  writer.addQuad(quad(namedNode(domainUri), namedNode('gufo:isDerivedFrom'), namedNode(rangeUri)));

  return true;
}
