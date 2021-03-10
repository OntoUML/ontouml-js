import tags from 'language-tags';

export class MultilingualText {
  static defaultLanguage: string = 'en';
  static languagePreference: string[] = ['en'];

  textMap: Map<string, string>;

  constructor(value?: string, language?: string) {
    this.textMap = new Map<string, string>();
    if (value != null) this.addText(value, language);
  }

  getText(language?: string): string {
    if (language && tags.check(language)) {
      return this.textMap.get(language);
    }

    for (const lang of MultilingualText.languagePreference) {
      if (this.textMap.has(lang)) {
        return this.textMap.get(lang);
      }
    }

    return this.textMap.size > 0 ? [...this.textMap.entries()][0][1] : null;
  }

  addText(value: string, language?: string): void {
    language = language && tags.check(language) ? language : MultilingualText.defaultLanguage;
    this.textMap.set(language, value);
  }

  addAll(obj: object) {
    Object.entries(obj).forEach((entry) => {
      this.addText(entry[1], entry[0]);
    });
  }

  entries(): [string, string][] {
    return [...this.textMap.entries()];
  }

  clear(): void {
    this.textMap.clear();
  }

  toJSON(): any {
    if (this.textMap.size == 0) return null;
    if (this.textMap.size == 1) return this.getText('en');
    return this.textMap;
  }
}
