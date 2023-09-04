import {
  Class,
  Project,
  Package,
  Generalization,
  GeneralizationSet,
  Property
} from '../../src';

describe(`${Class.name} Tests`, () => {
  let proj: Project;
  let agent: Class, person: Class, text: Class;
  let alias: Property, surname: Property;

  beforeAll(() => {
    agent = proj.classBuilder().category().build();
    person = proj.classBuilder().kind().build();
    text = proj.classBuilder().datatype().build();

    alias = agent.attributeBuilder().type(text).build();
    surname = agent.attributeBuilder().type(text).build();

    agent.addChild(person);
  });

  describe(`Test ${Class.prototype.attributes}()`, () => {
    it('Retrieve own attributes', () => {
      expect(agent.attributes).toEqual([alias]);
      expect(person.attributes).toEqual([surname]);
      expect(text.attributes).toEqual([]);
    });
  });

  describe(`Test ${Class.prototype.getAllAttributes.name}()`, () => {
    it('Retrieve all attributes', () => {
      const personAttributes = person.getAllAttributes();

      expect(personAttributes).toContain(alias);
      expect(personAttributes).toContain(surname);
      expect(personAttributes.length).toBe(2);
      expect(text.attributes).toEqual([]);
    });
  });

  // Tiago: CONTINUE HERE.

  // describe(`Test ${Class.prototype.getLiterals.name}()`, () => {
  //   it('Retrieve own literals', () => {
  //     const enumerationA = proj.createEnumeration();
  //     const enumerationB = proj.createEnumeration();
  //     const enumerationN = proj.createEnumeration();
  //     const litA = enumerationA.createLiteral();
  //     const litB = enumerationB.createLiteral();

  //     proj.createGeneralization(enumerationA, enumerationB);
  //     expect(enumerationA.getLiterals()).toEqual([litA]);
  //     expect(enumerationB.getLiterals()).toEqual([litB]);
  //     expect(enumerationN.getLiterals()).toEqual([]);
  //   });

  //   it('Test exception', () => {
  //     const _class = proj.classBuilder().build();
  //     expect(() => _class.getLiterals()).toThrow();
  //   });
  // });

  // describe(`Test ${Class.prototype.getAllLiterals.name}()`, () => {
  //   it('Retrieve all literals', () => {
  //     const enumerationA = proj.createEnumeration();
  //     const enumerationB = proj.createEnumeration();
  //     const enumerationN = proj.createEnumeration();
  //     const litA = enumerationA.createLiteral();
  //     const litB = enumerationB.createLiteral();

  //     proj.createGeneralization(enumerationA, enumerationB);
  //     const bLiterals = enumerationB.getAllLiterals();

  //     expect(bLiterals).toContain(litA);
  //     expect(bLiterals).toContain(litB);
  //     expect(bLiterals.length).toBe(2);
  //     expect(enumerationN.getAllLiterals()).toEqual([]);
  //   });

  //   it('Test exception', () => {
  //     const _class = proj.classBuilder().build();
  //     expect(() => _class.getAllLiterals()).toThrow();
  //   });
  // });

  // describe(`Test ${Class.prototype.clone.name}()`, () => {
  //   it('Test method', () => {
  //     const classA = proj.classBuilder().build();
  //     const classB = classA.clone();
  //     expect(classA).toEqual(classB);
  //   });

  //   it('Test method', () => {
  //     const classC = new Class();
  //     const classD = classC.clone();
  //     expect(classC).toEqual(classD);
  //   });
  // });
});
