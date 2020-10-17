import memoizee from 'memoizee';
import Options from './options';
import { IElement, IRelation, IPackage, IClass, IClassifier, IProperty } from '@types';
import { getSuperProperty } from './relation_functions';
import { OntoumlType } from '@constants/.';
import { getPackagePrefix } from './prefix_functions';
import {
  getName,
  hasAttributes,
  hasOntoumlStereotype,
  isComparative,
  isDatatype,
  isDerivation,
  isInstantiation,
  isMaterial,
  isPartWholeRelation,
  isRelation
} from './helper_functions';

import _ from 'lodash';

export default class UriManager {
  uris: { [key: string]: string };

  constructor() {
    this.uris = {};
  }

  generateUniqueURI({ id, name }: { id: string; name: string }): string {
    const names = Object.values(this.uris);

    if (!id && !name) {
      return null;
    }

    if (this.uris[id]) {
      return this.uris[id];
    }

    if (names.includes(name)) {
      this.uris[id] = `${name}_${id}`;
    } else {
      this.uris[id] = name;
    }

    return this.uris[id];
  }
}

export const getUri = memoizee((element: IElement, options: Options): string => {
  const fixedUri = getAssignedUri(element);
  if (fixedUri) {
    return fixedUri;
  }

  const customUri = getCustomUri(element, options);
  if (customUri) {
    return customUri;
  }

  const xsdUri = getXsdUri(element);
  if (xsdUri) {
    return xsdUri;
  }

  if (options.uriFormatBy === 'id') {
    return getIdBasedUri(element, options);
  }

  return getNameBasedUri(element, options);
});

export const getXsdUri = (element: IElement): string => {
  if (!isDatatype(element) || hasAttributes(element as IClass)) return null;

  const xsdTypes: string[] = [
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
    'NMTOKENS'
  ];

  const datatypeName = getName(element).toLowerCase();

  for (const type of xsdTypes) {
    if (type.toLowerCase() === datatypeName) {
      return 'xsd:' + type;
    }
  }

  return null;
};

export const getAssignedUri = (element: IElement): string => {
  const assignments = element.propertyAssignments;
  if (assignments && assignments.uri) return assignments.uri;

  return null;
};

export const hasAssignedUri = (element: IElement): boolean => {
  return getAssignedUri(element) !== null;
};

export const normalizeName = memoizee((name: string): string => {
  if (!name) {
    return null;
  }

  name = name.replace(/[\s-](\w)/g, (_match, $1) => {
    return $1.toUpperCase();
  });

  return name.replace(/[^a-zA-Z0-9_]/g, '');
});

export const getPrefix = (element: IElement, options: Options): string => {
  const hasCustomPackage = options.customPackageMapping && Object.keys(options.customPackageMapping).length > 0;
  if (options.prefixPackages || hasCustomPackage) {
    const root = element.getRootPackage ? element.getRootPackage() : null;
    const packageEl = element._container as IPackage;

    if (packageEl && packageEl.id && packageEl.name) {
      const isRoot = root && root.id === packageEl.id;
      const prefix = getPackagePrefix(packageEl, options);

      return isRoot ? '' : prefix;
    }
  }

  return options.basePrefix || '';
};

export const getNormalizedName = (element: IElement) => {
  let name = getName(element);
  return normalizeName(name);
};

const getRelationNameBasedUri = (relation: IRelation, options: Options): string => {
  if (isInstantiation(relation) || isDerivation(relation)) {
    throw new Error('Instantiation and derivation relations do not have URIs');
  }

  const prefix = getPrefix(relation, options);

  let normalizedRelationName = getNormalizedName(relation);
  if (normalizedRelationName) {
    return prefix + ':' + normalizedRelationName;
  }

  let normalizedTargetRoleName = getNormalizedName(relation.properties[1] as IProperty);
  if (normalizedTargetRoleName) {
    return prefix + ':' + normalizedTargetRoleName;
  }

  let sourceType = relation.properties[0].propertyType as IClassifier;
  let sourceTypeName = getName(sourceType) || sourceType.id;

  let targetType = relation.properties[1].propertyType as IClassifier;
  let targetTypeName = getName(targetType) || sourceType.id;

  let middleUriSegment;

  if (isMaterial(relation) || isComparative(relation)) {
    middleUriSegment = 'has';
  } else if (hasOntoumlStereotype(relation) || isPartWholeRelation(relation)) {
    let gufoPropertyUri = getSuperProperty(relation);
    middleUriSegment = gufoPropertyUri.replace('gufo:', '');
  } else {
    middleUriSegment = 'has';
  }

  let relationName = _.camelCase(sourceTypeName + ' ' + middleUriSegment + ' ' + targetTypeName);
  return prefix + ':' + normalizeName(relationName);
};

