// import { IClass, IProperty } from '@types';
// import { transformAnnotations } from './annotation_function';
// import { isComplexDatatype, isConcrete, isDatatype, isEnumeration, isPrimitiveDatatype, isTypeDefined } from './helper_functions';
// import { OntoumlType } from '@constants/.';
import { OntoumlType, Property, Class } from '@libs/ontouml/';
import { Ontouml2Gufo, transformAnnotations } from './';

export function transformAttribute(transformer: Ontouml2Gufo, attribute: Property): boolean {
  const container = attribute.container;

  if (container.type !== OntoumlType.CLASS_TYPE) {
    return false;
  }

  const containerClass: Class = container as Class;

  const attributeUri = transformer.getUri(attribute);
  const containerUri = transformer.getUri(containerClass);

  const containerIsDatatype = containerClass.hasDatatypeStereotype();
  const containerIsConcreteIndividual = !containerClass.isAbstract;

  const isTypelessAttribute = !!attribute.propertyType;
  const isPrimitiveAttribute = (attribute.propertyType as Class).isPrimitiveDataType();

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

    const isComplexAttribute = (attribute.propertyType as Class).isComplexDatatype();
    const isEnumeratedAttribute = (attribute.propertyType as Class).hasEnumerationStereotype();

    if (containerIsConcreteIndividual && (isComplexAttribute || isEnumeratedAttribute)) {
      transformer.addQuad(attributeUri, 'rdfs:subPropertyOf', 'gufo:hasReifiedQualityValue');
    }
  }

  transformAnnotations(transformer, attribute);

  return true;
}
