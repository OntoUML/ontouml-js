import { N3Store, Quad } from 'n3';
import { getElement } from './helpers';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode } = DataFactory;

export function isClass(
  uri: string,
  model: N3Store,
  prefixes: Prefixes,
): boolean {
  const quad = model.getQuads(
    namedNode(uri),
    namedNode(`${prefixes.rdf}type`),
    namedNode(`${prefixes.owl}Class`),
    null,
  )[0];

  return !!quad;
}

export function getClasses(model: N3Store, prefixes: Prefixes): DocClass[] {
  const quads = model.getQuads(
    null,
    namedNode(`${prefixes.rdf}type`),
    namedNode(`${prefixes.owl}Class`),
    null,
  );

  const classes = quads
    .filter((quad: Quad) => !quad.subject.id.includes('_:'))
    .map((quad: Quad) => getClass(quad.subject.id, model, prefixes));

  return classes.sort((c1: DocClass, c2: DocClass) =>
    c1.name > c2.name ? 1 : -1,
  );
}

export function getClass(
  uri: string,
  model: N3Store,
  prefixes: Prefixes,
): DocClass {
  return {
    ...getElement(uri, model, prefixes),
    disjointWith: [],
    isDomainOf: getDomainRelations(uri, model, prefixes),
    isRangeOf: getRangeRelations(uri, model, prefixes),
    supertypes: getSupertypes(uri, model, prefixes),
    subtypes: getSubtypes(uri, model, prefixes),
    stereotypes: getStereotype(uri, model, prefixes),
  };
}

function getDomainRelations(
  uri: string,
  model: N3Store,
  prefixes: Prefixes,
): DocElement[] {
  const domainRelationQuads = model.getQuads(
    null,
    namedNode(`${prefixes.rdfs}domain`),
    namedNode(uri),
    null,
  );

  return domainRelationQuads.map((domainRelation: Quad) =>
    getElement(domainRelation.subject.id, model, prefixes),
  );
}

function getRangeRelations(
  uri: string,
  model: N3Store,
  prefixes: Prefixes,
): DocElement[] {
  const rangeRelationQuads = model.getQuads(
    null,
    namedNode(`${prefixes.rdfs}range`),
    namedNode(uri),
    null,
  );

  return rangeRelationQuads.map((rangeRelation: Quad) =>
    getElement(rangeRelation.subject.id, model, prefixes),
  );
}

function getSupertypes(
  uri: string,
  model: N3Store,
  prefixes: Prefixes,
): DocElement[] {
  const supertypesQuads = model.getQuads(
    namedNode(uri),
    namedNode(`${prefixes.rdfs}subClassOf`),
    null,
    null,
  );

  return supertypesQuads.map((superType: Quad) =>
    getElement(superType.object.id, model, prefixes),
  );
}

function getSubtypes(
  uri: string,
  model: N3Store,
  prefixes: Prefixes,
): DocElement[] {
  const subtypesQuads = model.getQuads(
    null,
    namedNode(`${prefixes.rdfs}subClassOf`),
    namedNode(uri),
    null,
  );

  return subtypesQuads.map((subType: Quad) =>
    getElement(subType.subject.id, model, prefixes),
  );
}

function getStereotype(
  uri: string,
  model: N3Store,
  prefixes: Prefixes,
): DocElement[] {
  const typesQuads = model.getQuads(
    namedNode(uri),
    namedNode(`${prefixes.rdf}type`),
    null,
    null,
  );
  const ignoreTypes = [
    `${prefixes.owl}Class`,
    `${prefixes.owl}NamedIndividual`,
  ];

  return typesQuads
    .filter((type: Quad) => !ignoreTypes.includes(type.object.id))
    .map((type: Quad) => getElement(type.object.id, model, prefixes));
}
