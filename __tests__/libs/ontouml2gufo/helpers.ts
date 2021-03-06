import { Package, Project } from '@libs/ontouml';
import { Ontouml2Gufo, Ontouml2GufoOptions, Issue, UriManager } from '@libs/ontouml2gufo';

export function generateGufo(modelOrProject: Package | Project, options?: Partial<Ontouml2GufoOptions>): string {
  const optionsWithDefaults = {
    baseIri: 'https://example.com',
    format: 'N-Triple',
    ...options
  };
  const ontouml2gufo = new Ontouml2Gufo(modelOrProject, optionsWithDefaults);

  ontouml2gufo.transform();

  return ontouml2gufo.getOwlCode();
  // TODO: replace with static method
}

export function getIssues(modelOrProject: Package | Project, options?: Partial<Ontouml2GufoOptions>): Issue[] {
  const optionsWithDefaults = {
    baseIri: 'https://example.com',
    format: 'Turtle',
    ...options
  };
  const ontouml2gufo = new Ontouml2Gufo(modelOrProject, optionsWithDefaults);

  ontouml2gufo.transform();

  return ontouml2gufo.getIssues();
}

export function getUriManager(modelOrProject: Package | Project, options?: Partial<Ontouml2GufoOptions>): UriManager {
  const optionsWithDefaults = {
    baseIri: 'https://example.com',
    format: 'Turtle',
    ...options
  };
  const ontouml2gufo = new Ontouml2Gufo(modelOrProject, optionsWithDefaults);

  return ontouml2gufo.uriManager;
}
