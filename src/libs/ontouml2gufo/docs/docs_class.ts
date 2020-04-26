import { N3Store, Quad } from 'n3';
import { getElement } from './docs_helpers';

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

export function getClass(
  uri: string,
  model: N3Store,
  prefixes: Prefixes,
): DocClass {
  const domainRelationQuads = model.getQuads(
    null,
    namedNode(`${prefixes.rdfs}domain`),
    namedNode(uri),
    null,
  );
  const domainRelations = domainRelationQuads.map((domainRelation: Quad) =>
    getElement(domainRelation.subject.id, model, prefixes),
  );

  const rangeRelationQuads = model.getQuads(
    null,
    namedNode(`${prefixes.rdfs}range`),
    namedNode(uri),
    null,
  );
  const rangeRelations = rangeRelationQuads.map((rangeRelation: Quad) =>
    getElement(rangeRelation.subject.id, model, prefixes),
  );

  return {
    ...getElement(uri, model, prefixes),
    disjointWith: [],
    isDomainOf: domainRelations,
    isRangeOf: rangeRelations,
  };
}

export function getClasses(model: N3Store, prefixes: Prefixes): DocClass[] {
  const quads = model.getQuads(
    null,
    namedNode(`${prefixes.rdf}type`),
    namedNode(`${prefixes.owl}Class`),
    null,
  );

  const classes = quads
    .filter((quad: Quad) => !quad.subject.id.includes('_:b'))
    .map((quad: Quad) => getClass(quad.subject.id, model, prefixes));

  return classes.sort((c1: DocClass, c2: DocClass) =>
    c1.name > c2.name ? 1 : -1,
  );
}
