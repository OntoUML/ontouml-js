import { Class, Generalization, GeneralizationSet, Package, Project } from '@libs/ontouml';

describe('Classifier: get relation methods', () => {
  describe('Model: Person owns Car', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const car = model.createClass();
    const owns = model.createBinaryRelation(person, car);

    it("person.getOwnOutgoingRelations() should include 'owns'", () => {
      const relations = person.getOwnOutgoingRelations();
      expect(relations).toContain(owns);
      expect(relations).toHaveLength(1);
    });

    it('person.getOwnIncomingRelations() should return an empty array', () => {
      const relations = person.getOwnIncomingRelations();
      expect(relations).toHaveLength(0);
    });

    it("person.getOwnRelations() should include 'owns'", () => {
      const relations = person.getOwnRelations();
      expect(relations).toContain(owns);
      expect(relations).toHaveLength(1);
    });

    it('car.getOwnOutgoingRelations() should return an empty array', () => {
      const relations = car.getOwnOutgoingRelations();
      expect(relations).toHaveLength(0);
    });

    it("car.getOwnIncomingRelations() should include 'owns'", () => {
      const relations = car.getOwnIncomingRelations();
      expect(relations).toContain(owns);
      expect(relations).toHaveLength(1);
    });

    it("car.getOwnRelations() should include 'owns'", () => {
      const relations = car.getOwnRelations();
      expect(relations).toContain(owns);
      expect(relations).toHaveLength(1);
    });
  });

  describe('Model: Person knows Person', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);

    it("person.getOwnOutgoingRelations() should include 'knows'", () => {
      const relations = person.getOwnOutgoingRelations();
      expect(relations).toContain(knows);
      expect(relations).toHaveLength(1);
    });

    it("car.getOwnIncomingRelations() should include 'knows'", () => {
      const relations = person.getOwnIncomingRelations();
      expect(relations).toContain(knows);
      expect(relations).toHaveLength(1);
    });

    it("person.getOwnRelations() should include 'knows'", () => {
      const relations = person.getOwnRelations();
      expect(relations).toContain(knows);
      expect(relations).toHaveLength(1);
    });
  });

  describe('Model: Person owns Car, Person worksAt Company, Car madeBy Company', () => {
    const model = new Project().createModel();

    const person = model.createClass();
    const car = model.createClass();
    const company = model.createClass();

    const owns = model.createBinaryRelation(person, car);
    const worksAt = model.createBinaryRelation(person, company);
    const madeBy = model.createBinaryRelation(car, company);

    it('person should own 2 outgoing relations', () => {
      const relations = person.getOwnOutgoingRelations();
      expect(relations).toContain(owns);
      expect(relations).toContain(worksAt);
      expect(relations).toHaveLength(2);
    });

    it('person should own no incoming relation', () => {
      const relations = person.getOwnIncomingRelations();
      expect(relations).toHaveLength(0);
    });

    it('person should own 2 relations', () => {
      const relations = person.getOwnRelations();
      expect(relations).toContain(owns);
      expect(relations).toContain(worksAt);
      expect(relations).toHaveLength(2);
    });

    it('car should own 1 outgoing relation', () => {
      const relations = car.getOwnOutgoingRelations();
      expect(relations).toContain(madeBy);
      expect(relations).toHaveLength(1);
    });

    it('car should own 1 incoming relation', () => {
      const relations = car.getOwnIncomingRelations();
      expect(relations).toContain(owns);
      expect(relations).toHaveLength(1);
    });

    it('car should own 2 relations', () => {
      const relations = car.getOwnRelations();
      expect(relations).toContain(madeBy);
      expect(relations).toContain(owns);
      expect(relations).toHaveLength(2);
    });

    it('company should own no outgoing relation', () => {
      const relations = company.getOwnOutgoingRelations();
      expect(relations).toHaveLength(0);
    });

    it('company should own 2 incoming relations', () => {
      const relations = company.getOwnIncomingRelations();
      expect(relations).toContain(madeBy);
      expect(relations).toContain(worksAt);
      expect(relations).toHaveLength(2);
    });

    it('company should own 2 relations', () => {
      const relations = company.getOwnRelations();
      expect(relations).toContain(madeBy);
      expect(relations).toContain(worksAt);
      expect(relations).toHaveLength(2);
    });
  });
});
