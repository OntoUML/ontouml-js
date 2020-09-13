import memoizee from 'memoizee';
import { IElement, IRelation, IPackage, IOntoUML2GUFOOptions } from '@types';
import { OntoUMLType } from '@constants/.';
import { NormalRelationStereotypeMapping, InverseRelationStereotypeMapping } from './constants';

type GetURI = {
  element: IElement;
  options?: IOntoUML2GUFOOptions;
};

export const getBasePrefix = memoizee(async (options: IOntoUML2GUFOOptions) => {
  const { baseIRI, basePrefix } = options;
  let prefix = {}
  
  if (basePrefix && basePrefix.trim().length>0 ) {
    prefix[basePrefix] = `${baseIRI}#`;
  } else {
    prefix[''] = `${baseIRI}#`;
  }

  return prefix;
});


export const getPackagePrefixes = memoizee(async (packages: IPackage[], options: IOntoUML2GUFOOptions) => {
  const { baseIRI, prefixPackages, uriManager, customPackageMapping } = options;
  const prefixes = {};
  const hasCustomPackages = Object.keys(customPackageMapping).length > 0;

  if (prefixPackages || hasCustomPackages) {

    for (let i = 0; i < packages.length; i += 1) {
      const { id, name } = packages[i];
      const { customUri, customPrefix } = getCustomPackageData(packages[i], options);

      if (customUri && customPrefix) {
        prefixes[customPrefix] = customUri;
      } else if (prefixPackages) {
        const packageUri = uriManager.generateUniqueURI({
          id,
          name,
        });
        const uri = normalizeName(packageUri);

        prefixes[uri] = `${baseIRI}/${uri}#`;
      }
    }
  }

  return prefixes;
});

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

export const getCustomElementData = (element: IElement, options: IOntoUML2GUFOOptions): CustomElementData => {
  const { id, name, type } = element;
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
  if (type === OntoUMLType.RELATION_TYPE) {
    const { properties } = element as IRelation;
    const targetAssociationId = properties[1].id;
    const targetAssociationName = properties[1].name;

    if (customElementMapping[targetAssociationId]) {
      customLabel = customElementMapping[targetAssociationId].label;
      customUri = customElementMapping[targetAssociationId].uri;
    } else if (customElementMapping[targetAssociationName]) {
      customLabel = customElementMapping[targetAssociationName].label;
      customUri = customElementMapping[targetAssociationName].uri;
    }
  }

  return { customLabel, customUri };
};

export const getPackagePrefix = memoizee((packageEl: IPackage, options: IOntoUML2GUFOOptions): string => {
  const { id, name } = packageEl;
  const { uriManager, prefixPackages } = options;
  const { customPrefix } = getCustomPackageData(packageEl, options);

  if (customPrefix) {
    return `${customPrefix}:`;
  } else if (prefixPackages) {
    const packagePrefix = uriManager.generateUniqueURI({ id, name });
    const prefix = normalizeName(packagePrefix);

    return `${prefix}:`;
  }

  return ':';
});

export const getAssignedUri = (element: IElement): string => {
  const propertyAssignments = element.propertyAssignments;
  return propertyAssignments && propertyAssignments.uri ? propertyAssignments.uri : null;
};

export const hasAssignedUri = (element: IElement): boolean => {
  return getAssignedUri(element) !== null;
};

//TODO: Properly test this method
export const getURI = memoizee(({ element, options }: GetURI): string => {
  if (hasAssignedUri(element)) {
    return getAssignedUri(element);
  }

  let suggestedName;

  const isRelation = element.type === OntoUMLType.RELATION_TYPE;
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

  const isInverseRelation = isRelation && element.propertyAssignments.isInverseRelation;
  const formattedId = element.id
    ? `${isInverseRelation ? 'inverse_' : ''}${normalizeName(element.id)}`
    : null;
  const { customUri } = getCustomElementData(element, options);

  const elementUri =
    customUri ||
    options.uriManager.generateUniqueURI({
      id: formattedId,
      name: formattedName,
    });

  let uri = options.uriFormatBy === 'id' ? formattedId || elementUri : elementUri || formattedId;

  if (!uri) {
    return null;
  }

  const hasCustomPackage =
    options.customPackageMapping && Object.keys(options.customPackageMapping).length > 0;
  if (options.prefixPackages || hasCustomPackage) {
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

export const getRelationName = (relation: IRelation): string => {
  const { id, name, stereotypes, properties, propertyAssignments } = relation;
  const stereotype = stereotypes ? stereotypes[0] : null;
  const { isInverseRelation, isPartWholeRelation } = propertyAssignments;
  const RelationStereotypeMapping = isInverseRelation
    ? InverseRelationStereotypeMapping
    : NormalRelationStereotypeMapping;
  const target = relation.getTarget();
  const targetAssociationName = properties[1].name;
  const hasAssociationName = !!targetAssociationName;
  const targetName = normalizeName(targetAssociationName) || normalizeName(target.name) || normalizeName(id);
  let formattedElementName = targetName;
  const stereotypeName = RelationStereotypeMapping[stereotype];
  const associationName =
    formattedElementName.charAt(0).toLocaleLowerCase() + formattedElementName.substring(1);
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
