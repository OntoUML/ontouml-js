import { Project, ProjectBuilder } from '../../src';

describe('Project builder tests', () => {
  it('should build a project with an id, a name, and a description', () => {
    const proj = new ProjectBuilder()
      .id('my-project')
      .name('My Project')
      .description('A very nice project.')
      .build();

    expect(proj).toBeInstanceOf(Project);
    expect(proj.id).toEqual('my-project');
    expect(proj.name.get()).toEqual('My Project');
    expect(proj.description.get()).toEqual('A very nice project.');
  });

  it('should be accessible through Project.builder()', () => {
    expect(Project.builder()).toBeInstanceOf(ProjectBuilder);
    expect(Project.builder().build()).toBeInstanceOf(Project);
  });

  it('should build a project with resource-valued metadata', () => {
    const proj = new ProjectBuilder()
      .publisher('https://example.org/publisher', 'Example Publisher')
      .license('https://creativecommons.org/licenses/by/4.0/', 'CC BY 4.0')
      .representationStyle(
        'https://w3id.org/ontouml-models/vocabulary#OntoumlStyle'
      )
      .accessRight(
        'http://publications.europa.eu/resource/authority/access-right/PUBLIC'
      )
      .context('https://w3id.org/ontouml-models/vocabulary#Research')
      .designedForTask(
        'https://w3id.org/ontouml-models/vocabulary#ConceptualClarification'
      )
      .ontologyType('https://w3id.org/ontouml-models/vocabulary#Domain')
      .theme('https://example.org/lcc/S', 'Class S - Agriculture')
      .build();

    expect(proj.publisher?.uri).toEqual('https://example.org/publisher');
    expect(proj.publisher?.name.get()).toEqual('Example Publisher');
    expect(proj.license?.name.get()).toEqual('CC BY 4.0');
    expect(proj.representationStyle?.uri).toContain('OntoumlStyle');
    expect(proj.accessRights).toHaveLength(1);
    expect(proj.contexts).toHaveLength(1);
    expect(proj.designedForTasks).toHaveLength(1);
    expect(proj.ontologyTypes).toHaveLength(1);
    expect(proj.themes[0].name.get()).toEqual('Class S - Agriculture');
  });

  it('should build a project with string- and text-valued metadata', () => {
    const proj = new ProjectBuilder()
      .namespace('https://example.org/my-project#')
      .landingPage('https://www.model-a-platform.com')
      .source('https://doi.org/10.3233/AO-150150')
      .acronym('MP')
      .language('en')
      .language('pt')
      .keyword('testing', 'en')
      .keyword('teste', 'pt')
      .bibliographicCitation('Someone (2021). A very nice project.')
      .build();

    expect(proj.namespace).toEqual('https://example.org/my-project#');
    expect(proj.landingPages).toEqual(['https://www.model-a-platform.com']);
    expect(proj.sources).toEqual(['https://doi.org/10.3233/AO-150150']);
    expect(proj.acronyms).toEqual(['MP']);
    expect(proj.languages).toEqual(['en', 'pt']);
    expect(proj.keywords).toHaveLength(2);
    expect(proj.keywords[0].get('en')).toEqual('testing');
    expect(proj.bibliographicCitations).toHaveLength(1);
  });

  it('should build a project with creators and contributors', () => {
    const proj = new ProjectBuilder()
      .creator('https://orcid.org/0000-0001', 'Alice')
      .creator('https://orcid.org/0000-0002', 'Bob')
      .contributor('https://orcid.org/0000-0003', 'Carol')
      .alternativeName('The Nice Project')
      .editorialNote('Still under development.')
      .build();

    expect(proj.creators).toHaveLength(2);
    expect(proj.creators.map(c => c.name.get())).toEqual(['Alice', 'Bob']);
    expect(proj.contributors).toHaveLength(1);
    expect(proj.contributors[0].uri).toEqual('https://orcid.org/0000-0003');
    expect(proj.alternativeNames).toHaveLength(1);
    expect(proj.alternativeNames[0].get()).toEqual('The Nice Project');
    expect(proj.editorialNotes).toHaveLength(1);
  });

  it('built projects should support building contents', () => {
    const proj = new ProjectBuilder().name('My Project').build();
    const person = proj.classBuilder().kind().name('Person').build();

    expect(proj.classes).toEqual([person]);
    expect(person.project).toBe(proj);
  });
});
