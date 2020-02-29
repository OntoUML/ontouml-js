import { Quad } from 'n3';
import { IClass, IOntoUML2GUFOOptions, IRelation } from '@types';
import { RelationStereotype } from '@constants/.';
import { getURI } from './helper_functions';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, quad } = DataFactory;

export function transformKind(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = classElement;
  const uri = getURI(id, name, options.uriFormatBy);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:FunctionalComplex'),
    ),
    quad(namedNode(`:${uri}`), namedNode('rdf:type'), namedNode('gufo:Kind')),
  ];
}

export function transformSubkind(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = classElement;
  const uri = getURI(id, name, options.uriFormatBy);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdf:type'),
      namedNode('gufo:SubKind'),
    ),
  ];
}

export function transformRole(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = classElement;
  const uri = getURI(id, name, options.uriFormatBy);

  return [
    quad(namedNode(`:${uri}`), namedNode('rdf:type'), namedNode('gufo:Role')),
  ];
}

export function transformPhase(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = classElement;
  const uri = getURI(id, name, options.uriFormatBy);

  return [
    quad(namedNode(`:${uri}`), namedNode('rdf:type'), namedNode('gufo:Phase')),
  ];
}

export function transformCategory(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = classElement;
  const uri = getURI(id, name, options.uriFormatBy);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:Endurant'),
    ),
    quad(
      namedNode(`:${uri}`),
      namedNode('rdf:type'),
      namedNode('gufo:Category'),
    ),
  ];
}

export function transformMixin(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = classElement;
  const uri = getURI(id, name, options.uriFormatBy);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:Endurant'),
    ),
    quad(namedNode(`:${uri}`), namedNode('rdf:type'), namedNode('gufo:Mixin')),
  ];
}

export function transformRoleMixin(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = classElement;
  const uri = getURI(id, name, options.uriFormatBy);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:Endurant'),
    ),
    quad(
      namedNode(`:${uri}`),
      namedNode('rdf:type'),
      namedNode('gufo:RoleMixin'),
    ),
  ];
}

export function transformPhaseMixin(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = classElement;
  const uri = getURI(id, name, options.uriFormatBy);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:Endurant'),
    ),
    quad(
      namedNode(`:${uri}`),
      namedNode('rdf:type'),
      namedNode('gufo:PhaseMixin'),
    ),
  ];
}

export function transformRelator(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = classElement;
  const uri = getURI(id, name, options.uriFormatBy);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:Relator'),
    ),
    quad(namedNode(`:${uri}`), namedNode('rdf:type'), namedNode('gufo:Kind')),
  ];
}

export function transformMode(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = classElement;
  const uri = getURI(id, name, options.uriFormatBy);
  const relations = classElement.getRelations();
  const relationStereotypes = relations
    .filter((relation: IRelation) => relation.stereotypes !== null)
    .map((relation: IRelation) => relation.stereotypes[0]);
  const quads = [];

  if (relationStereotypes.includes(RelationStereotype.CHARACTERIZATION)) {
    if (relationStereotypes.includes(RelationStereotype.EXTERNAL_DEPENDENCE)) {
      quads.push(
        quad(
          namedNode(`:${uri}`),
          namedNode('rdfs:subClassOf'),
          namedNode('gufo:ExtrinsicMode'),
        ),
      );
    } else {
      quads.push(
        quad(
          namedNode(`:${uri}`),
          namedNode('rdfs:subClassOf'),
          namedNode('gufo:IntrinsicMode'),
        ),
      );
    }
  }

  quads.push(
    quad(namedNode(`:${uri}`), namedNode('rdf:type'), namedNode('gufo:Kind')),
  );

  return quads;
}

export function transformQuality(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = classElement;
  const uri = getURI(id, name, options.uriFormatBy);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:Quality'),
    ),
    quad(namedNode(`:${uri}`), namedNode('rdf:type'), namedNode('gufo:Kind')),
  ];
}

export function transformQuantity(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = classElement;
  const uri = getURI(id, name, options.uriFormatBy);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:Quantity'),
    ),
    quad(namedNode(`:${uri}`), namedNode('rdf:type'), namedNode('gufo:Kind')),
  ];
}

export function transformCollective(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = classElement;
  const uri = getURI(id, name, options.uriFormatBy);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:Collection'),
    ),
    quad(namedNode(`:${uri}`), namedNode('rdf:type'), namedNode('gufo:Kind')),
  ];
}

export function transformEvent(
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = classElement;
  const uri = getURI(id, name, options.uriFormatBy);

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:subClassOf'),
      namedNode('gufo:Event'),
    ),
  ];
}
