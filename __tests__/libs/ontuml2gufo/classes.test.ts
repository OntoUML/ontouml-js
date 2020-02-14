import { ModelManager } from '@libs/model';
import { OntoUML2GUFO } from '@libs/ontuml2gufo';
import { example, modePattern1, modePattern2 } from '@test-models/valids';

it('Transform OntoUML model to gUFO', async () => {
  const modelManager = new ModelManager(example);
  const service = new OntoUML2GUFO(modelManager);
  const result = await service.transformOntoUML2GUFO('https://example.com');

  expect(result.includes('owl:imports')).toBe(true);
});

it('Check OntoUML mode pattern 1 - IntrinsicMode', async () => {
  const modelManager = new ModelManager(modePattern1);
  const service = new OntoUML2GUFO(modelManager);
  const result = await service.transformOntoUML2GUFO('https://example.com');

  expect(result.includes('gufo:IntrinsicMode')).toBe(true);
});

it('Check OntoUML mode pattern 2 - ExtrinsicMode', async () => {
  const modelManager = new ModelManager(modePattern2);
  const service = new OntoUML2GUFO(modelManager);
  const result = await service.transformOntoUML2GUFO('https://example.com');

  expect(result.includes('gufo:ExtrinsicMode')).toBe(true);
});
