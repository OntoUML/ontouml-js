import { generateGufo } from './helpers';
import { Package, CARDINALITY_MAX_AS_NUMBER } from '@libs/ontouml';

describe('Cardinalities', () => {
  describe('Relation cardinalities not transformed', () => {
    it('should NOT generate cardinality axioms if association end is mutable (readOnly = false)', () => {
      const model = new Package();
      const _class = model.createKind('Person');
      const relation = model.createMaterialRelation(_class, _class, 'likes');

      relation.getSourceEnd().cardinality.setOneToMany();
      relation.getTargetEnd().cardinality.setOneToMany();

      const owlCode = generateGufo(model);

      expect(owlCode).not.toContain('<rdf:type> <owl:Restriction>');
    });

    it('should NOT generate cardinality axioms if relation is unbounded (0..*)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const event = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, event, 'was born in');

      relation.getSourceEnd().cardinality.setZeroToMany();
      relation.getTargetEnd().cardinality.setZeroToMany();

      const owlCode = generateGufo(model);

      expect(owlCode).not.toContain('<rdf:type> <owl:Restriction>');
    });

    it('should NOT generate cardinality axioms if relation is unbounded (*)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const event = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, event, 'was born in');

      relation.getSourceEnd().cardinality.value = '*';
      relation.getTargetEnd().cardinality.value = '*';

      const owlCode = generateGufo(model);

      expect(owlCode).not.toContain('<rdf:type> <owl:Restriction>');
    });
  });

  describe('Relation cardinalities { createObjectProperty: true, createInverses: false }', () => {
    it('should generate cardinality axioms if source association end is readOnly (1..*)', () => {
      const model = new Package();
      const love = model.createExtrinsicMode('Love');
      const person = model.createKind('Person');
      const relation = model.createCharacterizationRelation(love, person, 'is love of');

      relation.getSourceEnd().isReadOnly = true;
      relation.getSourceEnd().cardinality.setOneToMany();

      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Person> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <:isLoveOf> ];');
      expect(owlCode).toContain('<owl:someValuesFrom> <:Love>');
    });

    it('should generate cardinality axioms if target association end is readOnly (1..*)', () => {
      const model = new Package();
      const love = model.createExtrinsicMode('Love');
      const person = model.createKind('Person');
      const relation = model.createCharacterizationRelation(love, person, 'is love of');

      relation.getSourceEnd().cardinality.setOneToMany();
      relation.getTargetEnd().isReadOnly = true;
      relation.getTargetEnd().cardinality.setOneToMany();

      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Love> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <:isLoveOf>');
      expect(owlCode).toContain('<owl:someValuesFrom> <:Person>');
    });

    it('should generate cardinality axioms if relation stereotype implies existential dependency from source to target (1)', () => {
      const model = new Package();
      const love = model.createExtrinsicMode('Love');
      const person = model.createKind('Person');
      const relation = model.createCharacterizationRelation(love, person, 'is love of');
      relation.getTargetEnd().cardinality.setOneToOne();

      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Love> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <:isLoveOf>');
      expect(owlCode).toContain('<owl:minQualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });

    it('should generate cardinality axioms if relation stereotype implies existential dependency from target to source (1..*)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const death = model.createEvent('Death');
      const relation = model.createTerminationRelation(person, death, 'diedAt');

      relation.getSourceEnd().cardinality.setOneToMany();

      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Death> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <:diedAt> ]');
      expect(owlCode).toContain('<owl:someValuesFrom> <:Person>');
    });

    it('should generate cardinality axioms if relation stereotype implies bidirectional existential dependency (1..*)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.setOneToMany();

      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <:wasBornIn> ]');
      expect(owlCode).toContain('<owl:someValuesFrom> <:Person>');
    });

    it('should generate cardinality axioms using owl:qualifiedCardinality (1)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      model.createCreationRelation(person, birth, 'was born in');

      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <:wasBornIn> ]');
      expect(owlCode).toContain('<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });

    it('should generate cardinality axioms using owl:qualifiedCardinality (1..1)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      model.createCreationRelation(person, birth, 'was born in');

      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <:wasBornIn> ]');
      expect(owlCode).toContain('<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });

    it('should generate cardinality axioms using owl:minQualifiedCardinality (2..*)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.setCardinalityFromNumbers(2, CARDINALITY_MAX_AS_NUMBER);
      relation.getTargetEnd().cardinality.setZeroToMany();

      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <:wasBornIn> ]');
      expect(owlCode).toContain('<owl:minQualifiedCardinality> "2"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });

    it('should generate cardinality axioms using owl:maxQualifiedCardinality (0..1)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.setZeroToOne();
      relation.getTargetEnd().cardinality.setZeroToMany();

      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <:wasBornIn> ]');
      expect(owlCode).toContain('<owl:maxQualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });

    it('should generate cardinality axioms using owl:minQualifiedCardinality and owl:maxQualifiedCardinality (1..3)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.setCardinalityFromNumbers(1, 3);
      relation.getTargetEnd().cardinality.setZeroToMany();

      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <:wasBornIn> ]');

      expect(owlCode).toContain('<owl:minQualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');

      expect(owlCode).toContain('<owl:maxQualifiedCardinality> "3"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });
  });

  describe('Relation cardinalities { createObjectProperty: true, createInverses: true }', () => {
    it('should generate cardinality axioms using owl:someValuesFrom (1..*)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.setOneToMany();
      relation.getSourceEnd().addName('newPerson');
      relation.getTargetEnd().cardinality.setZeroToMany();

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <:newPerson>');
      expect(owlCode).toContain('<owl:someValuesFrom> <:Person>');
    });

    it('should generate cardinality axioms using owl:qualifiedCardinality (1)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.setOneToOne();
      relation.getSourceEnd().addName('newPerson');
      relation.getTargetEnd().cardinality.setZeroToMany();

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <:newPerson>');
      expect(owlCode).toContain('<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });

    it('should generate cardinality axioms using owl:minQualifiedCardinality (2..*)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.setZeroToMany();
      relation.getSourceEnd().addName('newPerson');
      relation.getTargetEnd().cardinality.value = '2..*';

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });

      expect(owlCode).toContain('<:Person> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <:wasBornIn>');
      expect(owlCode).toContain('<owl:minQualifiedCardinality> "2"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Birth>');
    });

    it('should generate cardinality axioms using owl:maxQualifiedCardinality (0..1)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.setZeroToMany();
      relation.getSourceEnd().addName('newPerson');
      relation.getTargetEnd().cardinality.setZeroToOne();

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });

      expect(owlCode).toContain('<:Person> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <:wasBornIn>');
      expect(owlCode).toContain('<owl:maxQualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Birth>');
    });

    it('should generate cardinality axioms using owl:minQualifiedCardinality and owl:maxQualifiedCardinality (1..3)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.value = '1..3';
      relation.getSourceEnd().addName('newPerson');
      relation.getTargetEnd().cardinality.setZeroToMany();

      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <:newPerson>');

      expect(owlCode).toContain('<owl:minQualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');

      expect(owlCode).toContain('<owl:maxQualifiedCardinality> "3"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });
  });

  describe('Relation cardinalities { createObjectProperty: false, createInverses: false }', () => {
    it('should generate cardinality axioms using owl:someValuesFrom (1..*)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.setOneToMany();
      relation.getTargetEnd().cardinality.setZeroToMany();

      const owlCode = generateGufo(model, { createObjectProperty: false });

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <gufo:wasCreatedIn> ]');
      expect(owlCode).toContain('<owl:someValuesFrom> <:Person>');
    });

    it('should generate cardinality axioms using owl:qualifiedCardinality (1)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.setOneToOne();
      relation.getTargetEnd().cardinality.setZeroToMany();

      const owlCode = generateGufo(model, { createObjectProperty: false });

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <gufo:wasCreatedIn> ]');
      expect(owlCode).toContain('<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });

    it('should generate cardinality axioms using owl:minQualifiedCardinality (2..*)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.setZeroToMany();
      relation.getTargetEnd().cardinality.value = '2..*';

      const owlCode = generateGufo(model, { createObjectProperty: false });

      expect(owlCode).toContain('<:Person> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <gufo:wasCreatedIn>');
      expect(owlCode).toContain('<owl:minQualifiedCardinality> "2"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Birth>');
    });

    it('should generate cardinality axioms using owl:maxQualifiedCardinality (0..1)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.setZeroToMany();
      relation.getTargetEnd().cardinality.setZeroToOne();

      const owlCode = generateGufo(model, { createObjectProperty: false });

      expect(owlCode).toContain('<:Person> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <gufo:wasCreatedIn>');
      expect(owlCode).toContain('<owl:maxQualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Birth>');
    });

    it('should generate cardinality axioms using owl:minQualifiedCardinality and owl:maxQualifiedCardinality (1..3)', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.value = '1..3';
      relation.getTargetEnd().cardinality.setZeroToMany();

      const owlCode = generateGufo(model, { createObjectProperty: false });

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <gufo:wasCreatedIn> ]');

      expect(owlCode).toContain('<owl:minQualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');

      expect(owlCode).toContain('<owl:maxQualifiedCardinality> "3"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });
  });

  describe('Relation cardinalities { createObjectProperty: false, createInverses: true } ', () => {
    it('should generate cardinality axioms using owl:someValuesFrom (1..*) and gufoi:created', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.setOneToMany();
      relation.getTargetEnd().cardinality.setZeroToMany();

      const owlCode = generateGufo(model, { createObjectProperty: false, createInverses: true });

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <gufoi:created>');
      expect(owlCode).toContain('<owl:someValuesFrom> <:Person>');
    });

    it('should generate cardinality axioms using owl:qualifiedCardinality (1) and gufoi:created', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.setOneToOne();
      relation.getTargetEnd().cardinality.setZeroToMany();

      const owlCode = generateGufo(model, { createObjectProperty: false, createInverses: true });

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <gufoi:created>');
      expect(owlCode).toContain('<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });

    it('should generate cardinality axioms using owl:minQualifiedCardinality (2..*) and gufo:wasCreatedIn', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.setZeroToMany();
      relation.getTargetEnd().cardinality.value = '2..*';

      const owlCode = generateGufo(model, { createObjectProperty: false, createInverses: true });

      expect(owlCode).toContain('<:Person> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <gufo:wasCreatedIn>');
      expect(owlCode).toContain('<owl:minQualifiedCardinality> "2"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Birth>');
    });

    it('should generate cardinality axioms using owl:maxQualifiedCardinality (0..1) and gufo:wasCreatedIn', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.setZeroToMany();
      relation.getTargetEnd().cardinality.setZeroToOne();

      const owlCode = generateGufo(model, { createObjectProperty: false, createInverses: true });

      expect(owlCode).toContain('<:Person> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <gufo:wasCreatedIn>');
      expect(owlCode).toContain('<owl:maxQualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Birth>');
    });

    it('should generate cardinality axioms using owl:minQualifiedCardinality and owl:maxQualifiedCardinality (1..3) and gufoi:created', () => {
      const model = new Package();
      const person = model.createKind('Person');
      const birth = model.createEvent('Birth');
      const relation = model.createCreationRelation(person, birth, 'was born in');

      relation.getSourceEnd().cardinality.value = '1..3';
      relation.getTargetEnd().cardinality.setZeroToMany();

      const owlCode = generateGufo(model, { createObjectProperty: false, createInverses: true });

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <gufoi:created>');

      expect(owlCode).toContain('<owl:minQualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');

      expect(owlCode).toContain('<owl:maxQualifiedCardinality> "3"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });
  });
});
