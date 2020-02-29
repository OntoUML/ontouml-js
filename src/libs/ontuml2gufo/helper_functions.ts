export function getURI(id: string, name: string, option?: string): string {
  const formattedName = name
    ? name
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

  if (option === 'id') {
    return formattedId || formattedName;
  }

  return formattedName || formattedId;
}
