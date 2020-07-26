import { N3Writer } from 'n3';
import {
  NormalRelationStereotypeMapping,
  InverseRelationStereotypeMapping,
  IgnoredGUFOInverseRelations,
} from './constants';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, quad } = DataFactory;

export async function transformGUFOInverses(writer: N3Writer): Promise<boolean> {
  const properPartInverseList = ['hasEventProperPart', 'hasAspectProperPart', 'hasObjectProperPart'];
  const objectProperPartInverseList = ['hasCollectionMember', 'hasComponent', 'hasSubCollection', 'hasSubQuantity'];
  const quads = [];

  for (const stereotype of Object.keys(InverseRelationStereotypeMapping)) {
    const property = NormalRelationStereotypeMapping[stereotype];
    const inverseProperty = InverseRelationStereotypeMapping[stereotype];
    const isInverseEnabled = !IgnoredGUFOInverseRelations.includes(stereotype);

    if (inverseProperty && isInverseEnabled) {
      quads.push(quad(namedNode(`:${inverseProperty}`), namedNode('rdf:type'), namedNode('owl:ObjectProperty')));

      quads.push(quad(namedNode(`:${inverseProperty}`), namedNode('owl:inverseOf'), namedNode(`gufo:${property}`)));

      if (properPartInverseList.includes(inverseProperty)) {
        quads.push(
          quad(namedNode(`:${inverseProperty}`), namedNode('rdfs:subPropertyOf'), namedNode(':hasProperPart'))
        );
      }

      if (objectProperPartInverseList.includes(inverseProperty)) {
        quads.push(
          quad(namedNode(`:${inverseProperty}`), namedNode('rdfs:subPropertyOf'), namedNode(':hasObjectProperPart'))
        );
      }
    }
  }

  await writer.addQuads(quads);

  return true;
}
