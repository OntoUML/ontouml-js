import { Class, Generalization, GeneralizationSet, Package, Project } from '@libs/ontouml';

describe('Classifier: Derived fields', () => {
  describe('Model: Person owns Car', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const car = model.createClass();
    const owns = model.createBinaryRelation(person, car);

    it('person should have 1 relational property', () => {
      expect(person.relationalProperties).toContain(owns.properties[1]);
      expect(person.relationalProperties.size).toBe(1);
    });

    it('person should be the type of 1 property', () => {
      expect(person.isTypeOf).toContain(owns.properties[0]);
      expect(person.isTypeOf.size).toBe(1);
    });

    it('car should have 1 relational property', () => {
      expect(car.relationalProperties).toContain(owns.properties[0]);
      expect(car.relationalProperties.size).toBe(1);
    });

    it('car should be the type of 1 property', () => {
      expect(car.isTypeOf).toContain(owns.properties[1]);
      expect(car.isTypeOf.size).toBe(1);
    });
  });

  describe('Model: Person knows Person', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);

    it('person should have 2 relational properties', () => {
      expect(person.relationalProperties).toContain(knows.properties[0]);
      expect(person.relationalProperties).toContain(knows.properties[1]);
      expect(person.relationalProperties.size).toBe(2);
    });

    it('person should be the type of 2 properties', () => {
      expect(person.isTypeOf).toContain(knows.properties[0]);
      expect(person.isTypeOf).toContain(knows.properties[1]);
      expect(person.isTypeOf.size).toBe(2);
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

    it('person should have 2 relational properties', () => {
      expect(person.relationalProperties).toContain(owns.properties[1]);
      expect(person.relationalProperties).toContain(worksAt.properties[1]);
      expect(person.relationalProperties.size).toBe(2);
    });

    it('person should be the type of 2 properties', () => {
      expect(person.isTypeOf).toContain(owns.properties[0]);
      expect(person.isTypeOf).toContain(worksAt.properties[0]);
      expect(person.isTypeOf.size).toBe(2);
    });

    it('car should have 2 relational properties', () => {
      expect(car.relationalProperties).toContain(owns.properties[0]);
      expect(car.relationalProperties).toContain(madeBy.properties[1]);
      expect(car.relationalProperties.size).toBe(2);
    });

    it('car should be the type of 2 properties', () => {
      expect(car.isTypeOf).toContain(owns.properties[1]);
      expect(car.isTypeOf).toContain(madeBy.properties[0]);
      expect(car.isTypeOf.size).toBe(2);
    });

    it('company should have 2 relational properties', () => {
      expect(company.relationalProperties).toContain(worksAt.properties[0]);
      expect(company.relationalProperties).toContain(madeBy.properties[0]);
      expect(company.relationalProperties.size).toBe(2);
    });

    it('company should be the type of 2 properties', () => {
      expect(company.isTypeOf).toContain(worksAt.properties[1]);
      expect(company.isTypeOf).toContain(madeBy.properties[1]);
      expect(company.isTypeOf.size).toBe(2);
    });
  });
});
