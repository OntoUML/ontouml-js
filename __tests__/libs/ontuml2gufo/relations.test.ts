import { alpinebits, partWhole, derivation } from '@test-models/valids';
import { transformOntoUML2GUFO } from './helpers';

describe('Relations', () => {
  let alpinebitsResult;
  let derivationResult;
  let partWholeResult;

  beforeAll(async () => {
    alpinebitsResult = await transformOntoUML2GUFO(alpinebits);
    derivationResult = await transformOntoUML2GUFO(derivation);
    partWholeResult = await transformOntoUML2GUFO(partWhole);
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

  it('should generate normal relation without stereotype', () => {
    const data = [
      '<:keynoteSpeaker> <rdf:type> <owl:ObjectProperty> .',
      '<:keynoteSpeaker> <rdfs:domain> <:KeynoteSpeech> .',
      '<:keynoteSpeaker> <rdfs:range> <:KeynoteSpeaker> .',
      '<:keynoteSpeaker> <rdfs:comment> "Relation URI was automatically generated." .',
      '<:KeynoteSpeech> <rdfs:subClassOf> [',
      '<rdf:type> <owl:Restriction>;',
      '<owl:onProperty> <:keynoteSpeaker>;',
      '<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;',
      '<owl:onClass> <:KeynoteSpeaker>',
      '] .',
      '<:KeynoteSpeaker> <rdfs:subClassOf> [',
      '<rdf:type> <owl:Restriction>;',
      '<owl:onProperty> [ <owl:inverseOf> <:keynoteSpeaker> ];',
      '<owl:someValuesFrom> <:KeynoteSpeech>',
      '] .',
    ];

    for (const value of data) {
      expect(partWholeResult).toContain(value);
    }
  });

  it('should generate part-whole relation without stereotype', () => {
    const data = [
      '<:isProperPartOfPerson> <rdf:type> <owl:ObjectProperty> .',
      '<:isProperPartOfPerson> <rdfs:range> <:Person> .',
      '<:isProperPartOfPerson> <rdfs:domain> <:Heart> .',
      '<:isProperPartOfPerson> <rdfs:subPropertyOf> <gufo:isProperPartOf> .',
      '<:isProperPartOfPerson> <rdfs:comment> "Relation URI was automatically generated." .',
      '<:Person> <rdfs:subClassOf> [',
      '<rdf:type> <owl:Restriction>;',
      '<owl:onProperty> [ <owl:inverseOf> <:isProperPartOfPerson> ];',
      '<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;',
      '<owl:onClass> <:Heart>',
      '] .',
      '<:Heart> <rdfs:subClassOf> [',
      '<rdf:type> <owl:Restriction>;',
      '<owl:onProperty> <:isProperPartOfPerson>;',
      '<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;',
      '<owl:onClass> <:Person>',
      '] .',
    ];

    for (const value of data) {
      expect(partWholeResult).toContain(value);
    }
  });

  it('should generate a part-whole relation between events', () => {
    const data = [
      '<:isProperPartOfConference> <rdf:type> <owl:ObjectProperty> .',
      '<:isProperPartOfConference> <rdfs:domain> <:KeynoteSpeech> .',
      '<:isProperPartOfConference> <rdfs:range> <:Conference> .',
      '<:isProperPartOfConference> <rdfs:subPropertyOf> <gufo:isEventProperPartOf> .',
      '<:isProperPartOfConference> <rdfs:comment> "Relation URI was automatically generated." .',
      '<:KeynoteSpeech> <rdfs:subClassOf> [',
      '<rdf:type> <owl:Restriction>;',
      '<owl:onProperty> <:isProperPartOfConference>;',
      '<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;',
      '<owl:onClass> <:Conference>',
      '] .',
      '<:Conference> <rdfs:subClassOf> [',
      '<rdf:type> <owl:Restriction>;',
      '<owl:onProperty> [ <owl:inverseOf> <:isProperPartOfConference> ];',
      '<owl:someValuesFrom> <:KeynoteSpeech>',
      '] .',
    ];

    for (const value of data) {
      expect(partWholeResult).toContain(value);
    }
  });

  // it('should generate derivation relation', async () => {
  //   const data = [
  //     '<:Loves> <gufo:isDerivedFrom> <:Love>',
  //     '<:HeavierThan> <gufo:isDerivedFrom> <:Weight>',
  //     '<:WorksAt> <gufo:isDerivedFrom> <:EmploymentContract>',
  //   ];

  //   for (const value of data) {
  //     expect(derivationResult).toContain(value);
  //   }
  // });
});
