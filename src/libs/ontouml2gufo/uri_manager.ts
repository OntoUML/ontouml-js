import _ from 'lodash';

import { IElement, IRelation, IPackage, IClass, IClassifier, IProperty } from '@types';

import Ontouml2Gufo from './ontouml2gufo';
import { getSuperProperty } from './relation_functions';
import { getPackagePrefix } from './prefix_functions';
import {
  getAllAssociationEnds,
  getAllAttributes,
  getAllClasses,
  getAllPackages,
  getAllRelations,
  getAllLiterals,
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

export default class UriManager {
  transformer: Ontouml2Gufo;
  id2Uri: { [key: string]: string };
  uniqueUris: string[];

  constructor(transformer: Ontouml2Gufo) {
    this.transformer = transformer;
    this.generateUniqueUris();
  }

  getUri(element): string {
    return this.id2Uri[element.id];
  }

  getSourceUri(relation: IRelation): string {
    const source = relation.properties[0].propertyType;

    if (!source || !source.id) return null;

    return this.getUri(source as IElement);
  }

  getTargetUri(relation: IRelation): string {
    const target = relation.properties[1].propertyType;
    if (!target || !target.id) return null;

    return this.getUri(target as IElement);
  }

  uriExists(uri: string) {
    return this.uniqueUris.includes(uri);
  }

  saveUri(element: IElement, uri: string) {
    this.id2Uri[element.id] = uri;
    this.uniqueUris.push(uri);
  }

  generateUniqueUris() {
    this.id2Uri = {};
    this.uniqueUris = [];

    const { model } = this.transformer;

    const packages = _.sortBy(getAllPackages(model), ['id', 'name']);
    const classes = _.sortBy(getAllClasses(model), ['id', 'name']);
    const attributes = _.sortBy(getAllAttributes(model), ['id', 'name']);
    const relations = _.sortBy(getAllRelations(model), ['id', 'name']);
    const associationEnds = _.sortBy(getAllAssociationEnds(model), ['id', 'name']);
    const literals = _.sortBy(getAllLiterals(model), ['id', 'name']);

    const elements: IElement[] = _.concat(classes, attributes, relations, associationEnds, literals, packages, [model]);

    for (const element of elements) {
      if (!element.id) {
        throw new Error('Cannot generate id-based URI for an element that does not have an id.');
      }

      if (isInstantiation(element as IRelation) || isDerivation(element as IRelation)) {
        continue;
      }

      const fixedUri = this.getFixedUri(element);
      if (fixedUri) {
        this.saveUri(element, fixedUri);
        continue;
      }

      if (this.transformer.options.uriFormatBy === 'id') {
        const idUri = this.getUriFromId(element);

        if (!this.uriExists(idUri)) {
          this.saveUri(element, idUri);
          continue;
        }

        throw new Error('Cannot generate id-based URIs if elements with duplicate ids exist.');
      }

      let nameUri = this.getNameBasedUri(element);
      if (this.uriExists(nameUri)) {
        nameUri = this.getUniqueUriVariation(nameUri);
      }

      this.saveUri(element, nameUri);
    }
  }

  getUniqueUriVariation(originalUri: string) {
    let candidateUri = originalUri;
    let i = 0;
    while (this.uriExists(candidateUri)) {
      i++;
      candidateUri = originalUri + '_' + i;
    }
    return candidateUri;
  }

  getUriFromId(element: IElement): string {
    return this.getPrefix(element) + ':' + element.id;
  }

  getFixedUri(element: IElement) {
    return this.getUriFromTaggedValues(element) || this.getUriFromOptions(element) || getUriFromXsdMapping(element);
  }

  getUriFromTaggedValues(element) {
    const assignments = element.propertyAssignments;
    return assignments && assignments.uri ? assignments.uri : null;
  }

  getUriFromOptions(element: IElement): string {
    const uri = this.transformer.options.getCustomUri(element);
    return uri ? this.getPrefix(element) + ':' + uri : null;
  }

  getNameBasedUri(element: IElement): string {
    if (isRelation(element)) {
      return this.getRelationNameBasedUri(element as IRelation);
    }

    let elementName = getNormalizedName(element) || normalizeName(element.id);
    return this.getPrefix(element) + ':' + elementName;
  }

  getRelationNameBasedUri(relation: IRelation): string {
    if (isInstantiation(relation) || isDerivation(relation)) {
      throw new Error('Instantiation and derivation relations do not have URIs');
    }

    const prefix = this.getPrefix(relation) + ':';

    let normalizedRelationName = getNormalizedName(relation);
    if (normalizedRelationName) {
      return prefix + normalizedRelationName;
    }

    let normalizedTargetRoleName = getNormalizedName(relation.properties[1] as IProperty);
    if (normalizedTargetRoleName) {
      return prefix + normalizedTargetRoleName;
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
    return prefix + normalizeName(relationName);
  }

  getInverseRelationUri(relation: IRelation): string {
    if (this.transformer.options.uriFormatBy === 'id') {
      return this.getPrefix(relation) + ':inverse_' + relation.id;
    }

    return this.getInverseRelationNameBasedUri(relation);
  }

  getInverseRelationNameBasedUri(relation: IRelation): string {
    if (isInstantiation(relation) || isDerivation(relation)) {
      throw new Error('Instantiation and derivation relations do not have URIs');
    }

    const prefix = this.getPrefix(relation);

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
  }

  getPrefix(element: IElement): string {
    const { options } = this.transformer;

    const hasCustomPackage = options.customPackageMapping && Object.keys(options.customPackageMapping).length > 0;
    if (options.prefixPackages || hasCustomPackage) {
      const root = element.getRootPackage ? element.getRootPackage() : null;
      const packageEl = element._container as IPackage;

      if (packageEl && packageEl.id && packageEl.name) {
        const isRoot = root && root.id === packageEl.id;
        const prefix = getPackagePrefix(this.transformer, packageEl);

        return isRoot ? '' : prefix;
      }
    }

    return options.basePrefix || '';
  }
}

export function normalizeName(name: string): string {
  if (!name) {
    return null;
  }

  name = name.replace(/[\s-](\w)/g, (_match, $1) => {
    return $1.toUpperCase();
  });

  return name.replace(/[^a-zA-Z0-9_]/g, '');
}

export const getNormalizedName = (element: IElement) => {
  let name = getName(element);
  return normalizeName(name);
};

export const getUriFromXsdMapping = (element: IElement): string => {
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
