import { Writer } from 'n3';
import { IElement } from '@types';
import { AvailableLanguages } from './constants';
import Options from './options';
import { getCustomElementData } from './prefix_functions';
import { getUri } from './uri_manager';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal, quad } = DataFactory;

export function transformAnnotations(writer: Writer, element: IElement, options: Options): boolean {
  const { propertyAssignments, description, name } = element;
  const { customLabel = {} } = getCustomElementData(element, options);
  const uri = getUri(element, options);
  const quads = [];

  for (const language of Object.keys(customLabel)) {
    if (AvailableLanguages.includes(language)) {
      quads.push(quad(namedNode(uri), namedNode('rdfs:label'), literal(customLabel[language], language)));
    }
  }

  if (propertyAssignments) {
    for (const language of Object.keys(propertyAssignments)) {
      if (AvailableLanguages.includes(language)) {
        quads.push(quad(namedNode(uri), namedNode('rdfs:label'), literal(propertyAssignments[language], language)));
      }
    }
  }

  if (customLabel.default) {
    quads.push(quad(namedNode(uri), namedNode('rdfs:label'), literal(customLabel.default)));
  } else if (name) {
    quads.push(quad(namedNode(uri), namedNode('rdfs:label'), literal(name)));
  }

  if (description) {
    quads.push(quad(namedNode(uri), namedNode('rdfs:comment'), literal(description)));
  }

  if (quads.length > 0) {
    writer.addQuads(quads);
  }

  return true;
}
