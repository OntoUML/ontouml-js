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
  const uri = getURI({ element: relation, options });

  return [quad(namedNode(uri), namedNode('rdfs:subPropertyOf'), namedNode('gufo:inheresIn'))];
}

export function transformComparative(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  const uri = getURI({ element: relation, options });

  return [
    quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:ComparativeRelationshipType')),
  ];
}

export function transformComponentOf(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  const uri = getURI({ element: relation, options });

  return [quad(namedNode(uri), namedNode('rdfs:subPropertyOf'), namedNode('gufo:isComponentOf'))];
}

export function transformCreation(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  const uri = getURI({ element: relation, options });

  return [quad(namedNode(uri), namedNode('rdfs:subPropertyOf'), namedNode('gufo:wasCreatedIn'))];
}

export function transformDerivation(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  const source = relation.getDerivingRelation();
  const target = relation.getDerivedClass();

  if (source && source.id && target && target.id) {
    const domainUri = getURI({ element: source, options });
    const rangeUri = getURI({ element: target, options });

    return [quad(namedNode(domainUri), namedNode('gufo:isDerivedFrom'), namedNode(rangeUri))];
  }

  return [];
}

export function transformExternalDependence(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const uri = getURI({ element: relation, options });

  return [
    quad(namedNode(uri), namedNode('rdfs:subPropertyOf'), namedNode('gufo:externallyDependsOn')),
  ];
}

export function transformHistoricalDependence(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const uri = getURI({ element: relation, options });

  return [
    quad(namedNode(uri), namedNode('rdfs:subPropertyOf'), namedNode('gufo:historicallyDependsOn')),
  ];
}

export function transformInstantiation(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  const source = relation.getSource();
  const target = relation.getTarget();

  const domainUri = getURI({ element: target, options });
  const rangeUri = getURI({ element: source, options });

  return [quad(namedNode(domainUri), namedNode('gufo:categorizes'), namedNode(rangeUri))];
}

export function transformManifestation(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  const uri = getURI({ element: relation, options });

  return [quad(namedNode(uri), namedNode('rdfs:subPropertyOf'), namedNode('gufo:manifestedIn'))];
}

export function transformMaterial(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  const uri = getURI({ element: relation, options });

  return [quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:MaterialRelationshipType'))];
}

export function transformMediation(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  const uri = getURI({ element: relation, options });

  return [quad(namedNode(uri), namedNode('rdfs:subPropertyOf'), namedNode('gufo:mediates'))];
}

export function transformMemberOf(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  const uri = getURI({ element: relation, options });

  return [
    quad(namedNode(uri), namedNode('rdfs:subPropertyOf'), namedNode('gufo:isCollectionMemberOf')),
  ];
}

export function transformParticipation(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  const uri = getURI({ element: relation, options });

  return [quad(namedNode(uri), namedNode('rdfs:subPropertyOf'), namedNode('gufo:participatedIn'))];
}

export function transformParticipational(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const uri = getURI({ element: relation, options });

  return [
    quad(namedNode(uri), namedNode('rdfs:subPropertyOf'), namedNode('gufo:isEventProperPartOf')),
  ];
}

export function transformSubCollectionOf(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const uri = getURI({ element: relation, options });

  return [
    quad(namedNode(uri), namedNode('rdfs:subPropertyOf'), namedNode('gufo:isSubCollectionOf')),
  ];
}

export function transformSubQuantityOf(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  const uri = getURI({ element: relation, options });

  return [quad(namedNode(uri), namedNode('rdfs:subPropertyOf'), namedNode('gufo:isSubQuantityOf'))];
}

export function transformTermination(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  const uri = getURI({ element: relation, options });

  return [quad(namedNode(uri), namedNode('rdfs:subPropertyOf'), namedNode('gufo:wasTerminatedIn'))];
}
