import { IClass, IProperty } from '@types';
import { transformAnnotations } from './annotation_function';
import { isComplexDatatype, isConcrete, isDatatype, isEnumeration, isPrimitiveDatatype, isTypeDefined } from './helper_functions';
import { OntoumlType } from '@constants/.';
import { Ontouml2Gufo } from './ontouml2gufo';

export function transformAttribute(transformer: Ontouml2Gufo, attribute: IProperty): boolean {
  const container = attribute._container;

  if (container.type !== OntoumlType.CLASS_TYPE) {
    return false;
  }

  const containerClass: IClass = container as IClass;

  const attributeUri = transformer.getUri(attribute);
  const containerUri = transformer.getUri(containerClass);

  const containerIsDatatype = isDatatype(containerClass);
  const containerIsConcreteIndividual = isConcrete(containerClass);

  const isTypelessAttribute = !isTypeDefined(attribute);
  const isPrimitiveAttribute = isPrimitiveDatatype(attribute.propertyType as IClass);

  transformer.addQuad(attributeUri, 'rdfs:domain', containerUri);

  if (!isTypelessAttribute) {
    const attributeTypeUri = transformer.getUri(attribute.propertyType);
    transformer.addQuad(attributeUri, 'rdfs:range', attributeTypeUri);
  }

  if (isTypelessAttribute || isPrimitiveAttribute) {
    transformer.addQuad(attributeUri, 'rdf:type', 'owl:DatatypeProperty');

    if (containerIsDatatype) {
      transformer.addQuad(attributeUri, 'rdfs:subPropertyOf', 'gufo:hasValueComponent');
    } else if (containerIsConcreteIndividual) {
      transformer.addQuad(attributeUri, 'rdfs:subPropertyOf', 'gufo:hasQualityValue');
    }
  } else {
    transformer.addQuad(attributeUri, 'rdf:type', 'owl:ObjectProperty');

    const isComplexAttribute = isComplexDatatype(attribute.propertyType as IClass);
    const isEnumeratedAttribute = isEnumeration(attribute.propertyType as IClass);

    if (containerIsConcreteIndividual && (isComplexAttribute || isEnumeratedAttribute)) {
      transformer.addQuad(attributeUri, 'rdfs:subPropertyOf', 'gufo:hasReifiedQualityValue');
    }
  }

  transformAnnotations(transformer, attribute);

  return true;
}
