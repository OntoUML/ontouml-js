import { Quad } from 'n3';
import { IRelation, IOntoUML2GUFOOptions } from '@types';
import { NormalRelationStereotypeMapping, InverseRelationStereotypeMapping } from './constants';
import { getURI } from './helper_functions';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, quad } = DataFactory;

export function transformSubPropertyOf(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  const uri = getURI({ element: relation, options });
  const {
    stereotypes,
    propertyAssignments: { isInverseRelation },
  } = relation;
  const RelationStereotypeMapping = isInverseRelation
    ? InverseRelationStereotypeMapping
    : NormalRelationStereotypeMapping;
  const stereotype = stereotypes[0];
  const propertyUri = isInverseRelation
    ? `:${RelationStereotypeMapping[stereotype]}`
    : `gufo:${RelationStereotypeMapping[stereotype]}`;

  return [quad(namedNode(uri), namedNode('rdfs:subPropertyOf'), namedNode(propertyUri))];
}

export function transformCharacterization(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  // gufo:inheresIn
  return transformSubPropertyOf(relation, options);
}

export function transformComparative(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  const uri = getURI({ element: relation, options });

  return [quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:ComparativeRelationshipType'))];
}

export function transformComponentOf(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  // gufo:isComponentOf
  return transformSubPropertyOf(relation, options);
}

export function transformCreation(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  // gufo:wasCreatedIn
  return transformSubPropertyOf(relation, options);
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

export function transformExternalDependence(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  // gufo:externallyDependsOn
  return transformSubPropertyOf(relation, options);
}

export function transformHistoricalDependence(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  // gufo:historicallyDependsOn
  return transformSubPropertyOf(relation, options);
}

export function transformInstantiation(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  const source = relation.getSource();
  const target = relation.getTarget();

  const domainUri = getURI({ element: target, options });
  const rangeUri = getURI({ element: source, options });

  return [quad(namedNode(domainUri), namedNode('gufo:categorizes'), namedNode(rangeUri))];
}

export function transformManifestation(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  // gufo:manifestedIn
  return transformSubPropertyOf(relation, options);
}

export function transformMaterial(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  const uri = getURI({ element: relation, options });

  return [quad(namedNode(uri), namedNode('rdf:type'), namedNode('gufo:MaterialRelationshipType'))];
}

export function transformMediation(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  // gufo:mediates
  return transformSubPropertyOf(relation, options);
}

export function transformMemberOf(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  // gufo:isCollectionMemberOf
  return transformSubPropertyOf(relation, options);
}

export function transformParticipation(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  // gufo:participatedIn
  return transformSubPropertyOf(relation, options);
}

export function transformParticipational(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  // gufo:isEventProperPartOf
  return transformSubPropertyOf(relation, options);
}

export function transformSubCollectionOf(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  // gufo:isSubCollectionOf
  return transformSubPropertyOf(relation, options);
}

export function transformSubQuantityOf(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  // gufo:isSubQuantityOf
  return transformSubPropertyOf(relation, options);
}

export function transformTermination(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  // gufo:wasTerminatedIn
  return transformSubPropertyOf(relation, options);
}

export function transformBringsAbout(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  // gufo:broughtAbout
  return transformSubPropertyOf(relation, options);
}

export function transformTriggers(relation: IRelation, options: IOntoUML2GUFOOptions): Quad[] {
  // gufo:contributedToTrigger
  return transformSubPropertyOf(relation, options);
}
