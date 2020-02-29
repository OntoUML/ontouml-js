import { Quad } from 'n3';
import { IRelation } from '@types';
import { getURI } from './helper_functions';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, quad } = DataFactory;

export function transformCharacterization(relation: IRelation): Quad[] {
  const { id, name } = relation;
  const uri = getURI(id, name);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:inheresIn'),
    ),
  ];
}

export function transformComparative(relation: IRelation): Quad[] {
  const { id, name } = relation;
  const uri = getURI(id, name);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdf:type'),
      namedNode('gufo:ComparativeRelationshipType'),
    ),
  ];
}

export function transformComponentOf(relation: IRelation): Quad[] {
  const { id, name } = relation;
  const uri = getURI(id, name);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:isComponentOf'),
    ),
  ];
}

export function transformCreation(relation: IRelation): Quad[] {
  const { id, name } = relation;
  const uri = getURI(id, name);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:wasCreatedIn'),
    ),
  ];
}

export function transformDerivation(relation: IRelation): Quad[] {
  const { properties } = relation;
  const domain = properties[0].propertyType.id;
  const range = properties[1].propertyType.id;

  return [
    quad(
      namedNode(`:${domain}`),
      namedNode('gufo:isDerivedFrom'),
      namedNode(`:${range}`),
    ),
  ];
}

export function transformExternalDependence(relation: IRelation): Quad[] {
  const { id, name } = relation;
  const uri = getURI(id, name);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:externallyDependsOn'),
    ),
  ];
}

export function transformHistorical(relation: IRelation): Quad[] {
  const { id, name } = relation;
  const uri = getURI(id, name);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:historicallyDependsOn'),
    ),
  ];
}

export function transformHistoricalDependence(relation: IRelation): Quad[] {
  const { id, name } = relation;
  const uri = getURI(id, name);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:historicallyDependsOn'),
    ),
  ];
}

export function transformInstantiation(relation: IRelation): Quad[] {
  const { id, name } = relation;
  const uri = getURI(id, name);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:categorizes'),
    ),
  ];
}

export function transformManifestation(relation: IRelation): Quad[] {
  const { id, name } = relation;
  const uri = getURI(id, name);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:manifestedIn'),
    ),
  ];
}

export function transformMaterial(relation: IRelation): Quad[] {
  const { id, name } = relation;
  const uri = getURI(id, name);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdf:type'),
      namedNode('gufo:MaterialRelationshipType'),
    ),
  ];
}

export function transformMediation(relation: IRelation): Quad[] {
  const { id, name } = relation;
  const uri = getURI(id, name);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:mediates'),
    ),
  ];
}

export function transformMemberOf(relation: IRelation): Quad[] {
  const { id, name } = relation;
  const uri = getURI(id, name);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:isCollectionMemberOf'),
    ),
  ];
}

export function transformParticipation(relation: IRelation): Quad[] {
  const { id, name } = relation;
  const uri = getURI(id, name);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:participatedIn'),
    ),
  ];
}

export function transformParticipational(relation: IRelation): Quad[] {
  const { id, name } = relation;
  const uri = getURI(id, name);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:isEventProperPartOf'),
    ),
  ];
}

export function transformSubCollectionOf(relation: IRelation): Quad[] {
  const { id, name } = relation;
  const uri = getURI(id, name);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:isSubCollectionOf'),
    ),
  ];
}

export function transformSubQuantityOf(relation: IRelation): Quad[] {
  const { id, name } = relation;
  const uri = getURI(id, name);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:isSubQuantityOf'),
    ),
  ];
}

export function transformTermination(relation: IRelation): Quad[] {
  const { id, name } = relation;
  const uri = getURI(id, name);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:wasTerminatedIn'),
    ),
  ];
}
