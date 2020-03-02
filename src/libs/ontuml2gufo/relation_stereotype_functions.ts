import { Quad } from 'n3';
import { IRelation, IOntoUML2GUFOOptions } from '@types';
import { getURI } from './helper_functions';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, quad } = DataFactory;

export function transformCharacterization(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = relation;
  const uri = getURI({
    id,
    name,
    uriFormatBy: options.uriFormatBy,
    relation,
  });

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:inheresIn'),
    ),
  ];
}

export function transformComparative(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = relation;
  const uri = getURI({
    id,
    name,
    uriFormatBy: options.uriFormatBy,
    relation,
  });

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdf:type'),
      namedNode('gufo:ComparativeRelationshipType'),
    ),
  ];
}

export function transformComponentOf(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = relation;
  const uri = getURI({
    id,
    name,
    uriFormatBy: options.uriFormatBy,
    relation,
  });

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:isComponentOf'),
    ),
  ];
}

export function transformCreation(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = relation;
  const uri = getURI({
    id,
    name,
    uriFormatBy: options.uriFormatBy,
    relation,
  });

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:wasCreatedIn'),
    ),
  ];
}

export function transformDerivation(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const source = relation.getSource();
  const target = relation.getTarget();

  const domainUri = getURI({
    id: source.id,
    name: source.name,
    uriFormatBy: options.uriFormatBy,
  });
  const rangeUri = getURI({
    id: target.id,
    name: target.name,
    uriFormatBy: options.uriFormatBy,
  });

  return [
    quad(
      namedNode(`:${domainUri}`),
      namedNode('gufo:isDerivedFrom'),
      namedNode(`:${rangeUri}`),
    ),
  ];
}

export function transformExternalDependence(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = relation;
  const uri = getURI({
    id,
    name,
    uriFormatBy: options.uriFormatBy,
    relation,
  });

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:externallyDependsOn'),
    ),
  ];
}

export function transformHistoricalDependence(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = relation;
  const uri = getURI({
    id,
    name,
    uriFormatBy: options.uriFormatBy,
    relation,
  });

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:historicallyDependsOn'),
    ),
  ];
}

export function transformInstantiation(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = relation;
  const uri = getURI({
    id,
    name,
    uriFormatBy: options.uriFormatBy,
    relation,
  });

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:categorizes'),
    ),
  ];
}

export function transformManifestation(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = relation;
  const uri = getURI({
    id,
    name,
    uriFormatBy: options.uriFormatBy,
    relation,
  });

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:manifestedIn'),
    ),
  ];
}

export function transformMaterial(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = relation;
  const uri = getURI({
    id,
    name,
    uriFormatBy: options.uriFormatBy,
    relation,
  });

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdf:type'),
      namedNode('gufo:MaterialRelationshipType'),
    ),
  ];
}

export function transformMediation(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = relation;
  const uri = getURI({
    id,
    name,
    uriFormatBy: options.uriFormatBy,
    relation,
  });

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:mediates'),
    ),
  ];
}

export function transformMemberOf(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = relation;
  const uri = getURI({
    id,
    name,
    uriFormatBy: options.uriFormatBy,
    relation,
  });

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:isCollectionMemberOf'),
    ),
  ];
}

export function transformParticipation(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = relation;
  const uri = getURI({
    id,
    name,
    uriFormatBy: options.uriFormatBy,
    relation,
  });

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:participatedIn'),
    ),
  ];
}

export function transformParticipational(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = relation;
  const uri = getURI({
    id,
    name,
    uriFormatBy: options.uriFormatBy,
    relation,
  });

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:isEventProperPartOf'),
    ),
  ];
}

export function transformSubCollectionOf(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = relation;
  const uri = getURI({
    id,
    name,
    uriFormatBy: options.uriFormatBy,
    relation,
  });

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:isSubCollectionOf'),
    ),
  ];
}

export function transformSubQuantityOf(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = relation;
  const uri = getURI({
    id,
    name,
    uriFormatBy: options.uriFormatBy,
    relation,
  });

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:isSubQuantityOf'),
    ),
  ];
}

export function transformTermination(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = relation;
  const uri = getURI({
    id,
    name,
    uriFormatBy: options.uriFormatBy,
    relation,
  });

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:wasTerminatedIn'),
    ),
  ];
}
