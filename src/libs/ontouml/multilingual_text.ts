import tags from 'language-tags';

export class MultilingualText {
  static defaultLanguage: string = 'en';
  static languagePreference: string[] = ['en'];

  textMap: Map<string, string>;

  constructor(base?: Partial<MultilingualText>) {
    this.textMap = !base ? new Map<string, string>() : new Map<string, string>(base.textMap);
  }

  getText(language?: string): string {
    if (tags.check(language)) {
      return this.textMap.get(language);
    }

    for (const lang of MultilingualText.languagePreference) {
      if (this.textMap.has(lang)) {
        return this.textMap.get(lang);
      }
    }

    return this.textMap.size > 0 ? this.textMap.entries().next().value : null;
  }

  addText(value: string, language?: string): void {
    language = tags.check(language) ? language : MultilingualText.defaultLanguage;
    this.textMap.set(language, value);
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
