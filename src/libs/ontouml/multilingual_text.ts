import tags from 'language-tags';

export type MultilingualText = string | { [bcpLanguageTag: string]: string };

export function getText(multilingualText: MultilingualText, orderedLanguagePreferences: string[] = ['en']): string {
  for (const lang of orderedLanguagePreferences) {
    if (!tags.check(lang)) {
      throw new Error('Invalid language code');
    }
  }

  if (typeof multilingualText === 'string') {
    return multilingualText;
  }

  for (const lang of orderedLanguagePreferences) {
    if (typeof multilingualText[lang] === 'string') {
      return multilingualText[lang];
    }
  }

  return Object.values(multilingualText)[0] || null;
}
