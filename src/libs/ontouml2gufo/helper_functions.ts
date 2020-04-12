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
    const { baseIRI, prefixPackages, uriManager, customLabels = {} } = options;
    const prefixes = {};

    if (prefixPackages) {
      prefixes[''] = `${baseIRI}#`;

      for (let i = 0; i < packages.length; i += 1) {
        const { id, name } = packages[i];
        const packageUri = uriManager.generateUniqueURI({
          id,
          name: customLabels[id] || customLabels[name] || name,
        });
        const uri = formatPackageName(packageUri);

        prefixes[uri] = `${baseIRI}/${uri}#`;
      }
    } else {
      prefixes[''] = `${baseIRI}#`;
    }

    return prefixes;
  },
);

export const getURI = memoizee(({ element, options }: GetURI): string => {
  const { customLabels, uriManager, uriFormatBy, prefixPackages } = options;
  const { id, name, propertyAssignments } = element;
  const isRelation = element.type === OntoUMLType.RELATION_TYPE;
  const isClass = element.type === OntoUMLType.CLASS_TYPE;
  const isInverseRelation = isRelation && propertyAssignments.isInverseRelation;
  let suggestedName = name;

  if (isRelation && !name && uriFormatBy === 'name') {
    suggestedName = getRelationName(element as IRelation);
  }

  let formattedName;

  if (isRelation) {
    formattedName = name
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

  const elementUri = uriManager.generateUniqueURI({
    id: formattedId,
    name: customLabels[id] || customLabels[name] || formattedName,
  });

  let uri =
    uriFormatBy === 'id'
      ? formattedId || elementUri
      : elementUri || formattedId;

  if (!uri) {
    return null;
  }

  if (prefixPackages) {
    const root = element.getRootPackage ? element.getRootPackage() : null;
    const packageEl = element._container as IPackage;

    if (packageEl && packageEl.id && packageEl.name) {
      const isRoot = root && root.id === packageEl.id;
      const packageUri = uriManager.generateUniqueURI({
        id: packageEl.id,
        name:
          customLabels[packageEl.id] ||
          customLabels[packageEl.name] ||
          packageEl.name,
      });

      const formattedPackageUri = formatPackageName(packageUri);

      return isRoot ? `:${uri}` : `${formattedPackageUri}:${uri}`;
    }
  }

  return `:${uri}`;
});

const getRelationName = (relation: IRelation): string => {
  const { id, stereotypes, properties, propertyAssignments } = relation;
  const stereotype = stereotypes ? stereotypes[0] : null;
  const {
    isInverseRelation,
    isInvertedRelation,
    isPartWholeRelation,
  } = propertyAssignments;
  const RelationStereotypeMapping = isInverseRelation
    ? InverseRelationStereotypeMapping
    : NormalRelationStereotypeMapping;

  const source = relation.getSource();
  const target = relation.getTarget();
  const sourceAssociatioName = properties[0].name;
  const targetAssociationname = properties[1].name;
  const hasAssociationName = isInvertedRelation
    ? !!sourceAssociatioName
    : !!targetAssociationname;

  const sourceName =
    formatName(sourceAssociatioName) ||
    formatName(source.name) ||
    formatName(id);
  const targetName =
    formatName(targetAssociationname) ||
    formatName(target.name) ||
    formatName(id);
  let formattedElementName = isInvertedRelation ? sourceName : targetName;

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
