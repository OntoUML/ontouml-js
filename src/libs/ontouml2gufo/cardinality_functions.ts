import { IClass, IProperty, IRelation } from '@types';
import { Writer } from 'n3';
import Options from './options';
import { getInverseRelationUri, getUri } from './uri_manager';

import {
  isDerivation,
  isInstantiation,
  isBounded,
  isMaterial,
  isComparative,
  hasOntoumlStereotype,
  isPartWholeRelation,
  isBinary,
  impliesExistentialDependency,
  getLowerboundCardinality,
  getUpperboundCardinality,
  UNBOUNDED_CARDINALITY,
  targetExistentiallyDependsOnSource,
  sourceExistentiallyDependsOnTarget,
  isClass
} from './helper_functions';
import { getSuperProperty } from './relation_functions';
import { getInverseSuperProperty } from './relations_inverse_functions';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal } = DataFactory;

function getObjectPropertyNodes(writer: Writer, relation: IRelation, propertyPosition, options: Options) {
  if (isInstantiation(relation) || isDerivation(relation) || relation.properties.length > 2) {
    throw new Error('Cannot get property nodes for n-ary, «instantation», or «derivation» relations');
  }

  if (propertyPosition === 0) {
    if (
      isMaterial(relation) ||
      isComparative(relation) ||
      (!hasOntoumlStereotype(relation) && !isPartWholeRelation(relation)) ||
      options.createObjectProperty
    ) {
      return options.createInverses
        ? namedNode(getInverseRelationUri(relation, options))
        : writer.blank(namedNode('owl:inverseOf'), namedNode(getUri(relation, options)));
    }

    return options.createInverses
      ? namedNode(getInverseSuperProperty(relation))
      : writer.blank(namedNode('owl:inverseOf'), namedNode(getSuperProperty(relation)));
  }

  if (propertyPosition === 1) {
    if (
      isMaterial(relation) ||
      isComparative(relation) ||
      (!hasOntoumlStereotype(relation) && !isPartWholeRelation(relation)) ||
      options.createObjectProperty
    ) {
      return namedNode(getUri(relation, options));
    }

    return namedNode(getSuperProperty(relation));
  }

  return null;
}

enum Direction {
  SOURCE_TO_TARGET = 1,
  TARGET_TO_SOURCE = 2
}

export function transformRelationCardinalities(writer: Writer, relation: IRelation, options: Options) {
  if (
    !isClass(relation.getSource()) ||
    !isClass(relation.getTarget()) ||
    isInstantiation(relation) ||
    isDerivation(relation) ||
    !isBinary(relation) ||
    !impliesExistentialDependency(relation)
  ) {
    return;
  }

  const sourceProperty = relation.properties[0];
  if (isBounded(sourceProperty)) {
    writerCardinalityAxiom(writer, relation, Direction.TARGET_TO_SOURCE, options);
  }

  const targetProperty = relation.properties[1];
  if (isBounded(targetProperty)) {
    writerCardinalityAxiom(writer, relation, Direction.SOURCE_TO_TARGET, options);
  }
}

function writerCardinalityAxiom(writer: Writer, relation: IRelation, direction: Direction, options: Options) {
  if (!direction) return;

  let sourceClass: IClass;
  let targetAssociationEnd: IProperty;
  let objectPropertyNode;
  let isExistentialDependency: boolean;

  if (direction === Direction.SOURCE_TO_TARGET) {
    sourceClass = relation.properties[0].propertyType as IClass;
    targetAssociationEnd = relation.properties[1];
    objectPropertyNode = getObjectPropertyNodes(writer, relation, 1, options);
    isExistentialDependency = sourceExistentiallyDependsOnTarget(relation);
  } else {
    sourceClass = relation.properties[1].propertyType as IClass;
    targetAssociationEnd = relation.properties[0];
    objectPropertyNode = getObjectPropertyNodes(writer, relation, 0, options);
    isExistentialDependency = targetExistentiallyDependsOnSource(relation);
  }

  let restrictionNodes = [];

  const lowerBound = getLowerboundCardinality(targetAssociationEnd.cardinality);
  const upperBound = getUpperboundCardinality(targetAssociationEnd.cardinality);
  const targetClassNode = namedNode(getUri(targetAssociationEnd.propertyType, options));

  if (lowerBound === 1 && upperBound === UNBOUNDED_CARDINALITY) {
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

    if (upperBound > 0 && upperBound !== UNBOUNDED_CARDINALITY && isExistentialDependency) {
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

  const sourceClassNode = namedNode(getUri(sourceClass, options));
  restrictionNodes.forEach(restriction => {
    writer.addQuad(sourceClassNode, namedNode('rdfs:subClassOf'), writer.blank(restriction));
  });
}
