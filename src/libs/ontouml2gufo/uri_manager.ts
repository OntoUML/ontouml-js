import memoizee from 'memoizee';
import { IElement, IRelation, IPackage, IClass } from '@types';
import { OntoumlType } from '@constants/.';
import { NormalRelationStereotypeMapping, InverseRelationStereotypeMapping } from './constants';
import Options from './options';
import { getCustomElementData, getPackagePrefix } from './prefix_functions';
import { getName, hasAttributes, isDatatype } from './helper_functions';

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

  let xsdUri = getXsdUri(element);
  if (xsdUri) return xsdUri;

  return null;
};

export const hasAssignedUri = (element: IElement): boolean => {
  return getAssignedUri(element) !== null;
};

// const getRelationUri = (relation: IRelation, opts: Options): string => {
//   if (options.uriFormatBy === 'name') {
//     suggestedName = getRelationName(element as IRelation);
//   }
// };

//TODO: Properly test this method

export const getUri = memoizee((element: IElement, options: Options): string => {
  if (hasAssignedUri(element)) {
    return getAssignedUri(element);
  }

  let suggestedName;
  const isRelation = element.type === OntoumlType.RELATION_TYPE;
  if (isRelation && options.uriFormatBy === 'name') {
    suggestedName = getRelationName(element as IRelation);
  } else {
    suggestedName = element.name;
  }
  let formattedName;
  if (isRelation) {
    formattedName = suggestedName;
  } else {
    formattedName = element.name ? normalizeName(element.name) : null;
  }

  const isInverseRelation = isRelation && element.propertyAssignments && element.propertyAssignments.isInverseRelation;
  const formattedId = element.id ? `${isInverseRelation ? 'inverse_' : ''}${normalizeName(element.id)}` : null;
  const { customUri } = getCustomElementData(element, options);
  const elementUri =
    customUri ||
    options.uriManager.generateUniqueURI({
      id: formattedId,
      name: formattedName
    });

  let uri = options.uriFormatBy === 'id' ? formattedId || elementUri : elementUri || formattedId;

  if (!uri) {
    return null;
  }
  const hasCustomPackage = options.customPackageMapping && Object.keys(options.customPackageMapping).length > 0;
  if (options.prefixPackages || hasCustomPackage) {
    const root = element.getRootPackage ? element.getRootPackage() : null;
    const packageEl = element._container as IPackage;

    if (packageEl && packageEl.id && packageEl.name) {
      const isRoot = root && root.id === packageEl.id;
      const prefix = getPackagePrefix(packageEl, options);

      return isRoot ? `:${uri}` : `${prefix}:${uri}`;
    }
  }
  let basePrefix = options.basePrefix || '';
  return `${basePrefix}:${uri}`;
});

export const getRelationName = (relation: IRelation): string => {
  const { id, name, stereotypes, properties, propertyAssignments } = relation;
  const stereotype = stereotypes ? stereotypes[0] : null;
  const { isInverseRelation, isPartWholeRelation } = propertyAssignments;
  const RelationStereotypeMapping = isInverseRelation ? InverseRelationStereotypeMapping : NormalRelationStereotypeMapping;
  const target = relation.getTarget();
  const targetAssociationName = properties[1].name;
  const hasAssociationName = !!targetAssociationName;
  const targetName = normalizeName(targetAssociationName) || normalizeName(target.name) || normalizeName(id);
  let formattedElementName = targetName;
  const stereotypeName = RelationStereotypeMapping[stereotype];
  const associationName = formattedElementName.charAt(0).toLocaleLowerCase() + formattedElementName.substring(1);
  let prefixName = stereotypeName;

  if (isPartWholeRelation && !stereotypeName) {
    prefixName = RelationStereotypeMapping['isProperPartOf'];
  }
  let relationName = prefixName ? `${prefixName}${formattedElementName}` : associationName;
  if (name && !isInverseRelation) {
    relationName = normalizeName(name);
  }
  if (hasAssociationName) {
    relationName = associationName;
  }
  return relationName;
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
