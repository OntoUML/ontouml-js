import tags from 'language-tags';
import _ from 'lodash';

export type MultilingualText = string | { [bcpLanguageTag: string]: string };

function getText(multilingualText: MultilingualText, orderedLanguagePreferences: string[] = ['en']): string {
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

  let keys = Object.keys(multilingualText).sort();
  return multilingualText[keys[0]] || null;
}

export const multilingualText = {
  getText
};
