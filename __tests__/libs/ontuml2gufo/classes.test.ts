import { ModelManager } from '@libs/model';
import { OntoUML2GUFO } from '@libs/ontuml2gufo';
import {
  genericExample1,
  modeExample1,
  modeExample2,
} from '@test-models/valids';
import { IPackage } from '@types';

async function transformOntoUML2GUFO(
  model: IPackage,
  format?: string,
): Promise<string> {
  const modelManager = new ModelManager(model);
  const service = new OntoUML2GUFO(modelManager);

  return await service.transformOntoUML2GUFO({
    baseIRI: 'https://example.com',
    format: format || 'N-Triple',
  });
}

it('should transform OntoUML generic model to gUFO', async () => {
  const result = await transformOntoUML2GUFO(genericExample1, 'Turtle');

  expect(result).toMatchSnapshot();
});

it('should transform OntoUML <<mode>> class as IntrinsicMode', async () => {
  const result = await transformOntoUML2GUFO(modeExample1);

  expect(result).toMatchSnapshot();

  expect(result).toContain('<:qJdeWA6AUB0UtAWm> <rdf:type> <owl:Class>');
  expect(result).toContain(
    '<:qJdeWA6AUB0UtAWm> <rdf:type> <owl:NamedIndividual>',
  );
  expect(result).toContain('<:qJdeWA6AUB0UtAWm> <rdfs:label> "Headache" .');
  expect(result).toContain(
    '<:qJdeWA6AUB0UtAWm> <rdfs:subClassOf> <gufo:IntrinsicMode>',
  );
  expect(result).toContain('<:qJdeWA6AUB0UtAWm> <rdf:type> <gufo:Kind>');
});

it('should transform OntoUML <<mode>> class as ExtrinsicMode', async () => {
  const result = await transformOntoUML2GUFO(modeExample2);

  expect(result).toMatchSnapshot();

  expect(result).toContain('<:qJdeWA6AUB0UtAWm> <rdf:type> <owl:Class>');
  expect(result).toContain(
    '<:qJdeWA6AUB0UtAWm> <rdf:type> <owl:NamedIndividual>',
  );
  expect(result).toContain('<:qJdeWA6AUB0UtAWm> <rdfs:label> "Love" .');
  expect(result).toContain(
    '<:qJdeWA6AUB0UtAWm> <rdfs:subClassOf> <gufo:ExtrinsicMode>',
  );
  expect(result).toContain('<:qJdeWA6AUB0UtAWm> <rdf:type> <gufo:Kind>');
});
