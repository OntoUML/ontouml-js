import tags from 'language-tags';

function assertValidTag(language: string) {
  if (language && !tags.check(language)) {
    throw new Error('Invalid language tag: ' + language);
  }
}

export class MultilingualText {
  static defaultLanguage: string = 'en';
  static languagePreference: string[] = ['en'];

  private textMap: Map<string, string> = new Map<string, string>();

  constructor(value?: string, language?: string) {
    if (value != null) this.add(value, language);
  }

  /**
   *
   * If no language is provided, returns value based on the static field languagePreference.
   * If no such values exist, returns the first value it finds.
   * If no values are defined, returns null.
   */
  get(language?: string): string | null {
    if (language) {
      assertValidTag(language);

      if (!this.textMap.has(language)) {
        throw new Error('Value for language tag not available: ' + language);
      }

      return this.textMap.get(language)!;
    }

    for (const lang of MultilingualText.languagePreference) {
      if (this.textMap.has(lang)) {
        return this.textMap.get(lang)!;
      }
    }

    if (this.textMap.size > 0) return [...this.textMap.entries()][0][1];

    return null;
  }

  add(
    value: string,
    language: string = MultilingualText.defaultLanguage
  ): void {
    assertValidTag(language);
    this.textMap.set(language, value);
  }

  addAll(obj: { [key: string]: string }) {
    Object.entries(obj).forEach(([value, language]) => {
      this.add(value, language);
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
    return Object.fromEntries(this.textMap);
  }
}
