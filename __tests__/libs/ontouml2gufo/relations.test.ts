import { RelationStereotype } from '@constants/.';
import { generateGufo, OntoumlFactory } from './helpers';

describe('Relations', () => {
  let owlCode;

  describe("For a «material» relation 'owns' from «kind» Person to «kind» Car", () => {
    beforeAll(() => {
      const personClass = OntoumlFactory.createKind('Person');
      const carClass = OntoumlFactory.createKind('Car');
      const relation = OntoumlFactory.createRelation('owns', RelationStereotype.MATERIAL, personClass, carClass);
      const model = OntoumlFactory.createPackage('Model', [personClass, carClass, relation]);
      owlCode = generateGufo(model);
    });

    it('should generate an object property', () => {
      expect(owlCode).toContain('<:owns> <rdf:type> <owl:ObjectProperty>');
    });

    it('should generate a domain axiom', () => {
      expect(owlCode).toContain('<:owns> <rdfs:domain> <:Person>');
    });

    it('should generate a range axiom', () => {
      expect(owlCode).toContain('<:owns> <rdfs:range> <:Car>');
    });
  });

  describe('OntoUML stereotype to gufo property mapping ', () => {
    it('«material» to gufo:MaterialRelationshipType', () => {
      const _class = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('knows', RelationStereotype.MATERIAL, _class, _class);
      const model = OntoumlFactory.createPackage('Model', [_class, relation]);

      owlCode = generateGufo(model);
      expect(owlCode).toContain('<:knows> <rdf:type> <gufo:MaterialRelationshipType>');
    });

    it('«comparative» to gufo:ComparativeRelationshipType', () => {
      const _class = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('heavierThan', RelationStereotype.COMPARATIVE, _class, _class);
      const model = OntoumlFactory.createPackage('Model', [_class, relation]);

      owlCode = generateGufo(model);
      expect(owlCode).toContain('<:heavierThan> <rdf:type> <gufo:ComparativeRelationshipType>');
    });

    it('«comparative» to gufo:ComparativeRelationshipType', () => {
      const class1 = OntoumlFactory.createEvent('Car Accident');
      const class2 = OntoumlFactory.createSituation('Dangerous Situation');
      const relation = OntoumlFactory.createRelation('ledTo', RelationStereotype.BRINGS_ABOUT, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      owlCode = generateGufo(model);
      expect(owlCode).toContain('<:ledTo> <rdf:type> <gufo:ComparativeRelationshipType>');
    });
  });
});

// it('should connect a relation to gUFO stereotype', () => {
//   const data = [
//     '<:organizer> <rdfs:subPropertyOf> <gufo:mediates>',
//     '<:depicted> <rdfs:subPropertyOf> <gufo:historicallyDependsOn>',
//     '<:snowparkContainer> <rdfs:subPropertyOf> <gufo:isComponentOf>',
//     '<:feature> <rdfs:subPropertyOf> <gufo:inheresIn>'
//   ];

//   for (const value of data) {
//     expect(alpinebits).toContain(value);
//   }
// });

// it('should generate a cardinality restriction of 2..*', () => {
//   expect(alpinebits).toContain(
//     `<:CompositeArea> <rdfs:subClassOf> [
//       <rdf:type> <owl:Restriction>;
//       <owl:onProperty> [ <owl:inverseOf> <:superArea> ];
//       <owl:minQualifiedCardinality> "2"^^<xsd:nonNegativeInteger>;
//       <owl:onClass> <:MountainArea>
//     ] .`.replace(/ {6}/gm, '')
//   );
// });

// it('should generate a cardinality restriction of 1..*', () => {
//   expect(alpinebits).toContain(
//     `<:EventPlan> <rdfs:subClassOf> [
//       <rdf:type> <owl:Restriction>;
//       <owl:onProperty> <:organizer>;
//       <owl:someValuesFrom> <:Organizer>
//     ] .`.replace(/ {6}/gm, '')
//   );
// });

// it('should generate a cardinality restriction of 0..1', () => {
//   expect(alpinebits).toContain(
//     `<:EventPlan> <rdfs:subClassOf> [
//       <rdf:type> <owl:Restriction>;
//       <owl:onProperty> <:eventSeries>;
//       <owl:maxQualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;
//       <owl:onClass> <:EventSeries>
//     ] .`.replace(/ {6}/gm, '')
//   );
// });

// it('should generate normal relation without stereotype', () => {
//   const data = [
//     '<:keynoteSpeaker> <rdf:type> <owl:ObjectProperty> .',
//     '<:keynoteSpeaker> <rdfs:domain> <:KeynoteSpeech> .',
//     '<:keynoteSpeaker> <rdfs:range> <:KeynoteSpeaker> .',
//     '<:keynoteSpeaker> <rdfs:comment> "Relation URI was automatically generated." .',
//     '<:KeynoteSpeech> <rdfs:subClassOf> [',
//     '<rdf:type> <owl:Restriction>;',
//     '<owl:onProperty> <:keynoteSpeaker>;',
//     '<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;',
//     '<owl:onClass> <:KeynoteSpeaker>',
//     '] .',
//     '<:KeynoteSpeech> <rdfs:subClassOf> [',
//     '<rdf:type> <owl:Restriction>;',
//     '<owl:onProperty> <:keynoteSpeaker>;',
//     '<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;',
//     '<owl:onClass> <:KeynoteSpeaker>',
//     '] .'
//   ];

//   for (const value of data) {
//     expect(partWhole).toContain(value);
//   }
// });

// it('should generate part-whole relation without stereotype', () => {
//   const data = [
//     '<:isProperPartOfPerson> <rdf:type> <owl:ObjectProperty> .',
//     '<:isProperPartOfPerson> <rdfs:range> <:Person> .',
//     '<:isProperPartOfPerson> <rdfs:domain> <:Heart> .',
//     '<:isProperPartOfPerson> <rdfs:subPropertyOf> <gufo:isObjectProperPartOf> .',
//     '<:isProperPartOfPerson> <rdfs:comment> "Relation URI was automatically generated." .',
//     '<:Person> <rdfs:subClassOf> [',
//     '<rdf:type> <owl:Restriction>;',
//     '<owl:onProperty> [ <owl:inverseOf> <:isProperPartOfPerson> ];',
//     '<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;',
//     '<owl:onClass> <:Heart>',
//     '] .',
//     '<:Heart> <rdfs:subClassOf> [',
//     '<rdf:type> <owl:Restriction>;',
//     '<owl:onProperty> <:isProperPartOfPerson>;',
//     '<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;',
//     '<owl:onClass> <:Person>',
//     '] .'
//   ];

//   for (const value of data) {
//     expect(partWhole).toContain(value);
//   }
// });

// it('should generate a part-whole relation between aspects', () => {
//   const data = [
//     '<:isProperPartOfKeynoteAgreement> <rdf:type> <owl:ObjectProperty> .',
//     '<:isProperPartOfKeynoteAgreement> <rdfs:domain> <:KeynoteSpeakerCommitment> .',
//     '<:isProperPartOfKeynoteAgreement> <rdfs:range> <:KeynoteAgreement> .',
//     '<:isProperPartOfKeynoteAgreement> <rdfs:subPropertyOf> <gufo:isAspectProperPartOf> .',
//     '<:KeynoteSpeakerCommitment> <rdfs:subClassOf> [',
//     '<rdf:type> <owl:Restriction>;',
//     '<owl:onProperty> <:isProperPartOfKeynoteAgreement>;',
//     '<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;',
//     '<owl:onClass> <:KeynoteAgreement>',
//     '] .',
//     '<:KeynoteAgreement> <rdfs:subClassOf> [',
//     '<rdf:type> <owl:Restriction>;',
//     '<owl:onProperty> [ <owl:inverseOf> <:isProperPartOfKeynoteAgreement> ];',
//     '<owl:someValuesFrom> <:KeynoteSpeakerCommitment>',
//     '] .'
//   ];

//   for (const value of data) {
//     expect(partWhole).toContain(value);
//   }
// });

// it('should generate a part-whole relation between events', () => {
//   const data = [
//     '<:isProperPartOfConference> <rdf:type> <owl:ObjectProperty> .',
//     '<:isProperPartOfConference> <rdfs:domain> <:KeynoteSpeech> .',
//     '<:isProperPartOfConference> <rdfs:range> <:Conference> .',
//     '<:isProperPartOfConference> <rdfs:subPropertyOf> <gufo:isEventProperPartOf> .',
//     '<:isProperPartOfConference> <rdfs:comment> "Relation URI was automatically generated." .',
//     '<:KeynoteSpeech> <rdfs:subClassOf> [',
//     '<rdf:type> <owl:Restriction>;',
//     '<owl:onProperty> <:isProperPartOfConference>;',
//     '<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;',
//     '<owl:onClass> <:Conference>',
//     '] .',
//     '<:Conference> <rdfs:subClassOf> [',
//     '<rdf:type> <owl:Restriction>;',
//     '<owl:onProperty> [ <owl:inverseOf> <:isProperPartOfConference> ];',
//     '<owl:someValuesFrom> <:KeynoteSpeech>',
//     '] .'
//   ];

//   for (const value of data) {
//     expect(partWhole).toContain(value);
//   }
// });

// it('should generate derivation relation', () => {
//   const data = [
//     '<:loves> <gufo:isDerivedFrom> <:Love>',
//     '<:heavierThan> <gufo:isDerivedFrom> <:Weight>',
//     '<:worksAt> <gufo:isDerivedFrom> <:EmploymentContract>'
//   ];

//   for (const value of data) {
//     expect(derivation).toContain(value);
//   }
// });

// it('should hide object property creation', () => {
//   const data = [
//     '<:inheresInKeynoteSpeaker> <rdf:type> <owl:ObjectProperty>',
//     '<owl:onProperty> <:inheresInKeynoteSpeaker>',
//     '<:mediatesKeynoteSpeaker> <rdf:type> <owl:ObjectProperty>',
//     '<owl:onProperty> <:mediatesKeynoteSpeaker>',
//     '<:historicallyDependsOnKeynoteInvitation> <rdf:type> <owl:ObjectProperty>',
//     '<owl:onProperty> <:historicallyDependsOnKeynoteInvitation>'
//   ];

//   for (const value of data) {
//     expect(partWhole).toContain(value);
//     expect(partWholeHideRelation).not.toContain(value);
//   }
// });

// it('should create cardinality restriction with gufo property', () => {
//   const data = [
//     '<owl:onProperty> <gufo:inheresIn>',
//     '<owl:inverseOf> <gufo:inheresIn>',
//     '<owl:onProperty> <gufo:mediates>',
//     '<owl:inverseOf> <gufo:mediates>',
//     '<owl:onProperty> <gufo:historicallyDependsOn>'
//   ];

//   for (const value of data) {
//     expect(partWholeHideRelation).toContain(value);
//   }
// });
