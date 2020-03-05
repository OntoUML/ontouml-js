import { ModelManager } from '@libs/model';
import { OntoUML2GUFO } from '@libs/ontuml2gufo';
import { alpinebits } from '@test-models/valids';
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
    result = await transformOntoUML2GUFO(alpinebits);
  });

  it('should generate "capacity" as an int DatatypeProperty', async () => {
    expect(result).toContain('<:capacity> <rdf:type> <owl:DatatypeProperty>');
    expect(result).toContain(
      '<:capacity> <rdfs:subPropertyOf> <gufo:hasQualityValue>',
    );
    expect(result).toContain('<:capacity> <rdfs:domain> <:EventPlan>');
    expect(result).toContain('<:capacity> <rdfs:range> <xsd:int>');
    expect(result).toContain('<:capacity> <rdfs:label> "capacity"');
  });

  it('should generate "description" as a string DatatypeProperty', async () => {
    expect(result).toContain(
      '<:description> <rdf:type> <owl:DatatypeProperty>',
    );
    expect(result).toContain(
      '<:description> <rdfs:subPropertyOf> <gufo:hasQualityValue>',
    );
    expect(result).toContain('<:description> <rdfs:domain> <:NamedIndividual>');
    expect(result).toContain('<:description> <rdfs:range> <xsd:string>');
    expect(result).toContain('<:description> <rdfs:label> "description"');
  });
});
