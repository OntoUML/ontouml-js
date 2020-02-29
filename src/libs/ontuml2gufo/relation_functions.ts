import { N3Writer, Quad, BlankNode } from 'n3';
import { IRelation } from '@types';
import { RelationStereotype } from '@constants/.';
import { getURI } from './helper_functions';
import {
  transformCharacterization,
  transformComparative,
  transformComponentOf,
  transformCreation,
  transformDerivation,
  transformExternalDependence,
  transformHistorical,
  transformHistoricalDependence,
  transformInstantiation,
  transformManifestation,
  transformMaterial,
  transformMediation,
  transformMemberOf,
  transformParticipation,
  transformParticipational,
  transformSubCollectionOf,
  transformSubQuantityOf,
  transformTermination,
} from './relation_stereotype_functions';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal, quad } = DataFactory;

/**
 * Transform relations by its stereotypes
 */
export async function transformRelationsByStereotype(
  writer: N3Writer,
  relations: IRelation[],
): Promise<boolean> {
  const transformStereotypeFunction = {
    [RelationStereotype.CHARACTERIZATION]: transformCharacterization,
    [RelationStereotype.COMPARATIVE]: transformComparative,
    [RelationStereotype.COMPONENT_OF]: transformComponentOf,
    [RelationStereotype.CREATION]: transformCreation,
    [RelationStereotype.DERIVATION]: transformDerivation,
    [RelationStereotype.EXTERNAL_DEPENDENCE]: transformExternalDependence,
    [RelationStereotype.HISTORICAL]: transformHistorical,
    [RelationStereotype.HISTORICAL_DEPENDENCE]: transformHistoricalDependence,
    [RelationStereotype.INSTANTIATION]: transformInstantiation,
    [RelationStereotype.MANIFESTATION]: transformManifestation,
    [RelationStereotype.MATERIAL]: transformMaterial,
    [RelationStereotype.MEDIATION]: transformMediation,
    [RelationStereotype.MEMBER_OF]: transformMemberOf,
    [RelationStereotype.PARTICIPATION]: transformParticipation,
    [RelationStereotype.PARTICIPATIONAL]: transformParticipational,
    [RelationStereotype.SUBCOLLECTION_OF]: transformSubCollectionOf,
    [RelationStereotype.SUBQUANTITY_OF]: transformSubQuantityOf,
    [RelationStereotype.TERMINATION]: transformTermination,
  };

  for (let i = 0; i < relations.length; i += 1) {
    const relation = relations[i];
    const { name, id, stereotypes } = relation;
    const uri = getURI(id, name);

    if (!stereotypes || stereotypes.length !== 1) continue;

    const stereotype = stereotypes[0];

    if (
      stereotype &&
      Object.keys(transformStereotypeFunction).includes(stereotype)
    ) {
      // Get domain and range quads from relation
      const domainRangeQuads = transformRelationDomainAndRange(relation);
      // Get cardinalities quads from relation
      const cardinalityQuads = transformRelationCardinalities(writer, relation);
      // Get stereotype quads from relation
      const stereotypeQuads = transformStereotypeFunction[stereotype](relation);

      await writer.addQuads([
        ...domainRangeQuads,
        ...cardinalityQuads,
        ...stereotypeQuads,
      ]);

      // add label
      if (name) {
        await writer.addQuad(
          namedNode(`:${uri}`),
          namedNode('rdfs:label'),
          literal(name),
        );
      }
    }
  }

  return true;
}

/**
 * Transform relation domain and range classes to gUFO
 */
export function transformRelationDomainAndRange(relation: IRelation): Quad[] {
  const { id, name, properties } = relation;
  const uri = getURI(id, name);

  const domainClassId = properties[0].propertyType.id;
  const rangeClassId = properties[1].propertyType.id;

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdf:type'),
      namedNode('owl:ObjectProperty'),
    ),
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:domain'),
      namedNode(`:${domainClassId}`),
    ),
    quad(
      namedNode(`:${uri}`),
      namedNode('rdfs:range'),
      namedNode(`:${rangeClassId}`),
    ),
  ];
}

/**
 * Transform relation cardinalities to gUFO
 */
export function transformRelationCardinalities(
  writer: N3Writer,
  relation: IRelation,
): Quad[] {
  const { properties } = relation;

  const domain = properties[0];
  const range = properties[1];

  const domainCardinality = domain.cardinality;
  const rangeCardinality = range.cardinality;

  if (domainCardinality && rangeCardinality) {
    return [
      ...transformRelationCardinality({
        writer,
        relation,
        cardinality: domainCardinality,
        isDomain: true,
      }),
      ...transformRelationCardinality({
        writer,
        relation,
        cardinality: rangeCardinality,
        isDomain: false,
      }),
    ];
  }

  return [];
}

/**
 * Transform relation cardinalities to gUFO
 */
