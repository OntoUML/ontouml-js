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

  it('should generate attributes of datatypes classes without rdfs:subPropertyOf gufo:hasQualityValue', async () => {
    expect(result).toContain('<:lower> <rdf:type> <owl:DatatypeProperty>');
    expect(result).not.toContain(
      '<:lower> <rdfs:subPropertyOf> <gufo:hasQualityValue>',
    );
  });

  it('should generate attributes of stereotype classes with rdfs:subPropertyOf gufo:hasQualityValue', async () => {
    expect(result).toContain('<:area> <rdf:type> <owl:DatatypeProperty>');
    expect(result).toContain(
      '<:area> <rdfs:subPropertyOf> <gufo:hasQualityValue>',
    );
    expect(result).toContain('<:area> <rdfs:domain> <:GeospatialFeature>');
    expect(result).toContain('<:area> <rdfs:range> <xsd:int>');
    expect(result).toContain('<:area> <rdfs:label> "area"');
  });
});
