import memoizee from 'memoizee';
import { IRelation } from '@types';
import { RelationStereotypeToGUFOMapping } from '@constants/.';

type GetURI = {
  id: string;
  name: string;
  uriFormatBy?: string;
  relation?: IRelation;
};

export const getURI = memoizee(
  ({ id, name, uriFormatBy = 'name', relation }: GetURI): string => {
    let suggestedName = name;

    if (relation && !name && uriFormatBy === 'name') {
      const { stereotypes } = relation;
      const target = relation.getTarget();

      const targetName = target.name || id;
      const formattedTargetName = targetName
        .toLowerCase()
        .split(' ')
        .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/ /g, '');
      const stereotypeName = RelationStereotypeToGUFOMapping[stereotypes[0]];

      suggestedName = `${stereotypeName}${formattedTargetName}`;
    }

    const formattedName = name
      ? name
          .toLowerCase()
          .split(' ')
          .map((s: string, index: number) =>
            (relation && index > 0) || !relation
              ? s.charAt(0).toUpperCase() + s.substring(1)
              : s,
          )
          .join(' ')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .replace(/ /g, '')
      : suggestedName;
    const formattedId = id
      ? id
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .replace(/ /g, '')
      : null;

    if (uriFormatBy === 'id') {
      return formattedId || formattedName;
    }

    return formattedName || formattedId;
  },
);
