import { Writer } from 'n3';
import { IElement, IRelation } from '@types';
import Options from './options';
import { getUri } from './uri_manager';
import tags from 'language-tags';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal, quad } = DataFactory;

export function transformAnnotations(writer: Writer, element: IElement, options: Options): boolean {
  const labels = options.getCustomLabels(element) || {};
  const uri = getUri(element, options);
  const quads = [];

  for (const language of Object.keys(labels)) {
    if (tags.check(language)) {
      quads.push(quad(namedNode(uri), namedNode('rdfs:label'), literal(labels[language], language)));
    }
  }

  const { propertyAssignments } = element;

  if (propertyAssignments) {
    for (const language of Object.keys(propertyAssignments)) {
      if (tags.check(language)) {
        quads.push(quad(namedNode(uri), namedNode('rdfs:label'), literal(propertyAssignments[language], language)));
      }
    }
  }

  if (labels.default) {
    quads.push(quad(namedNode(uri), namedNode('rdfs:label'), literal(labels.default)));
  }

  const { name } = element;
  if (name) {
    if (typeof name === 'string' || name instanceof String) {
      quads.push(quad(namedNode(uri), namedNode('rdfs:label'), literal(name)));
    } else if (typeof name === 'object') {
      for (const language of Object.keys(name)) {
        if (tags.check(language)) {
          quads.push(quad(namedNode(uri), namedNode('rdfs:label'), literal(name[language], language)));
        }
      }
    }
  }

  const { description } = element;
  if (description) {
    quads.push(quad(namedNode(uri), namedNode('rdfs:comment'), literal(description)));
  }

  if (quads.length > 0) {
    writer.addQuads(quads);
  }

  return true;
}

export function transformInverseAnnotations(writer: Writer, relation: IRelation, options: Options) {
  transformAnnotations(writer, relation.properties[0], options);
}
