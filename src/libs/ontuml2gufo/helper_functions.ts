import memoizee from 'memoizee';

type GetURI = {
  id: string;
  name: string;
  uriFormatBy?: string;
  isRelation?: boolean;
};

export const getURI = memoizee(
  ({ id, name, uriFormatBy = 'name', isRelation = false }: GetURI): string => {
    const formattedName = name
      ? name
          .toLowerCase()
          .split(' ')
          .map((s: string, index: number) =>
            (isRelation && index > 0) || !isRelation
              ? s.charAt(0).toUpperCase() + s.substring(1)
              : s,
          )
          .join(' ')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9 ]/g, '')
          .replace(/ /g, '')
      : null;
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
