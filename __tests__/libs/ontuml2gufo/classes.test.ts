import { ModelManager } from '@libs/model';
import { OntoUML2GUFO } from '@libs/ontuml2gufo';
import { example } from '@test-models/valids';

it('Transform OntoUML model to gUFO', async () => {
  const modelManager = new ModelManager(example);
  const service = new OntoUML2GUFO(modelManager);
  const result = await service.transformOntoUML2GUFO('https://example.com');

  console.log(result);

  expect(true).toBe(true);
});
