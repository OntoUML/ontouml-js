import { alpinebits } from '@test-models/valids';
import { transformOntoUML2GUFO } from './helpers';

describe('Attributes', () => {
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
