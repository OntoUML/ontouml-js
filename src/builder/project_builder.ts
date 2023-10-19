import { NamedElement, NamedElementBuilder, Project } from '..';

export abstract class ProjectBuilder extends NamedElementBuilder<ProjectBuilder> {
  protected override element?: Project;

  private _publisher?: string;
  private _designedForTasks: string[] = [];
  private _license?: string;
  private _accessRights: string[] = [];
  private _themes: string[] = [];
  private _contexts: string[] = [];
  private _ontologyTypes: string[] = [];
  private _representationStyle?: string;
  private _namespace?: string;
  private _landingPages: string[] = [];
  private _sources: string[] = [];
  private _bibliographicCitations: string[] = [];
  private _keywords: string[] = [];
  private _acronyms: string[] = [];
  private _languages: string[] = [];

  override build(): Project {
    this.element = new Project();
    super.build();

    return this.element;
  }

  publisher(uri: string): ProjectBuilder {
    return this;
  }
}
