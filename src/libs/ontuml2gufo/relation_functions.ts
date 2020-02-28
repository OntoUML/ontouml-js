import { N3Writer, Quad } from 'n3';
import { IRelation } from '@types';
import { RelationStereotype } from '@constants/.';
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

    if (!stereotypes || stereotypes.length !== 1) continue;

    const stereotype = stereotypes[0];

    if (
      stereotype &&
      Object.keys(transformStereotypeFunction).includes(stereotype)
    ) {
      // Get domain and range quads from relation
      const domainRangeQuads = transformRelationDomainAndRange(relation);
      // Get stereotype quads from relation
      const stereotypeQuads = transformStereotypeFunction[stereotype](relation);

      await writer.addQuads([...domainRangeQuads, ...stereotypeQuads]);

      // add label
      if (name) {
        await writer.addQuad(
          namedNode(`:${id}`),
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
  const { id, properties } = relation;

  const domain = properties[0].propertyType.id;
  const range = properties[1].propertyType.id;

  return [
    quad(
      namedNode(`:${id}`),
      namedNode('rdf:type'),
      namedNode('owl:ObjectProperty'),
    ),
    quad(
      namedNode(`:${id}`),
      namedNode('rdfs:domain'),
      namedNode(`:${domain}`),
    ),
    quad(namedNode(`:${id}`), namedNode('rdfs:range'), namedNode(`:${range}`)),
  ];
}

/**
 * Transform relation cardinalities to gUFO
 */
// export async function transformRelationCardinalities(
//   relation: IRelation,
// ): Promise<Quad[]> {
//   const { properties } = relation;

//   const domainCardinality = properties[0].cardinality;
//   const rangeCardinality = properties[1].cardinality;

//   return [];
// }
