import memoizee from 'memoizee';
import { IElement, IRelation } from '@types';
import {
  RelationStereotypeToGUFOMapping,
  RelationsInvertedInGUFO,
  OntoUMLType,
} from '@constants/.';
import URIManager from './uri_manager';

type GetURI = {
  element: IElement;
  options?: {
    uriFormatBy?: string;
    uriManager: URIManager;
  };
};

export const getURI = memoizee(({ element, options }: GetURI): string => {
  const { uriManager } = options;
  const uriFormatBy = options ? options.uriFormatBy || 'name' : 'name';
  const { id, name } = element;
  const isRelation = element.type === OntoUMLType.RELATION_TYPE;
  const isClass = element.type === OntoUMLType.CLASS_TYPE;
  let suggestedName = name;

  if (isRelation && !name && uriFormatBy === 'name') {
    const relation = element as IRelation;
    const { stereotypes, properties, propertyAssignments = {} } = relation;
    const stereotype = stereotypes ? stereotypes[0] : null;
    const { isInvertedRelation, isPartWholeRelation } = propertyAssignments;

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

    const stereotypeName = RelationStereotypeToGUFOMapping[stereotype];
    const associationName =
      formattedElementName.charAt(0).toLocaleLowerCase() +
      formattedElementName.substring(1);

    let prefixName = stereotypeName;

    if (isPartWholeRelation) {
      prefixName = 'isProperPartOf';
    }

    suggestedName = hasAssociationName
      ? associationName
      : `${prefixName}${formattedElementName}`;
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

  const formattedId = id ? cleanSpecialCharacters(id) : null;

  const uri = uriManager.generateUniqueURI({
    id: formattedId,
    name: formattedName,
  });

  if (uriFormatBy === 'id') {
    return formattedId || uri;
  }

  return uri || formattedId;
});

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
