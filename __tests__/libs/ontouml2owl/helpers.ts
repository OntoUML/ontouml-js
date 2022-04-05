import { Package, Project } from '@libs/ontouml';
import { Ontouml2Owl } from '@libs/ontouml2owl';

export function generateOwl(project: Project): string {
  const ontouml2owl = new Ontouml2Owl(project, 'http://test.com', 't');

  ontouml2owl.transform();

  return ontouml2owl.owlCode;
  // TODO: replace with static method
}
