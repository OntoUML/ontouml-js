import { Quad } from 'n3';
import { IRelation } from '@types';
import Options from './options';
import { NormalRelationStereotypeMapping, InverseRelationStereotypeMapping } from './constants';
import { getUri } from './uri_manager';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, quad } = DataFactory;

export function transformSubPropertyOf(relation: IRelation, options: Options): Quad[] {
  const uri = getUri({ element: relation, options });
  const {
    stereotypes,
    propertyAssignments: { isInverseRelation }
  } = relation;
  const RelationStereotypeMapping = isInverseRelation ? InverseRelationStereotypeMapping : NormalRelationStereotypeMapping;
  const stereotype = stereotypes[0];
  const propertyUri = isInverseRelation
    ? `:${RelationStereotypeMapping[stereotype]}`
    : `gufo:${RelationStereotypeMapping[stereotype]}`;

  return [quad(namedNode(uri), namedNode('rdfs:subPropertyOf'), namedNode(propertyUri))];
}

export function transformCharacterization(relation: IRelation, options: Options): Quad[] {
  // gufo:inheresIn
  return transformSubPropertyOf(relation, options);
}

export function transformComparative(relation: IRelation, options: Options): Quad[] {
  const uri = getUri(relation, options);

  return [quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:ComparativeRelationshipType'))];
}

export function transformComponentOf(relation: IRelation, options: Options): Quad[] {
  // gufo:isComponentOf
  return transformSubPropertyOf(relation, options);
}

export function transformCreation(relation: IRelation, options: Options): Quad[] {
  // gufo:wasCreatedIn
  return transformSubPropertyOf(relation, options);
}

export function transformDerivation(relation: IRelation, options: Options): Quad[] {
  const source = relation.getDerivingRelation();
  const target = relation.getDerivedClass();

  if (source && source.id && target && target.id) {
    const domainUri = getUri(source, options);
    const rangeUri = getUri(target, options);

    return [quad(namedNode(domainUri), namedNode('gufo:isDerivedFrom'), namedNode(rangeUri))];
  }

  return [];
}

export function transformExternalDependence(relation: IRelation, options: Options): Quad[] {
  // gufo:externallyDependsOn
  return transformSubPropertyOf(relation, options);
}

export function transformHistoricalDependence(relation: IRelation, options: Options): Quad[] {
  // gufo:historicallyDependsOn
  return transformSubPropertyOf(relation, options);
}

export function transformInstantiation(relation: IRelation, options: Options): Quad[] {
  const source = relation.getSource();
  const target = relation.getTarget();

  const domainUri = getUri(target, options);
  const rangeUri = getUri(source, options);

  return [quad(namedNode(domainUri), namedNode('gufo:categorizes'), namedNode(rangeUri))];
}

export function transformManifestation(relation: IRelation, options: Options): Quad[] {
  // gufo:manifestedIn
  return transformSubPropertyOf(relation, options);
}

export function transformMaterial(relation: IRelation, options: Options): Quad[] {
  const uri = getUri(relation, options);

  return [quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:MaterialRelationshipType'))];
}

export function transformMediation(relation: IRelation, options: Options): Quad[] {
  // gufo:mediates
  return transformSubPropertyOf(relation, options);
}

export function transformMemberOf(relation: IRelation, options: Options): Quad[] {
  // gufo:isCollectionMemberOf
  return transformSubPropertyOf(relation, options);
}

export function transformParticipation(relation: IRelation, options: Options): Quad[] {
  // gufo:participatedIn
  return transformSubPropertyOf(relation, options);
}

export function transformParticipational(relation: IRelation, options: Options): Quad[] {
  // gufo:isEventProperPartOf
  return transformSubPropertyOf(relation, options);
}

export function transformSubCollectionOf(relation: IRelation, options: Options): Quad[] {
  // gufo:isSubCollectionOf
  return transformSubPropertyOf(relation, options);
}

export function transformSubQuantityOf(relation: IRelation, options: Options): Quad[] {
  // gufo:isSubQuantityOf
  return transformSubPropertyOf(relation, options);
}

export function transformTermination(relation: IRelation, options: Options): Quad[] {
  // gufo:wasTerminatedIn
  return transformSubPropertyOf(relation, options);
}

export function transformBringsAbout(relation: IRelation, options: Options): Quad[] {
  // gufo:broughtAbout
  return transformSubPropertyOf(relation, options);
}

export function transformTriggers(relation: IRelation, options: Options): Quad[] {
  // gufo:contributedToTrigger
  return transformSubPropertyOf(relation, options);
}
