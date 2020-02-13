import { Quad } from 'n3';
import { IClass } from '@types';

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
  const parents = classElement.getParents();
  const parent = parents[0];
  const quads = [];

  if (parent) {
    quads.push(
      quad(
        namedNode(`:${id}`),
        namedNode('rdfs:subClassOf'),
        namedNode(`:${parent.id}`),
      ),
    );
  }

  quads.push(
    quad(namedNode(`:${id}`), namedNode('rdf:type'), namedNode('gufo:SubKind')),
  );

  return quads;
}

export function transformRole(classElement: IClass): Quad[] {
  const { id } = classElement;
  const parents = classElement.getParents();
  const parent = parents[0];
  const quads = [];

  if (parent) {
    quads.push(
      quad(
        namedNode(`:${id}`),
        namedNode('rdfs:subClassOf'),
        namedNode(`:${parent.id}`),
      ),
    );
  }

  quads.push(
    quad(namedNode(`:${id}`), namedNode('rdf:type'), namedNode('gufo:Role')),
  );

  return quads;
}

export function transformPhase(classElement: IClass): Quad[] {
  const { id } = classElement;
  const parents = classElement.getParents();
  const parent = parents[0];
  const quads = [];

  if (parent) {
    quads.push(
      quad(
        namedNode(`:${id}`),
        namedNode('rdfs:subClassOf'),
        namedNode(`:${parent.id}`),
      ),
    );
  }

  quads.push(
    quad(namedNode(`:${id}`), namedNode('rdf:type'), namedNode('gufo:Phase')),
  );

  return quads;
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

export function transformRelatorKind(classElement: IClass): Quad[] {
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

export function transformModeKind(classElement: IClass): Quad[] {
  const { id } = classElement;
  const relations = classElement.getRelations();

  console.log(relations);

  return [
    quad(
      namedNode(`:${id}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:IntrinsicMode'), // gufo:ExtrinsicMode
    ),
    quad(namedNode(`:${id}`), namedNode('rdf:type'), namedNode('gufo:Kind')),
  ];
}

export function transformQualityKind(classElement: IClass): Quad[] {
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

export function transformQuantityKind(classElement: IClass): Quad[] {
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

export function transformCollectiveKind(classElement: IClass): Quad[] {
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
