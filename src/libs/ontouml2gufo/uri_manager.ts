import { Relation, ModelElement, Property, Class, Package } from '@libs/ontouml';
import { Ontouml2Gufo, getSuperProperty, getPackagePrefix } from './';

import _ from 'lodash';

export class UriManager {
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

  getSourceUri(relation: Relation): string {
    const source = relation.properties[0].propertyType;

    if (!source || !source.id) return null;

    return this.getUri(source as ModelElement);
  }

  getTargetUri(relation: Relation): string {
    const target = relation.properties[1].propertyType;
    if (!target || !target.id) return null;

    return this.getUri(target as ModelElement);
  }

  uriExists(uri: string) {
    return this.uniqueUris.includes(uri);
  }

  saveUri(element: ModelElement, uri: string) {
    this.id2Uri[element.id] = uri;
    this.uniqueUris.push(uri);
  }

  generateUniqueUris() {
    this.id2Uri = {};
    this.uniqueUris = [];

    const { model } = this.transformer;

    const packages = _.sortBy(model.getAllPackages(), ['id', 'name']);
    const classes = _.sortBy(model.getAllClasses(), ['id', 'name']);
    const attributes = _.sortBy(model.getAllAttributes(), ['id', 'name']);
    const relations = _.sortBy(model.getAllRelations(), ['id', 'name']);
    const associationEnds = _.sortBy(model.getAllRelationEnds(), ['id', 'name']);
    const literals = _.sortBy(model.getAllLiterals(), ['id', 'name']);

    const elements: ModelElement[] = _.concat<ModelElement>(classes, attributes, relations, associationEnds, literals, packages, [
      model
    ]);

    for (const element of elements) {
      if (!element.id) {
        throw new Error('Cannot generate id-based URI for an element that does not have an id.');
      }

      if (element instanceof Relation && (element.hasInstantiationStereotype() || element.hasDerivationStereotype())) {
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

  getUriFromId(element: ModelElement): string {
    return this.getPrefix(element) + ':' + element.id;
  }

  getFixedUri(element: ModelElement) {
    return this.getUriFromTaggedValues(element) || this.getUriFromOptions(element) || getUriFromXsdMapping(element);
  }

  getUriFromTaggedValues(element) {
    const assignments = element.propertyAssignments;
    return assignments && assignments.uri ? assignments.uri : null;
  }

  getUriFromOptions(element: ModelElement): string {
    const uri = this.transformer.options.getCustomUri(element);
    return uri ? this.getPrefix(element) + ':' + uri : null;
  }

  getNameBasedUri(element: ModelElement): string {
    if (element instanceof Relation) {
      return this.getRelationNameBasedUri(element as Relation);
    }

    let elementName = getNormalizedName(element) || normalizeName(element.id);
    return this.getPrefix(element) + ':' + elementName;
  }

  getRelationNameBasedUri(relation: Relation): string {
    if (relation.hasInstantiationStereotype() || relation.hasDerivationStereotype()) {
      throw new Error('Instantiation and derivation relations do not have URIs');
    }

    const prefix = this.getPrefix(relation) + ':';

    let normalizedRelationName = getNormalizedName(relation);
    if (normalizedRelationName) {
      return prefix + normalizedRelationName;
    }

    let normalizedTargetRoleName = getNormalizedName(relation.properties[1] as Property);
    if (normalizedTargetRoleName) {
      return prefix + normalizedTargetRoleName;
    }

    let sourceType = relation.getSource();
    let sourceTypeName = sourceType.getNameOrId();

    let targetType = relation.getTarget();
    let targetTypeName = targetType.getNameOrId();

    let middleUriSegment;

    if (relation.hasMaterialStereotype() || relation.hasComparativeStereotype()) {
      middleUriSegment = 'has';
    } else if (relation.stereotype || relation.isPartWholeRelation()) {
      let gufoPropertyUri = getSuperProperty(relation);
      middleUriSegment = gufoPropertyUri.replace('gufo:', '');
    } else {
      middleUriSegment = 'has';
    }

    let relationName = _.camelCase(sourceTypeName + ' ' + middleUriSegment + ' ' + targetTypeName);
    return prefix + normalizeName(relationName);
  }

  getInverseRelationUri(relation: Relation): string {
    if (this.transformer.options.uriFormatBy === 'id') {
      return this.getPrefix(relation) + ':inverse_' + relation.id;
    }

    return this.getInverseRelationNameBasedUri(relation);
  }

  getInverseRelationNameBasedUri(relation: Relation): string {
    if (relation.hasInstantiationStereotype() || relation.hasDerivationStereotype()) {
      throw new Error('Instantiation and derivation relations do not have URIs');
    }

    const prefix = this.getPrefix(relation);

    let normalizedTargetRoleName = getNormalizedName(relation.properties[0] as Property);
    if (normalizedTargetRoleName) {
      return prefix + ':' + normalizedTargetRoleName;
    }

    let sourceType = relation.getSource();
    let sourceTypeName = sourceType.getNameOrId();

    let targetType = relation.getTarget();
    let targetTypeName = targetType.getNameOrId();

    let middleUriSegment;

    if (relation.hasMaterialStereotype() || relation.hasComparativeStereotype()) {
      middleUriSegment = 'has';
    } else if (relation.stereotype || relation.isPartWholeRelation()) {
      let gufoPropertyUri = getSuperProperty(relation);
      middleUriSegment = gufoPropertyUri.replace('gufo:', '');
    } else {
      middleUriSegment = 'has';
    }

    let relationName = _.camelCase(sourceTypeName + ' ' + middleUriSegment + ' ' + targetTypeName);
    return prefix + ':' + normalizeName(relationName);
  }

  getPrefix(element: ModelElement): string {
    const { options } = this.transformer;

    const hasCustomPackage = options.customPackageMapping && Object.keys(options.customPackageMapping).length > 0;
    if (options.prefixPackages || hasCustomPackage) {
      const root = element.getModelOrRootPackage();
      const packageEl = element.container as Package;

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

export const getNormalizedName = (element: ModelElement) => {
  let name = element.getName();
  return normalizeName(name);
};

export const getUriFromXsdMapping = (element: ModelElement): string => {
  if (!(element instanceof Class)) {
    return null;
  } else if (!element.hasDatatypeStereotype() || element.hasAttributes()) {
    return null;
  }

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

  const datatypeName = element.getName().toLowerCase();

  for (const type of xsdTypes) {
    if (type.toLowerCase() === datatypeName) {
      return 'xsd:' + type;
    }
  }

  return null;
};
