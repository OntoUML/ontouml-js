import { RelationStereotype } from '@constants/.';
import { generateGufo } from './helpers';
import OntoumlFactory from './ontouml_factory';

describe('Inverse relations', () => {
  describe('Basic inverse relation mapping: stereotypeless relation', () => {
    let owlCode;

    beforeAll(() => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createKind('Dog');
      const relation = OntoumlFactory.createRelation('owns', null, class1, class2);
      relation.properties[0].name = 'owner';
      relation.properties[1].name = 'pet';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
    });

    it('should generate a label with the name of the source association end', () => {
      expect(owlCode).toContain('<:owner> <rdfs:label> "owner"');
    });

    it('should generate an object property', () => {
      expect(owlCode).toContain('<:owner> <rdf:type> <owl:ObjectProperty>');
    });

    it('should generate a domain axiom', () => {
      expect(owlCode).toContain('<:owner> <rdfs:domain> <:Dog>');
    });

    it('should generate a range axiom', () => {
      expect(owlCode).toContain('<:owner> <rdfs:range> <:Person>');
    });
  });

  describe('Basic inverse relation mapping: stereotyped relation', () => {
    let owlCode;

    beforeAll(() => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createKind('Dog');
      const relation = OntoumlFactory.createRelation('owns', RelationStereotype.MATERIAL, class1, class2);
      relation.properties[0].name = 'owner';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
    });

    it('should generate a label with the original name of the relation', () => {
      expect(owlCode).toContain('<:owner> <rdfs:label> "owner"');
    });

    it('should generate an object property', () => {
      expect(owlCode).toContain('<:owner> <rdf:type> <owl:ObjectProperty>');
    });

    it('should generate a domain axiom', () => {
      expect(owlCode).toContain('<:owner> <rdfs:domain> <:Dog>');
    });

    it('should generate a range axiom', () => {
      expect(owlCode).toContain('<:owner> <rdfs:range> <:Person>');
    });

    it('should not generate basic mapping for «instantiation»', () => {
      const class1 = OntoumlFactory.createMode('Person');
      const class2 = OntoumlFactory.createMode('PersonType');
      const relation = OntoumlFactory.createRelation('instantiated by', RelationStereotype.INSTANTIATION, class1, class2);
      relation.properties[0].name = 'instance';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).not.toContain('<:instance>');
    });

    it('should not generate basic mapping for «derivation»', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const relation1 = OntoumlFactory.createRelation('married to', RelationStereotype.MATERIAL, class1, class1);
      const class2 = OntoumlFactory.createRelator('Marriage');
      const relation2 = OntoumlFactory.createRelation('derived from', RelationStereotype.DERIVATION, relation1, class2);
      relation2.properties[0].name = 'derivedRelation';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation1, relation2]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).not.toContain('<:derivedRelation>');
    });
  });

  describe('Stereotype specific inverse mapping: from OntoUML stereotype to gufo object property', () => {
    it('inverse «material» to gufoi:MaterialRelationshipType', () => {
      const _class = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('knows', RelationStereotype.MATERIAL, _class, _class);
      relation.properties[0].name = 'knownBy';
      const model = OntoumlFactory.createPackage('Model', [_class, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:knownBy> <rdf:type> <gufo:MaterialRelationshipType>');
      expect(owlCode).not.toContain('<:knownBy> <rdfs:subPropertyOf>');
    });

    it('inverse «comparative» to gufoi:ComparativeRelationshipType', () => {
      const _class = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('heavierThan', RelationStereotype.COMPARATIVE, _class, _class);
      relation.properties[0].name = 'heavier';
      const model = OntoumlFactory.createPackage('Model', [_class, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:heavier> <rdf:type> <gufo:ComparativeRelationshipType>');
      expect(owlCode).not.toContain('<:heavier> <rdfs:subPropertyOf>');
    });

    it('inverse «inverse bringsAbout» to gufoi:broughtAbout', () => {
      const class1 = OntoumlFactory.createEvent('Car Accident');
      const class2 = OntoumlFactory.createSituation('Dangerous Situation');
      const relation = OntoumlFactory.createRelation('has post state', RelationStereotype.BRINGS_ABOUT, class1, class2);
      relation.properties[0].name = 'accident';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:accident> <rdfs:subPropertyOf> <gufoi:wasBroughtAboutBy>');
    });

    it('inverse «characterization» to gufoi:inheresIn', () => {
      const class1 = OntoumlFactory.createMode('Love');
      const class2 = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('inheres in person', RelationStereotype.CHARACTERIZATION, class1, class2);
      relation.properties[0].name = 'love';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:love> <rdfs:subPropertyOf> <gufoi:bears>');
    });

    it('inverse «creation» to gufoi:wasCreatedIn', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createRelation('was created in birth', RelationStereotype.CREATION, class1, class2);
      relation.properties[0].name = 'bornPerson';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:bornPerson> <rdfs:subPropertyOf> <gufoi:created>');
    });

    it('inverse «externalDependence» to gufoi:externallyDependsOn', () => {
      const class1 = OntoumlFactory.createMode('Love');
      const class2 = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('has lovee', RelationStereotype.EXTERNAL_DEPENDENCE, class1, class2);
      relation.properties[0].name = 'love';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:love> <rdfs:subPropertyOf> <gufoi:hasModeDependee>');
    });

    it('inverse «historicalDependence» to gufoi:historicallyDependsOn', () => {
      const class1 = OntoumlFactory.createMode('Person');
      const relation = OntoumlFactory.createRelation('has ancestor', RelationStereotype.HISTORICAL_DEPENDENCE, class1, class1);
      relation.properties[0].name = 'descendant';
      const model = OntoumlFactory.createPackage('Model', [class1, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:descendant> <rdfs:subPropertyOf> <gufoi:hasHistoricalDependee>');
    });

    it('inverse «manifestation» to gufoi:manifestedIn', () => {
      const class1 = OntoumlFactory.createMode('Vulnerability');
      const class2 = OntoumlFactory.createEvent('Accident');
      const relation = OntoumlFactory.createRelation('manifested in accident', RelationStereotype.MANIFESTATION, class1, class2);
      relation.properties[0].name = 'vulnerability';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:vulnerability> <rdfs:subPropertyOf> <gufoi:manifested>');
    });

    it('inverse «mediation» to gufoi:mediates', () => {
      const class1 = OntoumlFactory.createRelator('Enrolment');
      const class2 = OntoumlFactory.createRole('Student');
      const relation = OntoumlFactory.createRelation('involves student', RelationStereotype.MEDIATION, class1, class2);
      relation.properties[0].name = 'enrolment';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:enrolment> <rdfs:subPropertyOf> <gufoi:isMediatedBy>');
    });

    it('inverse «participation» to gufoi:participatedIn', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Fight');
      const relation = OntoumlFactory.createRelation('participated in fight', RelationStereotype.PARTICIPATION, class1, class2);
      relation.properties[0].name = 'fighter';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:fighter> <rdfs:subPropertyOf> <gufoi:hadParticipant>');
    });

    it('inverse «termination» to gufoi:wasTerminatedIn', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Death');
      const relation = OntoumlFactory.createRelation('was terminated in death', RelationStereotype.TERMINATION, class1, class2);
      relation.properties[0].name = 'dead';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:dead> <rdfs:subPropertyOf> <gufoi:terminated>');
    });

    it('inverse «trigger» to gufoi:contributedToTrigger', () => {
      const class1 = OntoumlFactory.createSituation('Hazard');
      const class2 = OntoumlFactory.createEvent('Threat Event');
      const relation = OntoumlFactory.createRelation('triggered threat event', RelationStereotype.TRIGGERS, class1, class2);
      relation.properties[0].name = 'hazard';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:hazard> <rdfs:subPropertyOf> <gufoi:wasTriggeredBy>');
    });

    it('inverse «componentOf» to gufoi:contributedToTrigger', () => {
      const class1 = OntoumlFactory.createKind('Engine');
      const class2 = OntoumlFactory.createKind('Car');
      const relation = OntoumlFactory.createRelation('is component of car', RelationStereotype.COMPONENT_OF, class1, class2);
      relation.properties[0].name = 'engine';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:engine> <rdfs:subPropertyOf> <gufoi:hasComponent>');
    });

    it('inverse «memberOf» to gufoi:isCollectionMemberOf', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createKind('Group');
      const relation = OntoumlFactory.createRelation('is component of car', RelationStereotype.MEMBER_OF, class1, class2);
      relation.properties[0].name = 'member';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:member> <rdfs:subPropertyOf> <gufoi:hasCollectionMember>');
    });

    it('inverse «subCollectionOf» to gufoi:isSubCollectionOf', () => {
      const class1 = OntoumlFactory.createKind('Research Group');
      const class2 = OntoumlFactory.createKind('Faculty');
      const relation = OntoumlFactory.createRelation(
        'is subcollection of faculty',
        RelationStereotype.SUBCOLLECTION_OF,
        class1,
        class2
      );
      relation.properties[0].name = 'researchGroup';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:researchGroup> <rdfs:subPropertyOf> <gufoi:hasSubCollection>');
    });

    it('inverse «subQuantityOf» to gufoi:isSubQuantityOf', () => {
      const class1 = OntoumlFactory.createQuantity('Water');
      const class2 = OntoumlFactory.createQuantity('Wine');
      const relation = OntoumlFactory.createRelation('is part of wine', RelationStereotype.SUBQUANTITY_OF, class1, class2);
      relation.properties[0].name = 'waterSubQuantity';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:waterSubQuantity> <rdfs:subPropertyOf> <gufoi:hasSubQuantity>');
    });

    it('inverse «participational» to gufoi:isEventProperPartOf', () => {
      const class1 = OntoumlFactory.createEvent('Player Contribution');
      const class2 = OntoumlFactory.createEvent('Match');
      const relation = OntoumlFactory.createRelation('is part of match', RelationStereotype.PARTICIPATIONAL, class1, class2);
      relation.properties[0].name = 'playerContribution';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:playerContribution> <rdfs:subPropertyOf> <gufoi:hasEventProperPart>');
    });
  });

  describe('Part-whole relation without stereotype mapping', () => {
    it('Should generate subproperty of gufoi:hasProperPart if more specific property is not available', () => {
      const class1 = OntoumlFactory.createCollective('Treasure');
      const class2 = OntoumlFactory.createSituation('Hazard');
      const relation = OntoumlFactory.createPartWhole('is part of hazardous situation', class1, class2);
      relation.properties[0].name = 'treasure';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:treasure> <rdfs:subPropertyOf> <gufoi:hasProperPart>');
    });

    it('Inverse between functional complexes should generate subproperty of gufoi:hasObjectProperPart', () => {
      const class1 = OntoumlFactory.createKind('Engine');
      const class2 = OntoumlFactory.createKind('Car');
      const relation = OntoumlFactory.createPartWhole('is part of car', class1, class2);
      relation.properties[0].name = 'engine';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:engine> <rdfs:subPropertyOf> <gufoi:hasObjectProperPart>');
    });

    it('Inverse between relators should generate subproperty of gufoi:hasAspectProperPart', () => {
      const class1 = OntoumlFactory.createRelator('SubAgreement');
      const class2 = OntoumlFactory.createRelator('Agreement');
      const relation = OntoumlFactory.createPartWhole('is part of agreement', class1, class2);
      relation.properties[0].name = 'subAgreement';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:subAgreement> <rdfs:subPropertyOf> <gufoi:hasAspectProperPart>');
    });

    it('Inverse between mode and relator should generate subproperty of gufoi:hasApectProperPart', () => {
      const class1 = OntoumlFactory.createMode('Commitment');
      const class2 = OntoumlFactory.createRelator('Agreement');
      const relation = OntoumlFactory.createPartWhole('is part of agreement', class1, class2);
      relation.properties[0].name = 'commitment';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:commitment> <rdfs:subPropertyOf> <gufoi:hasAspectProperPart>');
    });

    it('Inverse between modes should generate subproperty of gufoi:hasAspectProperPart', () => {
      const class1 = OntoumlFactory.createMode('Admiration');
      const class2 = OntoumlFactory.createMode('Love');
      const relation = OntoumlFactory.createPartWhole('is part of love', class1, class2);
      relation.properties[0].name = 'admiration';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:admiration> <rdfs:subPropertyOf> <gufoi:hasAspectProperPart>');
    });

    it('Between events should generate subproperty of gufoi:hasEventProperPart', () => {
      const class1 = OntoumlFactory.createEvent('Keynote Speech');
      const class2 = OntoumlFactory.createEvent('Conference');
      const relation = OntoumlFactory.createPartWhole('is part of conference', class1, class2);
      relation.properties[0].name = 'keynoteSpeech';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:keynoteSpeech> <rdfs:subPropertyOf> <gufoi:hasEventProperPart>');
    });
  });

  describe('Hide property creation { createObjectProperty: false, createInverses: true }', () => {
    it('inverse «mediation» should NOT be transformed into an object property', () => {
      const class1 = OntoumlFactory.createRelator('Enrolment');
      const class2 = OntoumlFactory.createRole('Student');
      const relation = OntoumlFactory.createRelation('involves student', RelationStereotype.MEDIATION, class1, class2);
      relation.properties[0].name = 'enrolment';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: false, createInverses: true });
      expect(owlCode).not.toContain('<:enrolment>');
    });

    it('inverse «characterization» should NOT be transformed into an object property', () => {
      const class1 = OntoumlFactory.createMode('Love');
      const class2 = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('inheres in person', RelationStereotype.CHARACTERIZATION, class1, class2);
      relation.properties[0].name = 'love';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: false, createInverses: true });
      expect(owlCode).not.toContain('<:love>');
    });

    it('inverse «material» should generate gufo:MaterialRelationshipType', () => {
      const _class = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('knows', RelationStereotype.MATERIAL, _class, _class);
      relation.properties[0].name = 'knower';
      const model = OntoumlFactory.createPackage('Model', [_class, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: false, createInverses: true });
      expect(owlCode).toContain('<:knower> <rdf:type> <gufo:MaterialRelationshipType>');
      expect(owlCode).toContain('<:knower> <rdfs:label> "knower"');
    });

    it('inverse «comparative» should generate gufo:ComparativeRelationshipType', () => {
      const _class = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('heavierThan', RelationStereotype.COMPARATIVE, _class, _class);
      relation.properties[0].name = 'heavier';
      const model = OntoumlFactory.createPackage('Model', [_class, relation]);

      const owlCode = generateGufo(model, { createObjectProperty: false, createInverses: true });
      expect(owlCode).toContain('<:heavier> <rdf:type> <gufo:ComparativeRelationshipType>');
      expect(owlCode).toContain('<:heavier> <rdfs:label> "heavier"');
    });
  });
});
