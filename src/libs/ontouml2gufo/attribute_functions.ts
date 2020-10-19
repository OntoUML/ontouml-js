import { Writer } from 'n3';
import { IClass, IProperty } from '@types';
import { getUri } from './uri_manager';
import { transformAnnotations } from './annotation_function';
import Options from './options';
import { isComplexDatatype, isConcrete, isDatatype, isEnumeration, isPrimitiveDatatype, isTypeDefined } from './helper_functions';
import { OntoumlType } from '@constants/.';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, quad } = DataFactory;

export function transformAttribute(writer: Writer, attribute: IProperty, options: Options): boolean {
  const container = attribute._container;

  if (container.type !== OntoumlType.CLASS_TYPE) {
    return false;
  }

  const containerClass: IClass = container as IClass;

  const attributeUri = getUri(attribute, options);
  const containerUri = getUri(containerClass, options);

  const containerIsDatatype = isDatatype(containerClass);
  const containerIsConcreteIndividual = isConcrete(containerClass);

  const isTypelessAttribute = !isTypeDefined(attribute);
  const isPrimitiveAttribute = isPrimitiveDatatype(attribute.propertyType as IClass);

  writer.addQuad(quad(namedNode(attributeUri), namedNode('rdfs:domain'), namedNode(containerUri)));

  if (!isTypelessAttribute) {
    const attributeTypeUri = getUri(attribute.propertyType, options);
    writer.addQuad(quad(namedNode(attributeUri), namedNode('rdfs:range'), namedNode(attributeTypeUri)));
  }

  if (isTypelessAttribute || isPrimitiveAttribute) {
    writer.addQuad(quad(namedNode(attributeUri), namedNode('rdf:type'), namedNode('owl:DatatypeProperty')));

    if (containerIsDatatype) {
      writer.addQuad(quad(namedNode(attributeUri), namedNode('rdfs:subPropertyOf'), namedNode('gufo:hasValueComponent')));
    } else if (containerIsConcreteIndividual) {
      writer.addQuad(quad(namedNode(attributeUri), namedNode('rdfs:subPropertyOf'), namedNode('gufo:hasQualityValue')));
    }
  } else {
    writer.addQuad(quad(namedNode(attributeUri), namedNode('rdf:type'), namedNode('owl:ObjectProperty')));

    const isComplexAttribute = isComplexDatatype(attribute.propertyType as IClass);
    const isEnumeratedAttribute = isEnumeration(attribute.propertyType as IClass);

    if (containerIsConcreteIndividual && (isComplexAttribute || isEnumeratedAttribute)) {
      writer.addQuad(quad(namedNode(attributeUri), namedNode('rdfs:subPropertyOf'), namedNode('gufo:hasReifiedQualityValue')));
    }
  }

  transformAnnotations(writer, attribute, options);

  return true;
}
