import { generateGufo } from './helpers';
import { Package } from '@libs/ontouml';

describe('Inverse relations', () => {
  describe('Basic inverse relation mapping: stereotypeless relation', () => {
    let owlCode;

    beforeAll(() => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createKind('Person');
      const class2 = model.createKind('Dog');
      const relation = model.createBinaryRelation(class1, class2, 'owns');

      relation.getSourceEnd().addName('owner');
      relation.getTargetEnd().addName('pet');

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
      const model = new Package();
      model.addName('Model');

      const class1 = model.createKind('Person');
      const class2 = model.createKind('Dog');
      const relation = model.createMaterialRelation(class1, class2, 'owns');

      relation.getSourceEnd().addName('owner');

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
      const model = new Package();
      model.addName('Model');
      const class1 = model.createIntrinsicMode('Person');
      const class2 = model.createIntrinsicMode('PersonType');
      const relation = model.createInstantiationRelation(class1, class2, 'instantiated by');

      relation.getSourceEnd().addName('instance');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).not.toContain('<:instance>');
    });

    it('should not generate basic mapping for «derivation»', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createKind('Person');
      const relation1 = model.createMaterialRelation(class1, class1, 'married to');
      const class2 = model.createRelator('MArriage');
      const relation2 = model.createDerivationRelation(relation1, class2, 'derived from');

      relation2.getSourceEnd().addName('derivedRelation');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).not.toContain('<:derivedRelation>');
    });
  });

  describe('Stereotype specific inverse mapping: from OntoUML stereotype to gufo object property', () => {
    it('inverse «material» to gufoi:MaterialRelationshipType', () => {
      const model = new Package();
      model.addName('Model');
      const _class = model.createKind('Person');
      const relation = model.createMaterialRelation(_class, _class, 'knows');

      relation.getSourceEnd().addName('knownBy');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:knownBy> <rdf:type> <gufo:MaterialRelationshipType>');
      expect(owlCode).not.toContain('<:knownBy> <rdfs:subPropertyOf>');
    });

    it('inverse «comparative» to gufoi:ComparativeRelationshipType', () => {
      const model = new Package();
      model.addName('Model');
      const _class = model.createKind('Person');
      const relation = model.createComparativeRelation(_class, _class, 'heavierThan');

      relation.getSourceEnd().addName('heavier');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:heavier> <rdf:type> <gufo:ComparativeRelationshipType>');
      expect(owlCode).not.toContain('<:heavier> <rdfs:subPropertyOf>');
    });

    it('inverse «inverse bringsAbout» to gufoi:broughtAbout', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createEvent('Car Accident');
      const class2 = model.createSituation('Dangerous Situation');
      const relation = model.createBringsAboutRelation(class1, class2, 'has post state');

      relation.getSourceEnd().addName('accident');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:accident> <rdfs:subPropertyOf> <gufoi:wasBroughtAboutBy>');
    });

    it('inverse «characterization» to gufoi:inheresIn', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createExtrinsicMode('Love');
      const class2 = model.createKind('Person');
      const relation = model.createCharacterizationRelation(class1, class2, 'inheres in person');

      relation.getSourceEnd().addName('love');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:love> <rdfs:subPropertyOf> <gufoi:bears>');
    });

    it('inverse «creation» to gufoi:wasCreatedIn', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createKind('Person');
      const class2 = model.createEvent('Birth');
      const relation = model.createCreationRelation(class1, class2, 'was created in birth');

      relation.getSourceEnd().addName('bornPerson');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:bornPerson> <rdfs:subPropertyOf> <gufoi:created>');
    });

    it('inverse «externalDependence» to gufoi:externallyDependsOn', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createExtrinsicMode('Love');
      const class2 = model.createKind('Person');
      const relation = model.createExternalDependencyRelation(class1, class2, 'has lovee');

      relation.getSourceEnd().addName('love');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:love> <rdfs:subPropertyOf> <gufoi:hasModeDependee>');
    });

    it('inverse «historicalDependence» to gufoi:historicallyDependsOn', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createIntrinsicMode('Person');
      const relation = model.createHistoricalDependenceRelation(class1, class1, 'has ancestor');

      relation.getSourceEnd().addName('descendant');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:descendant> <rdfs:subPropertyOf> <gufoi:hasHistoricalDependee>');
    });

    it('inverse «manifestation» to gufoi:manifestedIn', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createExtrinsicMode('Vulnerability');
      const class2 = model.createEvent('Accident');
      const relation = model.createManifestationRelation(class1, class2, 'manifested in accident');

      relation.getSourceEnd().addName('vulnerability');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:vulnerability> <rdfs:subPropertyOf> <gufoi:manifested>');
    });

    it('inverse «mediation» to gufoi:mediates', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createRelator('Enrollment');
      const class2 = model.createRole('Student');
      const relation = model.createMediationRelation(class1, class2, 'involves student');

      relation.getSourceEnd().addName('enrolment');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:enrolment> <rdfs:subPropertyOf> <gufoi:isMediatedBy>');
    });

    it('inverse «participation» to gufoi:participatedIn', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createKind('Person');
      const class2 = model.createEvent('Fight');
      const relation = model.createParticipationRelation(class1, class2, 'participated in fight');

      relation.getSourceEnd().addName('fighter');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:fighter> <rdfs:subPropertyOf> <gufoi:hadParticipant>');
    });

    it('inverse «termination» to gufoi:wasTerminatedIn', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createKind('Person');
      const class2 = model.createEvent('Death');
      const relation = model.createTerminationRelation(class1, class2, 'was terminated in death');

      relation.getSourceEnd().addName('dead');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:dead> <rdfs:subPropertyOf> <gufoi:terminated>');
    });

    it('inverse «trigger» to gufoi:contributedToTrigger', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createSituation('Hazard');
      const class2 = model.createEvent('Threat Event');
      const relation = model.createTriggersRelation(class1, class2, 'triggered threat event');

      relation.getSourceEnd().addName('hazard');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:hazard> <rdfs:subPropertyOf> <gufoi:wasTriggeredBy>');
    });

    it('inverse «componentOf» to gufoi:contributedToTrigger', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createKind('Engine');
      const class2 = model.createKind('Car');
      const relation = model.createComponentOfRelation(class1, class2, 'is component of car');

      relation.getSourceEnd().addName('engine');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:engine> <rdfs:subPropertyOf> <gufoi:hasComponent>');
    });

    it('inverse «memberOf» to gufoi:isCollectionMemberOf', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createKind('Person');
      const class2 = model.createKind('Group');
      const relation = model.createMemberOfRelation(class1, class2, 'is component of car');

      relation.getSourceEnd().addName('member');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:member> <rdfs:subPropertyOf> <gufoi:hasCollectionMember>');
    });

    it('inverse «subCollectionOf» to gufoi:isSubCollectionOf', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createKind('Research Group');
      const class2 = model.createKind('Faculty');
      const relation = model.createSubCollectionOfRelation(class1, class2, 'is subcollection of faculty');

      relation.getSourceEnd().addName('researchGroup');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:researchGroup> <rdfs:subPropertyOf> <gufoi:hasSubCollection>');
    });

    it('inverse «subQuantityOf» to gufoi:isSubQuantityOf', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createQuantity('Water');
      const class2 = model.createQuantity('Wine');
      const relation = model.createSubQuantityOfRelation(class1, class2, 'is part of wine');

      relation.getSourceEnd().addName('waterSubQuantity');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:waterSubQuantity> <rdfs:subPropertyOf> <gufoi:hasSubQuantity>');
    });

    it('inverse «participational» to gufoi:isEventProperPartOf', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createEvent('Player Contribution');
      const class2 = model.createEvent('Match');
      const relation = model.createParticipationalRelation(class1, class2, 'is part of match');

      relation.getSourceEnd().addName('playerContribution');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:playerContribution> <rdfs:subPropertyOf> <gufoi:hasEventProperPart>');
    });
  });

  describe('Part-whole relation without stereotype mapping', () => {
    it('Should generate subproperty of gufoi:hasProperPart if more specific property is not available', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createCollective('Treasure');
      const class2 = model.createSituation('Hazard');
      const relation = model.createPartWholeRelation(class1, class2, 'is part of hazardous situation');

      relation.getSourceEnd().addName('treasure');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:treasure> <rdfs:subPropertyOf> <gufoi:hasProperPart>');
    });

    it('Inverse between functional complexes should generate subproperty of gufoi:hasObjectProperPart', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createKind('Engine');
      const class2 = model.createKind('Car');
      const relation = model.createPartWholeRelation(class1, class2, 'is part of car');

      relation.getSourceEnd().addName('engine');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:engine> <rdfs:subPropertyOf> <gufoi:hasObjectProperPart>');
    });

    it('Inverse between relators should generate subproperty of gufoi:hasAspectProperPart', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createRelator('SubAgreement');
      const class2 = model.createRelator('Agreement');
      const relation = model.createPartWholeRelation(class1, class2, 'is part of agreement');

      relation.getSourceEnd().addName('subAgreement');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:subAgreement> <rdfs:subPropertyOf> <gufoi:hasAspectProperPart>');
    });

    it('Inverse between mode and relator should generate subproperty of gufoi:hasApectProperPart', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createExtrinsicMode('Commitment');
      const class2 = model.createRelator('Agreement');
      const relation = model.createPartWholeRelation(class1, class2, 'is part of agreement');

      relation.getSourceEnd().addName('commitment');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:commitment> <rdfs:subPropertyOf> <gufoi:hasAspectProperPart>');
    });

    it('Inverse between modes should generate subproperty of gufoi:hasAspectProperPart', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createExtrinsicMode('Admiration');
      const class2 = model.createExtrinsicMode('Love');
      const relation = model.createPartWholeRelation(class1, class2, 'is part of love');

      relation.getSourceEnd().addName('admiration');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:admiration> <rdfs:subPropertyOf> <gufoi:hasAspectProperPart>');
    });

    it('Between events should generate subproperty of gufoi:hasEventProperPart', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createEvent('Keynote Speech');
      const class2 = model.createEvent('Conference');
      const relation = model.createPartWholeRelation(class1, class2, 'is part of conference');

      relation.getSourceEnd().addName('keynoteSpeech');

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });
      expect(owlCode).toContain('<:keynoteSpeech> <rdfs:subPropertyOf> <gufoi:hasEventProperPart>');
    });
  });

  describe('Hide property creation { createObjectProperty: false, createInverses: true }', () => {
    it('inverse «mediation» should NOT be transformed into an object property', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createRelator('Enrolment');
      const class2 = model.createRole('Student');
      const relation = model.createMediationRelation(class1, class2, 'involves student');

      relation.getSourceEnd().addName('enrolment');

      const owlCode = generateGufo(model, { createObjectProperty: false, createInverses: true });
      expect(owlCode).not.toContain('<:enrolment>');
    });

    it('inverse «characterization» should NOT be transformed into an object property', () => {
      const model = new Package();
      model.addName('Model');
      const class1 = model.createExtrinsicMode('Love');
      const class2 = model.createKind('Person');
      const relation = model.createCharacterizationRelation(class1, class2, 'inheres in person');

      relation.getSourceEnd().addName('love');

      const owlCode = generateGufo(model, { createObjectProperty: false, createInverses: true });
      expect(owlCode).not.toContain('<:love>');
    });

    it('inverse «material» should generate gufo:MaterialRelationshipType', () => {
      const model = new Package();
      model.addName('Model');
      const _class = model.createKind('Person');
      const relation = model.createMaterialRelation(_class, _class, 'knows');

      relation.getSourceEnd().addName('knower');

      const owlCode = generateGufo(model, { createObjectProperty: false, createInverses: true });
      expect(owlCode).toContain('<:knower> <rdf:type> <gufo:MaterialRelationshipType>');
      expect(owlCode).toContain('<:knower> <rdfs:label> "knower"');
    });

    it('inverse «comparative» should generate gufo:ComparativeRelationshipType', () => {
      const model = new Package();
      model.addName('Model');
      const _class = model.createKind('Person');
      const relation = model.createComparativeRelation(_class, _class, 'heavierThan');

      relation.getSourceEnd().addName('heavier');

      const owlCode = generateGufo(model, { createObjectProperty: false, createInverses: true });
      expect(owlCode).toContain('<:heavier> <rdf:type> <gufo:ComparativeRelationshipType>');
      expect(owlCode).toContain('<:heavier> <rdfs:label> "heavier"');
    });
  });
});
