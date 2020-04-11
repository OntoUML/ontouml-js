import { alpinebits, partWhole, derivation } from '@test-models/valids';
import { transformOntoUML2GUFO } from './helpers';

describe('Relations', () => {
  let alpinebitsResult;
  let derivationResult;
  let partWholeResult;
  let partWholeHideRelationResult;

  beforeAll(async () => {
    alpinebitsResult = await transformOntoUML2GUFO(alpinebits, {
      createInverses: true,
    });
    derivationResult = await transformOntoUML2GUFO(derivation);
    partWholeResult = await transformOntoUML2GUFO(partWhole);
    partWholeHideRelationResult = await transformOntoUML2GUFO(partWhole, {
      hideObjectPropertyCreation: true,
    });
  });

  it('should generate an uri automatically using association end', async () => {
    const data = [
      '<:isComponentOfSnowpark> <rdf:type> <owl:ObjectProperty>',
      '<:snowparkFeature> <owl:inverseOf> <:isComponentOfSnowpark>',
    ];

    for (const value of data) {
      expect(alpinebitsResult).toContain(value);
    }
  });

  it('should generate an uri automatically using stereotype', async () => {
    const data = [
      '<:organizer> <rdf:type> <owl:ObjectProperty>',
      '<:organizedEvent> <owl:inverseOf> <:organizer>',
    ];

    for (const value of data) {
      expect(alpinebitsResult).toContain(value);
    }
  });

  it('should generate a domain and range to relation', async () => {
    const data = [
      '<:organizer> <rdfs:domain> <:EventPlan>',
      '<:organizer> <rdfs:range> <:Organizer>',
      '<:organizedEvent> <rdfs:domain> <:Organizer>',
      '<:organizedEvent> <rdfs:range> <:EventPlan>',
    ];

    for (const value of data) {
      expect(alpinebitsResult).toContain(value);
    }
  });

  it('should connect a relation to gUFO stereotype', async () => {
    const data = [
      '<:organizer> <rdfs:subPropertyOf> <gufo:mediates>',
      '<:described> <rdfs:subPropertyOf> <gufo:historicallyDependsOn>',
      '<:isComponentOfSnowpark> <rdfs:subPropertyOf> <gufo:isComponentOf>',
      '<:geospatialFeature> <rdfs:subPropertyOf> <gufo:inheresIn>',
    ];

    for (const value of data) {
      expect(alpinebitsResult).toContain(value);
    }
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
      `<:EventPlan> <rdfs:subClassOf> [
        <rdf:type> <owl:Restriction>;
        <owl:onProperty> <:organizer>;
        <owl:someValuesFrom> <:Organizer>
      ] .`.replace(/ {6}/gm, ''),
    );
  });

  it('should generate a cardinality restriction of 0..1', () => {
    expect(alpinebitsResult).toContain(
      `<:EventPlan> <rdfs:subClassOf> [
        <rdf:type> <owl:Restriction>;
        <owl:onProperty> <:eventSeries>;
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
      '<:isProperPartOfPerson> <rdfs:subPropertyOf> <gufo:isObjectProperPartOf> .',
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

  it('should generate a part-whole relation between aspects', () => {
    const data = [
      '<:isProperPartOfKeynoteAgreement> <rdf:type> <owl:ObjectProperty> .',
      '<:isProperPartOfKeynoteAgreement> <rdfs:domain> <:KeynoteSpeakerCommitment> .',
      '<:isProperPartOfKeynoteAgreement> <rdfs:range> <:KeynoteAgreement> .',
      '<:isProperPartOfKeynoteAgreement> <rdfs:subPropertyOf> <gufo:isAspectProperPartOf> .',
      '<:KeynoteSpeakerCommitment> <rdfs:subClassOf> [',
      '<rdf:type> <owl:Restriction>;',
      '<owl:onProperty> <:isProperPartOfKeynoteAgreement>;',
      '<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;',
      '<owl:onClass> <:KeynoteAgreement>',
      '] .',
      '<:KeynoteAgreement> <rdfs:subClassOf> [',
      '<rdf:type> <owl:Restriction>;',
      '<owl:onProperty> [ <owl:inverseOf> <:isProperPartOfKeynoteAgreement> ];',
      '<owl:someValuesFrom> <:KeynoteSpeakerCommitment>',
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

  it('should generate derivation relation', async () => {
    const data = [
      '<:Loves> <gufo:isDerivedFrom> <:Love>',
      '<:HeavierThan> <gufo:isDerivedFrom> <:Weight>',
      '<:WorksAt> <gufo:isDerivedFrom> <:EmploymentContract>',
    ];

    for (const value of data) {
      expect(derivationResult).toContain(value);
    }
  });

  it('should hide object property creation', async () => {
    const data = [
      '<:inheresInKeynoteSpeaker> <rdf:type> <owl:ObjectProperty>',
      '<owl:onProperty> <:inheresInKeynoteSpeaker>',
      '<:mediatesKeynoteSpeaker> <rdf:type> <owl:ObjectProperty>',
      '<owl:onProperty> <:mediatesKeynoteSpeaker>',
      '<:historicallyDependsOnKeynoteInvitation> <rdf:type> <owl:ObjectProperty>',
      '<owl:onProperty> <:historicallyDependsOnKeynoteInvitation>',
    ];

    for (const value of data) {
      expect(partWholeResult).toContain(value);
      expect(partWholeHideRelationResult).not.toContain(value);
    }
  });

  it('should create cardinality restriction with gufo property', async () => {
    const data = [
      '<owl:onProperty> <gufo:inheresIn>',
      '<owl:inverseOf> <gufo:inheresIn>',
      '<owl:onProperty> <gufo:mediates>',
      '<owl:inverseOf> <gufo:mediates>',
      '<owl:onProperty> <gufo:historicallyDependsOn>',
    ];

    for (const value of data) {
      expect(partWholeHideRelationResult).toContain(value);
    }
  });
});
