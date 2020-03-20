import { ModelManager } from '@libs/model';
import { OntoUML2GUFO } from '@libs/ontuml2gufo';
import { annotations } from '@test-models/valids';
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
    result = await transformOntoUML2GUFO(annotations);
  });

  it('should generate language labels on classess (testing with nl, pt, en, and it)', async () => {
    expect(result).toContain('<:Person> <rdfs:label> "Persoon"@nl');
    expect(result).toContain('<:Person> <rdfs:label> "Pessoa"@pt');
    expect(result).toContain('<:Person> <rdfs:label> "Person"@en');
    expect(result).toContain('<:Person> <rdfs:label> "Persona"@it');
  });

  it('should generate language labels on attributes (testing with nl, pt, en, and it)', async () => {
    expect(result).toContain('<:name> <rdfs:label> "naam"@nl');
    expect(result).toContain('<:name> <rdfs:label> "nome"@pt');
    expect(result).toContain('<:name> <rdfs:label> "name"@en');
    expect(result).toContain('<:name> <rdfs:label> "nome"@it');
  });

  it('should generate language labels on classess (testing with nl, pt, en, and it)', async () => {
    expect(result).toContain(
      '<:RegardsEmployee> <rdfs:label> "betreft werknemer"@nl',
    );
    expect(result).toContain(
      '<:RegardsEmployee> <rdfs:label> "de empregado"@pt',
    );
    expect(result).toContain(
      '<:RegardsEmployee> <rdfs:label> "regards employee"@en',
    );
    expect(result).toContain(
      '<:RegardsEmployee> <rdfs:label> "di dipendente"@it',
    );
  });

  it('should generate class "description" as a rdfs:comment', async () => {
    expect(result).toContain(
      '<:Person> <rdfs:comment> "This is a description of the person class."',
    );
  });

  it('should generate attribute "description" as a rdfs:comment', async () => {
    expect(result).toContain(
      '<:name> <rdfs:comment> "This is the description of the attribute name in of the person class."',
    );
  });

  it('should generate association "description" as a rdfs:comment', async () => {
    expect(result).toContain(
      '<:RegardsEmployee> <rdfs:comment> "This is the description of the <<mediation>> association between the classes employment and person."',
    );
  });
});
