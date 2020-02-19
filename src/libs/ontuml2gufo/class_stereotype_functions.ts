import { Quad } from 'n3';
import { IClass, IRelation } from '@types';
import { RelationStereotype } from '@constants/.';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, quad } = DataFactory;

export function transformKind(classElement: IClass): Quad[] {
  const { id } = classElement;

  return [
    quad(
      namedNode(`:${id}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:FunctionalComplex'),
    ),
    quad(namedNode(`:${id}`), namedNode('rdf:type'), namedNode('gufo:Kind')),
  ];
}

export function transformSubkind(classElement: IClass): Quad[] {
  const { id } = classElement;

  return [
    quad(namedNode(`:${id}`), namedNode('rdf:type'), namedNode('gufo:SubKind')),
  ];
}

export function transformRole(classElement: IClass): Quad[] {
  const { id } = classElement;

  return [
    quad(namedNode(`:${id}`), namedNode('rdf:type'), namedNode('gufo:Role')),
  ];
}

export function transformPhase(classElement: IClass): Quad[] {
  const { id } = classElement;

  return [
    quad(namedNode(`:${id}`), namedNode('rdf:type'), namedNode('gufo:Phase')),
  ];
}

export function transformCategory(classElement: IClass): Quad[] {
  const { id } = classElement;

  return [
    quad(
      namedNode(`:${id}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:Endurant'),
    ),
    quad(
      namedNode(`:${id}`),
      namedNode('rdf:type'),
      namedNode('gufo:Category'),
    ),
  ];
}

export function transformMixin(classElement: IClass): Quad[] {
  const { id } = classElement;

  return [
    quad(
      namedNode(`:${id}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:Endurant'),
    ),
    quad(namedNode(`:${id}`), namedNode('rdf:type'), namedNode('gufo:Mixin')),
  ];
}

export function transformRoleMixin(classElement: IClass): Quad[] {
  const { id } = classElement;

  return [
    quad(
      namedNode(`:${id}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:Endurant'),
    ),
    quad(
      namedNode(`:${id}`),
      namedNode('rdf:type'),
      namedNode('gufo:RoleMixin'),
    ),
  ];
}

export function transformPhaseMixin(classElement: IClass): Quad[] {
  const { id } = classElement;

  return [
    quad(
      namedNode(`:${id}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:Endurant'),
    ),
    quad(
      namedNode(`:${id}`),
      namedNode('rdf:type'),
      namedNode('gufo:PhaseMixin'),
    ),
  ];
}

export function transformRelator(classElement: IClass): Quad[] {
  const { id } = classElement;

  return [
    quad(
      namedNode(`:${id}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:Relator'),
    ),
    quad(namedNode(`:${id}`), namedNode('rdf:type'), namedNode('gufo:Kind')),
  ];
}

export function transformMode(classElement: IClass): Quad[] {
  const { id } = classElement;
  const relations = classElement.getRelations();
  const relationStereotypes = relations.map(
    (relation: IRelation) => relation.stereotypes[0],
  );
  const quads = [];

  if (relationStereotypes.includes(RelationStereotype.CHARACTERIZATION)) {
    if (relationStereotypes.includes(RelationStereotype.EXTERNAL_DEPENDENCE)) {
      quads.push(
        quad(
          namedNode(`:${id}`),
          namedNode('rdfs:subClassOf'),
          namedNode('gufo:ExtrinsicMode'),
        ),
      );
    } else {
      quads.push(
        quad(
          namedNode(`:${id}`),
          namedNode('rdfs:subClassOf'),
          namedNode('gufo:IntrinsicMode'),
        ),
      );
    }
  }

  quads.push(
    quad(namedNode(`:${id}`), namedNode('rdf:type'), namedNode('gufo:Kind')),
  );

  return quads;
}

export function transformQuality(classElement: IClass): Quad[] {
  const { id } = classElement;

  return [
    quad(
      namedNode(`:${id}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:Quality'),
    ),
    quad(namedNode(`:${id}`), namedNode('rdf:type'), namedNode('gufo:Kind')),
  ];
}

export function transformQuantity(classElement: IClass): Quad[] {
  const { id } = classElement;

  return [
    quad(
      namedNode(`:${id}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:Quantity'),
    ),
    quad(namedNode(`:${id}`), namedNode('rdf:type'), namedNode('gufo:Kind')),
  ];
}

export function transformCollective(classElement: IClass): Quad[] {
  const { id } = classElement;

  return [
    quad(
      namedNode(`:${id}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:Collection'),
    ),
    quad(namedNode(`:${id}`), namedNode('rdf:type'), namedNode('gufo:Kind')),
  ];
}

export function transformEvent(classElement: IClass): Quad[] {
  const { id } = classElement;

  return [
    quad(
      namedNode(`:${id}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:Event'),
    ),
  ];
}
