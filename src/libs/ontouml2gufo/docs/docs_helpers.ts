import { N3Store } from 'n3';
import { DefaultPrefixes } from '../constants';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode } = DataFactory;

type URIData = {
  label?: string;
  comment?: string;
  name: string;
  prefixName: string;
  prefix: string;
  url: string;
  urlTarget: string;
};

export function getURIData(
  uri: string,
  model: N3Store,
  prefixes: Prefixes,
): URIData {
  let name = '';
  let prefixName = '';
  let prefix = '';
  let url = '';
  let urlTarget = '';

  for (const key of Object.keys(prefixes)) {
    if (uri.includes(prefixes[key])) {
      prefix = key;
      name = uri.replace(prefixes[key], '');
      prefixName = `${prefix}:${name}`;
      url = DefaultPrefixes[prefix] ? `${prefixes[key]}${name}` : `#${name}`;
      urlTarget = DefaultPrefixes[prefix] ? '_blank' : '_self';

      break;
    }
  }

  const commentQuad = model.getQuads(
    namedNode(uri),
    namedNode(`${prefixes.rdfs}comment`),
    null,
    null,
  )[0];
  const comment = commentQuad
    ? commentQuad.object.id.substring(1, commentQuad.object.id.length - 1)
    : '';

  const labelQuad = model.getQuads(
    namedNode(uri),
    namedNode(`${prefixes.rdfs}label`),
    null,
    null,
  )[0];
  const label = labelQuad
    ? labelQuad.object.id.substring(1, labelQuad.object.id.length - 1)
    : '';

  return { comment, label, name, prefixName, prefix, url, urlTarget };
}

export function getElement(
  uri: string,
  model: N3Store,
  prefixes: Prefixes,
): DocElement {
  return {
    ...getURIData(uri, model, prefixes),
    uri,
  };
}
