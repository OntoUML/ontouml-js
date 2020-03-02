import memoizee from 'memoizee';
import { IRelation } from '@types';
import {
  RelationStereotypeToGUFOMapping,
  RelationsInvertedInGUFO,
} from '@constants/.';
import URIManager from './uri_manager';

type GetURI = {
  id: string;
  name: string;
  uriFormatBy?: string;
  relation?: IRelation;
};

const uriManager = new URIManager();

export const getURI = memoizee(
  ({ id, name, uriFormatBy = 'name', relation }: GetURI): string => {
    let suggestedName = name;

    if (relation && !name && uriFormatBy === 'name') {
      const { stereotypes, properties } = relation;
      const isInvertedRelation = RelationsInvertedInGUFO.includes(
        stereotypes[0],
      );

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
      const formattedElementName = isInvertedRelation ? sourceName : targetName;

      const stereotypeName = RelationStereotypeToGUFOMapping[stereotypes[0]];
      const associationName =
        formattedElementName.charAt(0).toLocaleLowerCase() +
        formattedElementName.substring(1);

      suggestedName = hasAssociationName
        ? associationName
        : `${stereotypeName}${formattedElementName}`;
    }

    const formattedName = name
      ? formatName(name, (s: string, index: number) =>
          (relation && index > 0) || !relation
            ? s.charAt(0).toUpperCase() + s.substring(1)
            : s,
        )
      : suggestedName;
    const formattedId = id
      ? id
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .replace(/ /g, '')
      : null;

    const uri = uriManager.generateUniqueURI({
      id: formattedId,
      name: formattedName,
    });

    if (uriFormatBy === 'id') {
      return formattedId || uri;
    }

    return uri || formattedId;
  },
);

const formatName = memoizee(
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
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .replace(/ /g, '')
      : null,
);
