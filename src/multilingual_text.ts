import tags from 'language-tags';

function assertValidTag(language: string) {
  if (language && !tags.check(language)) {
    throw new Error("Invalid language tag: " + language);
  }
}

export class MultilingualText {
  static defaultLanguage: string = 'en';
  static languagePreference: string[] = ['en'];

  textMap: Map<string, string>;

  constructor(value?: string, language?: string) {
    this.textMap = new Map<string, string>();
    if (value != null) this.addText(value, language);
  }
  

  getText(language?: string): string {
    if(language){
      assertValidTag(language);
  
      if (!this.textMap.has(language)) {
        throw new Error("Value for language tag not available: " + language);
      }

      return this.textMap.get(language)!;
    }

    for (const lang of MultilingualText.languagePreference) {
      if (this.textMap.has(lang)) {
        return this.textMap.get(lang)!;
      }
    }

    if (this.textMap.size > 0) 
      return [...this.textMap.entries()][0][1]

    throw new Error("No textual value defined.");
  }

  addText(value: string, language: string = MultilingualText.defaultLanguage): void {
    assertValidTag(language);
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
