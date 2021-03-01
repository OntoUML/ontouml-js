import { Relation, Class, Property, CARDINALITY_MAX_AS_NUMBER } from '@libs/ontouml';
import { Ontouml2Gufo, getInverseSuperProperty, getSuperProperty } from './';

const N3 = require('n3');
const { namedNode, literal } = N3.DataFactory;

export function transformRelationCardinalities(transformer: Ontouml2Gufo, relation: Relation) {
  if (
    !(relation.getSource() instanceof Class) ||
    !(relation.getTarget() instanceof Class) ||
    relation.hasInstantiationStereotype() ||
    relation.hasDerivationStereotype() ||
    !relation.isBinary() ||
    !relation.isBinaryExistentialDependency()
  ) {
    return;
  }

  const sourceProperty = relation.getSourceEnd();
  if (!sourceProperty.cardinality.isZeroToMany()) {
    writerCardinalityAxiom(transformer, relation, Direction.TARGET_TO_SOURCE);
  }

  const targetProperty = relation.getTargetEnd();
  if (!targetProperty.cardinality.isZeroToMany()) {
    writerCardinalityAxiom(transformer, relation, Direction.SOURCE_TO_TARGET);
  }
}

function getObjectPropertyNodes(transformer: Ontouml2Gufo, relation: Relation, propertyPosition) {
  const { options } = transformer;

  if (relation.hasInstantiationStereotype() || relation.isDerivation() || relation.isTernary()) {
    throw new Error('Cannot get property nodes for n-ary, «instantation», or «derivation» relations');
  }

  if (propertyPosition === 0) {
    if (
      relation.hasMaterialStereotype() ||
      relation.hasComparativeStereotype() ||
      (!relation.stereotype && !relation.isPartWholeRelation()) ||
      options.createObjectProperty
    ) {
      return options.createInverses
        ? namedNode(transformer.getInverseRelationUri(relation))
        : transformer.writer.blank(namedNode('owl:inverseOf'), namedNode(transformer.getUri(relation)));
    }

    return options.createInverses
      ? namedNode(getInverseSuperProperty(relation))
      : transformer.writer.blank(namedNode('owl:inverseOf'), namedNode(getSuperProperty(relation)));
  }

  if (propertyPosition === 1) {
    if (
      relation.hasMaterialStereotype() ||
      relation.hasComparativeStereotype() ||
      (!relation.stereotype && !relation.isPartWholeRelation()) ||
      options.createObjectProperty
    ) {
      return namedNode(transformer.getUri(relation));
    }

    return namedNode(getSuperProperty(relation));
  }

  return null;
}

enum Direction {
  SOURCE_TO_TARGET = 1,
  TARGET_TO_SOURCE = 2
}

function writerCardinalityAxiom(transformer: Ontouml2Gufo, relation: Relation, direction: Direction) {
  if (!direction) return;

  let sourceClass: Class;
  let targetAssociationEnd: Property;
  let objectPropertyNode;
  let isExistentialDependency: boolean;

  if (direction === Direction.SOURCE_TO_TARGET) {
    sourceClass = relation.getSourceClass();
    targetAssociationEnd = relation.getTargetEnd();
    objectPropertyNode = getObjectPropertyNodes(transformer, relation, 1);
    isExistentialDependency = relation.getSourceEnd().isReadOnly;
  } else {
    sourceClass = relation.getTargetClass();
    targetAssociationEnd = relation.getSourceEnd();
    objectPropertyNode = getObjectPropertyNodes(transformer, relation, 0);
    isExistentialDependency = relation.getTargetEnd().isReadOnly;
  }

  let restrictionNodes = [];

  const lowerBound = targetAssociationEnd.cardinality.getLowerBoundAsNumber();
  const upperBound = targetAssociationEnd.cardinality.getUpperBoundAsNumber();
  const targetClassNode = namedNode(transformer.getUri(targetAssociationEnd.propertyType));

  if (lowerBound === 1 && upperBound === CARDINALITY_MAX_AS_NUMBER) {
    restrictionNodes.push([
      {
        predicate: namedNode('rdf:type'),
        object: namedNode('owl:Restriction')
      },
      {
        predicate: namedNode('owl:onProperty'),
        object: objectPropertyNode
      },
      {
        predicate: namedNode('owl:someValuesFrom'),
        object: targetClassNode
      }
    ]);
  } else if (lowerBound > 0 && upperBound > 0 && lowerBound === upperBound) {
    restrictionNodes.push([
      {
        predicate: namedNode('rdf:type'),
        object: namedNode('owl:Restriction')
      },
      {
        predicate: namedNode('owl:onProperty'),
        object: objectPropertyNode
      },
      {
        predicate: isExistentialDependency ? namedNode('owl:qualifiedCardinality') : namedNode('owl:minQualifiedCardinality'),
        object: literal(lowerBound, namedNode('xsd:nonNegativeInteger'))
      },
      {
        predicate: namedNode('owl:onClass'),
        object: targetClassNode
      }
    ]);
  } else {
    if (lowerBound > 0) {
      restrictionNodes.push([
        {
          predicate: namedNode('rdf:type'),
          object: namedNode('owl:Restriction')
        },
        {
          predicate: namedNode('owl:onProperty'),
          object: objectPropertyNode
        },
        {
          predicate: namedNode('owl:minQualifiedCardinality'),
          object: literal(lowerBound, namedNode('xsd:nonNegativeInteger'))
        },
        {
          predicate: namedNode('owl:onClass'),
          object: targetClassNode
        }
      ]);
    }

    if (upperBound > 0 && upperBound !== CARDINALITY_MAX_AS_NUMBER && isExistentialDependency) {
      restrictionNodes.push([
        {
          predicate: namedNode('rdf:type'),
          object: namedNode('owl:Restriction')
        },
        {
          predicate: namedNode('owl:onProperty'),
          object: objectPropertyNode
        },
        {
          predicate: namedNode('owl:maxQualifiedCardinality'),
          object: literal(upperBound, namedNode('xsd:nonNegativeInteger'))
        },
        {
          predicate: namedNode('owl:onClass'),
          object: targetClassNode
        }
      ]);
    }
  }

  const sourceClassNode = namedNode(transformer.getUri(sourceClass));
  restrictionNodes.forEach(restriction => {
    transformer.addQuad(sourceClassNode, namedNode('rdfs:subClassOf'), transformer.writer.blank(restriction));
  });
}
