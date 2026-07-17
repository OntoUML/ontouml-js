import { MultilingualText, NamedElementBuilder, Project, Resource } from '..';

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

  publisher(uri?: string, name?: string, language?: string): ProjectBuilder {
    this._publisher = new Resource(uri, name, language);
    return this;
  }

  license(uri?: string, name?: string, language?: string): ProjectBuilder {
    this._license = new Resource(uri, name, language);
    return this;
  }

  representationStyle(
    uri?: string,
    name?: string,
    language?: string
  ): ProjectBuilder {
    this._representationStyle = new Resource(uri, name, language);
    return this;
  }

  namespace(uri: string): ProjectBuilder {
    this._namespace = uri;
    return this;
  }

  accessRight(uri?: string, name?: string, language?: string): ProjectBuilder {
    this._accessRights.push(new Resource(uri, name, language));
    return this;
  }

  context(uri?: string, name?: string, language?: string): ProjectBuilder {
    this._contexts.push(new Resource(uri, name, language));
    return this;
  }

  designedForTask(
    uri?: string,
    name?: string,
    language?: string
  ): ProjectBuilder {
    this._designedForTasks.push(new Resource(uri, name, language));
    return this;
  }

  ontologyType(uri?: string, name?: string, language?: string): ProjectBuilder {
    this._ontologyTypes.push(new Resource(uri, name, language));
    return this;
  }

  theme(uri?: string, name?: string, language?: string): ProjectBuilder {
    this._themes.push(new Resource(uri, name, language));
    return this;
  }

  bibliographicCitation(
    value: string,
    language: string = MultilingualText.defaultLanguage
  ): ProjectBuilder {
    this._bibliographicCitations.push(new MultilingualText(value, language));
    return this;
  }

  keyword(
    value: string,
    language: string = MultilingualText.defaultLanguage
  ): ProjectBuilder {
    this._keywords.push(new MultilingualText(value, language));
    return this;
  }

  acronym(value: string): ProjectBuilder {
    this._acronyms.push(value);
    return this;
  }

  landingPage(uri: string): ProjectBuilder {
    this._landingPages.push(uri);
    return this;
  }

  language(value: string): ProjectBuilder {
    this._languages.push(value);
    return this;
  }

  source(uri: string): ProjectBuilder {
    this._sources.push(uri);
    return this;
  }
}
