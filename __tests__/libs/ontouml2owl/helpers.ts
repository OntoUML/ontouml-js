import { Project } from '@libs/ontouml';
import { Ontouml2Owl, Metadata2Owl, Metadata } from '@libs/ontouml2owl';

export function generateOwl(project: Project, baseUri: string, prefix: string, format?: string): string {
  const transformer = new Ontouml2Owl(project, baseUri, prefix, format || 'N-Triples');
  const { result } = transformer.run();
  return result;
}

export function transformMetadata(metadata: Metadata, ontologyUri: string, format?: string): string {
  const transformer = new Metadata2Owl(metadata, ontologyUri, format || 'N-Triples');
  const { result } = transformer.run();
  return result;
}
