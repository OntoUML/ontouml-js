export function countPattern(schema: string, pattern: string): number {
  return (schema.match(new RegExp(pattern, 'g')) || []).length;
}

export function removeBlankSpaces(text: string): string {
  return text
    .replace(/\s/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '');
}
