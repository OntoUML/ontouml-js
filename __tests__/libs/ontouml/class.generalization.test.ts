import { Class, Project, Package, Generalization, GeneralizationSet } from '@libs/ontouml';

describe(`${Class.name} Tests`, () => {
  let project: Project;
  let model: Package;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

  describe(`Test ${Class.prototype.getGeneralizations.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createClass();
      const person = model.createClass();
      model.createGeneralization(agent, person);

      expect(agent.getGeneralizations().length).toBe(1);
    });
  });

  describe(`Test ${Class.prototype.getGeneralizationSets.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createClass();
      const person = model.createClass();
      const agentIntoPerson = model.createGeneralization(agent, person);
      model.createGeneralizationSet(agentIntoPerson);

      expect(agent.getGeneralizationSets().length).toBe(1);
    });
  });

  describe(`Test ${Class.prototype.getGeneralizationsWhereGeneral.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createClass();
      const person = model.createClass();
      model.createGeneralization(agent, person);

      expect(agent.getGeneralizationsWhereGeneral().length).toBe(1);
    });
  });

  describe(`Test ${Class.prototype.getGeneralizationsWhereSpecific.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createClass();
      const person = model.createClass();
      model.createGeneralization(agent, person);

      expect(agent.getGeneralizationsWhereGeneral().length).toBe(1);
    });
  });

  describe(`Test ${Class.prototype.getGeneralizationSetsWhereGeneral.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createClass();
      const person = model.createClass();
      const agentIntoPerson = model.createGeneralization(agent, person);
      model.createGeneralizationSet(agentIntoPerson);

      expect(agent.getGeneralizationSetsWhereGeneral().length).toBe(1);
    });
  });

  describe(`Test ${Class.prototype.getGeneralizationSetsWhereSpecific.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createClass();
      const person = model.createClass();
      const agentIntoPerson = model.createGeneralization(agent, person);
      model.createGeneralizationSet(agentIntoPerson);

      expect(person.getGeneralizationSetsWhereSpecific().length).toBe(1);
    });
  });

  describe(`Test ${Class.prototype.getGeneralizationSetsWhereCategorizer.name}()`, () => {
    let pkg: Package;
    let agent, agentType, person, organization: Class;
    let agentIntoPerson, agentIntoOrganization: Generalization;
    let genSet: GeneralizationSet;

    beforeAll(() => {
      pkg = model.createPackage();
      agent = model.createClass();
      agentType = model.createClass();
      person = model.createClass();
      organization = pkg.createClass();
      agentIntoPerson = model.createGeneralization(agent, person);
      agentIntoOrganization = model.createGeneralization(agent, organization);
      genSet = pkg.createGeneralizationSet([agentIntoPerson, agentIntoOrganization], false, false, agentType);
    });

    it('Test agent generalization sets', () => {
      const agentGeneralizationSets = agent.getGeneralizationSetsWhereCategorizer();
      expect(agentGeneralizationSets.length).toBe(0);
    });

    it('Test person generalization sets', () => {
      const personGeneralizationSets = person.getGeneralizationSetsWhereCategorizer();
      expect(personGeneralizationSets.length).toBe(0);
    });

    it('Test organization generalization sets', () => {
      const organizationGeneralizationSets = organization.getGeneralizationSetsWhereCategorizer();
      expect(organizationGeneralizationSets.length).toBe(0);
    });

    it('Test agentType generalization sets', () => {
      const agentTypeGeneralizationSets = agentType.getGeneralizationSetsWhereCategorizer();
      expect(agentTypeGeneralizationSets).toContain(genSet);
      expect(agentTypeGeneralizationSets.length).toBe(1);
    });
  });

  describe(`Test ${Class.prototype.getAttributes.name}()`, () => {
    it('Retrieve own attributes', () => {
      const agent = model.createCategory();
      const person = model.createKind();
      const text = model.createDatatype();
      const alias = agent.createAttribute(text);
      const surname = person.createAttribute(text);
      model.createGeneralization(agent, person);

      expect(agent.getAttributes()).toEqual([alias]);
      expect(person.getAttributes()).toEqual([surname]);
      expect(text.getAttributes()).toEqual([]);
    });

    it('Test exception', () => {
      const enumeration = model.createEnumeration();
      expect(() => enumeration.getAttributes()).toThrow();
    });
  });

  describe(`Test ${Class.prototype.getAllAttributes.name}()`, () => {
    it('Retrieve all attributes', () => {
      const agent = model.createCategory();
      const person = model.createKind();
      const text = model.createDatatype();
      const alias = agent.createAttribute(text);
      const surname = person.createAttribute(text);
      model.createGeneralization(agent, person);
      const personAttributes = person.getAllAttributes();

      expect(personAttributes).toContain(alias);
      expect(personAttributes).toContain(surname);
      expect(personAttributes.length).toBe(2);
      expect(text.getAttributes()).toEqual([]);
    });

    it('Test exception', () => {
      const enumeration = model.createEnumeration();
      expect(() => enumeration.getAllAttributes()).toThrow();
    });
  });

  describe(`Test ${Class.prototype.getLiterals.name}()`, () => {
    it('Retrieve own literals', () => {
      const enumerationA = model.createEnumeration();
      const enumerationB = model.createEnumeration();
      const enumerationN = model.createEnumeration();
      const litA = enumerationA.createLiteral();
      const litB = enumerationB.createLiteral();

      model.createGeneralization(enumerationA, enumerationB);
      expect(enumerationA.getLiterals()).toEqual([litA]);
      expect(enumerationB.getLiterals()).toEqual([litB]);
      expect(enumerationN.getLiterals()).toEqual([]);
    });

    it('Test exception', () => {
      const _class = model.createClass();
      expect(() => _class.getLiterals()).toThrow();
    });
  });

  describe(`Test ${Class.prototype.getAllLiterals.name}()`, () => {
    it('Retrieve all literals', () => {
      const enumerationA = model.createEnumeration();
      const enumerationB = model.createEnumeration();
      const enumerationN = model.createEnumeration();
      const litA = enumerationA.createLiteral();
      const litB = enumerationB.createLiteral();

      model.createGeneralization(enumerationA, enumerationB);
      const bLiterals = enumerationB.getAllLiterals();

      expect(bLiterals).toContain(litA);
      expect(bLiterals).toContain(litB);
      expect(bLiterals.length).toBe(2);
      expect(enumerationN.getAllLiterals()).toEqual([]);
    });

    it('Test exception', () => {
      const _class = model.createClass();
      expect(() => _class.getAllLiterals()).toThrow();
    });
  });

  describe(`Test ${Class.prototype.clone.name}()`, () => {
    it('Test method', () => {
      const classA = model.createClass();
      const classB = classA.clone();
      expect(classA).toEqual(classB);
    });

    it('Test method', () => {
      const classC = new Class();
      const classD = classC.clone();
      expect(classC).toEqual(classD);
    });
  });
});
