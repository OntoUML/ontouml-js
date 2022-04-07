import { Project } from '@libs/ontouml';
import { Ontouml2Owl } from '@libs/ontouml2owl';

export function generateOwl(project: Project, baseUri: string, prefix: string, format?: string): string {
  const ontouml2owl = new Ontouml2Owl(project, baseUri, prefix, format || 'N-Triples');
  const { result } = ontouml2owl.run();
  return result;
}
