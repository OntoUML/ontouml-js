import { Relation } from '@libs/ontouml';
import { Ontouml2Gufo, transformInverseAnnotations } from './';

// TODO: check method name updated for disambiguation
export function getPartWholeSuperPropertyInverse(relation: Relation): string {
  if (!relation.isPartWholeRelation()) return null;
  if (relation.holdsBetweenSubstantials()) return 'gufoi:hasObjectProperPart';
  if (relation.holdsBetweenMoments()) return 'gufoi:hasAspectProperPart';
  if (relation.holdsBetweenEvents()) return 'gufoi:hasEventProperPart';
  return 'gufoi:hasProperPart';
}

// TODO: check method name updated for disambiguation
export function getSuperPropertyFromStereotypeInverse(relation: Relation): string {
  const stereotype = relation.stereotype;

  const ontoumlRelation2GufoInverseProperty = {
    bringsAbout: 'gufoi:wasBroughtAboutBy',
    characterization: 'gufoi:bears',
    componentOf: 'gufoi:hasComponent',
    creation: 'gufoi:created',
    externalDependence: 'gufoi:hasModeDependee',
    historicalDependence: 'gufoi:hasHistoricalDependee',
    manifestation: 'gufoi:manifested',
    mediation: 'gufoi:isMediatedBy',
    memberOf: 'gufoi:hasCollectionMember',
    participation: 'gufoi:hadParticipant',
    participational: 'gufoi:hasEventProperPart',
    subCollectionOf: 'gufoi:hasSubCollection',
    subQuantityOf: 'gufoi:hasSubQuantity',
    termination: 'gufoi:terminated',
    triggers: 'gufoi:wasTriggeredBy'
  };

  return ontoumlRelation2GufoInverseProperty[stereotype];
}

export function getInverseSuperProperty(relation: Relation): string {
  return getSuperPropertyFromStereotypeInverse(relation) || getPartWholeSuperPropertyInverse(relation);
}

export function transformInverseRelation(transformer: Ontouml2Gufo, relation: Relation) {
  if (relation.hasInstantiationStereotype() || relation.isDerivation()) {
    return;
  }

  if (relation.hasMaterialStereotype() || relation.hasComparativeStereotype()) {
    writeInverseBaseRelationAxioms(transformer, relation);
    transformInverseAnnotations(transformer, relation);
    writeInverseRelationTypeAxiom(transformer, relation);
    return;
  }

  if (!relation.isPartWholeRelation() && !relation.stereotype) {
    writeInverseBaseRelationAxioms(transformer, relation);
    transformInverseAnnotations(transformer, relation);
    return;
  }

  if (transformer.options.createObjectProperty && transformer.options.createInverses) {
    writeInverseBaseRelationAxioms(transformer, relation);
    transformInverseAnnotations(transformer, relation);
    writeInverseSubPropertyAxiom(transformer, relation);
    return;
  }
}

function writeInverseRelationTypeAxiom(transformer: Ontouml2Gufo, relation: Relation) {
  const relationUri = transformer.getInverseRelationUri(relation);

  const relationTypeMap = {
    material: 'gufo:MaterialRelationshipType',
    comparative: 'gufo:ComparativeRelationshipType'
  };

  const stereotype = relation.stereotype;
  const typeUri = relationTypeMap[stereotype];

  transformer.addQuad(relationUri, 'rdf:type', typeUri);
}

function writeInverseBaseRelationAxioms(transformer: Ontouml2Gufo, relation: Relation) {
  const relationUri = transformer.getInverseRelationUri(relation);

  transformer.addQuad(relationUri, 'rdf:type', 'owl:ObjectProperty');

  const domainUri = transformer.getSourceUri(relation);
  if (domainUri) {
    transformer.addQuad(relationUri, 'rdfs:range', domainUri);
  }

  const rangeUri = transformer.getTargetUri(relation);
  if (rangeUri) {
    transformer.addQuad(relationUri, 'rdfs:domain', rangeUri);
  }
}

function writeInverseSubPropertyAxiom(transformer: Ontouml2Gufo, relation: Relation) {
  let superProperty = getInverseSuperProperty(relation);

  if (!superProperty) {
    return;
  }

  const relationUri = transformer.getInverseRelationUri(relation);
  transformer.addQuad(relationUri, 'rdfs:subPropertyOf', superProperty);
}
