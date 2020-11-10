import {
  Class,
  OntoumlType,
  ClassStereotype,
  OntologicalNature,
  Property,
  Literal,
  Project,
  serialization,
  ORDERLESS_LEVEL
} from '@libs/ontouml';

describe(`${Class.name} Tests`, () => {
  describe('Test constructor', () => {
    const emptyClass = new Class();
    const fullyFeaturedClass = new Class({
      stereotypes: [ClassStereotype.CATEGORY],
      restrictedTo: [OntologicalNature.functional_complex],
      isAbstract: true,
      isDerived: true,
      isExtensional: true,
      isPowertype: true,
      order: 2
    });

    it('Test type property descriptor', () => {
      const desc = Object.getOwnPropertyDescriptor(emptyClass, 'type');

      expect(desc.value).toEqual(OntoumlType.CLASS_TYPE);
      expect(desc.enumerable).toBeTruthy();
      expect(desc.writable).toBeFalsy();
      expect(desc.configurable).toBeFalsy();
    });

    it('Test defaults', () => {
      expect(emptyClass.stereotypes).toBeUndefined();
      expect(emptyClass.restrictedTo).toBeUndefined();
      expect(emptyClass.isAbstract).toEqual(false);
      expect(emptyClass.isDerived).toEqual(false);
      expect(emptyClass.isExtensional).toEqual(false);
      expect(emptyClass.isPowertype).toEqual(false);
      expect(emptyClass.order).toEqual(1);
    });

    it('Test overriding defaults', () => {
      expect(fullyFeaturedClass.stereotypes).toBeDefined();
      expect(fullyFeaturedClass.restrictedTo).toBeDefined();
      expect(fullyFeaturedClass.isAbstract).toEqual(true);
      expect(fullyFeaturedClass.isDerived).toEqual(true);
      expect(fullyFeaturedClass.isExtensional).toEqual(true);
      expect(fullyFeaturedClass.isPowertype).toEqual(true);
      expect(fullyFeaturedClass.order).toEqual(2);
    });
  });

  describe(`Test ${Class.prototype.getContents.name}()`, () => {
    const emptyClass = new Class();
    const classWithContents = new Class();

    it('Test class with no contents', () => {
      const contents = emptyClass.getContents();

      expect(contents).toBeInstanceOf(Array);
      expect(contents.length).toBe(0);
    });

    const attribute = new Property();
    const literal = new Literal();

    classWithContents.properties = [attribute];
    classWithContents.literals = [literal];

    it('Test class with contents', () => {
      const contents = classWithContents.getContents();

      expect(contents).toContain(attribute);
      expect(contents).toContain(literal);
      expect(contents.length).toBe(2);
    });
  });

  describe(`Test ${Class.prototype.getAllContents.name}()`, () => {
    const emptyClass = new Class();
    const classWithContents = new Class();

    it('Test class with no contents', () => {
      const contents = emptyClass.getAllContents();

      expect(contents).toBeInstanceOf(Array);
      expect(contents.length).toBe(0);
    });

    const attribute = new Property();
    const literal = new Literal();

    classWithContents.properties = [attribute];
    classWithContents.literals = [literal];

    it('Test class with contents', () => {
      const contents = classWithContents.getAllContents();

      expect(contents).toContain(attribute);
      expect(contents).toContain(literal);
      expect(contents.length).toBe(2);
    });
  });

  describe(`Test ${Class.prototype.toJSON.name}`, () => {
    const project = new Project();
    const model = project.createModel();
    const emptyClass = model.createClass();

    const enumeration = model.createEnumeration();
    const literal = enumeration.createLiteral();

    const fullyFeaturedCategory = model.createCategory({ 'en-US': 'category' }, OntologicalNature.functional_complex, {
      isAbstract: true,
      isDerived: true,
      isExtensional: true,
      isPowertype: true,
      order: ORDERLESS_LEVEL
    });
    const attribute = fullyFeaturedCategory.createAttribute(enumeration);

    it('Test empty class serialization', () => {
      const serialization = emptyClass.toJSON();

      expect(serialization.stereotypes).toEqual(null);
      expect(serialization.restrictedTo).toEqual(null);
      expect(serialization.properties).toEqual(null);
      expect(serialization.literals).toEqual(null);
      expect(serialization.isAbstract).toEqual(false);
      expect(serialization.isDerived).toEqual(false);
      expect(serialization.isExtensional).toEqual(false);
      expect(serialization.isPowertype).toEqual(false);
      expect(serialization.order).toEqual('1');
    });

    it('Test fully featured category serialization', () => {
      const serialization = fullyFeaturedCategory.toJSON();

      expect(serialization.stereotypes).toContain(ClassStereotype.CATEGORY);
      expect(serialization.restrictedTo).toContain(OntologicalNature.functional_complex);
      expect(serialization.properties).toContain(attribute);
      expect(serialization.literals).toEqual(null);
      expect(serialization.isAbstract).toEqual(true);
      expect(serialization.isDerived).toEqual(true);
      expect(serialization.isExtensional).toEqual(true);
      expect(serialization.isPowertype).toEqual(true);
      expect(serialization.order).toEqual('*');
    });

    it('Test enumeration serialization', () => {
      const serialization = enumeration.toJSON();

      expect(serialization.stereotypes).toContain(ClassStereotype.ENUMERATION);
      expect(serialization.restrictedTo).toContain(OntologicalNature.abstract);
      expect(serialization.properties).toEqual(null);
      expect(serialization.literals).toContain(literal);
    });

    it('Test classes serialization within project', () => {
      expect(() => JSON.stringify(project)).not.toThrow();
    });

    // TODO: add validation test
    it('Test classes validation within project', async () => {
      const isValid = await serialization.validate(project);

      if (isValid !== true) {
        console.log('Project serialization is not valid', isValid);
        console.log(JSON.stringify(project, null, 2));
      }

      expect(isValid).toEqual(true);
    });
  });

  describe(`Test ${Class.prototype.createAttribute.name}()`, () => {
    const model = new Project().createModel();
    const enumeration = model.createEnumeration();
    const category = model.createCategory();

    it('Test regular case', () => {
      const att = category.createAttribute(enumeration);

      expect(att).toBeDefined();
      expect(category.properties).toContain(att);
      expect(att.container).toBe(category);
      expect(att.project).toBeDefined();
      expect(att.project).toBe(category.project);
    });

    it('Test exception on enumerations', () => {
      expect(() => enumeration.createAttribute(enumeration)).toThrow();
    });
  });

  describe(`Test ${Class.prototype.createLiteral.name}()`, () => {
    const model = new Project().createModel();
    const enumeration = model.createEnumeration();
    const category = model.createCategory();

    it('Test regular case', () => {
      const literal = enumeration.createLiteral();

      expect(literal).toBeDefined();
      expect(enumeration.literals).toContain(literal);
      expect(literal.container).toBe(enumeration);
      expect(literal.project).toBeDefined();
      expect(literal.project).toBe(enumeration.project);
    });

    it('Test exception on non-enumerations', () => {
      expect(() => category.createLiteral()).toThrow();
    });
  });

  describe(`Test ${Class.prototype.setContainer.name}()`, () => {
    const projectA = new Project();
    const modelA = projectA.createModel();
    const pkgA = modelA.createPackage();

    const projectB = new Project();
    const modelB = projectB.createModel();

    const _class = new Class();
    _class.setProject(projectA);

    it('Test set container within common project', () => {
      _class.setContainer(modelA);
      expect(_class.container).toBe(modelA);
      expect(modelA.contents).toContain(_class);
    });

    it('Test change container within common project', () => {
      _class.setContainer(pkgA);
      expect(_class.container).toBe(pkgA);
      expect(pkgA.contents).toContain(_class);
      expect(modelA.getAllContents()).toContain(_class);
    });

    it('Test exception when changing enclosing project', () => {
      expect(() => _class.setContainer(modelB)).toThrow();
    });
  });

  describe(`Test Class.${Class.areAbstract.name}()`, () => {
    const model = new Project().createModel();
    const kind = model.createKind();
    const category = model.createCategory();
    const mixin = model.createMixin();

    it('Test empty array', () => expect(Class.areAbstract([])).toBe(false));
    it('Test array of non-abstracts', () => expect(Class.areAbstract([kind])).toBe(false));
    it('Test array of containing non-abstract', () => expect(Class.areAbstract([category, kind, mixin])).toBe(false));
    it('Test array of abstracts', () => expect(Class.areAbstract([category, mixin])).toBe(true));
  });

  describe(`Test ${Class.prototype.hasAttributes.name}()`, () => {
    const model = new Project().createModel();
    const enumeration = model.createEnumeration(null, [{}, {}]); // creates two literals
    const kind = model.createKind();

    it('Test class without attributes', () => expect(kind.hasAttributes()).toBe(false));
    it('Test class with attributes', () => {
      kind.createAttribute(enumeration);
      expect(kind.hasAttributes()).toBe(true);
    });
    it('Test enumeration without attributes', () => expect(enumeration.hasAttributes()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasLiterals.name}()`, () => {
    const model = new Project().createModel();
    const enumeration = model.createEnumeration();
    const kind = model.createKind();

    it('Test enumeration without literals', () => expect(enumeration.hasLiterals()).toBe(false));
    it('Test enumeration with literals', () => {
      enumeration.createLiteral();
      expect(enumeration.hasLiterals()).toBe(true);
    });
    it('Test class without literals', () => expect(kind.hasLiterals()).toBe(false));
  });

  describe(`Test ${Class.prototype.restrictedToOverlaps.name}()`, () => {
    const model = new Project().createModel();
    const category = model.createCategory(null, [OntologicalNature.functional_complex, OntologicalNature.collective]);

    it('Test empty restrictions', () => expect(category.restrictedToOverlaps([])).toBe(false));
    it('Test disjoint restrictions', () => expect(category.restrictedToOverlaps([OntologicalNature.quantity])).toBe(false));
    it('Test subset restrictions', () =>
      expect(category.restrictedToOverlaps([OntologicalNature.functional_complex])).toBe(true));
    it('Test overlapping restrictions', () =>
      expect(category.restrictedToOverlaps([OntologicalNature.functional_complex, OntologicalNature.quantity])).toBe(true));
    it('Test matching restrictions', () =>
      expect(category.restrictedToOverlaps([OntologicalNature.functional_complex, OntologicalNature.collective])).toBe(true));
    it('Test super set restrictions', () =>
      expect(
        category.restrictedToOverlaps([
          OntologicalNature.functional_complex,
          OntologicalNature.collective,
          OntologicalNature.quantity
        ])
      ).toBe(true));
    it('Test empty own restrictions', () => {
      category.restrictedTo = [];
      expect(
        category.restrictedToOverlaps([
          OntologicalNature.functional_complex,
          OntologicalNature.collective,
          OntologicalNature.quantity
        ])
      ).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.restrictedToContainedIn.name}()`, () => {
    const model = new Project().createModel();
    const category = model.createCategory(null, [OntologicalNature.functional_complex, OntologicalNature.collective]);

    it('Test empty restrictions', () => expect(category.restrictedToContainedIn([])).toBe(false));
    it('Test disjoint restrictions', () => expect(category.restrictedToContainedIn([OntologicalNature.quantity])).toBe(false));
    it('Test subset restrictions', () =>
      expect(category.restrictedToContainedIn([OntologicalNature.functional_complex])).toBe(false));
    it('Test overlapping restrictions', () =>
      expect(category.restrictedToContainedIn([OntologicalNature.functional_complex, OntologicalNature.quantity])).toBe(false));
    it('Test matching restrictions', () =>
      expect(category.restrictedToContainedIn([OntologicalNature.functional_complex, OntologicalNature.collective])).toBe(true));
    it('Test super set restrictions', () =>
      expect(
        category.restrictedToContainedIn([
          OntologicalNature.functional_complex,
          OntologicalNature.collective,
          OntologicalNature.quantity
        ])
      ).toBe(true));
    it('Test empty own restrictions', () => {
      category.restrictedTo = [];
      expect(
        category.restrictedToContainedIn([
          OntologicalNature.functional_complex,
          OntologicalNature.collective,
          OntologicalNature.quantity
        ])
      ).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.restrictedToContains.name}()`, () => {
    const model = new Project().createModel();
    const category = model.createCategory(null, [OntologicalNature.functional_complex, OntologicalNature.collective]);

    it('Test empty restrictions', () => expect(category.restrictedToContains([])).toBe(false));
    it('Test disjoint restrictions', () => expect(category.restrictedToContains([OntologicalNature.quantity])).toBe(false));
    it('Test subset restrictions', () =>
      expect(category.restrictedToContains([OntologicalNature.functional_complex])).toBe(true));
    it('Test overlapping restrictions', () =>
      expect(category.restrictedToContains([OntologicalNature.functional_complex, OntologicalNature.quantity])).toBe(false));
    it('Test matching restrictions', () =>
      expect(category.restrictedToContains([OntologicalNature.functional_complex, OntologicalNature.collective])).toBe(true));
    it('Test super set restrictions', () =>
      expect(
        category.restrictedToContains([
          OntologicalNature.functional_complex,
          OntologicalNature.collective,
          OntologicalNature.quantity
        ])
      ).toBe(false));
    it('Test empty own restrictions', () => {
      category.restrictedTo = [];
      expect(
        category.restrictedToContains([
          OntologicalNature.functional_complex,
          OntologicalNature.collective,
          OntologicalNature.quantity
        ])
      ).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.restrictedToEquals.name}()`, () => {
    const model = new Project().createModel();
    const category = model.createCategory(null, [OntologicalNature.functional_complex, OntologicalNature.collective]);

    it('Test empty restrictions', () => expect(category.restrictedToEquals([])).toBe(false));
    it('Test disjoint restrictions', () => expect(category.restrictedToEquals([OntologicalNature.quantity])).toBe(false));
    it('Test subset restrictions', () => expect(category.restrictedToEquals([OntologicalNature.functional_complex])).toBe(false));
    it('Test overlapping restrictions', () =>
      expect(category.restrictedToEquals([OntologicalNature.functional_complex, OntologicalNature.quantity])).toBe(false));
    it('Test matching restrictions', () =>
      expect(category.restrictedToEquals([OntologicalNature.functional_complex, OntologicalNature.collective])).toBe(true));
    it('Test super set restrictions', () =>
      expect(
        category.restrictedToEquals([
          OntologicalNature.functional_complex,
          OntologicalNature.collective,
          OntologicalNature.quantity
        ])
      ).toBe(false));
    it('Test empty own restrictions', () => {
      category.restrictedTo = [];
      expect(
        category.restrictedToEquals([
          OntologicalNature.functional_complex,
          OntologicalNature.collective,
          OntologicalNature.quantity
        ])
      ).toBe(false);
    });
    it('Test matching empty restrictions', () => {
      category.restrictedTo = [];
      expect(category.restrictedToEquals([])).toBe(false);
    });
  });
});
