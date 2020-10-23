import { ModelManager } from '@libs/model';
import { Ontouml2Gufo } from '@libs/ontouml2gufo';

import { IPackage } from '@types';
import Options from '@libs/ontouml2gufo/options';
import Issue from '@libs/ontouml2gufo/issue';
import UriManager from '@libs/ontouml2gufo/uri_manager';

export function generateGufo(model: IPackage, options?: Partial<Options>): string {
  const modelManager = new ModelManager(model);
  const ontouml2gufo = new Ontouml2Gufo(modelManager, {
    baseIri: 'https://example.com',
    format: 'N-Triple',
    ...options
  });

  ontouml2gufo.transform();

  return ontouml2gufo.getOwlCode();
  // TODO: replace with static method
}

export function getIssues(model: IPackage, options?: Partial<Options>): Issue[] {
  const modelManager = new ModelManager(model);
  const ontouml2gufo = new Ontouml2Gufo(modelManager, {
    baseIri: 'https://example.com',
    format: 'Turtle',
    ...options
  });

  ontouml2gufo.transform();

  return ontouml2gufo.getIssues();
}

export function getUriManager(model: IPackage, options?: Partial<Options>): UriManager {
  const modelManager = new ModelManager(model);
  const ontouml2gufo = new Ontouml2Gufo(modelManager, {
    baseIri: 'https://example.com',
    format: 'Turtle',
    ...options
  });

  return ontouml2gufo.uriManager;
}
