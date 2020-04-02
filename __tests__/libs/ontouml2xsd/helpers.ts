import { ModelManager } from '@libs/model';
import { OntoUML2XSD } from '@libs/ontouml2xsd';
import { IPackage } from '@types';

export function transformOntoUML2XSD(model: IPackage): string {
  const modelCopy = JSON.parse(JSON.stringify(model));
  const modelManager = new ModelManager(modelCopy);
  const service = new OntoUML2XSD(modelManager);

  return service.transformOntoUML2XSD();
}

it('should ignore', () => {
  expect(true).toBe(true);
});
