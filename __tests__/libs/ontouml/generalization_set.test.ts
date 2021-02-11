import { GeneralizationSet, Project, serializationUtils } from '@libs/ontouml';

describe(`${GeneralizationSet.name} Tests`, () => {
  describe(`Test ${GeneralizationSet.prototype.toJSON.name}()`, () => {
    const model = new Project().createModel();
    const agentType = model.createClass();
    const agent = model.createClass();
    const person = model.createClass();
    const gen = model.createGeneralization(agent, person, { en: 'agentType' });
    const genSet = model.createGeneralizationSet([gen], true, false, agentType);

    it('Test serialization', () => expect(() => JSON.stringify(genSet)).not.toThrow());
    it('Test serialization validation', () => expect(serializationUtils.validate(genSet.project)).toBeTruthy());
  });

  describe(`Test ${GeneralizationSet.prototype.setContainer.name}()`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const agent = model.createClass();
    const person = pkg.createClass();
    const gen = model.createGeneralization(agent, person);
    const genSet = model.createGeneralizationSet([gen]);

    it('Test function call', () => {
      expect(genSet.container).toBe(model);
      expect(genSet.container).not.toBe(pkg);
      expect(model.getContents()).toContain(genSet);
      expect(pkg.getContents()).not.toContain(genSet);

      genSet.setContainer(pkg);

      expect(genSet.container).toBe(pkg);
      expect(genSet.container).not.toBe(model);
      expect(pkg.getContents()).toContain(genSet);
      expect(model.getContents()).not.toContain(genSet);
    });
  });

  describe(`Test ${GeneralizationSet.prototype.isPhasePartition.name}()`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const agent = model.createClass();
    const person = pkg.createClass();
    const gen = model.createGeneralization(agent, person);
    const genSet1 = model.createGeneralizationSet([gen]);
    const genSet2 = model.createGeneralizationSet([gen], true, true);

    it('Test function call', () => expect(genSet1.isPhasePartition()).toBe(false));
    it('Test function call', () => expect(genSet2.isPhasePartition()).toBe(true));
  });

  describe(`Test ${GeneralizationSet.prototype.getGeneral.name}()`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const agent = model.createClass();
    const person = pkg.createClass();
    const gen = model.createGeneralization(agent, person);
    const genSet = model.createGeneralizationSet([gen]);

    it('Test function call', () => expect(genSet.getGeneral()).toBe(agent));
  });

  describe(`Test ${GeneralizationSet.prototype.getSpecifics.name}()`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const agent = model.createClass();
    const person = pkg.createClass();
    const gen = model.createGeneralization(agent, person);
    const genSet = model.createGeneralizationSet([gen]);

    it('Test function call', () => expect(genSet.getSpecifics()).toContain(person));
    it('Test function call', () => expect(genSet.getSpecifics().length).toBe(1));
  });

  describe(`Test ${GeneralizationSet.prototype.getGeneralClass.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();

    const knows = model.createBinaryRelation(agent, agent);
    const friendsWith = model.createBinaryRelation(person, person);

    const personGeneralization = model.createGeneralization(agent, person);
    const relationGeneralization = model.createGeneralization(knows, friendsWith);

    const genSet1 = model.createGeneralizationSet([personGeneralization]);
    const genSet2 = model.createGeneralizationSet([relationGeneralization]);

    it('Test function call', () => expect(genSet1.getGeneralClass()).toBe(agent));
    it('Test function call', () => expect(() => genSet2.getGeneralClass()).toThrow());
  });

  describe(`Test ${GeneralizationSet.prototype.getSpecificClasses.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();

    const knows = model.createBinaryRelation(agent, agent);
    const friendsWith = model.createBinaryRelation(person, person);

    const personGeneralization = model.createGeneralization(agent, person);
    const relationGeneralization = model.createGeneralization(knows, friendsWith);

    const genSet1 = model.createGeneralizationSet([personGeneralization]);
    const genSet2 = model.createGeneralizationSet([relationGeneralization]);

    it('Test function call', () => expect(genSet1.getSpecificClasses()).toContain(person));
    it('Test function call', () => expect(genSet1.getSpecificClasses().length).toBe(1));
    it('Test function call', () => expect(() => genSet2.getSpecificClasses()).toThrow());
  });

  describe(`Test ${GeneralizationSet.prototype.getGeneralRelation.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();

    const knows = model.createBinaryRelation(agent, agent);
    const friendsWith = model.createBinaryRelation(person, person);

    const personGeneralization = model.createGeneralization(agent, person);
    const relationGeneralization = model.createGeneralization(knows, friendsWith);

    const genSet1 = model.createGeneralizationSet([personGeneralization]);
    const genSet2 = model.createGeneralizationSet([relationGeneralization]);

    it('Test function call', () => expect(() => genSet1.getGeneralRelation()).toThrow());
    it('Test function call', () => expect(genSet2.getGeneralRelation()).toBe(knows));
  });

  describe(`Test ${GeneralizationSet.prototype.getSpecificRelations.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();

    const knows = model.createBinaryRelation(agent, agent);
    const friendsWith = model.createBinaryRelation(person, person);

    const personGeneralization = model.createGeneralization(agent, person);
    const relationGeneralization = model.createGeneralization(knows, friendsWith);

    const genSet1 = model.createGeneralizationSet([personGeneralization]);
    const genSet2 = model.createGeneralizationSet([relationGeneralization]);

    it('Test function call', () => expect(() => genSet1.getSpecificRelations()).toThrow());
    it('Test function call', () => expect(genSet2.getSpecificRelations()).toContain(friendsWith));
    it('Test function call', () => expect(genSet2.getSpecificRelations().length).toBe(1));
  });

  describe(`Test ${GeneralizationSet.prototype.getInvolvedClassifiers.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();

    const knows = model.createBinaryRelation(agent, agent);
    const friendsWith = model.createBinaryRelation(person, person);

    const personGeneralization = model.createGeneralization(agent, person);
    const relationGeneralization = model.createGeneralization(knows, friendsWith);

    const genSet1 = model.createGeneralizationSet([personGeneralization]);
    const genSet2 = model.createGeneralizationSet([relationGeneralization]);

    it('Test function call', () => expect(genSet1.getInvolvedClassifiers()).toContain(agent));
    it('Test function call', () => expect(genSet1.getInvolvedClassifiers()).toContain(person));
    it('Test function call', () => expect(genSet1.getInvolvedClassifiers().length).toBe(2));
    it('Test function call', () => expect(genSet2.getInvolvedClassifiers()).toContain(knows));
    it('Test function call', () => expect(genSet2.getInvolvedClassifiers()).toContain(friendsWith));
    it('Test function call', () => expect(genSet2.getInvolvedClassifiers().length).toBe(2));
  });

  describe(`Test ${GeneralizationSet.prototype.involvesClasses.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();

    const knows = model.createBinaryRelation(agent, agent);
    const friendsWith = model.createBinaryRelation(person, person);

    const personGeneralization = model.createGeneralization(agent, person);
    const relationGeneralization = model.createGeneralization(knows, friendsWith);

    const genSet1 = model.createGeneralizationSet([personGeneralization]);
    const genSet2 = model.createGeneralizationSet([relationGeneralization]);

    it('Test function call', () => expect(genSet1.involvesClasses()).toBe(true));
    it('Test function call', () => expect(genSet2.involvesClasses()).toBe(false));
  });

  describe(`Test ${GeneralizationSet.prototype.involvesRelations.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();

    const knows = model.createBinaryRelation(agent, agent);
    const friendsWith = model.createBinaryRelation(person, person);

    const personGeneralization = model.createGeneralization(agent, person);
    const relationGeneralization = model.createGeneralization(knows, friendsWith);

    const genSet1 = model.createGeneralizationSet([personGeneralization]);
    const genSet2 = model.createGeneralizationSet([relationGeneralization]);

    it('Test function call', () => expect(genSet1.involvesRelations()).toBe(false));
    it('Test function call', () => expect(genSet2.involvesRelations()).toBe(true));
  });

  describe(`Test ${GeneralizationSet.prototype.clone.name}()`, () => {
    const model = new Project().createModel();
    const classA = model.createClass();
    const classB = model.createClass();
    const genA = model.createGeneralization(classA, classB);
    const genSetA = model.createGeneralizationSet(genA);
    const genSetB = genSetA.clone();

    const genSetC = new GeneralizationSet();
    const genSetD = genSetC.clone();

    it('Test method', () => expect(genSetA).toEqual(genSetB));
    it('Test method', () => expect(genSetC).toEqual(genSetD));
  });

  describe(`Test ${GeneralizationSet.prototype.getInstantiationRelations.name}()`, () => {
    // TODO: implement test
  });
});
