import { ModelManager } from '@libs/model';
import { OntoUML2GUFO } from '@libs/ontouml2gufo';
import { IPackage, IOntoUML2GUFOOptions, IOntoUML2GUFOResult } from '@types';

export async function transformOntoUML2GUFO(
  model: IPackage,
  options?: Partial<IOntoUML2GUFOOptions>
): Promise<IOntoUML2GUFOResult> {
  const modelCopy = JSON.parse(JSON.stringify(model));
  const modelManager = new ModelManager(modelCopy);
  const service = new OntoUML2GUFO(modelManager);

  return await service.transformOntoUML2GUFO({
    baseIRI: 'https://example.com',
    format: 'N-Triple',
    ...options,
  });
}

it('should ignore', () => {
  expect(true).toBe(true);
});
