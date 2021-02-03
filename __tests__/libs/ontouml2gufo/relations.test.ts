import { generateGufo } from './helpers';
import { Package } from '@libs/ontouml';

describe('Relations', () => {
  describe('Basic relation mapping: stereotypeless relation', () => {
    let owlCode;

    beforeAll(() => {
      const model = new Package();
      const class1 = model.createKind('Person');
      model.createBinaryRelation(class1, class1, 'likes');
      owlCode = generateGufo(model);
    });

    it('should generate a label with the original name of the relation', () => {
      expect(owlCode).toContain('<:likes> <rdfs:label> "likes"');
    });

    it('should generate an object property', () => {
      expect(owlCode).toContain('<:likes> <rdf:type> <owl:ObjectProperty>');
    });

    it('should generate a domain axiom', () => {
      expect(owlCode).toContain('<:likes> <rdfs:domain> <:Person>');
    });

    it('should generate a range axiom', () => {
      expect(owlCode).toContain('<:likes> <rdfs:range> <:Person>');
    });
  });

  describe('Basic relation mapping: stereotyped relation', () => {
    let owlCode;

    beforeAll(() => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const class2 = model.createKind('Car');

      model.createMaterialRelation(class1, class2, 'is owner of');
      owlCode = generateGufo(model);
    });

    it('should generate a label with the original name of the relation', () => {
      expect(owlCode).toContain('<:isOwnerOf> <rdfs:label> "is owner of"');
    });

    it('should generate an object property', () => {
      expect(owlCode).toContain('<:isOwnerOf> <rdf:type> <owl:ObjectProperty>');
    });

    it('should generate a domain axiom', () => {
      expect(owlCode).toContain('<:isOwnerOf> <rdfs:domain> <:Person>');
    });

    it('should generate a range axiom', () => {
      expect(owlCode).toContain('<:isOwnerOf> <rdfs:range> <:Car>');
    });

    it('should not generate basic mapping for «instantiation»', () => {
      const model = new Package();
      const class1 = model.createIntrinsicMode('Person');
      const class2 = model.createIntrinsicMode('PersonType');

      model.createInstantiationRelation(class1, class2, 'instantiated by');

      const owl = generateGufo(model);
      expect(owl).not.toContain('<:instantiatedBy>');
    });

    it('should not generate basic mapping for «derivation»', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const class2 = model.createRelator('Marriage');
      const relation1 = model.createMaterialRelation(class1, class1, 'married to');

      model.createDerivationRelation(relation1, class2, 'derived from');

      const owl = generateGufo(model);
      expect(owl).not.toContain('<:derivedFrom>');
    });
  });

  describe('Stereotype specific mapping: from OntoUML stereotype to gufo object property', () => {
    it('«material» to gufo:MaterialRelationshipType', () => {
      const model = new Package();
      const class1 = model.createKind('Person');

      model.createMaterialRelation(class1, class1, 'knows');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:knows> <rdf:type> <gufo:MaterialRelationshipType>');
      expect(owlCode).not.toContain('<:knows> <rdfs:subPropertyOf>');
    });

    it('«comparative» to gufo:ComparativeRelationshipType', () => {
      const model = new Package();
      const class1 = model.createKind('Person');

      model.createComparativeRelation(class1, class1, 'heavierThan');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:heavierThan> <rdf:type> <gufo:ComparativeRelationshipType>');
      expect(owlCode).not.toContain('<:heavierThan> <rdfs:subPropertyOf>');
    });

    it('«derivation» to gufo:isDerivedFrom', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const class2 = model.createRelator('Marriage');
      const relation1 = model.createMaterialRelation(class1, class1, 'married to');

      model.createDerivationRelation(relation1, class2, 'derived from');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:marriedTo> <gufo:isDerivedFrom> <:Marriage>');
    });

    it('«instantiation» to gufo:categorizes', () => {
      const model = new Package();
      const class1 = model.createIntrinsicMode('Person');
      const class2 = model.createIntrinsicMode('PersonType');

      model.createInstantiationRelation(class1, class2, 'instantiated by');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:PersonType> <gufo:categorizes> <:Person>');
    });

    it('«bringsAbout» to gufo:broughtAbout', () => {
      const model = new Package();
      const class1 = model.createEvent('Car Accident');
      const class2 = model.createSituation('Dangerous Situation');

      model.createBringsAboutRelation(class1, class2, 'has post state');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:hasPostState> <rdfs:subPropertyOf> <gufo:broughtAbout>');
    });

    it('«characterization» to gufo:inheresIn', () => {
      const model = new Package();
      const class1 = model.createExtrinsicMode('Love');
      const class2 = model.createKind('Person');

      model.createCharacterizationRelation(class1, class2, 'inheres in person');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:inheresInPerson> <rdfs:subPropertyOf> <gufo:inheresIn>');
    });

    it('«creation» to gufo:wasCreatedIn', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const class2 = model.createEvent('Birth');

      model.createCreationRelation(class1, class2, 'was created in birth');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:wasCreatedInBirth> <rdfs:subPropertyOf> <gufo:wasCreatedIn>');
    });

    it('«externalDependence» to gufo:externallyDependsOn', () => {
      const model = new Package();
      const class1 = model.createExtrinsicMode('Love');
      const class2 = model.createKind('Person');

      model.createExternalDependencyRelation(class1, class2, 'has lovee');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:hasLovee> <rdfs:subPropertyOf> <gufo:externallyDependsOn>');
    });

    it('«historicalDependence» to gufo:historicallyDependsOn', () => {
      const model = new Package();
      const class1 = model.createIntrinsicMode('Person');

      model.createHistoricalDependenceRelation(class1, class1, 'has ancestor');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:hasAncestor> <rdfs:subPropertyOf> <gufo:historicallyDependsOn>');
    });

    it('«manifestation» to gufo:manifestedIn', () => {
      const model = new Package();
      const class1 = model.createIntrinsicMode('Vulnerability');
      const class2 = model.createEvent('Accident');

      model.createManifestationRelation(class1, class2, 'manifested in accident');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:manifestedInAccident> <rdfs:subPropertyOf> <gufo:manifestedIn>');
    });

    it('«mediation» to gufo:mediates', () => {
      const model = new Package();
      const class1 = model.createRelator('Enrollment');
      const class2 = model.createRole('Student');

      model.createMediationRelation(class1, class2, 'involves student');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:involvesStudent> <rdfs:subPropertyOf> <gufo:mediates>');
    });

    it('«participation» to gufo:participatedIn', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const class2 = model.createEvent('Fight');

      model.createParticipationRelation(class1, class2, 'participated in fight');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:participatedInFight> <rdfs:subPropertyOf> <gufo:participatedIn>');
    });

    it('«termination» to gufo:wasTerminatedIn', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const class2 = model.createEvent('Death');

      model.createTerminationRelation(class1, class2, 'was terminated in death');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:wasTerminatedInDeath> <rdfs:subPropertyOf> <gufo:wasTerminatedIn>');
    });

    it('«trigger» to gufo:contributedToTrigger', () => {
      const model = new Package();
      const class1 = model.createSituation('Hazard');
      const class2 = model.createEvent('Threat Event');

      model.createTriggersRelation(class1, class2, 'triggered threat event');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:triggeredThreatEvent> <rdfs:subPropertyOf> <gufo:contributedToTrigger>');
    });

    it('«componentOf» to gufo:contributedToTrigger', () => {
      const model = new Package();
      const class1 = model.createKind('Engine');
      const class2 = model.createKind('Car');

      model.createComponentOfRelation(class1, class2, 'is component of car');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isComponentOfCar> <rdfs:subPropertyOf> <gufo:isComponentOf>');
    });

    it('«memberOf» to gufo:isCollectionMemberOf', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const class2 = model.createKind('Group');

      model.createMemberOfRelation(class1, class2, 'is component of car');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isComponentOfCar> <rdfs:subPropertyOf> <gufo:isCollectionMemberOf>');
    });

    it('«subCollectionOf» to gufo:isSubCollectionOf', () => {
      //   'is subcollection of faculty',
      //   RelationStereotype.SUBCOLLECTION_OF,
      //   class1,
      //   class2
      // );
      const model = new Package();
      const class1 = model.createKind('Faculty');
      const class2 = model.createKind('Research Group');

      model.createSubCollectionOfRelation(class1, class2, 'is subcollection of faculty');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isSubcollectionOfFaculty> <rdfs:subPropertyOf> <gufo:isSubCollectionOf>');
    });

    it('«subQuantityOf» to gufo:isSubQuantityOf', () => {
      const model = new Package();
      const class1 = model.createQuantity('Water');
      const class2 = model.createQuantity('Wine');

      model.createSubQuantityOfRelation(class1, class2, 'is component of car');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isComponentOfCar> <rdfs:subPropertyOf> <gufo:isSubQuantityOf>');
    });

    it('«participational» to gufo:isEventProperPartOf', () => {
      const model = new Package();
      const class1 = model.createEvent('Player Contribution');
      const class2 = model.createEvent('Match');

      model.createParticipationalRelation(class1, class2, 'is part of match');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isPartOfMatch> <rdfs:subPropertyOf> <gufo:isEventProperPartOf>');
    });
  });

  describe('Part-whole relation without stereotype mapping', () => {
    it('Should generate subproperty of gufo:isProperPartOf if more specific property is not available', () => {
      const model = new Package();
      const class1 = model.createCollective('Treasure');
      const class2 = model.createSituation('Hazard');

      model.createPartWholeRelation(class1, class2, 'is part of hazardous situation');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isPartOfHazardousSituation> <rdfs:subPropertyOf> <gufo:isProperPartOf>');
    });

    it('Between functional complexes should generate subproperty of gufo:isObjectProperPartOf', () => {
      const model = new Package();
      const class1 = model.createKind('Engine');
      const class2 = model.createKind('Car');

      model.createPartWholeRelation(class1, class2, 'is part of car');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isPartOfCar> <rdfs:subPropertyOf> <gufo:isObjectProperPartOf>');
    });

    it('Between relators should generate subproperty of gufo:isAspectProperPartOf', () => {
      const model = new Package();
      const class1 = model.createRelator('SubAgreement');
      const class2 = model.createRelator('Agreement');

      model.createPartWholeRelation(class1, class2, 'is part of agreement');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isPartOfAgreement> <rdfs:subPropertyOf> <gufo:isAspectProperPartOf>');
    });

    it('Between mode and relator should generate subproperty of gufo:isAspectProperPartOf', () => {
      const model = new Package();
      const class1 = model.createExtrinsicMode('Commitment');
      const class2 = model.createRelator('Agreement');

      model.createPartWholeRelation(class1, class2, 'is part of agreement');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isPartOfAgreement> <rdfs:subPropertyOf> <gufo:isAspectProperPartOf>');
    });

    it('Between modes should generate subproperty of gufo:isAspectProperPartOf', () => {
      const model = new Package();
      const class1 = model.createExtrinsicMode('Admiration');
      const class2 = model.createExtrinsicMode('Love');

      model.createPartWholeRelation(class1, class2, 'is part of love');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isPartOfLove> <rdfs:subPropertyOf> <gufo:isAspectProperPartOf>');
    });

    it('Between events should generate subproperty of gufo:isEventProperPartOf', () => {
      const model = new Package();
      const class1 = model.createEvent('Keynote Speech');
      const class2 = model.createEvent('Conference');

      model.createPartWholeRelation(class1, class2, 'is part of conference');

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isPartOfConference> <rdfs:subPropertyOf> <gufo:isEventProperPartOf>');
    });
  });

  describe('Hide property creation { createObjectProperty: false }', () => {
    it('«mediation» should NOT generate gufo:mediates', () => {
      const model = new Package();
      const class1 = model.createRelator('Enrollment');
      const class2 = model.createRole('Student');

      model.createMediationRelation(class1, class2, 'involves student');

      const owlCode = generateGufo(model, { createObjectProperty: false });
      expect(owlCode).not.toContain('<:involvesStudent>');
    });

    it('«characterization» should NOT generate gufo:inheresIn', () => {
      const model = new Package();
      const class1 = model.createExtrinsicMode('Love');
      const class2 = model.createKind('Person');

      model.createCharacterizationRelation(class1, class2, 'inheres in person');

      const owlCode = generateGufo(model, { createObjectProperty: false });
      expect(owlCode).not.toContain('<:inheresInPerson>');
    });

    it('«material» should generate gufo:MaterialRelationshipType', () => {
      const model = new Package();
      const class1 = model.createKind('Person');

      model.createMaterialRelation(class1, class1, 'knows');

      const owlCode = generateGufo(model, { createObjectProperty: false });
      expect(owlCode).toContain('<:knows> <rdf:type> <gufo:MaterialRelationshipType>');
      expect(owlCode).toContain('<:knows> <rdfs:label> "knows"');
    });

    it('«comparative» should generate gufo:ComparativeRelationshipType', () => {
      const model = new Package();
      const class1 = model.createKind('Person');

      model.createComparativeRelation(class1, class1, 'heavierThan');

      const owlCode = generateGufo(model, { createObjectProperty: false });
      expect(owlCode).toContain('<:heavierThan> <rdf:type> <gufo:ComparativeRelationshipType>');
      expect(owlCode).toContain('<:heavierThan> <rdfs:label> "heavierThan"');
    });

    it('«instantiation» should generate gufo:characterizes', () => {
      const model = new Package();
      const class1 = model.createExtrinsicMode('Person');
      const class2 = model.createExtrinsicMode('PersonType');

      model.createInstantiationRelation(class1, class2, 'instantiated by');

      const owlCode = generateGufo(model, { createObjectProperty: false });
      expect(owlCode).toContain('<:PersonType> <gufo:categorizes> <:Person>');
    });

    it('«derivation» to gufo:isDerivedFrom', () => {
      const model = new Package();
      const class1 = model.createKind('Person');
      const class2 = model.createRelator('Marriage');
      const relation = model.createMaterialRelation(class1, class1, 'married to');

      model.createDerivationRelation(relation, class2, 'derived from');

      const owlCode = generateGufo(model, { createObjectProperty: false });
      expect(owlCode).toContain('<:marriedTo> <gufo:isDerivedFrom> <:Marriage>');
    });
  });
});
