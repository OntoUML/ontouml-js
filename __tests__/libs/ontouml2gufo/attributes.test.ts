import { alpinebits as alpinebitsModel } from '@test-models/valids';
import { transformOntoUML2GUFO } from './helpers';

describe('Attributes', () => {
  let alpinebits;
  let alpinebitsCustomLabel;

  beforeAll(async () => {
    alpinebits = (await transformOntoUML2GUFO(alpinebitsModel)).model;
    alpinebitsCustomLabel = (await transformOntoUML2GUFO(alpinebitsModel, {
      createInverses: true,
      customElementMapping: {
        capacity: { uri: 'owlCapacity' },
        tZNlFRaGAqCsIBOU: { uri: 'owlArea' },
        '3x40WRaGAqCsIB4X': { uri: 'hasTrail', label: { en: 'hasLabel' } },
      },
    })).model;
  });

  it('should generate "capacity" as an int DatatypeProperty', async () => {
    expect(alpinebits).toContain(
      '<:capacity> <rdf:type> <owl:DatatypeProperty>',
    );
    expect(alpinebits).toContain(
      '<:capacity> <rdfs:subPropertyOf> <gufo:hasQualityValue>',
    );
    expect(alpinebits).toContain('<:capacity> <rdfs:domain> <:EventPlan>');
    expect(alpinebits).toContain('<:capacity> <rdfs:range> <xsd:int>');
    expect(alpinebits).toContain('<:capacity> <rdfs:label> "capacity"');
  });

  it('should generate "description" as a string DatatypeProperty', async () => {
    expect(alpinebits).toContain(
      '<:description> <rdf:type> <owl:DatatypeProperty>',
    );
    expect(alpinebits).toContain(
      '<:description> <rdfs:subPropertyOf> <gufo:hasQualityValue>',
    );
    expect(alpinebits).toContain(
      '<:description> <rdfs:domain> <:NamedIndividual>',
    );
    expect(alpinebits).toContain('<:description> <rdfs:range> <xsd:string>');
    expect(alpinebits).toContain('<:description> <rdfs:label> "description"');
  });

  it('should generate attributes of datatypes classes without rdfs:subPropertyOf gufo:hasQualityValue', async () => {
    expect(alpinebits).toContain('<:lower> <rdf:type> <owl:DatatypeProperty>');
    expect(alpinebits).not.toContain(
      '<:lower> <rdfs:subPropertyOf> <gufo:hasQualityValue>',
    );
  });

  it('should generate attributes of stereotype classes with rdfs:subPropertyOf gufo:hasQualityValue', async () => {
    expect(alpinebits).toContain('<:area> <rdf:type> <owl:DatatypeProperty>');
    expect(alpinebits).toContain(
      '<:area> <rdfs:subPropertyOf> <gufo:hasQualityValue>',
    );
    expect(alpinebits).toContain('<:area> <rdfs:domain> <:GeospatialFeature>');
    expect(alpinebits).toContain('<:area> <rdfs:range> <xsd:int>');
    expect(alpinebits).toContain('<:area> <rdfs:label> "area"');
  });

  it('should generate custom labels', async () => {
    const data = [
      '<:owlCapacity> <rdf:type> <owl:DatatypeProperty>',
      '<:owlArea> <rdf:type> <owl:DatatypeProperty>',
      '<:hasTrail> <rdf:type> <owl:ObjectProperty>',
      '<:hasTrail> <rdfs:label> "hasLabel"@en',
    ];

    for (const value of data) {
      expect(alpinebitsCustomLabel).toContain(value);
    }
  });
});
