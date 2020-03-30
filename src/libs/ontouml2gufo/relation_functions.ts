import { N3Writer, Quad, BlankNode } from 'n3';
import memoizee from 'memoizee';
import { IRelation, IOntoUML2GUFOOptions } from '@types';
import {
  AggregationKind,
  RelationStereotype,
  ClassStereotype,
} from '@constants/.';
import {
  RelationsInverted,
  RelationsAsPredicate,
  NormalRelationStereotypeMapping,
  InverseRelationStereotypeMapping,
  IgonoredInverseRelations,
  HideObjectPropertyCreationList,
  HideReadOnlyObjectPropertyCreationList,
  IgnoreCardinalityCreationList,
  AspectProperPartClassStereotypeList,
  ObjectProperPartClassStereotypeList,
} from './constants';
import { getURI } from './helper_functions';
import {
  transformCharacterization,
  transformComparative,
  transformComponentOf,
  transformCreation,
  transformDerivation,
  transformExternalDependence,
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
import { transformAnnotations } from './annotation_function';
import { transformGUFOInverses } from './relation_gufo_inverse';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal, quad } = DataFactory;

const transformStereotypeFunction = {
  [RelationStereotype.CHARACTERIZATION]: transformCharacterization,
  [RelationStereotype.COMPARATIVE]: transformComparative,
  [RelationStereotype.COMPONENT_OF]: transformComponentOf,
  [RelationStereotype.CREATION]: transformCreation,
  [RelationStereotype.DERIVATION]: transformDerivation,
  [RelationStereotype.EXTERNAL_DEPENDENCE]: transformExternalDependence,
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

/**
 * Transform relations by its stereotypes
 */
export async function transformRelations(
  writer: N3Writer,
  relations: IRelation[],
  options: IOntoUML2GUFOOptions,
): Promise<boolean> {
  const { createInverses } = options;

  if (createInverses) {
    await transformGUFOInverses(writer);
  }

  for (let i = 0; i < relations.length; i += 1) {
    const relation = relations[i];
    const { stereotypes } = relation;
    const stereotype = stereotypes ? stereotypes[0] : null;

    const inverseRelation = {
      ...relation,
      properties: [relation.properties[1], relation.properties[0]],
      getSource: () => {
        return relation.properties[1].propertyType;
      },
      getTarget: () => {
        return relation.properties[0].propertyType;
      },
    } as IRelation;

    const extraPropertyAssigments = generateExtraPropertyAssignments(
      relation,
      options,
    );

    relation.propertyAssignments = {
      ...(relation.propertyAssignments || {}),
      ...extraPropertyAssigments,
      isInverseRelation: false,
    };

    const uri = getURI({ element: relation, options });

    inverseRelation.propertyAssignments = {
      ...(inverseRelation.propertyAssignments || {}),
      ...extraPropertyAssigments,
      isInverseRelation: true,
      relationUri: uri,
    };

    const { hideBaseCreation } = relation.propertyAssignments;
    const isInverseTransformationEnabled =
      createInverses && !IgonoredInverseRelations.includes(stereotype);

    let baseQuads = [];
    let cardinalityQuads = [];
    let stereotypeQuads = [];

    let inverseBaseQuads = [];
    let inverseCardinalityQuads = [];
    let inverseStereotypeQuads = [];

    // ignore predicate relations like instantiation
    if (!RelationsAsPredicate.includes(stereotype)) {
      if (!hideBaseCreation) {
        // Get base quads (type, domain, range) from relation
        baseQuads = transformRelationBase(relation, options);

        if (isInverseTransformationEnabled) {
          inverseBaseQuads = transformRelationBase(inverseRelation, options);
        }
      }

      if (!IgnoreCardinalityCreationList.includes(stereotype)) {
        // Get cardinalities quads from relation
        cardinalityQuads = transformRelationCardinalities(
          writer,
          relation,
          options,
        );

        if (isInverseTransformationEnabled) {
          inverseCardinalityQuads = transformRelationCardinalities(
            writer,
            inverseRelation,
            options,
          );
        }
      }
    }

    // stereotype checking
    const hasStereotypeFunction =
      stereotype &&
      Object.keys(transformStereotypeFunction).includes(stereotype);

    if (hasStereotypeFunction && !hideBaseCreation) {
      // Get stereotype quads from relation
      stereotypeQuads = transformStereotypeFunction[stereotype](
        relation,
        options,
      );

      if (isInverseTransformationEnabled) {
        inverseStereotypeQuads = transformStereotypeFunction[stereotype](
          inverseRelation,
          options,
        );
      }
    }

    await writer.addQuads([
      ...baseQuads,
      ...cardinalityQuads,
      ...stereotypeQuads,
      ...inverseBaseQuads,
      ...inverseCardinalityQuads,
      ...inverseStereotypeQuads,
    ]);

    // transform annotations for relation
    await transformAnnotations(writer, relation, options);
  }

  return true;
}

function generateExtraPropertyAssignments(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
) {
  const { hideObjectPropertyCreation } = options;
  const { stereotypes } = relation;
  const stereotype = stereotypes ? stereotypes[0] : null;

  const { properties } = relation;

  // source and target information
  const sourceClass = relation.getSource();
  const targetClass = relation.getTarget();
  const sourceStereotype = sourceClass.stereotypes
    ? sourceClass.stereotypes[0]
    : null;
  const targetStereotype = targetClass.stereotypes
    ? targetClass.stereotypes[0]
    : null;

  // part-whole checking
  const partWholeKinds = [AggregationKind.SHARED, AggregationKind.COMPOSITE];
  const isPartWholeRelation =
    partWholeKinds.includes(properties[0].aggregationKind) ||
    partWholeKinds.includes(properties[1].aggregationKind);
  const isPartWholeRelationBetweenEvents =
    isPartWholeRelation &&
    sourceStereotype === ClassStereotype.EVENT &&
    targetStereotype === ClassStereotype.EVENT;
  const isPartWholeRelationBetweenAspects =
    isPartWholeRelation &&
    AspectProperPartClassStereotypeList.includes(sourceStereotype) &&
    AspectProperPartClassStereotypeList.includes(targetStereotype);
  const isPartWholeRelationBetweenObjects =
    isPartWholeRelation &&
    ObjectProperPartClassStereotypeList.includes(sourceStereotype) &&
    ObjectProperPartClassStereotypeList.includes(targetStereotype);
  const isPartWholeRelationWithoutStereotype =
    isPartWholeRelation && !stereotype;
  const isPartWholeRelationBetweenEventsWithoutStereotype =
    isPartWholeRelationBetweenEvents && !stereotype;
  const isReadOnlyRelation =
    properties[0].isReadOnly || properties[1].isReadOnly;
  const isPartWholeInverted = partWholeKinds.includes(
    properties[0].aggregationKind,
  );

  // isInverse checking
  const isInvertedRelation =
    isPartWholeInverted || RelationsInverted.includes(stereotype);

  // hideObjectPropertyCreation checking
  const hideNormalBaseCreation =
    hideObjectPropertyCreation &&
    (HideObjectPropertyCreationList.includes(stereotype) ||
      isPartWholeRelationWithoutStereotype);
  const hideReadOnlyBaseCreation =
    hideObjectPropertyCreation &&
    isReadOnlyRelation &&
    HideReadOnlyObjectPropertyCreationList.includes(stereotype);
  const hideBaseCreation = hideNormalBaseCreation || hideReadOnlyBaseCreation;

  // add extra properties
  return {
    isPartWholeRelation,
    isPartWholeRelationBetweenEvents,
    isPartWholeRelationBetweenAspects,
    isPartWholeRelationBetweenObjects,
    isPartWholeRelationWithoutStereotype,
    isPartWholeRelationBetweenEventsWithoutStereotype,
    isInvertedRelation,
    hideBaseCreation,
  };
}

/**
 * Transform relation domain and range classes to gUFO
 */
function transformRelationBase(
  relation: IRelation,
  options: IOntoUML2GUFOOptions,
): Quad[] {
  const { name, propertyAssignments } = relation;
  const uri = getURI({ element: relation, options });
  const {
    isPartWholeRelation,
    isInvertedRelation,
    isInverseRelation,
    isPartWholeRelationBetweenEvents,
    isPartWholeRelationBetweenAspects,
    isPartWholeRelationBetweenObjects,
    isPartWholeRelationWithoutStereotype,
  } = propertyAssignments;
  const RelationStereotypeMapping = isInverseRelation
    ? InverseRelationStereotypeMapping
    : NormalRelationStereotypeMapping;
  const sourceClass = relation.getSource();
  const targetClass = relation.getTarget();

  const domainClassUri = getURI({ element: sourceClass, options });
  const rangeClassUri = getURI({ element: targetClass, options });

  const quads = [
    quad(
      namedNode(uri),
      namedNode('rdf:type'),
      namedNode('owl:ObjectProperty'),
    ),
  ];

  if (domainClassUri && rangeClassUri) {
    const domainUri = isInvertedRelation ? rangeClassUri : domainClassUri;
    const rangeUri = isInvertedRelation ? domainClassUri : rangeClassUri;

    quads.push(
      quad(namedNode(uri), namedNode('rdfs:domain'), namedNode(domainUri)),
    );

    quads.push(
      quad(namedNode(uri), namedNode('rdfs:range'), namedNode(rangeUri)),
    );
  }

  if (isInverseRelation) {
    const { relationUri } = relation.propertyAssignments;

    quads.push(
      quad(namedNode(uri), namedNode('owl:inverseOf'), namedNode(relationUri)),
    );
  }

  // transform part-whole relations
  if (isPartWholeRelation) {
    // relation between events
    if (isPartWholeRelationBetweenEvents) {
      quads.push(
        quad(
          namedNode(uri),
          namedNode('rdfs:subPropertyOf'),
          namedNode(`gufo:${RelationStereotypeMapping['isEventProperPartOf']}`),
        ),
      );
    }
    // relation between aspects
    else if (isPartWholeRelationBetweenAspects) {
      quads.push(
        quad(
          namedNode(uri),
          namedNode('rdfs:subPropertyOf'),
          namedNode(
            `gufo:${RelationStereotypeMapping['isAspectProperPartOf']}`,
          ),
        ),
      );
    }
    // relation between objects
    else if (isPartWholeRelationBetweenObjects) {
      quads.push(
        quad(
          namedNode(uri),
          namedNode('rdfs:subPropertyOf'),
          namedNode(
            `gufo:${RelationStereotypeMapping['isObjectProperPartOf']}`,
          ),
        ),
      );
    }
    // relations without stereotypes
    else if (isPartWholeRelationWithoutStereotype) {
      quads.push(
        quad(
          namedNode(uri),
          namedNode('rdfs:subPropertyOf'),
          namedNode(`gufo:${RelationStereotypeMapping['isProperPartOf']}`),
        ),
      );
    }
  }

  // add label
  if (name) {
    quads.push(quad(namedNode(uri), namedNode('rdfs:label'), literal(name)));
  } else {
    quads.push(
      quad(
        namedNode(uri),
        namedNode('rdfs:comment'),
        literal('Relation URI was automatically generated.'),
      ),
    );
  }

  return quads;
}

/**
 * Transform relation cardinalities to gUFO
 */
function transformRelationCardinalities(
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
        cardinality: rangeCardinality,
        isDomain: true,
        options,
      }),
      ...transformRelationCardinality({
        writer,
        relation,
        cardinality: domainCardinality,
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
function transformRelationCardinality({
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
  const classUri = getURI({ element: classElement, options });

  const quads = [];

  const lowerboundDomainCardinality = getLowerboundCardinality(cardinality);
  const upperboundDomainCardinality = getUpperboundCardinality(cardinality);
  const hasInfiniteCardinality = cardinality.includes('*');

  const defaultParams = { writer, relation, isDomain, options };

  // min = max
  if (
    lowerboundDomainCardinality === upperboundDomainCardinality &&
    !hasInfiniteCardinality
  ) {
    quads.push(
      generateRelationCardinalityQuad({
        ...defaultParams,
        cardinalityPredicate: 'owl:qualifiedCardinality',
        cardinality: lowerboundDomainCardinality,
      }),
    );
  }
  // 0..3, 0..5, ...
  else if (lowerboundDomainCardinality === 0 && !hasInfiniteCardinality) {
    quads.push(
      generateRelationCardinalityQuad({
        ...defaultParams,
        cardinalityPredicate: 'owl:maxQualifiedCardinality',
        cardinality: upperboundDomainCardinality,
      }),
    );
  }
  // 2..*, 3..* ...
  else if (
    lowerboundDomainCardinality > 1 &&
    lowerboundDomainCardinality < 99999 &&
    hasInfiniteCardinality
  ) {
    quads.push(
      generateRelationCardinalityQuad({
        ...defaultParams,
        cardinalityPredicate: 'owl:minQualifiedCardinality',
        cardinality: lowerboundDomainCardinality,
      }),
    );
  }
  // 1..*
  else if (lowerboundDomainCardinality === 1 && hasInfiniteCardinality) {
    quads.push(generateRelationCardinalityQuad({ ...defaultParams }));
  }
  // 1..5, 2..4, 3..7 ...
  else if (lowerboundDomainCardinality > 0 && !hasInfiniteCardinality) {
    quads.push(
      quad(
        namedNode(classUri),
        namedNode('rdfs:subClassOf'),
        writer.blank([
          {
            predicate: namedNode('rdf:type'),
            object: namedNode('owl:Class'),
          },
          {
            predicate: namedNode('owl:intersectionOf'),
            object: writer.list([
              generateRelationBlankQuad({
                ...defaultParams,
                cardinalityPredicate: 'owl:minQualifiedCardinality',
                cardinality: lowerboundDomainCardinality,
              }),
              generateRelationBlankQuad({
                ...defaultParams,
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
function generateRelationCardinalityQuad({
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
  const classUri = getURI({ element: classElement, options });

  return quad(
    namedNode(classUri),
    namedNode('rdfs:subClassOf'),
    generateRelationBlankQuad({
      writer,
      relation,
      isDomain,
      cardinalityPredicate,
      cardinality,
      options,
    }),
  );
}

function generateRelationBlankQuad({
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
  const { stereotypes } = relation;
  const stereotype = stereotypes ? stereotypes[0] : null;
  const {
    isInvertedRelation,
    hideBaseCreation,
    isPartWholeRelationWithoutStereotype,
    isPartWholeRelationBetweenEvents,
    isPartWholeRelationBetweenAspects,
    isPartWholeRelationBetweenObjects,
    isInverseRelation,
  } = relation.propertyAssignments;
  const RelationStereotypeMapping = isInverseRelation
    ? InverseRelationStereotypeMapping
    : NormalRelationStereotypeMapping;
  const uri = getURI({ element: relation, options });
  // get range
  const classElement = isDomain ? relation.getTarget() : relation.getSource();
  const classUri = getURI({ element: classElement, options });
  const isRelationDomain = isInvertedRelation ? !isDomain : isDomain;
  let propertyUri = uri;

  // add gufo props when hide object property creation is true
  if (hideBaseCreation) {
    if (stereotype) {
      propertyUri = `gufo:${RelationStereotypeMapping[stereotype]}`;
    } else if (isPartWholeRelationBetweenEvents) {
      propertyUri = `gufo:${RelationStereotypeMapping['isEventProperPartOf']}`;
    } else if (isPartWholeRelationBetweenAspects) {
      propertyUri = `gufo:${RelationStereotypeMapping['isAspectProperPartOf']}`;
    } else if (isPartWholeRelationBetweenObjects) {
      propertyUri = `gufo:${RelationStereotypeMapping['isObjectProperPartOf']}`;
    } else if (isPartWholeRelationWithoutStereotype) {
      propertyUri = `gufo:${RelationStereotypeMapping['isProperPartOf']}`;
    }
  }

  const blankTriples = [
    {
      predicate: namedNode('rdf:type'),
      object: namedNode('owl:Restriction'),
    },
    {
      predicate: namedNode('owl:onProperty'),
      object: isRelationDomain
        ? namedNode(propertyUri)
        : writer.blank(namedNode('owl:inverseOf'), namedNode(propertyUri)),
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

    blankTriples.push({
      predicate: namedNode('owl:onClass'),
      object: namedNode(classUri),
    });
  } else {
    blankTriples.push({
      predicate: namedNode('owl:someValuesFrom'),
      object: namedNode(classUri),
    });
  }

  return writer.blank(blankTriples);
}

const getLowerboundCardinality = memoizee((cardinality: string): number => {
  const cardinalities = cardinality.split('..');
  const lowerbound = cardinalities[0];

  return lowerbound === '*' ? 99999 : Number(lowerbound);
});

const getUpperboundCardinality = memoizee((cardinality: string): number => {
  const cardinalities = cardinality.split('..');
  const upperbound = cardinalities[1] || cardinalities[0];

  return upperbound === '*' ? 99999 : Number(upperbound);
});
