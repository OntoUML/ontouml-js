import { MultilingualText } from '../multilingual_text';
import { NamedElement } from '../named_element';
import { Resource } from '../resource';
import { OntoumlElementBuilder } from './ontouml_element_builder';

/**
 * A fluent builder for {@link NamedElement} instances.
 *
 * This abstract builder configures the naming and documentation fields shared
 * by all named elements, such as names, descriptions, alternative names,
 * editorial notes, creators, and contributors. Textual fields are
 * multilingual and may be set in multiple languages.
 *
 * @example
 * ```typescript
 * const person = project
 *   .classBuilder()
 *   .kind()
 *   .name('Person')
 *   .name('Pessoa', 'pt')
 *   .description('A human being.')
 *   .build();
 * ```
 */
export abstract class NamedElementBuilder<
  B extends NamedElementBuilder<B>
> extends OntoumlElementBuilder<B> {
  protected declare element?: NamedElement;
  private _name: MultilingualText = new MultilingualText();
  private _description: MultilingualText = new MultilingualText();
  private _alternativeNames: MultilingualText[] = [];
  private _editorialNotes: MultilingualText[] = [];
  private _creators: Resource[] = [];
  private _contributors: Resource[] = [];

  /**
   * Builds the {@link NamedElement} with the parameters passed to the
   * builder, assigning the configured naming and documentation fields to the
   * element under construction. Concrete builders override this method to
   * instantiate and return elements of their specific types.
   */
  override build(): NamedElement {
    super.build();

    this.assertElement();
    this.element!.name = this._name;
    this.element!.description = this._description;
    this.element!.alternativeNames = this._alternativeNames;
    this.element!.editorialNotes = this._editorialNotes;
    this.element!.creators = this._creators;
    this.element!.contributors = this._contributors;

    return this.element!;
  }

  /**
   * Adds a name to the element in the given language.
   *
   * @param value - the name text.
   * @param language - language tag of `value`; defaults to
   *        {@link MultilingualText.defaultLanguage}.
   * @returns this builder, for method chaining.
   */
  name(value: string, language: string = MultilingualText.defaultLanguage): B {
    this._name.add(value, language);
    return this as unknown as B;
  }

  /**
   * Adds a free-text account of the element in the given language.
   *
   * @param value - the description text.
   * @param language - language tag of `value`; defaults to
   *        {@link MultilingualText.defaultLanguage}.
   * @returns this builder, for method chaining.
   */
  description(
    value: string,
    language: string = MultilingualText.defaultLanguage
  ): B {
    this._description.add(value, language);
    return this as unknown as B;
  }

  /**
   * Adds an alternative name by which the element is also known.
   *
   * @param value - the alternative name text.
   * @param language - language tag of `value`; defaults to
   *        {@link MultilingualText.defaultLanguage}.
   * @returns this builder, for method chaining.
   */
  alternativeName(
    value: string,
    language: string = MultilingualText.defaultLanguage
  ): B {
    this._alternativeNames.push(new MultilingualText(value, language));
    return this as unknown as B;
  }

  /**
   * Adds an editorial note to the element, i.e., a remark intended for its
   * editors rather than its end users.
   *
   * @param value - the editorial note text.
   * @param language - language tag of `value`; defaults to
   *        {@link MultilingualText.defaultLanguage}.
   * @returns this builder, for method chaining.
   */
  editorialNote(
    value: string,
    language: string = MultilingualText.defaultLanguage
  ): B {
    this._editorialNotes.push(new MultilingualText(value, language));
    return this as unknown as B;
  }

  /**
   * Adds an agent responsible for creating the element, such as a person or
   * an organization.
   *
   * @param uri - URI identifying the creator.
   * @param name - human-readable label of the creator.
   * @param language - language tag of `name` (e.g., `"en"`).
   * @returns this builder, for method chaining.
   * @throws an error if both `uri` and `name` are absent.
   */
  creator(uri?: string, name?: string, language?: string): B {
    this._creators.push(this.resource(uri, name, language));
    return this as unknown as B;
  }

  /**
   * Adds an agent that contributed to the element, such as a person or an
   * organization.
   *
   * @param uri - URI identifying the contributor.
   * @param name - human-readable label of the contributor.
   * @param language - language tag of `name` (e.g., `"en"`).
   * @returns this builder, for method chaining.
   * @throws an error if both `uri` and `name` are absent.
   */
  contributor(uri?: string, name?: string, language?: string): B {
    this._contributors.push(this.resource(uri, name, language));
    return this as unknown as B;
  }

  /**
   * Creates a {@link Resource} for a metadata field, rejecting resources that
   * would carry no information at all.
   *
   * @throws an error if both `uri` and `name` are absent.
   */
  protected resource(uri?: string, name?: string, language?: string): Resource {
    if (!uri && !name) {
      throw new Error('A resource requires at least one of `uri` and `name`.');
    }

    return new Resource(uri, name, language);
  }
}
