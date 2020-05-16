import { N3Store, Quad } from 'n3';
import { getURIData, getElement } from './helpers';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode } = DataFactory;

export function isAttribute(
  uri: string,
  model: N3Store,
  prefixes: Prefixes,
): boolean {
  const quad = model.getQuads(
    namedNode(uri),
    namedNode(`${prefixes.rdf}type`),
    namedNode(`${prefixes.owl}DatatypeProperty`),
    null,
  )[0];

  return !!quad;
}

export function getAttribute(
  uri: string,
  model: N3Store,
  prefixes: Prefixes,
): DocRelation {
  const domainQuad = model.getQuads(
    namedNode(uri),
    namedNode(`${prefixes.rdfs}domain`),
    null,
    null,
  )[0];
  const domainUri = domainQuad ? domainQuad.object.id : '';
  const rangeQuad = model.getQuads(
    namedNode(uri),
    namedNode(`${prefixes.rdfs}range`),
    null,
    null,
  )[0];
  const rangeUri = rangeQuad ? rangeQuad.object.id : '';

  return {
    ...getURIData(uri, model, prefixes),
    uri,
    domain: getElement(domainUri, model, prefixes),
    range: getElement(rangeUri, model, prefixes),
  };
}

export function getAttributes(
  model: N3Store,
  prefixes: Prefixes,
): DocRelation[] {
  const quads = model.getQuads(
    null,
    namedNode(`${prefixes.rdf}type`),
    namedNode(`${prefixes.owl}DatatypeProperty`),
    null,
  );

  const relations = quads.map((quad: Quad) =>
    getAttribute(quad.subject.id, model, prefixes),
  );

  return relations.sort((c1: DocRelation, c2: DocRelation) =>
    c1.name > c2.name ? 1 : -1,
  );
}
