import { Class, Project } from '../../src';

describe(`${Class.name} Tests`, () => {
  let proj: Project;
  let clazz: Class;

  beforeEach(() => {
    proj = new Project();
  });

  describe(`Test ${Class.prototype.getContents.name}()`, () => {
    it('getContents() should return an empty array if the class has no attributes or literals', () => {
      clazz = proj.classBuilder().build();
      const contents = clazz.getContents();

      expect(contents).toEqual([]);
    });

    it('getContents() should return an array containing exactly the one attribute of the class', () => {
      clazz = proj.classBuilder().build();
      const attribute = clazz.attributeBuilder().build();

      const contents = clazz.getContents();
      expect(contents).toEqual([attribute]);
    });

    it('getContents() should return an array containing exactly the two attributes of the class', () => {
      clazz = proj.classBuilder().build();
      const attribute1 = clazz.attributeBuilder().build();
      const attribute2 = clazz.attributeBuilder().build();

      const contents = clazz.getContents();
      expect(contents).toIncludeSameMembers([attribute1, attribute2]);
    });

    it('getContents() should return an array containing exactly the one literal of the class', () => {
      clazz = proj.classBuilder().enumeration().build();
      const literal = clazz.literalBuilder().build();

      const contents = clazz.getContents();
      expect(contents).toEqual([literal]);
    });

    it('getContents() should return an array containing exactly the two literals of the class', () => {
      clazz = proj.classBuilder().enumeration().build();
      const literal1 = clazz.literalBuilder().build();
      const literal2 = clazz.literalBuilder().build();

      const contents = clazz.getContents();
      expect(contents).toIncludeSameMembers([literal1, literal2]);
    });

    it('getContents() should return the attributes and the literals of the class', () => {
      clazz = proj.classBuilder().enumeration().build();
      const attribute = clazz.attributeBuilder().build();
      const literal = clazz.literalBuilder().build();

      const contents = clazz.getContents();
      expect(contents).toIncludeSameMembers([attribute, literal]);
    });
  });

  describe(`Test ${Class.prototype.getAllContents.name}()`, () => {
    it('getAllContents() should return the same values as getContents()', () => {
      clazz = proj.classBuilder().enumeration().build();
      clazz.attributeBuilder().build();
      clazz.literalBuilder().build();

      const contents = clazz.getContents();
      const allContents = clazz.getAllContents();
      expect(allContents).toIncludeSameMembers(contents);
    });
  });

  describe(`Test ${Class.prototype.hasAttributes.name}()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().build();
    });

    it('hasAttributes() should return false if the class has no attributes', () => {
      expect(clazz.hasAttributes()).toBeFalsy();
    });

    it('hasAttributes() should return true if the class has 1 attribute', () => {
      clazz.attributeBuilder().build();
      expect(clazz.hasAttributes()).toBeTruthy();
    });

    it('hasAttributes() should return true if the class has 3 attributes', () => {
      clazz.attributeBuilder().build();
      clazz.attributeBuilder().build();
      clazz.attributeBuilder().build();
      expect(clazz.hasAttributes()).toBeTruthy();
    });
  });

  describe(`Test ${Class.prototype.hasLiterals.name}()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().enumeration().build();
    });

    it('hasLiterals() should return false if the class has no literals', () => {
      expect(clazz.hasLiterals()).toBeFalsy();
    });

    it('hasLiterals() should return true if the class has 1 literal', () => {
      clazz.literalBuilder().build();
      expect(clazz.hasLiterals()).toBeTruthy();
    });

    it('hasLiterals() should return true if the class has 3 literals', () => {
      clazz.literalBuilder().build();
      clazz.literalBuilder().build();
      clazz.literalBuilder().build();
      expect(clazz.hasLiterals()).toBeTruthy();
    });
  });

  // describe(`Test ${Class.prototype.setContainer.name}()`, () => {
  //   const projectA = new Project();
  //   const modelA = projectA.createModel();
  //   const pkgA = modelA.createPackage();

  //   const projectB = new Project();
  //   const modelB = projectB.createModel();

  //   const _class = new Class(proj);

  //   it('Test set container within common project', () => {
  //     _class.setContainer(modelA);
  //     expect(_class.container).toBe(modelA);
  //     // TODO discuss change with Claudenir
  //     // expect(modelA.contents).toContain(_class);
  //   });

  //   it('Test change container within common project', () => {
  //     _class.setContainer(pkgA);
  //     expect(_class.container).toBe(pkgA);
  //     // expect(pkgA.contents).toContain(_class);
  //     // expect(modelA.getAllContents()).toContain(_class);
  //   });

  //   // it('Test exception when changing enclosing project', () => {
  //   //   expect(() => _class.setContainer(modelB)).toThrow();
  //   // });
  // });

  // describe(`Test ${Class.prototype.getGeneralizations.name}()`, () => {
  //   let category: Class, kind: Class, subkind: Class;
  //   let g1: Generalization, g2: Generalization;

  //   beforeEach(() => {
  //     category = proj.classBuilder().category().build();
  //     kind = proj.classBuilder().kind().build();
  //     subkind = proj.classBuilder().subkind().build();
  //     g1 = kind.addParent(category);
  //     g2 = subkind.addParent(kind);
  //   });

  //   it('getGeneralizations() should return the generalization where the class is the general', () => {
  //     expect(category.getGeneralizations()).toContain(g1);
  //   });

  //   it('getGeneralizations() should return the generalization where the class is the specific', () => {
  //     expect(subkind.getGeneralizations()).toContain(g2);
  //   });

  //   it('getGeneralizations() should return the generalizations where the class is the general and the one where it is the specific', () => {
  //     expect(category.getGeneralizations()).toContain(g1);
  //   });
  // });

  // describe(`Test ${Class.prototype.getGeneralizationSets.name}()`, () => {
  //   it('Test function call', () => {
  //     const agent = model.createClass();
  //     const person = model.createClass();
  //     const agentIntoPerson = model.createGeneralization(agent, person);
  //     model.createGeneralizationSet(agentIntoPerson);

  //     expect(agent.getGeneralizationSets().length).toBe(1);
  //   });
  // });

  // describe(`Test ${Class.prototype.getGeneralizationsWhereGeneral.name}()`, () => {
  //   it('Test function call', () => {
  //     const agent = model.createClass();
  //     const person = model.createClass();
  //     model.createGeneralization(agent, person);

  //     expect(agent.getGeneralizationsWhereGeneral().length).toBe(1);
  //   });
  // });

  // describe(`Test ${Class.prototype.getGeneralizationsWhereSpecific.name}()`, () => {
  //   it('Test function call', () => {
  //     const agent = model.createClass();
  //     const person = model.createClass();
  //     model.createGeneralization(agent, person);

  //     expect(agent.getGeneralizationsWhereGeneral().length).toBe(1);
  //   });
  // });

  // describe(`Test ${Class.prototype.getGeneralizationSetsWhereGeneral.name}()`, () => {
  //   it('Test function call', () => {
  //     const agent = model.createClass();
  //     const person = model.createClass();
  //     const agentIntoPerson = model.createGeneralization(agent, person);
  //     model.createGeneralizationSet(agentIntoPerson);

  //     expect(agent.getGeneralizationSetsWhereGeneral().length).toBe(1);
  //   });
  // });

  // describe(`Test ${Class.prototype.getGeneralizationSetsWhereSpecific.name}()`, () => {
  //   it('Test function call', () => {
  //     const agent = model.createClass();
  //     const person = model.createClass();
  //     const agentIntoPerson = model.createGeneralization(agent, person);
  //     model.createGeneralizationSet(agentIntoPerson);

  //     expect(person.getGeneralizationSetsWhereSpecific().length).toBe(1);
  //   });
  // });

  // describe(`Test ${Class.prototype.getGeneralizationSetsWhereCategorizer.name}()`, () => {
  //   let pkg: Package;
  //   let agent: Class, agentType: Class, person: Class, organization: Class;
  //   let agentIntoPerson, agentIntoOrganization: Generalization;
  //   let genSet: GeneralizationSet;

  //   beforeAll(() => {
  //     pkg = model.createPackage();
  //     agent = model.createClass();
  //     agentType = model.createClass();
  //     person = model.createClass();
  //     organization = pkg.createClass();
  //     agentIntoPerson = model.createGeneralization(agent, person);
  //     agentIntoOrganization = model.createGeneralization(agent, organization);
  //     genSet = pkg.createGeneralizationSet(
  //       [agentIntoPerson, agentIntoOrganization],
  //       false,
  //       false,
  //       agentType
  //     );
  //   });

  //   it('Test agent generalization sets', () => {
  //     const agentGeneralizationSets =
  //       agent.getGeneralizationSetsWhereCategorizer();
  //     expect(agentGeneralizationSets.length).toBe(0);
  //   });

  //   it('Test person generalization sets', () => {
  //     const personGeneralizationSets =
  //       person.getGeneralizationSetsWhereCategorizer();
  //     expect(personGeneralizationSets.length).toBe(0);
  //   });

  //   it('Test organization generalization sets', () => {
  //     const organizationGeneralizationSets =
  //       organization.getGeneralizationSetsWhereCategorizer();
  //     expect(organizationGeneralizationSets.length).toBe(0);
  //   });

  //   it('Test agentType generalization sets', () => {
  //     const agentTypeGeneralizationSets =
  //       agentType.getGeneralizationSetsWhereCategorizer();
  //     expect(agentTypeGeneralizationSets).toContain(genSet);
  //     expect(agentTypeGeneralizationSets.length).toBe(1);
  //   });
  // });

  // describe(`Test ${Class.prototype.getAttributes.name}()`, () => {
  //   it('Retrieve own attributes', () => {
  //     const agent = model.createCategory();
  //     const person = model.createKind();
  //     const text = model.createDatatype();
  //     const alias = agent.createAttribute(text);
  //     const surname = person.createAttribute(text);
  //     model.createGeneralization(agent, person);

  //     expect(agent.getAttributes()).toEqual([alias]);
  //     expect(person.getAttributes()).toEqual([surname]);
  //     expect(text.getAttributes()).toEqual([]);
  //   });

  //   it('Test exception', () => {
  //     const enumeration = model.createEnumeration();
  //     expect(() => enumeration.getAttributes()).toThrow();
  //   });
  // });

  // describe(`Test ${Class.prototype.getAllAttributes.name}()`, () => {
  //   it('Retrieve all attributes', () => {
  //     const agent = model.createCategory();
  //     const person = model.createKind();
  //     const text = model.createDatatype();
  //     const alias = agent.createAttribute(text);
  //     const surname = person.createAttribute(text);
  //     model.createGeneralization(agent, person);
  //     const personAttributes = person.getAllAttributes();

  //     expect(personAttributes).toContain(alias);
  //     expect(personAttributes).toContain(surname);
  //     expect(personAttributes.length).toBe(2);
  //     expect(text.getAttributes()).toEqual([]);
  //   });

  //   it('Test exception', () => {
  //     const enumeration = model.createEnumeration();
  //     expect(() => enumeration.getAllAttributes()).toThrow();
  //   });
  // });

  // describe(`Test ${Class.prototype.getLiterals.name}()`, () => {
  //   it('Retrieve own literals', () => {
  //     const enumerationA = model.createEnumeration();
  //     const enumerationB = model.createEnumeration();
  //     const enumerationN = model.createEnumeration();
  //     const litA = enumerationA.createLiteral();
  //     const litB = enumerationB.createLiteral();

  //     model.createGeneralization(enumerationA, enumerationB);
  //     expect(enumerationA.getLiterals()).toEqual([litA]);
  //     expect(enumerationB.getLiterals()).toEqual([litB]);
  //     expect(enumerationN.getLiterals()).toEqual([]);
  //   });

  //   it('Test exception', () => {
  //     const _class = model.createClass();
  //     expect(() => _class.getLiterals()).toThrow();
  //   });
  // });

  // describe(`Test ${Class.prototype.getAllLiterals.name}()`, () => {
  //   it('Retrieve all literals', () => {
  //     const enumerationA = model.createEnumeration();
  //     const enumerationB = model.createEnumeration();
  //     const enumerationN = model.createEnumeration();
  //     const litA = enumerationA.createLiteral();
  //     const litB = enumerationB.createLiteral();

  //     model.createGeneralization(enumerationA, enumerationB);
  //     const bLiterals = enumerationB.getAllLiterals();

  //     expect(bLiterals).toContain(litA);
  //     expect(bLiterals).toContain(litB);
  //     expect(bLiterals.length).toBe(2);
  //     expect(enumerationN.getAllLiterals()).toEqual([]);
  //   });

  //   it('Test exception', () => {
  //     const _class = model.createClass();
  //     expect(() => _class.getAllLiterals()).toThrow();
  //   });
  // });

  // describe(`Test ${Class.prototype.clone.name}()`, () => {
  //   it('Test method', () => {
  //     const classA = model.createClass();
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