export const getInverseRelationUri = (relation: IRelation, options: Options) => {
  if (options.uriFormatBy === 'id') {
    return getPrefix(relation, options) + ':inverse_' + relation.id;
  }

  return getInverseRelationNameBasedUri(relation, options);
};

export const getInverseRelationNameBasedUri = (relation: IRelation, options: Options) => {
  if (isInstantiation(relation) || isDerivation(relation)) {
    throw new Error('Instantiation and derivation relations do not have URIs');
  }

  const prefix = getPrefix(relation, options);

  let normalizedTargetRoleName = getNormalizedName(relation.properties[0] as IProperty);
  if (normalizedTargetRoleName) {
    return prefix + ':' + normalizedTargetRoleName;
  }

  let sourceType = relation.properties[0].propertyType as IClassifier;
  let sourceTypeName = getName(sourceType) || sourceType.id;

  let targetType = relation.properties[1].propertyType as IClassifier;
  let targetTypeName = getName(targetType) || sourceType.id;

  let middleUriSegment;

  if (isMaterial(relation) || isComparative(relation)) {
    middleUriSegment = 'has';
  } else if (hasOntoumlStereotype(relation) || isPartWholeRelation(relation)) {
    let gufoPropertyUri = getSuperProperty(relation);
    middleUriSegment = gufoPropertyUri.replace('gufo:', '');
  } else {
    middleUriSegment = 'has';
  }

  let relationName = _.camelCase(sourceTypeName + ' ' + middleUriSegment + ' ' + targetTypeName);
  return prefix + ':' + normalizeName(relationName);
};

export const getNameBasedUri = (element: IElement, options: Options): string => {
  if (isRelation(element)) {
    return getRelationNameBasedUri(element as IRelation, options);
  }

  let elementName = getNormalizedName(element) || normalizeName(element.id);
  return getPrefix(element, options) + ':' + elementName;
};

export const getIdBasedUri = (element: IElement, options: Options): string => {
  return getPrefix(element, options) + ':' + element.id;
};

export function getSourceUri(relation: IRelation, options: Options): string {
  const source = relation.properties[0].propertyType;

  if (!source || !source.id) return null;

  return getUri(source, options);
}

export function getTargetUri(relation: IRelation, options: Options): string {
  const target = relation.properties[1].propertyType;
  if (!target || !target.id) return null;

  return getUri(target, options);
}

type CustomElementData = {
  customLabel?: { [key: string]: string };
  customUri: string;
};

export const getCustomElementData = (element: IElement, options: Options): CustomElementData => {
  const { id, type } = element;
  const name = getName(element);

  const { customElementMapping } = options;
  let customLabel;
  let customUri;

  if (customElementMapping[id]) {
    customLabel = customElementMapping[id].label;
    customUri = customElementMapping[id].uri;
  } else if (customElementMapping[name]) {
    customLabel = customElementMapping[name].label;
    customUri = customElementMapping[name].uri;
  }
  // check target association end id/name
  if (type === OntoumlType.RELATION_TYPE) {
    const { properties } = element as IRelation;
    const targetAssociationId = properties[1].id;
    const targetAssociationName = getName(properties[1]);

    if (customElementMapping[targetAssociationId]) {
      customLabel = customElementMapping[targetAssociationId].label;
      customUri = customElementMapping[targetAssociationId].uri;
    } else if (customElementMapping[targetAssociationName]) {
      customLabel = customElementMapping[targetAssociationName].label;
      customUri = customElementMapping[targetAssociationName].uri;
    }
  }

  return {
    customLabel,
    customUri: getPrefix(element, options) + ':' + customUri
  };
};

export const getCustomUri = (element: IElement, options: Options): string => {
  const allMappings = options.customElementMapping;

  let elementCustomMapping = allMappings[element.id];

  if (elementCustomMapping && elementCustomMapping.uri) {
    return getPrefix(element, options) + ':' + elementCustomMapping.uri;
  }

  elementCustomMapping = allMappings[getName(element)];

  if (elementCustomMapping && elementCustomMapping.uri) {
    return getPrefix(element, options) + ':' + elementCustomMapping.uri;
  }

  return null;
};

export const getCustomLabels = (element: IElement, options: Options) => {
  const allMappings = options.customElementMapping;

  let elementCustomMapping = allMappings[element.id];

  if (elementCustomMapping && elementCustomMapping.label) {
    return elementCustomMapping.label;
  }

  elementCustomMapping = allMappings[getName(element)];

  if (elementCustomMapping && elementCustomMapping.label) {
    return elementCustomMapping.label;
  }

  return null;
};
