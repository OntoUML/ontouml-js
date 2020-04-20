import memoizee from 'memoizee';
import { IElement, IRelation, IPackage, IOntoUML2GUFOOptions } from '@types';
import { OntoUMLType } from '@constants/.';
import {
  NormalRelationStereotypeMapping,
  InverseRelationStereotypeMapping,
} from './constants';

type GetURI = {
  element: IElement;
  options?: IOntoUML2GUFOOptions;
};

export const getPrefixes = memoizee(
  async (packages: IPackage[], options: IOntoUML2GUFOOptions) => {
    const {
      baseIRI,
      prefixPackages,
      uriManager,
      customPackageMapping,
    } = options;
    const prefixes = {};
    const hasCustomPackages = Object.keys(customPackageMapping).length > 0;

    if (prefixPackages || hasCustomPackages) {
      prefixes[''] = `${baseIRI}#`;

      for (let i = 0; i < packages.length; i += 1) {
        const { id, name } = packages[i];
        const { customUri, customPrefix } = getCustomPackageData(
          packages[i],
          options,
        );

        if (customUri && customPrefix) {
          prefixes[customPrefix] = customUri;
        } else if (prefixPackages) {
          const packageUri = uriManager.generateUniqueURI({
            id,
            name,
          });
          const uri = formatPackageName(packageUri);

          prefixes[uri] = `${baseIRI}/${uri}#`;
        }
      }
    } else {
      prefixes[''] = `${baseIRI}#`;
    }

    return prefixes;
  },
);

type CustomPrefixData = { customPrefix?: string; customUri: string };

export const getCustomPackageData = (
  packageEl: IPackage,
  options: IOntoUML2GUFOOptions,
): CustomPrefixData => {
  const { id, name } = packageEl;
  const { customPackageMapping } = options;
  let customPrefix;
  let customUri;

  if (customPackageMapping[id]) {
    customPrefix = customPackageMapping[id].prefix;
    customUri = customPackageMapping[id].uri;
  } else if (customPackageMapping[name]) {
    customPrefix = customPackageMapping[name].prefix;
    customUri = customPackageMapping[name].uri;
  }

  return { customPrefix, customUri };
};

type CustomElementData = {
  customLabel?: { [key: string]: string };
  customUri: string;
};

export const getCustomElementData = (
  element: IElement,
  options: IOntoUML2GUFOOptions,
): CustomElementData => {
  const { id, name } = element;
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

  return { customLabel, customUri };
};

export const getPackagePrefix = memoizee(
  (packageEl: IPackage, options: IOntoUML2GUFOOptions): string => {
    const { id, name } = packageEl;
    const { uriManager, prefixPackages } = options;
    const { customPrefix } = getCustomPackageData(packageEl, options);

    if (customPrefix) {
      return `${customPrefix}:`;
    } else if (prefixPackages) {
      const packagePrefix = uriManager.generateUniqueURI({ id, name });
      const prefix = formatPackageName(packagePrefix);

      return `${prefix}:`;
    }

    return ':';
  },
);

export const getURI = memoizee(({ element, options }: GetURI): string => {
  const {
    uriManager,
    uriFormatBy,
    prefixPackages,
    customPackageMapping,
  } = options;
  const { id, name, propertyAssignments } = element;
  const isRelation = element.type === OntoUMLType.RELATION_TYPE;
  const isClass = element.type === OntoUMLType.CLASS_TYPE;
  const isInverseRelation = isRelation && propertyAssignments.isInverseRelation;
  const hasCustomPackage = Object.keys(customPackageMapping).length > 0;
  const hasName = name && !isInverseRelation;
  let suggestedName = name;

  if (isRelation && !hasName && uriFormatBy === 'name') {
    suggestedName = getRelationName(element as IRelation);
  }

  let formattedName;

  if (isRelation) {
    formattedName = hasName
      ? formatName(
          name,
          (s: string) => s.charAt(0).toUpperCase() + s.substring(1),
        )
      : suggestedName;
  } else if (isClass) {
    formattedName = name ? formatName(name) : null;
  } else {
    formattedName = name ? cleanSpecialCharacters(name) : null;
  }

  const formattedId = id
    ? `${isInverseRelation ? 'inverse_' : ''}${cleanSpecialCharacters(id)}`
    : null;
  const { customUri } = getCustomElementData(element, options);

  const elementUri =
    customUri ||
    uriManager.generateUniqueURI({
      id: formattedId,
      name: formattedName,
    });

  let uri =
    uriFormatBy === 'id'
      ? formattedId || elementUri
      : elementUri || formattedId;

  if (!uri) {
    return null;
  }

  if (prefixPackages || hasCustomPackage) {
    const root = element.getRootPackage ? element.getRootPackage() : null;
    const packageEl = element._container as IPackage;

    if (packageEl && packageEl.id && packageEl.name) {
      const isRoot = root && root.id === packageEl.id;
      const prefix = getPackagePrefix(packageEl, options);

      return isRoot ? `:${uri}` : `${prefix}${uri}`;
    }
  }

  return `:${uri}`;
});

const getRelationName = (relation: IRelation): string => {
  const { id, stereotypes, properties, propertyAssignments } = relation;
  const stereotype = stereotypes ? stereotypes[0] : null;
  const { isInverseRelation, isPartWholeRelation } = propertyAssignments;
  const RelationStereotypeMapping = isInverseRelation
    ? InverseRelationStereotypeMapping
    : NormalRelationStereotypeMapping;

  const target = relation.getTarget();
  const targetAssociationname = properties[1].name;
  const hasAssociationName = !!targetAssociationname;

  const targetName =
    formatName(targetAssociationname) ||
    formatName(target.name) ||
    formatName(id);
  let formattedElementName = targetName;

  const stereotypeName = RelationStereotypeMapping[stereotype];
  const associationName =
    formattedElementName.charAt(0).toLocaleLowerCase() +
    formattedElementName.substring(1);

  let prefixName = stereotypeName;

  if (isPartWholeRelation && !stereotypeName) {
    prefixName = RelationStereotypeMapping['isProperPartOf'];
  }

  return hasAssociationName || !prefixName
    ? associationName
    : `${prefixName}${formattedElementName}`;
};

const cleanSpecialCharacters = memoizee((str: string) =>
  str
    ? str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/ /g, '')
    : null,
);

const transformToCamelCase = memoizee(
  (name: string, mapFunction?: (s: string, index: number) => string): string =>
    name
      ? name
          .toLowerCase()
          .split(' ')
          .map((s: string, index: number) =>
            mapFunction
              ? mapFunction(s, index)
              : s.charAt(0).toUpperCase() + s.substring(1),
          )
          .join(' ')
      : null,
);

const formatName = memoizee(
  (name: string, mapFunction?: (s: string, index: number) => string): string =>
    name
      ? cleanSpecialCharacters(transformToCamelCase(name, mapFunction))
      : null,
);

const formatPackageName = memoizee((name: string): string =>
  name
    ? cleanSpecialCharacters(
        transformToCamelCase(name, (s: string, index: number) =>
          index === 0
            ? s.charAt(0).toLowerCase() + s.substring(1)
            : s.charAt(0).toUpperCase() + s.substring(1),
        ),
      )
    : null,
);
