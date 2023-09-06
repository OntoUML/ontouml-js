import { Generalization, Project, serializationUtils } from '../../src';

describe(`${Generalization.name} Tests`, () => {
  describe(`Test ${Generalization.prototype.toJSON.name}()`, () => {
    const model = new Project().createModel();
    const agent = proj.classBuilder().build();
    const person = proj.classBuilder().build();
    const gen = model.createGeneralization(agent, person, 'agentType');

    it('Test serialization', () =>
      expect(() => JSON.stringify(gen)).not.toThrow());
  });

  describe(`Test ${Generalization.prototype.setContainer.name}()`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const agent = proj.classBuilder().build();
    const person = pkg.createClass();
    const gen = model.createGeneralization(agent, person);

    it('Test function call', () => {
      expect(gen.container).toBe(model);
      expect(gen.container).not.toBe(pkg);
      expect(model.getContents()).toContain(gen);
      expect(pkg.getContents()).not.toContain(gen);

      pkg.addContent(gen);

      expect(gen.container).toBe(pkg);
      expect(gen.container).not.toBe(model);
      expect(pkg.getContents()).toContain(gen);
      expect(model.getContents()).not.toContain(gen);
    });
  });

  describe(`Test ${Generalization.prototype.getGeneralizationSets.name}()`, () => {
    const model = new Project().createModel();
    const agent = proj.classBuilder().build();
    const person = proj.classBuilder().build();

    const knows = model.createBinaryRelation(agent, agent);
    const friendsWith = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();

    const personGeneralization = model.createGeneralization(agent, person);
    const studentGeneralization = model.createGeneralization(agent, person);
    const relationGeneralization = model.createGeneralization(
      knows,
      friendsWith
    );

    const genSet1 = model.createGeneralizationSet([personGeneralization]);
    const genSet2 = model.createGeneralizationSet([relationGeneralization]);

    it('Test retrieve genSet1', () => {
      const genSets = personGeneralization.getGeneralizationSets();
      expect(genSets).toContain(genSet1);
      expect(genSets.length).toBe(1);
    });

    it('Test retrieve genSet2', () => {
      const genSets = relationGeneralization.getGeneralizationSets();
      expect(genSets).toContain(genSet2);
      expect(genSets.length).toBe(1);
    });

    it('Test retrieve from studentGeneralization', () =>
      expect(studentGeneralization.getGeneralizationSets().length).toBe(0));
  });

  describe(`Test ${Generalization.prototype.involvesClasses.name}()`, () => {
    const model = new Project().createModel();
    const agent = proj.classBuilder().build();
    const person = proj.classBuilder().build();

    const knows = model.createBinaryRelation(agent, agent);
    const friendsWith = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();

    const classGeneralization = model.createGeneralization(agent, person);
    const relationGeneralization = model.createGeneralization(
      knows,
      friendsWith
    );

    it('Test class generalization', () =>
      expect(classGeneralization.involvesClasses()).toBeTruthy());
    it('Test class generalization', () =>
      expect(relationGeneralization.involvesClasses()).toBeFalsy());
  });

  describe(`Test ${Generalization.prototype.involvesRelations.name}()`, () => {
    const model = new Project().createModel();
    const agent = proj.classBuilder().build();
    const person = proj.classBuilder().build();

    const knows = model.createBinaryRelation(agent, agent);
    const friendsWith = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();

    const classGeneralization = model.createGeneralization(agent, person);
    const relationGeneralization = model.createGeneralization(
      knows,
      friendsWith
    );

    it('Test class generalization', () =>
      expect(classGeneralization.involvesRelations()).toBeFalsy());
    it('Test class generalization', () =>
      expect(relationGeneralization.involvesRelations()).toBeTruthy());
  });

  describe(`Test ${Generalization.prototype.clone.name}()`, () => {
    const model = new Project().createModel();
    const classA = proj.classBuilder().build();
    const classB = proj.classBuilder().build();
    const genA = model.createGeneralization(classA, classB);
    const genB = genA.clone();

    const genC = new Generalization();
    const genD = genC.clone();

    it('Test method', () => expect(genA).toEqual(genB));
    it('Test method', () => expect(genC).toEqual(genD));
  });
});
