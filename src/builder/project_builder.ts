import {
  getMetadataLabel,
  MultilingualText,
  NamedElementBuilder,
  Project,
  Resource
} from '..';

/**
 * A fluent builder for {@link Project} instances.
 *
 * In addition to the identification and naming methods inherited from
 * {@link NamedElementBuilder}, this builder supports the project-level
 * metadata fields prescribed by the OntoUML/UFO catalog metadata schema,
 * such as publisher, license, keywords, and designed-for tasks.
 *
 * @example
 * ```typescript
 * const project = new ProjectBuilder()
 *   .name('UFO-S')
 *   .keyword('services', 'en')
 *   .language('en')
 *   .license('https://creativecommons.org/licenses/by/4.0/')
 *   .build();
 * ```
 */
export class ProjectBuilder extends NamedElementBuilder<ProjectBuilder> {
  protected declare element?: Project;

  private _publisher?: Resource;
  private _license?: Resource;
  private _representationStyle?: Resource;
  private _namespace?: string;
  private _accessRights: Resource[] = [];
  private _contexts: Resource[] = [];
  private _designedForTasks: Resource[] = [];
  private _ontologyTypes: Resource[] = [];
  private _themes: Resource[] = [];
  private _bibliographicCitations: MultilingualText[] = [];
  private _keywords: MultilingualText[] = [];
  private _acronyms: string[] = [];
  private _landingPages: string[] = [];
  private _languages: string[] = [];
  private _sources: string[] = [];

  constructor() {
    super();
  }

  /**
   * Builds an instance of {@link Project} with the parameters passed to the
   * builder. When no methods are evoked, the created project has the following
   * defaults:
   * - `id: "randomly-generated-id",`
   * - `created: new Date()`
   */
  override build(): Project {
    this.element = new Project();

    super.build();

    this.element.publisher = this._publisher;
    this.element.license = this._license;
    this.element.representationStyle = this._representationStyle;
    this.element.namespace = this._namespace;
    this.element.accessRights = this._accessRights;
    this.element.contexts = this._contexts;
    this.element.designedForTasks = this._designedForTasks;
    this.element.ontologyTypes = this._ontologyTypes;
    this.element.themes = this._themes;
    this.element.bibliographicCitations = this._bibliographicCitations;
    this.element.keywords = this._keywords;
    this.element.acronyms = this._acronyms;
    this.element.landingPages = this._landingPages;
    this.element.languages = this._languages;
    this.element.sources = this._sources;

    return this.element;
  }

  /**
   * Sets the agent responsible for making the project available, such as a
   * research group or a company.
   *
   * @param uri - URI identifying the publisher.
   * @param name - human-readable label of the publisher.
   * @param language - language tag of `name` (e.g., `"en"`).
   * @returns this builder, for method chaining.
   */
  publisher(uri?: string, name?: string, language?: string): ProjectBuilder {
    this._publisher = new Resource(uri, name, language);
    return this;
  }

  /**
   * Sets the license under which the project is distributed.
   *
   * @param uri - URI identifying the license (e.g., `"https://creativecommons.org/licenses/by/4.0/"`).
   * @param name - human-readable label of the license (e.g., `"CC BY 4.0"`).
   * @param language - language tag of `name` (e.g., `"en"`).
   * @returns this builder, for method chaining.
   */
  license(uri?: string, name?: string, language?: string): ProjectBuilder {
    this._license = new Resource(uri, name, language);
    return this;
  }

  /**
   * Sets the modeling style adopted in the project, preferably one of the
   * values of {@link OntologyRepresentationStyle}.
   *
   * @example
   * ```typescript
   * builder.representationStyle(OntologyRepresentationStyle.ONTOUML);
   * ```
   *
   * @param uri - URI identifying the representation style.
   * @param name - human-readable label of the representation style; when
   *        omitted and `uri` is a value of
   *        {@link OntologyRepresentationStyle}, the official label of the
   *        style is used.
   * @param language - language tag of `name` (e.g., `"en"`).
   * @returns this builder, for method chaining.
   */
  representationStyle(
    uri?: string,
    name?: string,
    language?: string
  ): ProjectBuilder {
    this._representationStyle = this.vocabularyResource(uri, name, language);
    return this;
  }

  /**
   * Creates a {@link Resource}, filling in the official label of `uri` when
   * it identifies an individual of the OntoUML/UFO Catalog Metadata
   * Vocabulary and no `name` is provided.
   */
  private vocabularyResource(
    uri?: string,
    name?: string,
    language?: string
  ): Resource {
    if (uri && !name) {
      const label = getMetadataLabel(uri);

      if (label) {
        return new Resource(uri, label, 'en');
      }
    }

    return new Resource(uri, name, language);
  }

  /**
   * Sets the namespace URI under which the project's elements are identified.
   *
   * @returns this builder, for method chaining.
   */
  namespace(uri: string): ProjectBuilder {
    this._namespace = uri;
    return this;
  }