export function transformRelationCardinality({
  writer,
  relation,
  cardinality,
  isDomain,
}: {
  writer: N3Writer;
  relation: IRelation;
  cardinality: string;
  isDomain: boolean;
}): Quad[] {
  const { properties } = relation;
  const domain = properties[isDomain ? 0 : 1];
  const domainClassId = domain.propertyType.id;

  const quads = [];

  const lowerboundDomainCardinality = getLowerboundCardinality(cardinality);
  const upperboundDomainCardinality = getUpperboundCardinality(cardinality);
  const hasInfiniteCardinality = cardinality.includes('*');

  // min = max
  if (
    lowerboundDomainCardinality === upperboundDomainCardinality &&
    !hasInfiniteCardinality
  ) {
    quads.push(
      generateRelationCardinalityQuad({
        writer,
        relation,
        isDomain,
        cardinalityPredicate: 'owl:qualifiedCardinality',
        cardinality: lowerboundDomainCardinality,
      }),
    );
  }
  // 0..3, 0..5, ...
  else if (lowerboundDomainCardinality === 0 && !hasInfiniteCardinality) {
    quads.push(
      generateRelationCardinalityQuad({
        writer,
        relation,
        isDomain,
        cardinalityPredicate: 'owl:maxQualifiedCardinality',
        cardinality: upperboundDomainCardinality,
      }),
    );
  }
  // 2..*, 3..* ...
  else if (lowerboundDomainCardinality > 1 && hasInfiniteCardinality) {
    quads.push(
      generateRelationCardinalityQuad({
        writer,
        relation,
        isDomain,
        cardinalityPredicate: 'owl:minQualifiedCardinality',
        cardinality: lowerboundDomainCardinality,
      }),
    );
  }
  // 2..4, 3..7 ...
  else if (lowerboundDomainCardinality > 1 && !hasInfiniteCardinality) {
    quads.push(
      quad(
        namedNode(`:${domainClassId}`),
        namedNode('rdfs:subClassOf'),
        writer.blank([
          {
            predicate: namedNode('rdf:type'),
            object: namedNode('owl:Class'),
          },
          {
            predicate: namedNode('owl:intersectionOf'),
            object: writer.list([
              generateRelationBlankTriples({
                writer,
                relation,
                isDomain,
                cardinalityPredicate: 'owl:minQualifiedCardinality',
                cardinality: lowerboundDomainCardinality,
              }),
              generateRelationBlankTriples({
                writer,
                relation,
                isDomain,
                cardinalityPredicate: 'owl:maxQualifiedCardinality',
                cardinality: upperboundDomainCardinality,
              }),
            ]),
          },
        ]),
      ),
    );
  }

  return quads;
}

/**
 * Transform relation cardinalities to gUFO
 */
export function generateRelationCardinalityQuad({
  writer,
  relation,
  isDomain,
  cardinalityPredicate,
  cardinality,
}: {
  writer: N3Writer;
  relation: IRelation;
  isDomain: boolean;
  cardinalityPredicate?: string;
  cardinality?: number;
}): Quad {
  const { properties } = relation;
  const domain = properties[isDomain ? 0 : 1];
  const domainClassId = domain.propertyType.id;

  return quad(
    namedNode(`:${domainClassId}`),
    namedNode('rdfs:subClassOf'),
    generateRelationBlankTriples({
      writer,
      relation,
      isDomain,
      cardinalityPredicate,
      cardinality,
    }),
  );
}

function generateRelationBlankTriples({
  writer,
  relation,
  isDomain,
  cardinalityPredicate,
  cardinality,
}: {
  writer: N3Writer;
  relation: IRelation;
  isDomain: boolean;
  cardinalityPredicate?: string;
  cardinality?: number;
}): BlankNode {
  const { id, name, properties } = relation;
  const uri = getURI(id, name);
  const range = properties[isDomain ? 1 : 0];
  const rangeClassId = range.propertyType.id;

  const blankTriples = [
    {
      predicate: namedNode('rdf:type'),
      object: namedNode('owl:Restriction'),
    },
    {
      predicate: namedNode('owl:onProperty'),
      object: isDomain
        ? namedNode(`:${uri}`)
        : writer.blank(namedNode('owl:inverseOf'), namedNode(`:${uri}`)),
    },
  ];

  if (cardinality && cardinalityPredicate) {
    blankTriples.push({
      predicate: namedNode(cardinalityPredicate),
      object: literal(
        cardinality.toString(),
        namedNode('xsd:nonNegativeInteger'),
      ),
    });
  }

  blankTriples.push({
    predicate: namedNode('owl:onClass'),
    object: namedNode(`:${rangeClassId}`),
  });

  return writer.blank(blankTriples);
}

function getLowerboundCardinality(cardinality: string): number {
  const cardinalities = cardinality.split('..');
  const lowerbound = cardinalities[0];

  return lowerbound === '*' ? 99999 : Number(lowerbound);
}

function getUpperboundCardinality(cardinality: string): number {
  const cardinalities = cardinality.split('..');
  const upperbound = cardinalities[1] || cardinalities[0];

  return upperbound === '*' ? 99999 : Number(upperbound);
}
