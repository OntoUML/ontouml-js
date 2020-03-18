import * as fs from 'fs';
import { ModelManager } from '@libs/model';
import { OntoUML2GUFO } from '@libs/ontuml2gufo';
import { alpinebits, partWhole } from '@test-models/valids';
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
  let alpinebitsResult;
  let partWholeResult;

  beforeAll(async () => {
    alpinebitsResult = await transformOntoUML2GUFO(alpinebits);
    partWholeResult = await transformOntoUML2GUFO(partWhole);

    const partWholeResultTTL = await transformOntoUML2GUFO(partWhole, {
      format: 'Turtle',
    });

    fs.writeFileSync(
      '__tests__/libs/ontuml2gufo/examples/partWhole.ttl',
      partWholeResultTTL,
    );
  });

  it('should generate an uri automatically using association end', async () => {
    expect(alpinebitsResult).toContain(
      '<:isComponentOfSnowpark> <rdf:type> <owl:ObjectProperty>',
    );
  });

  it('should generate an uri automatically using stereotype', async () => {
    expect(alpinebitsResult).toContain(
      '<:organizers> <rdf:type> <owl:ObjectProperty>',
    );
  });

  it('should generate a domain and range to relation', async () => {
    expect(alpinebitsResult).toContain(
      '<:organizers> <rdfs:domain> <:EventPlan>',
    );
    expect(alpinebitsResult).toContain(
      '<:organizers> <rdfs:range> <:Organizer>',
    );
  });

  it('should connect a relation to gUFO stereotype', async () => {
    expect(alpinebitsResult).toContain(
      '<:organizers> <rdfs:subPropertyOf> <gufo:mediates>',
    );
    expect(alpinebitsResult).toContain(
      '<:described> <rdfs:subPropertyOf> <gufo:historicallyDependsOn>',
    );
    expect(alpinebitsResult).toContain(
      '<:isComponentOfSnowpark> <rdfs:subPropertyOf> <gufo:isComponentOf>',
    );
    expect(alpinebitsResult).toContain(
      '<:inheresInGeospatialFeature> <rdfs:subPropertyOf> <gufo:inheresIn>',
    );
  });

  it('should generate a cardinality restriction of 2..*', async () => {
    expect(alpinebitsResult).toContain(
      `<:CompositeArea> <rdfs:subClassOf> [
        <rdf:type> <owl:Restriction>;
        <owl:onProperty> [ <owl:inverseOf> <:isComponentOfCompositeArea> ];
        <owl:minQualifiedCardinality> "2"^^<xsd:nonNegativeInteger>;
        <owl:onClass> <:MountainArea>
      ] .`.replace(/ {6}/gm, ''),
    );
  });

  it('should generate a cardinality restriction of 1..*', async () => {
    expect(alpinebitsResult).toContain(
      `<:MountainArea> <rdfs:subClassOf> [
        <rdf:type> <owl:Restriction>;
        <owl:onProperty> <:areaowner>;
        <owl:someValuesFrom> <:AreaOwner>
      ] .`.replace(/ {6}/gm, ''),
    );
  });

  it('should generate a cardinality restriction of 0..1', () => {
    expect(alpinebitsResult).toContain(
      `<:EventPlan> <rdfs:subClassOf> [
        <rdf:type> <owl:Restriction>;
        <owl:onProperty> <:eventseries>;
        <owl:maxQualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;
        <owl:onClass> <:EventSeries>
      ] .`.replace(/ {6}/gm, ''),
    );
  });

  it('should generate part-whole relation with without stereotype', () => {
    expect(partWholeResult).toContain(
      '<:isProperPartOfPerson> <rdfs:domain> <:Heart>',
    );
    expect(partWholeResult).toContain(
      '<:isProperPartOfPerson> <rdfs:range> <:Person>',
    );
    expect(partWholeResult).toContain(
      '<:isProperPartOfPerson> <rdfs:subPropertyOf> <gufo:isProperPartOf>',
    );
  });

  it('should generate a part-whole relation between events', () => {
    expect(partWholeResult).toContain(
      '<:isProperPartOfConference> <rdfs:domain> <:KeynoteSpeech>',
    );
    expect(partWholeResult).toContain(
      '<:isProperPartOfConference> <rdfs:range> <:Conference>',
    );
    expect(partWholeResult).toContain(
      '<:isProperPartOfConference> <rdfs:subPropertyOf> <gufo:isEventProperPartOf>',
    );
  });
});
