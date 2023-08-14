import {describe, expect, it, beforeEach, beforeAll} from '@jest/globals';
import {
  Class,
  OntoumlType,
  ClassStereotype,
  OntologicalNature,
  Property,
  Literal,
  Project,
  Package,
  Generalization,
  GeneralizationSet
} from '../src';

describe(`${Class.name} Tests`, () => {
  let project: Project;
  let model: Package;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

  describe('Test constructor', () => {
    it('Test type property descriptor', () => {
      const emptyClass = new Class();
      const desc = Object.getOwnPropertyDescriptor(emptyClass, 'type');

      expect(desc).toBeDefined();
      if(!desc) return;
      
      expect(desc.value).toEqual(OntoumlType.CLASS);
      expect(desc.enumerable).toBeTruthy();
      expect(desc.writable).toBeFalsy();
      expect(desc.configurable).toBeFalsy();
    });

    it('Test defaults', () => {
      const emptyClass = new Class();
      expect(emptyClass.stereotype).toBeNull();
      expect(emptyClass.restrictedTo).toHaveLength(0);
      expect(emptyClass.literals).toHaveLength(0);
      expect(emptyClass.isAbstract).toEqual(false);
      expect(emptyClass.isDerived).toEqual(false);
      expect(emptyClass.isExtensional).toEqual(false);
      expect(emptyClass.isPowertype).toEqual(false);
      expect(emptyClass.order).toEqual(1);
    });

    it('Test overriding defaults', () => {
      const fullyFeaturedClass = new Class({
        stereotype: ClassStereotype.CATEGORY,
        restrictedTo: [OntologicalNature.functional_complex],
        isAbstract: true,
        isDerived: true,
        isExtensional: true,
        isPowertype: true,
        order: 2
      });

      expect(fullyFeaturedClass.stereotype).toBeDefined();
      expect(fullyFeaturedClass.restrictedTo).toBeDefined();
      expect(fullyFeaturedClass.isAbstract).toEqual(true);
      expect(fullyFeaturedClass.isDerived).toEqual(true);
      expect(fullyFeaturedClass.isExtensional).toEqual(true);
      expect(fullyFeaturedClass.isPowertype).toEqual(true);
      expect(fullyFeaturedClass.order).toEqual(2);
    });
  });

  describe(`Test ${Class.prototype.getContents.name}()`, () => {
    it('Test class with no contents', () => {
      const emptyClass = new Class();
      const contents = emptyClass.getContents();

      expect(contents).toBeInstanceOf(Array);
      expect(contents.length).toBe(0);
    });

    it('Test class with contents', () => {
      const classWithContents = new Class();
      const attribute = new Property();
      const literal = new Literal();

      classWithContents.properties = [attribute];
      classWithContents.literals = [literal];
      const contents = classWithContents.getContents();

      expect(contents).toContain(attribute);
      expect(contents).toContain(literal);
      expect(contents.length).toBe(2);
    });
  });

  describe(`Test ${Class.prototype.getAllContents.name}()`, () => {
    it('Test class with no contents', () => {
      const emptyClass = new Class();
      const contents = emptyClass.getAllContents();

      expect(contents).toBeInstanceOf(Array);
      expect(contents.length).toBe(0);
    });

    it('Test class with contents', () => {
      const classWithContents = new Class();
      const attribute = new Property();
      const literal = new Literal();

      classWithContents.properties = [attribute];
      classWithContents.literals = [literal];
      const contents = classWithContents.getAllContents();

      expect(contents).toContain(attribute);
      expect(contents).toContain(literal);
      expect(contents.length).toBe(2);
    });
  });

  describe(`Test ${Class.prototype.createAttribute.name}()`, () => {
    it('Test regular case', () => {
      const enumeration = model.createEnumeration();
      const category = model.createCategory();
      const att = category.createAttribute(enumeration);

      expect(att).toBeDefined();
      expect(category.properties).toContain(att);
      expect(att.container).toBe(category);
      expect(att.project).toBeDefined();
      expect(att.project).toBe(category.project);
    });
  });

  describe(`Test ${Class.prototype.createLiteral.name}()`, () => {
    it('Test regular case', () => {
      const enumeration = model.createEnumeration();
      const literal = enumeration.createLiteral();

      expect(literal).toBeDefined();
      expect(enumeration.literals).toContain(literal);
      expect(literal.container).toBe(enumeration);
      expect(literal.project).toBeDefined();
      expect(literal.project).toBe(enumeration.project);
    });
  });

  describe(`Test ${Class.prototype.setContainer.name}()`, () => {
    const projectA = new Project();
    const modelA = projectA.createModel();
    const pkgA = modelA.createPackage();

    const projectB = new Project();
    const modelB = projectB.createModel();

    const _class = new Class(project);

    it('Test set container within common project', () => {
      _class.setContainer(modelA);
      expect(_class.container).toBe(modelA);
      // TODO discuss change with Claudenir
      // expect(modelA.contents).toContain(_class);
    });

    it('Test change container within common project', () => {
      _class.setContainer(pkgA);
      expect(_class.container).toBe(pkgA);
      // expect(pkgA.contents).toContain(_class);
      // expect(modelA.getAllContents()).toContain(_class);
    });

    // it('Test exception when changing enclosing project', () => {
    //   expect(() => _class.setContainer(modelB)).toThrow();
    // });
  });

  describe(`Test Class.${Class.areAbstract.name}()`, () => {
    let kind: Class, category: Class, mixin: Class;

    beforeAll(() => {
      kind = model.createKind();
      category = model.createCategory();
      mixin = model.createMixin();
    });

    it('Empty array should return false', () => {
      expect(Class.areAbstract([])).toBe(false);
    });

    it('Array with only non-abstract classes should return false', () => {
      expect(Class.areAbstract([kind])).toBe(false);
    });

    it('Array with a non-abstract class should return false', () => {
      expect(Class.areAbstract([category, kind, mixin])).toBe(false);
    });

    it('Array with only abstract classes should return true', () => {
      expect(Class.areAbstract([category, mixin])).toBe(true);
    });
  });

  describe(`Test ${Class.prototype.hasAttributes.name}()`, () => {
    it('Test class without attributes', () => {
      const kind = model.createKind();
      expect(kind.hasAttributes()).toBe(false);
    });

    it('Test class with attributes', () => {
      const kind = model.createKind();
      kind.createAttribute(kind);
      expect(kind.hasAttributes()).toBe(true);
    });

    it('Test enumeration without attributes', () => {
      const enumeration = model.createEnumeration(undefined, [{}, {}]); // creates two literals
      expect(enumeration.hasAttributes()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasLiterals.name}()`, () => {
    it('Test enumeration without literals', () => {
      const enumeration = model.createEnumeration();
      expect(enumeration.hasLiterals()).toBe(false);
    });

    it('Test enumeration with literals', () => {
      const enumeration = model.createEnumeration();
      enumeration.createLiteral();
      expect(enumeration.hasLiterals()).toBe(true);
    });

    it('Test class without literals', () => {
      const kind = model.createKind();
      expect(kind.hasLiterals()).toBe(false);
    });
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
    let agent: Class, agentType: Class, person: Class, organization: Class;
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
