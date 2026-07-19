import tags from 'language-tags';

/**
 * Throws an error if `language` is not a valid IETF BCP 47 language tag.
 * Empty, null, and undefined values are rejected as well.
 */
function assertValidTag(language: string) {
  if (!language || !tags.check(language)) {
    throw new Error('Invalid language tag: ' + language);
  }
}

/**
 * A text value expressed in one or more languages. Each value is indexed by
 * an IETF BCP 47 language tag (e.g., `"en"`, `"pt"`), allowing elements to be
 * named and described multilingually. For example, a class may be named
 * `"Person"` in English and `"Pessoa"` in Portuguese.
 *
 * The static fields {@link defaultLanguage} and {@link languagePreference}
 * control, respectively, the language assumed when adding a value without a
 * tag and the order in which languages are tried when retrieving a value
 * without specifying one.
 */
export class MultilingualText {
  /** The language tag assumed when a value is added without one; `"en"` by
   * default. */
  static defaultLanguage: string = 'en';

  /** The ordered list of language tags tried when retrieving a value without
   * specifying a language; `['en']` by default. */
  static languagePreference: string[] = ['en'];

  private textMap: Map<string, string> = new Map<string, string>();

  constructor(value?: string, language?: string) {
    if (value != null) this.add(value, language);
  }

  /**
   * Returns the text value for the given language.
   *
   * If no language is provided, returns the value of the first language in
   * {@link languagePreference} for which a value exists. If no such value
   * exists, returns the first value it finds. If no values are defined,
   * returns `null`.
   *
   * @param language - language tag of the desired value (e.g., `"en"`).
   * @throws an error if `language` is provided but invalid or has no value.
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

  /**
   * Adds a text value in the given language, replacing any existing value for
   * that language.
   *
   * @param value - the text to add.
   * @param language - language tag of `value`; defaults to
   *        {@link defaultLanguage}.
   * @throws an error if `language` is not a valid language tag.
   */
  add(
    value: string,
    language: string = MultilingualText.defaultLanguage
  ): void {
    assertValidTag(language);
    this.textMap.set(language, value);
  }

  /**
   * Adds every entry of an object mapping language tags to text values,
   * replacing existing values for those languages.
   *
   * @param obj - object whose keys are language tags and whose values are the
   *        corresponding texts (e.g., `{ en: 'Person', pt: 'Pessoa' }`).
   */
  addAll(obj: { [key: string]: string }) {
    Object.entries(obj).forEach(([language, value]) => {
      this.add(value, language);
    });
  }

  /** Returns all values of this text as `[language, value]` pairs. */
  entries(): [string, string][] {
    return [...this.textMap.entries()];
  }

  /** Removes all values of this text, in every language. */
  clear(): void {
    this.textMap.clear();
  }

  /**
   * Returns an object mapping language tags to text values, as prescribed by
   * the OntoUML JSON Schema, or `null` if no values are defined.
   */
  toJSON(): any {
    if (this.textMap.size == 0) return null;
    return Object.fromEntries(this.textMap);
  }
}
