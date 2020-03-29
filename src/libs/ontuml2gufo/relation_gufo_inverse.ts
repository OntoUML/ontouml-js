import { N3Writer } from 'n3';
import {
  NormalRelationStereotypeMapping,
  InverseRelationStereotypeMapping,
} from './constants';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, quad } = DataFactory;

export async function transformGUFOInverses(
  writer: N3Writer,
): Promise<boolean> {
  const objectProperPartInverserList = [
    'hasCollectionMember',
    'hasComponent',
    'hasSubCollection',
    'hasSubQuantity',
  ];
  const quads = [
    quad(
      namedNode('gufo:hasObjectProperPart'),
      namedNode('rdfs:subPropertyOf'),
      namedNode('gufo:hasProperPart'),
    ),
    quad(
      namedNode('gufo:hasObjectProperPart'),
      namedNode('owl:inverseOf'),
      namedNode('gufo:isObjectProperPartOf'),
    ),
  ];

  for (const stereotype of Object.keys(InverseRelationStereotypeMapping)) {
    const property = NormalRelationStereotypeMapping[stereotype];
    const inverseProperty = InverseRelationStereotypeMapping[stereotype];

    if (inverseProperty) {
      quads.push(
        quad(
          namedNode(`gufo:${inverseProperty}`),
          namedNode('rdf:type'),
          namedNode('owl:ObjectProperty'),
        ),
      );

      quads.push(
        quad(
          namedNode(`gufo:${inverseProperty}`),
          namedNode('owl:inverseOf'),
          namedNode(`gufo:${property}`),
        ),
      );

      if (inverseProperty === 'hasEventProperPart') {
        quads.push(
          quad(
            namedNode(`gufo:${inverseProperty}`),
            namedNode('rdfs:subPropertyOf'),
            namedNode('gufo:hasProperPart'),
          ),
        );
      }

      if (objectProperPartInverserList.includes(inverseProperty)) {
        quads.push(
          quad(
            namedNode(`gufo:${inverseProperty}`),
            namedNode('rdfs:subPropertyOf'),
            namedNode('gufo:hasObjectProperPart'),
          ),
        );
      }
    }
  }

  await writer.addQuads(quads);

  return true;
}
