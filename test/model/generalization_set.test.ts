import {
  Class,
  Generalization,
  GeneralizationSet,
  Package,
  Project,
  Relation,
  serializationUtils
} from '../../src';

describe(`GeneralizationSet Tests`, () => {
  let model: Package;
  let agent: Class, person: Class, organization: Class;
  let knows: Relation, friendsWith: Relation;
  let gen1: Generalization, gen2: Generalization, gen3: Generalization;
  let gs: GeneralizationSet, gs2: GeneralizationSet;

  beforeEach(() => {
    model = new Project().createModel();
    agent = proj.classBuilder().build();
    person = proj.classBuilder().build();
    organization = proj.classBuilder().build();
    gen1 = model.createGeneralization(agent, person);
    gen2 = model.createGeneralization(agent, organization);
    knows = proj.binaryRelationBuilder().source(person).target(person).build();
    friendsWith = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
    gen3 = model.createGeneralization(knows, friendsWith);
  });

  describe(`Test isPartition()`, () => {
    it('should be false if isDisjoint: false', () => {
      gs = model.createGeneralizationSet([], false, false);
      expect(gs.isPartition()).toBeFalse();
    });

    it('should be false if isComplete: false', () => {
      gs = model.createGeneralizationSet([], true, false);
      expect(gs.isPartition()).toBeFalse();
    });

    it('should be false if isDisjoint: false and isComplete: false', () => {
      gs = model.createGeneralizationSet([], false, false);
      expect(gs.isPartition()).toBeFalse();
    });

    it('should be true if isDisjoint: true and isComplete: true', () => {
      gs = model.createGeneralizationSet([], true, true);
      expect(gs.isPartition()).toBeTrue();
    });
  });

  describe(`Test getGeneral()`, () => {
    let man: Class;
    let gen3: Generalization;

    beforeEach(() => {
      man = proj.classBuilder().build();
      gen3 = model.createGeneralization(person, man);
    });

    it('should return the classifier set as the general in all generalizations within the generalization set (1 gen)', () => {
      gs = model.createGeneralizationSet([gen1]);
      expect(gs.getGeneral()).toBe(agent);
    });

    it('should return the classifier set as the general in all generalizations within the generalization set (2 gens)', () => {
      gs = model.createGeneralizationSet([gen1, gen2]);
      expect(gs.getGeneral()).toBe(agent);
    });

    it('should throw an exception if there is more than one general in the generalizations within the generalization set', () => {
      gs = model.createGeneralizationSet([gen1, gen2, gen3]);
      expect(() => gs.getGeneral()).toThrow();
    });
  });

  describe(`Test getSpecifics()`, () => {
    beforeEach(() => {
      gs = model.createGeneralizationSet([gen1, gen2]);
    });

    it('Should return all specifics', () => {
      const specifics = gs.getSpecifics();

      expect(specifics).toContain(person);
      expect(specifics).toContain(organization);
      expect(specifics).toHaveLength(2);
    });

    it('Should not return duplicates', () => {
      const gen3 = model.createGeneralization(agent, organization);
      gs = model.createGeneralizationSet([gen1, gen2, gen3]);
      const specifics = gs.getSpecifics();

      expect(specifics).toContain(person);
      expect(specifics).toContain(organization);
      expect(specifics).toHaveLength(2);
    });
  });

  describe(`Test getGeneralClass()`, () => {
    it('should return class', () => {
      gs = model.createGeneralizationSet([gen1]);
      expect(gs.getGeneralAsClass()).toBe(agent);
    });

    it('should throw an exception', () => {
      gs2 = model.createGeneralizationSet([gen3]);
      expect(() => gs2.getGeneralAsClass()).toThrow();
    });
  });

  describe(`Test getSpecificClasses()`, () => {
    it('Test function call', () => {
      gs = model.createGeneralizationSet([gen1]);
      expect(gs.getSpecificsAsClasses()).toContain(person);
      expect(gs.getSpecificsAsClasses().length).toBe(1);
    });

    it('Test function call', () => {
      gs2 = model.createGeneralizationSet([gen3]);
      expect(() => gs2.getSpecificsAsClasses()).toThrow();
    });
  });

  describe(`Test getGeneralRelation()`, () => {
    it('Test function call', () => {
      gs = model.createGeneralizationSet([gen1]);
      expect(() => gs.getGeneralAsRelation()).toThrow();
    });

    it('Test function call', () => {
      gs2 = model.createGeneralizationSet([gen3]);
      expect(gs2.getGeneralAsRelation()).toBe(knows);
    });
  });

  describe(`Test getSpecificRelations()`, () => {
    it('Test function call', () => {
      gs = model.createGeneralizationSet([gen1]);
      expect(() => gs.getSpecificsAsRelations()).toThrow();
    });

    it('Test function call', () => {
      gs2 = model.createGeneralizationSet([gen3]);
      expect(gs2.getSpecificsAsRelations()).toContain(friendsWith);
      expect(gs2.getSpecificsAsRelations().length).toBe(1);
    });
  });

  describe(`Test getInvolvedClassifiers()`, () => {
    it('Test function call', () => {
      gs = model.createGeneralizationSet([gen1]);
      expect(gs.getInvolvedClassifiers()).toContain(agent);
      expect(gs.getInvolvedClassifiers()).toContain(person);
      expect(gs.getInvolvedClassifiers().length).toBe(2);
    });

    it('Test function call', () => {
      gs2 = model.createGeneralizationSet([gen3]);
      expect(gs2.getInvolvedClassifiers()).toContain(knows);
      expect(gs2.getInvolvedClassifiers()).toContain(friendsWith);
      expect(gs2.getInvolvedClassifiers().length).toBe(2);
    });
  });

  describe(`Test involvesClasses()`, () => {
    it('Test function call', () => {
      gs = model.createGeneralizationSet([gen1]);
      expect(gs.involvesClasses()).toBeTrue();
    });

    it('Test function call', () => {
      gs2 = model.createGeneralizationSet([gen3]);
      expect(gs2.involvesClasses()).toBeFalse();
    });
  });

  describe(`Test involvesRelations()`, () => {
    it('Test function call', () => {
      const gs = model.createGeneralizationSet([gen1]);
      expect(gs.involvesRelations()).toBeFalse();
    });

    it('Test function call', () => {
      const gs2 = model.createGeneralizationSet([gen3]);
      expect(gs2.involvesRelations()).toBeTrue();
    });
  });

  describe(`Test clone()`, () => {
    it('Test method', () => {
      const classA = proj.classBuilder().build();
      const classB = proj.classBuilder().build();
      const genA = model.createGeneralization(classA, classB);
      const genSetA = model.createGeneralizationSet(genA);
      const genSetB = genSetA.clone();
      expect(genSetA).toEqual(genSetB);
    });

    it('Test method', () => {
      const genSetC = new GeneralizationSet();
      const genSetD = genSetC.clone();
      expect(genSetC).toEqual(genSetD);
    });
  });

  describe(`Test getInstantiationRelations()`, () => {
    // TODO: implement test
  });

  it(`Test setContainer()`, () => {
    gs = model.createGeneralizationSet([gen1]);
    const pkg = model.createPackage();

    expect(gs.container).toBe(model);
    expect(gs.container).not.toBe(pkg);
    expect(model.getContents()).toContain(gs);
    expect(pkg.getContents()).not.toContain(gs);

    pkg.addContent(gs);

    expect(gs.container).toBe(pkg);
    expect(gs.container).not.toBe(model);
    expect(pkg.getContents()).toContain(gs);
    expect(model.getContents()).not.toContain(gs);
  });

  describe(`Test toJSON()`, () => {
    const model = new Project().createModel();
    const agentType = proj.classBuilder().build();
    const agent = proj.classBuilder().build();
    const person = proj.classBuilder().build();
    const gen = model.createGeneralization(agent, person, 'agentType');
    const genSet = model.createGeneralizationSet([gen], true, false, agentType);

    it('Test serialization', () =>
      expect(() => JSON.stringify(genSet)).not.toThrow());
  });
});
