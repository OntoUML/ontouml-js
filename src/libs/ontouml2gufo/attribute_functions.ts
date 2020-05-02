import { N3Writer } from 'n3';
import { IClass, IOntoUML2GUFOOptions } from '@types';
import { ClassStereotype } from '@constants/.';
import { getURI } from './helper_functions';
import { transformAnnotations } from './annotation_function';

const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal, quad } = DataFactory;

const XSDDatatypes = [
  'anyURI',
  'base64Binary',
  'boolean',
  'byte',
  'date',
  'dateTime',
  'dateTimeStamp',
  'dayTimeDuration',
  'decimal',
  'double',
  'float',
  'gDay',
  'gMonth',
  'gMonthDay',
  'gYear',
  'gYearMonth',
  'hexBinary',
  'int',
  'integer',
  'language',
  'long',
  'Name',
  'NCName',
  'NMTOKEN',
  'negativeInteger',
  'nonNegativeInteger',
  'nonPositiveInteger',
  'normalizedString',
  'positiveInteger',
  'short',
  'string',
  'time',
  'token',
  'unsignedByte',
  'unsignedInt',
  'unsignedLong',
  'unsignedShort',
  'yearMonthDuration',
  'precisionDecimal',
  'duration',
  'QName',
  'ENTITY',
  'ID',
  'IDREF',
  'NOTATION',
  'IDREFS',
  'ENTITIES',
  'NMTOKENS',
];

export async function transformAttributes(
  writer: N3Writer,
  classElement: IClass,
  options: IOntoUML2GUFOOptions,
): Promise<boolean> {
  const { properties: attributes, stereotypes } = classElement;
  const isDatatypeClass = stereotypes[0] === ClassStereotype.DATATYPE;
  const quads = [];

  for (let i = 0; i < attributes.length; i += 1) {
    const { name, propertyType: attributeElement } = attributes[i];
    const uri = getURI({ element: attributes[i], options });
    const classUri = getURI({ element: classElement, options });
    const {
      name: datatypeName,
      stereotypes: datatypeStereotypes,
      properties: datatypeAttributes,
    } = (attributeElement || {}) as IClass;
    const datatypeStereotype = datatypeStereotypes
      ? datatypeStereotypes[0]
      : null;
    const isComplexDatatype =
      datatypeStereotype === ClassStereotype.DATATYPE && !!datatypeAttributes;
    const isEnumerationDatatype =
      datatypeStereotype === ClassStereotype.ENUMERATION;

    if (
      !attributeElement ||
      (datatypeStereotype === ClassStereotype.DATATYPE && !isComplexDatatype)
    ) {
      quads.push(
        quad(
          namedNode(uri),
          namedNode('rdf:type'),
          namedNode('owl:DatatypeProperty'),
        ),
      );
      quads.push(
        quad(namedNode(uri), namedNode('rdfs:domain'), namedNode(classUri)),
      );

      if (!isDatatypeClass) {
        quads.push(
          quad(
            namedNode(uri),
            namedNode('rdfs:subPropertyOf'),
            namedNode('gufo:hasQualityValue'),
          ),
        );
      }

      if (datatypeName && XSDDatatypes.includes(datatypeName)) {
        quads.push(
          quad(
            namedNode(uri),
            namedNode('rdfs:range'),
            namedNode(`xsd:${datatypeName}`),
          ),
        );
      }
    } else if (
      attributeElement &&
      (datatypeStereotype !== ClassStereotype.DATATYPE || isComplexDatatype)
    ) {
      const rangeUri = getURI({ element: attributeElement, options });

      // complex attribute is an attribute of a datatype class with type defined as datatype or enumeration
      const isComplexAttribute =
        isDatatypeClass && (isComplexDatatype || isEnumerationDatatype);

      quads.push(
        quad(
          namedNode(uri),
          namedNode('rdf:type'),
          namedNode('owl:ObjectProperty'),
        ),
      );
      quads.push(
        quad(namedNode(uri), namedNode('rdfs:domain'), namedNode(classUri)),
      );
      quads.push(
        quad(namedNode(uri), namedNode('rdfs:range'), namedNode(rangeUri)),
      );

      if (!isComplexAttribute) {
        quads.push(
          quad(
            namedNode(uri),
            namedNode('rdfs:subPropertyOf'),
            namedNode('gufo:hasReifiedQualityValue'),
          ),
        );
      }
    }

    // transform annotations
    await transformAnnotations(writer, attributes[i], options);
  }

  await writer.addQuads(quads);

  return true;
}
