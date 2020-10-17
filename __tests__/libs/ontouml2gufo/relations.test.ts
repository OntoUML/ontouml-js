import { RelationStereotype } from '@constants/.';
import { generateGufo, OntoumlFactory } from './helpers';

describe('Relations', () => {
  describe('Basic relation mapping: stereotypeless relation', () => {
    let owlCode;

    beforeAll(() => {
      const class1 = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('likes', null, class1, class1);
      const model = OntoumlFactory.createPackage('Model', [class1, relation]);
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
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createKind('Car');
      const relation = OntoumlFactory.createRelation('is owner of', RelationStereotype.MATERIAL, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
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
      const class1 = OntoumlFactory.createMode('Person');
      const class2 = OntoumlFactory.createMode('PersonType');
      const relation = OntoumlFactory.createRelation('instantiated by', RelationStereotype.INSTANTIATION, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owl = generateGufo(model);
      expect(owl).not.toContain('<:instantiatedBy>');
    });

    it('should not generate basic mapping for «derivation»', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const relation1 = OntoumlFactory.createRelation('married to', RelationStereotype.MATERIAL, class1, class1);
      const class2 = OntoumlFactory.createRelator('Marriage');
      const relation2 = OntoumlFactory.createRelation('derived from', RelationStereotype.DERIVATION, relation1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation1, relation2]);

      const owl = generateGufo(model);
      expect(owl).not.toContain('<:derivedFrom>');
    });
  });

  describe('Stereotype specific mapping: from OntoUML stereotype to gufo object property', () => {
    it('«material» to gufo:MaterialRelationshipType', () => {
      const _class = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('knows', RelationStereotype.MATERIAL, _class, _class);
      const model = OntoumlFactory.createPackage('Model', [_class, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:knows> <rdf:type> <gufo:MaterialRelationshipType>');
      expect(owlCode).not.toContain('<:knows> <rdfs:subPropertyOf>');
    });

    it('«comparative» to gufo:ComparativeRelationshipType', () => {
      const _class = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('heavierThan', RelationStereotype.COMPARATIVE, _class, _class);
      const model = OntoumlFactory.createPackage('Model', [_class, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:heavierThan> <rdf:type> <gufo:ComparativeRelationshipType>');
      expect(owlCode).not.toContain('<:heavierThan> <rdfs:subPropertyOf>');
    });

    it('«derivation» to gufo:isDerivedFrom', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const relation1 = OntoumlFactory.createRelation('married to', RelationStereotype.MATERIAL, class1, class1);
      const class2 = OntoumlFactory.createRelator('Marriage');
      const relation2 = OntoumlFactory.createRelation('derived from', RelationStereotype.DERIVATION, relation1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation1, relation2]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:marriedTo> <gufo:isDerivedFrom> <:Marriage>');
    });

    it('«instantiation» to gufo:categorizes', () => {
      const class1 = OntoumlFactory.createMode('Person');
      const class2 = OntoumlFactory.createMode('PersonType');
      const relation = OntoumlFactory.createRelation('instantiated by', RelationStereotype.INSTANTIATION, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:PersonType> <gufo:categorizes> <:Person>');
    });

    it('«bringsAbout» to gufo:broughtAbout', () => {
      const class1 = OntoumlFactory.createEvent('Car Accident');
      const class2 = OntoumlFactory.createSituation('Dangerous Situation');
      const relation = OntoumlFactory.createRelation('has post state', RelationStereotype.BRINGS_ABOUT, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:hasPostState> <rdfs:subPropertyOf> <gufo:broughtAbout>');
    });

    it('«characterization» to gufo:inheresIn', () => {
      const class1 = OntoumlFactory.createMode('Love');
      const class2 = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('inheres in person', RelationStereotype.CHARACTERIZATION, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:inheresInPerson> <rdfs:subPropertyOf> <gufo:inheresIn>');
    });

    it('«creation» to gufo:wasCreatedIn', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createRelation('was created in birth', RelationStereotype.CREATION, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:wasCreatedInBirth> <rdfs:subPropertyOf> <gufo:wasCreatedIn>');
    });

    it('«externalDependence» to gufo:externallyDependsOn', () => {
      const class1 = OntoumlFactory.createMode('Love');
      const class2 = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('has lovee', RelationStereotype.EXTERNAL_DEPENDENCE, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:hasLovee> <rdfs:subPropertyOf> <gufo:externallyDependsOn>');
    });

    it('«historicalDependence» to gufo:historicallyDependsOn', () => {
      const class1 = OntoumlFactory.createMode('Person');
      const relation = OntoumlFactory.createRelation('has ancestor', RelationStereotype.HISTORICAL_DEPENDENCE, class1, class1);
      const model = OntoumlFactory.createPackage('Model', [class1, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:hasAncestor> <rdfs:subPropertyOf> <gufo:historicallyDependsOn>');
    });

    it('«manifestation» to gufo:manifestedIn', () => {
      const class1 = OntoumlFactory.createMode('Vulnerability');
      const class2 = OntoumlFactory.createEvent('Accident');
      const relation = OntoumlFactory.createRelation('manifested in accident', RelationStereotype.MANIFESTATION, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:manifestedInAccident> <rdfs:subPropertyOf> <gufo:manifestedIn>');
    });

    it('«mediation» to gufo:mediates', () => {
      const class1 = OntoumlFactory.createRelator('Enrolment');
      const class2 = OntoumlFactory.createRole('Student');
      const relation = OntoumlFactory.createRelation('involves student', RelationStereotype.MEDIATION, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:involvesStudent> <rdfs:subPropertyOf> <gufo:mediates>');
    });

    it('«participation» to gufo:participatedIn', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Fight');
      const relation = OntoumlFactory.createRelation('participated in fight', RelationStereotype.PARTICIPATION, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:participatedInFight> <rdfs:subPropertyOf> <gufo:participatedIn>');
    });

    it('«termination» to gufo:wasTerminatedIn', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Death');
      const relation = OntoumlFactory.createRelation('was terminated in death', RelationStereotype.TERMINATION, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:wasTerminatedInDeath> <rdfs:subPropertyOf> <gufo:wasTerminatedIn>');
    });

    it('«trigger» to gufo:contributedToTrigger', () => {
      const class1 = OntoumlFactory.createSituation('Hazard');
      const class2 = OntoumlFactory.createEvent('Threat Event');
      const relation = OntoumlFactory.createRelation('triggered threat event', RelationStereotype.TRIGGERS, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:triggeredThreatEvent> <rdfs:subPropertyOf> <gufo:contributedToTrigger>');
    });

    it('«componentOf» to gufo:contributedToTrigger', () => {
      const class1 = OntoumlFactory.createKind('Engine');
      const class2 = OntoumlFactory.createKind('Car');
      const relation = OntoumlFactory.createRelation('is component of car', RelationStereotype.COMPONENT_OF, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isComponentOfCar> <rdfs:subPropertyOf> <gufo:isComponentOf>');
    });

    it('«memberOf» to gufo:isCollectionMemberOf', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createKind('Group');
      const relation = OntoumlFactory.createRelation('is component of car', RelationStereotype.MEMBER_OF, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isComponentOfCar> <rdfs:subPropertyOf> <gufo:isCollectionMemberOf>');
    });

    it('«subCollectionOf» to gufo:isSubCollectionOf', () => {
      const class1 = OntoumlFactory.createKind('Faculty');
      const class2 = OntoumlFactory.createKind('Research Group');
      const relation = OntoumlFactory.createRelation(
        'is subcollection of faculty',
        RelationStereotype.SUBCOLLECTION_OF,
        class1,
        class2
      );
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isSubcollectionOfFaculty> <rdfs:subPropertyOf> <gufo:isSubCollectionOf>');
    });

    it('«subQuantityOf» to gufo:isSubQuantityOf', () => {
      const class1 = OntoumlFactory.createQuantity('Water');
      const class2 = OntoumlFactory.createQuantity('Wine');
      const relation = OntoumlFactory.createRelation('is component of car', RelationStereotype.SUBQUANTITY_OF, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isComponentOfCar> <rdfs:subPropertyOf> <gufo:isSubQuantityOf>');
    });

    it('«participational» to gufo:isEventProperPartOf', () => {
      const class1 = OntoumlFactory.createEvent('Player Contribution');
      const class2 = OntoumlFactory.createEvent('Match');
      const relation = OntoumlFactory.createRelation('is part of match', RelationStereotype.PARTICIPATIONAL, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isPartOfMatch> <rdfs:subPropertyOf> <gufo:isEventProperPartOf>');
    });
  });

  describe('Part-whole relation without stereotype mapping', () => {
    it('Should generate subproperty of gufo:isProperPartOf if more specific property is not available', () => {
      const class1 = OntoumlFactory.createCollective('Treasure');
      const class2 = OntoumlFactory.createSituation('Hazard');
      const relation = OntoumlFactory.createPartWhole('is part of hazardous situation', class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isPartOfHazardousSituation> <rdfs:subPropertyOf> <gufo:isProperPartOf>');
    });

    it('Between functional complexes should generate subproperty of gufo:isObjectProperPartOf', () => {
      const class1 = OntoumlFactory.createKind('Engine');
      const class2 = OntoumlFactory.createKind('Car');
      const relation = OntoumlFactory.createPartWhole('is part of car', class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isPartOfCar> <rdfs:subPropertyOf> <gufo:isObjectProperPartOf>');
    });

    it('Between relators should generate subproperty of gufo:isAspectProperPartOf', () => {
      const class1 = OntoumlFactory.createRelator('SubAgreement');
      const class2 = OntoumlFactory.createRelator('Agreement');
      const relation = OntoumlFactory.createPartWhole('is part of agreement', class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isPartOfAgreement> <rdfs:subPropertyOf> <gufo:isAspectProperPartOf>');
    });

    it('Between mode and relator should generate subproperty of gufo:isAspectProperPartOf', () => {
      const class1 = OntoumlFactory.createMode('Commitment');
      const class2 = OntoumlFactory.createRelator('Agreement');
      const relation = OntoumlFactory.createPartWhole('is part of agreement', class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isPartOfAgreement> <rdfs:subPropertyOf> <gufo:isAspectProperPartOf>');
    });

    it('Between modes should generate subproperty of gufo:isAspectProperPartOf', () => {
      const class1 = OntoumlFactory.createMode('Admiration');
      const class2 = OntoumlFactory.createMode('Love');
      const relation = OntoumlFactory.createPartWhole('is part of love', class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isPartOfLove> <rdfs:subPropertyOf> <gufo:isAspectProperPartOf>');
    });

    it('Between events should generate subproperty of gufo:isEventProperPartOf', () => {
      const class1 = OntoumlFactory.createEvent('Keynote Speech');
      const class2 = OntoumlFactory.createEvent('Conference');
      const relation = OntoumlFactory.createPartWhole('is part of conference', class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model);
      expect(owlCode).toContain('<:isPartOfConference> <rdfs:subPropertyOf> <gufo:isEventProperPartOf>');
    });
  });

  describe('Hide property creation { createObjectProperty: false }', () => {
    it('«mediation» should NOT generate gufo:mediates', () => {
      const class1 = OntoumlFactory.createRelator('Enrolment');
      const class2 = OntoumlFactory.createRole('Student');
      const relation = OntoumlFactory.createRelation('involves student', RelationStereotype.MEDIATION, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: false });
      expect(owlCode).not.toContain('<:involvesStudent>');
    });

    it('«characterization» should NOT generate gufo:inheresIn', () => {
      const class1 = OntoumlFactory.createMode('Love');
      const class2 = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('inheres in person', RelationStereotype.CHARACTERIZATION, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: false });
      expect(owlCode).not.toContain('<:inheresInPerson>');
    });

    it('«material» should generate gufo:MaterialRelationshipType', () => {
      const _class = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('knows', RelationStereotype.MATERIAL, _class, _class);
      const model = OntoumlFactory.createPackage('Model', [_class, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: false });
      expect(owlCode).toContain('<:knows> <rdf:type> <gufo:MaterialRelationshipType>');
      expect(owlCode).toContain('<:knows> <rdfs:label> "knows"');
    });

    it('«comparative» should generate gufo:ComparativeRelationshipType', () => {
      const _class = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('heavierThan', RelationStereotype.COMPARATIVE, _class, _class);
      const model = OntoumlFactory.createPackage('Model', [_class, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: false });
      expect(owlCode).toContain('<:heavierThan> <rdf:type> <gufo:ComparativeRelationshipType>');
      expect(owlCode).toContain('<:heavierThan> <rdfs:label> "heavierThan"');
    });

    it('«instantiation» should generate gufo:characterizes', () => {
      const class1 = OntoumlFactory.createMode('Person');
      const class2 = OntoumlFactory.createMode('PersonType');
      const relation = OntoumlFactory.createRelation('instantiated by', RelationStereotype.INSTANTIATION, class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: false });
      expect(owlCode).toContain('<:PersonType> <gufo:categorizes> <:Person>');
    });

    it('«derivation» to gufo:isDerivedFrom', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const relation1 = OntoumlFactory.createRelation('married to', RelationStereotype.MATERIAL, class1, class1);
      const class2 = OntoumlFactory.createRelator('Marriage');
      const relation2 = OntoumlFactory.createRelation('derived from', RelationStereotype.DERIVATION, relation1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation1, relation2]);

      const owlCode = generateGufo(model, { createObjectProperty: false });
      expect(owlCode).toContain('<:marriedTo> <gufo:isDerivedFrom> <:Marriage>');
    });
  });
});