  /**
   * Adds an access right to the project, i.e., information about who can
   * access it or its security status.
   *
   * @param uri - URI identifying the access right.
   * @param name - human-readable label of the access right.
   * @param language - language tag of `name` (e.g., `"en"`).
   * @returns this builder, for method chaining.
   */
  accessRight(uri?: string, name?: string, language?: string): ProjectBuilder {
    this._accessRights.push(new Resource(uri, name, language));
    return this;
  }

  /**
   * Adds a context in which the project was developed, preferably one of the
   * values of {@link OntologyDevelopmentContext}.
   *
   * @example
   * ```typescript
   * builder.context(OntologyDevelopmentContext.RESEARCH);
   * ```
   *
   * @param uri - URI identifying the context.
   * @param name - human-readable label of the context; when omitted and
   *        `uri` is a value of {@link OntologyDevelopmentContext}, the
   *        official label of the context is used.
   * @param language - language tag of `name` (e.g., `"en"`).
   * @returns this builder, for method chaining.
   */
  context(uri?: string, name?: string, language?: string): ProjectBuilder {
    this._contexts.push(this.vocabularyResource(uri, name, language));
    return this;
  }

  /**
   * Adds a goal that motivated the development of the project, preferably
   * one of the values of {@link OntologyPurpose}.
   *
   * @example
   * ```typescript
   * builder.designedForTask(OntologyPurpose.CONCEPTUAL_CLARIFICATION);
   * ```
   *
   * @param uri - URI identifying the task.
   * @param name - human-readable label of the task; when omitted and `uri`
   *        is a value of {@link OntologyPurpose}, the official label of the
   *        purpose is used.
   * @param language - language tag of `name` (e.g., `"en"`).
   * @returns this builder, for method chaining.
   */
  designedForTask(
    uri?: string,
    name?: string,
    language?: string
  ): ProjectBuilder {
    this._designedForTasks.push(this.vocabularyResource(uri, name, language));
    return this;
  }

  /**
   * Adds a type classifying the project's ontology according to its
   * generality, preferably one of the values of {@link OntologyType}.
   *
   * @example
   * ```typescript
   * builder.ontologyType(OntologyType.DOMAIN);
   * ```
   *
   * @param uri - URI identifying the ontology type.
   * @param name - human-readable label of the ontology type; when omitted
   *        and `uri` is a value of {@link OntologyType}, the official label
   *        of the type is used.
   * @param language - language tag of `name` (e.g., `"en"`).
   * @returns this builder, for method chaining.
   */
  ontologyType(uri?: string, name?: string, language?: string): ProjectBuilder {
    this._ontologyTypes.push(this.vocabularyResource(uri, name, language));
    return this;
  }

  /**
   * Adds a central theme of the project, i.e., a subject domain it covers
   * (e.g., healthcare, finance).
   *
   * @param uri - URI identifying the theme.
   * @param name - human-readable label of the theme.
   * @param language - language tag of `name` (e.g., `"en"`).
   * @returns this builder, for method chaining.
   */
  theme(uri?: string, name?: string, language?: string): ProjectBuilder {
    this._themes.push(new Resource(uri, name, language));
    return this;
  }

  /**
   * Adds a bibliographic citation to a publication that documents the project.
   *
   * @param value - the citation text.
   * @param language - language tag of `value`; defaults to
   *        {@link MultilingualText.defaultLanguage}.
   * @returns this builder, for method chaining.
   */
  bibliographicCitation(
    value: string,
    language: string = MultilingualText.defaultLanguage
  ): ProjectBuilder {
    this._bibliographicCitations.push(new MultilingualText(value, language));
    return this;
  }

  /**
   * Adds a keyword describing the content of the project.
   *
   * @param value - the keyword text.
   * @param language - language tag of `value`; defaults to
   *        {@link MultilingualText.defaultLanguage}.
   * @returns this builder, for method chaining.
   */
  keyword(
    value: string,
    language: string = MultilingualText.defaultLanguage
  ): ProjectBuilder {
    this._keywords.push(new MultilingualText(value, language));
    return this;
  }

  /**
   * Adds an acronym by which the project is known (e.g., `"UFO-S"`).
   *
   * @returns this builder, for method chaining.
   */
  acronym(value: string): ProjectBuilder {
    this._acronyms.push(value);
    return this;
  }

  /**
   * Adds the URL of a web page where the project is made available.
   *
   * @returns this builder, for method chaining.
   */
  landingPage(uri: string): ProjectBuilder {
    this._landingPages.push(uri);
    return this;
  }

  /**
   * Adds a language in which the project's elements are written, identified
   * by a language tag (e.g., `"en"`, `"pt"`).
   *
   * @returns this builder, for method chaining.
   */
  language(value: string): ProjectBuilder {
    this._languages.push(value);
    return this;
  }

  /**
   * Adds the URI of a resource from which the project is derived, such as
   * another ontology or a standard.
   *
   * @returns this builder, for method chaining.
   */
  source(uri: string): ProjectBuilder {
    this._sources.push(uri);
    return this;
  }
}
