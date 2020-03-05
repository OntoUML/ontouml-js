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

  it('should generate an uri automatically using association end', async () => {
    expect(result).toContain(
      '<:isComponentOfSnowpark> <rdf:type> <owl:ObjectProperty>',
    );
  });

  it('should generate an uri automatically using stereotype', async () => {
    expect(result).toContain('<:organizers> <rdf:type> <owl:ObjectProperty>');
  });

  it('should generate a domain and range to relation', async () => {
    expect(result).toContain('<:organizers> <rdfs:domain> <:EventPlan>');
    expect(result).toContain('<:organizers> <rdfs:range> <:Organizer>');
  });

  it('should connect a relation to gUFO stereotype', async () => {
    expect(result).toContain(
      '<:organizers> <rdfs:subPropertyOf> <gufo:mediates>',
    );
    expect(result).toContain(
      '<:described> <rdfs:subPropertyOf> <gufo:historicallyDependsOn>',
    );
    expect(result).toContain(
      '<:categorizesEventPlan> <rdfs:subPropertyOf> <gufo:categorizes>',
    );
    expect(result).toContain(
      '<:isComponentOfSnowpark> <rdfs:subPropertyOf> <gufo:isComponentOf>',
    );
    expect(result).toContain(
      '<:inheresInGeospatialFeature> <rdfs:subPropertyOf> <gufo:inheresIn>',
    );
  });

  it('should generate a cardinality restriction of 2..*', async () => {
    expect(result).toContain(
      `<:CompositeArea> <rdfs:subClassOf> [
        <rdf:type> <owl:Restriction>;
        <owl:onProperty> <:subareas>;
        <owl:minQualifiedCardinality> "2"^^<xsd:nonNegativeInteger>;
        <owl:onClass> <:MountainArea>
      ] .`.replace(/ {6}/gm, ''),
    );
  });

  it('should generate a cardinality restriction of 1..*', async () => {
    expect(result).toContain(
      `<:MountainArea> <rdfs:subClassOf> [
        <rdf:type> <owl:Restriction>;
        <owl:onProperty> <:areaowner>;
        <owl:someValuesFrom> <:AreaOwner>
      ] .`.replace(/ {6}/gm, ''),
    );
  });

  it('should generate a cardinality restriction of 0..1', () => {
    expect(result).toContain(
      `<:EventPlan> <rdfs:subClassOf> [
        <rdf:type> <owl:Restriction>;
        <owl:onProperty> <:eventseries>;
        <owl:maxQualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;
        <owl:onClass> <:EventSeries>
      ] .`.replace(/ {6}/gm, ''),
    );
  });
});
