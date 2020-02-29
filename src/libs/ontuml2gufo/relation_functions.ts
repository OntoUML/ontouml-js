import { N3Writer, Quad, BlankNode } from 'n3';
import { IRelation, IOntoUML2GUFOOptions } from '@types';
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
  options: IOntoUML2GUFOOptions,
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
    const uri = getURI(id, name, options.uriFormatBy);

    if (!stereotypes || stereotypes.length !== 1) continue;

    const stereotype = stereotypes[0];

    if (
      stereotype &&
      Object.keys(transformStereotypeFunction).includes(stereotype)
    ) {
      // Get domain and range quads from relation
      const domainRangeQuads = transformRelationDomainAndRange(
        relation,
        options,
      );
      // Get cardinalities quads from relation
      const cardinalityQuads = transformRelationCardinalities(
        writer,
        relation,
        options,
      );
      // Get stereotype quads from relation
      const stereotypeQuads = transformStereotypeFunction[stereotype](
        relation,
        options,
      );

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
export function transformRelationDomainAndRange(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { id, name } = relation;
  const uri = getURI(id, name, options.uriFormatBy);

  const sourceClass = relation.getSource();
  const targetClass = relation.getTarget();

  const domainClassUri = getURI(
    sourceClass.id,
    sourceClass.name,
    options.uriFormatBy,
  );
  const rangeClassUri = getURI(
    targetClass.id,
    targetClass.name,
    options.uriFormatBy,
  );

  if (domainClassUri && rangeClassUri) {
    return [
      quad(
        namedNode(`:${uri}`),
        namedNode('rdf:type'),
        namedNode('owl:ObjectProperty'),
      ),
      quad(
        namedNode(`:${uri}`),
        namedNode('rdfs:domain'),
        namedNode(`:${domainClassUri}`),
      ),
      quad(
        namedNode(`:${uri}`),
        namedNode('rdfs:range'),
        namedNode(`:${rangeClassUri}`),
      ),
    ];
  }

  return [
    quad(
      namedNode(`:${uri}`),
      namedNode('rdf:type'),
      namedNode('owl:ObjectProperty'),
    ),
  ];
}

/**
 * Transform relation cardinalities to gUFO
 */
export function transformRelationCardinalities(
  writer: N3Writer,
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
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
        options,
      }),
      ...transformRelationCardinality({
        writer,
        relation,
        cardinality: rangeCardinality,
        isDomain: false,
        options,
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
  options,
}: {
  writer: N3Writer;
  relation: IRelation;
  cardinality: string;
  isDomain: boolean;
  options: IOntoUML2GUFOOptions;
}): Quad[] {
  // get domain
  const classElement = isDomain ? relation.getSource() : relation.getTarget();
  const classUri = getURI(
    classElement.id,
    classElement.name,
    options.uriFormatBy,
  );

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
        options,
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
        options,
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
        options,
      }),
    );
  }
  // 2..4, 3..7 ...
  else if (lowerboundDomainCardinality > 1 && !hasInfiniteCardinality) {
    quads.push(
      quad(
        namedNode(`:${classUri}`),
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
                options,
              }),
              generateRelationBlankTriples({
                writer,
                relation,
                isDomain,
                cardinalityPredicate: 'owl:maxQualifiedCardinality',
                cardinality: upperboundDomainCardinality,
                options,
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
  options,
}: {
  writer: N3Writer;
  relation: IRelation;
  isDomain: boolean;
  cardinalityPredicate?: string;
  cardinality?: number;
  options: IOntoUML2GUFOOptions;
}): Quad {
  // get domain
  const classElement = isDomain ? relation.getSource() : relation.getTarget();
  const classUri = getURI(
    classElement.id,
    classElement.name,
    options.uriFormatBy,
  );

  return quad(
    namedNode(`:${classUri}`),
    namedNode('rdfs:subClassOf'),
    generateRelationBlankTriples({
      writer,
      relation,
      isDomain,
      cardinalityPredicate,
      cardinality,
      options,
    }),
  );
}

function generateRelationBlankTriples({
  writer,
  relation,
  isDomain,
  cardinalityPredicate,
  cardinality,
  options,
}: {
  writer: N3Writer;
  relation: IRelation;
  isDomain: boolean;
  cardinalityPredicate?: string;
  cardinality?: number;
  options: IOntoUML2GUFOOptions;
}): BlankNode {
  const { id, name } = relation;
  const uri = getURI(id, name, options.uriFormatBy);
  // get range
  const classElement = isDomain ? relation.getTarget() : relation.getSource();
  const classUri = getURI(
    classElement.id,
    classElement.name,
    options.uriFormatBy,
  );

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
    object: namedNode(`:${classUri}`),
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
