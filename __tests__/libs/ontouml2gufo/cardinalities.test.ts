import { RelationStereotype } from '@constants/.';
import { generateGufo, OntoumlFactory } from './helpers';

describe('Cardinalities', () => {
  describe('Relation cardinalities not transformed', () => {
    it('should NOT generate cardinality axioms if association end is mutable (readOnly = false)', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('likes', RelationStereotype.MATERIAL, class1, class1);
      relation.properties[0].cardinality = '1..*';
      relation.properties[1].cardinality = '1..*';
      const model = OntoumlFactory.createPackage('Model', [class1, relation]);
      const owlCode = generateGufo(model);

      expect(owlCode).not.toContain('<rdf:type> <owl:Restriction>');
    });

    it('should NOT generate cardinality axioms if relation is unbounded (0..*)', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '0..*';
      relation.properties[1].cardinality = '0..*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model);

      expect(owlCode).not.toContain('<rdf:type> <owl:Restriction>');
    });

    it('should NOT generate cardinality axioms if relation is unbounded (*)', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '*';
      relation.properties[1].cardinality = '*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model);

      expect(owlCode).not.toContain('<rdf:type> <owl:Restriction>');
    });
  });

  describe('Relation cardinalities { createObjectProperty: true, createInverses: false }', () => {
    it('should generate cardinality axioms if source association end is readOnly (1..*)', () => {
      const class1 = OntoumlFactory.createMode('Love');
      const class2 = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('is love of', null, class1, class2);
      relation.properties[0].isReadOnly = true;
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Person> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <:isLoveOf> ];');
      expect(owlCode).toContain('<owl:someValuesFrom> <:Love>');
    });

    it('should generate cardinality axioms if target association end is readOnly (1..*)', () => {
      const class1 = OntoumlFactory.createMode('Love');
      const class2 = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createRelation('is love of', null, class1, class2);
      relation.properties[1].isReadOnly = true;
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Love> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <:isLoveOf>');
      expect(owlCode).toContain('<owl:someValuesFrom> <:Person>');
    });

    it('should generate cardinality axioms if relation stereotype implies existential dependency from source to target (1)', () => {
      const class1 = OntoumlFactory.createMode('Love');
      const class2 = OntoumlFactory.createKind('Person');
      const relation = OntoumlFactory.createCharacterization('is love of', class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Love> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <:isLoveOf>');
      expect(owlCode).toContain('<owl:minQualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });

    it('should generate cardinality axioms if relation stereotype implies existential dependency from target to source (1..*)', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Death');
      const relation = OntoumlFactory.createTermination('diedAt', class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Death> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <:diedAt> ]');
      expect(owlCode).toContain('<owl:someValuesFrom> <:Person>');
    });

    it('should generate cardinality axioms if relation stereotype implies bidirectional existential dependency (1..*)', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <:wasBornIn> ]');
      expect(owlCode).toContain('<owl:someValuesFrom> <:Person>');
    });

    it('should generate cardinality axioms using owl:qualifiedCardinality (1)', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '1';
      relation.properties[1].cardinality = '*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <:wasBornIn> ]');
      expect(owlCode).toContain('<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });

    it('should generate cardinality axioms using owl:qualifiedCardinality (1..1)', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '1..1';
      relation.properties[1].cardinality = '*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <:wasBornIn> ]');
      expect(owlCode).toContain('<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });

    it('should generate cardinality axioms using owl:minQualifiedCardinality (2..*)', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '2..*';
      relation.properties[1].cardinality = '*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <:wasBornIn> ]');
      expect(owlCode).toContain('<owl:minQualifiedCardinality> "2"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });

    it('should generate cardinality axioms using owl:maxQualifiedCardinality (0..1)', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '0..1';
      relation.properties[1].cardinality = '*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model);

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <:wasBornIn> ]');
      expect(owlCode).toContain('<owl:maxQualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });

    it('should generate cardinality axioms using owl:minQualifiedCardinality and owl:maxQualifiedCardinality (1..3)', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '1..3';
      relation.properties[1].cardinality = '*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
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
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '1..*';
      relation.properties[0].name = 'newPerson';
      relation.properties[1].cardinality = '*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <:newPerson>');
      expect(owlCode).toContain('<owl:someValuesFrom> <:Person>');
    });

    it('should generate cardinality axioms using owl:qualifiedCardinality (1)', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '1';
      relation.properties[0].name = 'newPerson';
      relation.properties[1].cardinality = '*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <:newPerson>');
      expect(owlCode).toContain('<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });

    it('should generate cardinality axioms using owl:minQualifiedCardinality (2..*)', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('wasBornIn', class1, class2);
      relation.properties[0].cardinality = '*';
      relation.properties[0].name = 'newPerson';
      relation.properties[1].cardinality = '2..*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });

      expect(owlCode).toContain('<:Person> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <:wasBornIn>');
      expect(owlCode).toContain('<owl:minQualifiedCardinality> "2"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Birth>');
    });

    it('should generate cardinality axioms using owl:maxQualifiedCardinality (0..1)', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('wasBornIn', class1, class2);
      relation.properties[0].cardinality = '*';
      relation.properties[0].name = 'newPerson';
      relation.properties[1].cardinality = '0..1';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model, { createObjectProperty: true, createInverses: true });

      expect(owlCode).toContain('<:Person> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <:wasBornIn>');
      expect(owlCode).toContain('<owl:maxQualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Birth>');
    });

    it('should generate cardinality axioms using owl:minQualifiedCardinality and owl:maxQualifiedCardinality (1..3)', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '1..3';
      relation.properties[0].name = 'newPerson';
      relation.properties[1].cardinality = '*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
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
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '1..*';
      relation.properties[1].cardinality = '*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model, { createObjectProperty: false });

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <gufo:wasCreatedIn> ]');
      expect(owlCode).toContain('<owl:someValuesFrom> <:Person>');
    });

    it('should generate cardinality axioms using owl:qualifiedCardinality (1)', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '1';
      relation.properties[1].cardinality = '*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model, { createObjectProperty: false });

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> [ <owl:inverseOf> <gufo:wasCreatedIn> ]');
      expect(owlCode).toContain('<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });

    it('should generate cardinality axioms using owl:minQualifiedCardinality (2..*)', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '*';
      relation.properties[1].cardinality = '2..*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model, { createObjectProperty: false });

      expect(owlCode).toContain('<:Person> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <gufo:wasCreatedIn>');
      expect(owlCode).toContain('<owl:minQualifiedCardinality> "2"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Birth>');
    });

    it('should generate cardinality axioms using owl:maxQualifiedCardinality (0..1)', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '*';
      relation.properties[1].cardinality = '0..1';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model, { createObjectProperty: false });

      expect(owlCode).toContain('<:Person> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <gufo:wasCreatedIn>');
      expect(owlCode).toContain('<owl:maxQualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Birth>');
    });

    it('should generate cardinality axioms using owl:minQualifiedCardinality and owl:maxQualifiedCardinality (1..3)', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '1..3';
      relation.properties[1].cardinality = '*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
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
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '1..*';
      relation.properties[1].cardinality = '*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model, { createObjectProperty: false, createInverses: true });

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <gufoi:created>');
      expect(owlCode).toContain('<owl:someValuesFrom> <:Person>');
    });

    it('should generate cardinality axioms using owl:qualifiedCardinality (1) and gufoi:created', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '1';
      relation.properties[1].cardinality = '*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model, { createObjectProperty: false, createInverses: true });

      expect(owlCode).toContain('<:Birth> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <gufoi:created>');
      expect(owlCode).toContain('<owl:qualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Person>');
    });

    it('should generate cardinality axioms using owl:minQualifiedCardinality (2..*) and gufo:wasCreatedIn', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '*';
      relation.properties[1].cardinality = '2..*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model, { createObjectProperty: false, createInverses: true });

      expect(owlCode).toContain('<:Person> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <gufo:wasCreatedIn>');
      expect(owlCode).toContain('<owl:minQualifiedCardinality> "2"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Birth>');
    });

    it('should generate cardinality axioms using owl:maxQualifiedCardinality (0..1) and gufo:wasCreatedIn', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '*';
      relation.properties[1].cardinality = '0..1';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
      const owlCode = generateGufo(model, { createObjectProperty: false, createInverses: true });

      expect(owlCode).toContain('<:Person> <rdfs:subClassOf> [');
      expect(owlCode).toContain('<rdf:type> <owl:Restriction>');
      expect(owlCode).toContain('<owl:onProperty> <gufo:wasCreatedIn>');
      expect(owlCode).toContain('<owl:maxQualifiedCardinality> "1"^^<xsd:nonNegativeInteger>;');
      expect(owlCode).toContain('<owl:onClass> <:Birth>');
    });

    it('should generate cardinality axioms using owl:minQualifiedCardinality and owl:maxQualifiedCardinality (1..3) and gufoi:created', () => {
      const class1 = OntoumlFactory.createKind('Person');
      const class2 = OntoumlFactory.createEvent('Birth');
      const relation = OntoumlFactory.createCreation('was born in', class1, class2);
      relation.properties[0].cardinality = '1..3';
      relation.properties[1].cardinality = '*';
      const model = OntoumlFactory.createPackage('Model', [class1, class2, relation]);
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
