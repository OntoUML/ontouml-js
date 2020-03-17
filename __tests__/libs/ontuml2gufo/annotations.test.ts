import { ModelManager } from '@libs/model';
import { OntoUML2GUFO } from '@libs/ontuml2gufo';
import { istandard } from '@test-models/valids';
import { IPackage, IOntoUML2GUFOOptions } from '@types';

async function transformOntoUML2GUFO(
  model: IPackage,
  options?: {
    format?: IOntoUML2GUFOOptions['format'];
    uriFormatBy?: IOntoUML2GUFOOptions['uriFormatBy'];
  },
): Promise<string> {
  const modelCopy = JSON.parse(JSON.stringify(model));
  const modelManager = new ModelManager(modelCopy);
  const service = new OntoUML2GUFO(modelManager);

  return await service.transformOntoUML2GUFO({
    baseIRI: 'https://example.com',
    format: 'N-Triple',
    ...options,
  });
}

describe('Relations', () => {
  let result;

  beforeAll(async () => {
    result = await transformOntoUML2GUFO(istandard);
  });

  it('should generate "nl" label', async () => {
    expect(result).toContain('<:LegalGender> <rdfs:label> "Geslacht"@nl');
  });

  it('should generate "description" as a rdfs:comment', async () => {
    expect(result).toContain(
      '<:LegalGender> <rdfs:comment> "Gender of a person as registered in the civil registration."',
    );
  });
});
