import { ModelManager } from '@libs/model';
import { Ontouml2Gufo } from '@libs/ontouml2gufo';

import { IPackage } from '@types';
import Options from '@libs/ontouml2gufo/options';
import Issue from '@libs/ontouml2gufo/issue';

export function generateGufo(model: IPackage, options?: Partial<Options>): string {
  // const clonedModel = JSON.parse(JSON.stringify(model));
  const modelManager = new ModelManager(model);
  const ontouml2gufo = new Ontouml2Gufo(modelManager, {
    baseIri: 'https://example.com',
    format: 'N-Triple',
    ...options
  });

  ontouml2gufo.transform();

  return ontouml2gufo.getOwlCode();
}

export function getIssues(model: IPackage, options?: Partial<Options>): Issue[] {
  // const clonedModel = JSON.parse(JSON.stringify(model));
  const modelManager = new ModelManager(model);
  const ontouml2gufo = new Ontouml2Gufo(modelManager, {
    baseIri: 'https://example.com',
    format: 'Turtle',
    ...options
  });

  ontouml2gufo.transform();

  return ontouml2gufo.getIssues();
}
