import {
  Class,
  OntoumlType,
  ClassStereotype,
  OntologicalNature,
  Property,
  Literal,
  Project,
  serialization,
  ORDERLESS_LEVEL,
  natures,
  stereotypes,
  PropertyStereotype,
  Generalization
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

  describe(`Test ${Class.prototype.isRestrictedToEndurant.name}()`, () => {
    const model = new Project().createModel();
    const kind = model.createKind('kind');
    const category = model.createCategory('category', [...natures.EndurantNatures]);
    const type = model.createType('type');
    const event = model.createEvent('event');
    const situation = model.createSituation('situation');
    const abstract = model.createAbstract('abstract');
    const datatype = model.createDatatype('datatype');
    const enumeration = model.createEnumeration('enumeration');
    const emptyRestrictions = model.createClass('emptyRestrictions');

    it('Test regular kind', () => expect(kind.isRestrictedToEndurant()).toBe(true));
    it('Test broad category', () => expect(category.isRestrictedToEndurant()).toBe(true));
    it('Test type', () => expect(type.isRestrictedToEndurant()).toBe(false));
    it('Test event', () => expect(event.isRestrictedToEndurant()).toBe(false));
    it('Test situation', () => expect(situation.isRestrictedToEndurant()).toBe(false));
    it('Test abstract', () => expect(abstract.isRestrictedToEndurant()).toBe(false));
    it('Test datatype', () => expect(datatype.isRestrictedToEndurant()).toBe(false));
    it('Test enumeration', () => expect(enumeration.isRestrictedToEndurant()).toBe(false));
    it('Test class with empty restrictedTo', () => expect(emptyRestrictions.isRestrictedToEndurant()).toBe(false));
  });

  describe(`Test ${Class.prototype.isRestrictedToSubstantial.name}()`, () => {
    const model = new Project().createModel();
    const categoryOfSubstantials = model.createCategory('categoryOfSubstantials', [...natures.SubstantialNatures]);
    const kind = model.createKind('kind');
    const categoryOfEndurants = model.createCategory('categoryOfEndurants', [...natures.EndurantNatures]);
    const mode = model.createIntrinsicMode('mode');

    it('Test regular kind', () => expect(kind.isRestrictedToSubstantial()).toBe(true));
    it('Test broad categoryOfSubstantials', () => expect(categoryOfSubstantials.isRestrictedToSubstantial()).toBe(true));
    it('Test broad mode', () => expect(mode.isRestrictedToSubstantial()).toBe(false));
    it('Test broad categoryOfEndurants', () => expect(categoryOfEndurants.isRestrictedToSubstantial()).toBe(false));
  });

  describe(`Test ${Class.prototype.isRestrictedToMoment.name}()`, () => {
    const model = new Project().createModel();
    const categoryOfMoments = model.createCategory('categoryOfMoments', [...natures.MomentNatures]);
    const mode = model.createIntrinsicMode('mode');
    const categoryOfEndurants = model.createCategory('categoryOfEndurants', [...natures.EndurantNatures]);
    const kind = model.createKind('kind');

    it('Test broad mode', () => expect(mode.isRestrictedToMoment()).toBe(true));
    it('Test broad categoryOfSubstantials', () => expect(categoryOfMoments.isRestrictedToMoment()).toBe(true));
    it('Test regular kind', () => expect(kind.isRestrictedToMoment()).toBe(false));
    it('Test broad categoryOfEndurants', () => expect(categoryOfEndurants.isRestrictedToMoment()).toBe(false));
  });

  describe(`Test ${Class.prototype.isRestrictedToFunctionalComplex.name}()`, () => {
    const model = new Project().createModel();
    const kind = model.createKind('kind');
    const collective = model.createCollective('kind');
    const quantity = model.createQuantity('kind');

    it('Test broad kind', () => expect(kind.isRestrictedToFunctionalComplex()).toBe(true));
    it('Test broad collective', () => expect(collective.isRestrictedToFunctionalComplex()).toBe(false));
    it('Test broad quantity', () => expect(quantity.isRestrictedToFunctionalComplex()).toBe(false));
  });

  describe(`Test ${Class.prototype.isRestrictedToCollective.name}()`, () => {
    const model = new Project().createModel();
    const kind = model.createKind('kind');
    const collective = model.createCollective('kind');
    const quantity = model.createQuantity('kind');

    it('Test broad kind', () => expect(kind.isRestrictedToCollective()).toBe(false));
    it('Test broad collective', () => expect(collective.isRestrictedToCollective()).toBe(true));
    it('Test broad quantity', () => expect(quantity.isRestrictedToCollective()).toBe(false));
  });

  describe(`Test ${Class.prototype.isRestrictedToQuantity.name}()`, () => {
    const model = new Project().createModel();
    const kind = model.createKind('kind');
    const collective = model.createCollective('kind');
    const quantity = model.createQuantity('kind');

    it('Test broad kind', () => expect(kind.isRestrictedToQuantity()).toBe(false));
    it('Test broad collective', () => expect(collective.isRestrictedToQuantity()).toBe(false));
    it('Test broad quantity', () => expect(quantity.isRestrictedToQuantity()).toBe(true));
  });

  describe(`Test ${Class.prototype.isRestrictedToIntrinsicMoment.name}()`, () => {
    const model = new Project().createModel();
    const categoryOfIntrinsicMoments = model.createCategory('categoryOfMoments', [...natures.IntrinsicMomentNatures]);
    const mode = model.createIntrinsicMode('mode');
    const quality = model.createQuality('quality');
    const categoryOfExtrinsicMoments = model.createCategory('categoryOfExtrinsicMoments', [...natures.ExtrinsicMomentNatures]);
    const relator = model.createRelator('relator');

    it('Test broad mode', () => expect(mode.isRestrictedToIntrinsicMoment()).toBe(true));
    it('Test broad quality', () => expect(quality.isRestrictedToIntrinsicMoment()).toBe(true));
    it('Test broad categoryOfIntrinsicMoments', () =>
      expect(categoryOfIntrinsicMoments.isRestrictedToIntrinsicMoment()).toBe(true));
    it('Test regular relator', () => expect(relator.isRestrictedToIntrinsicMoment()).toBe(false));
    it('Test broad categoryOfExtrinsicMoments', () =>
      expect(categoryOfExtrinsicMoments.isRestrictedToIntrinsicMoment()).toBe(false));
  });

  describe(`Test ${Class.prototype.isRestrictedToExtrinsicMoment.name}()`, () => {
    const model = new Project().createModel();
    const categoryOfExtrinsicMoments = model.createCategory('categoryOfExtrinsicMoments', [...natures.ExtrinsicMomentNatures]);
    const mode = model.createExtrinsicMode('mode');
    const relator = model.createRelator('relator');
    const categoryOfIntrinsicMoments = model.createCategory('categoryOfMoments', [...natures.IntrinsicMomentNatures]);
    const quality = model.createQuality('quality');

    it('Test broad mode', () => expect(mode.isRestrictedToExtrinsicMoment()).toBe(true));
    it('Test regular relator', () => expect(relator.isRestrictedToExtrinsicMoment()).toBe(true));
    it('Test broad categoryOfExtrinsicMoments', () =>
      expect(categoryOfExtrinsicMoments.isRestrictedToExtrinsicMoment()).toBe(true));
    it('Test broad quality', () => expect(quality.isRestrictedToExtrinsicMoment()).toBe(false));
    it('Test broad categoryOfIntrinsicMoments', () =>
      expect(categoryOfIntrinsicMoments.isRestrictedToExtrinsicMoment()).toBe(false));
  });

  describe(`Test ${Class.prototype.isRestrictedToIntrinsicMode.name}()`, () => {
    const model = new Project().createModel();
    const quality = model.createQuality('quality');
    const mode = model.createIntrinsicMode('mode');

    it('Test mode', () => expect(mode.isRestrictedToIntrinsicMode()).toBe(true));
    it('Test quality', () => expect(quality.isRestrictedToIntrinsicMode()).toBe(false));
  });

  describe(`Test ${Class.prototype.isRestrictedToQuality.name}()`, () => {
    const model = new Project().createModel();
    const quality = model.createQuality('quality');
    const mode = model.createIntrinsicMode('mode');

    it('Test quality', () => expect(quality.isRestrictedToQuality()).toBe(true));
    it('Test mode', () => expect(mode.isRestrictedToQuality()).toBe(false));
  });

  describe(`Test ${Class.prototype.isRestrictedToExtrinsicMode.name}()`, () => {
    const model = new Project().createModel();
    const mode = model.createExtrinsicMode('mode');
    const relator = model.createRelator('relator');

    it('Test mode', () => expect(mode.isRestrictedToExtrinsicMode()).toBe(true));
    it('Test relator', () => expect(relator.isRestrictedToExtrinsicMode()).toBe(false));
  });

  describe(`Test ${Class.prototype.isRestrictedToRelator.name}()`, () => {
    const model = new Project().createModel();
    const relator = model.createRelator('relator');
    const mode = model.createExtrinsicMode('mode');

    it('Test relator', () => expect(relator.isRestrictedToRelator()).toBe(true));
    it('Test mode', () => expect(mode.isRestrictedToRelator()).toBe(false));
  });

  describe(`Test ${Class.prototype.isRestrictedToEvent.name}()`, () => {
    const model = new Project().createModel();
    const event = model.createEvent('event');
    const situation = model.createSituation('situation');

    it(`Test ${event.name}`, () => expect(event.isRestrictedToEvent()).toBe(true));
    it(`Test ${situation.name}`, () => expect(situation.isRestrictedToEvent()).toBe(false));
  });

  describe(`Test ${Class.prototype.isRestrictedToSituation.name}()`, () => {
    const model = new Project().createModel();
    const situation = model.createSituation('situation');
    const type = model.createType('type');

    it(`Test ${situation.name}`, () => expect(situation.isRestrictedToSituation()).toBe(true));
    it(`Test ${type.name}`, () => expect(type.isRestrictedToSituation()).toBe(false));
  });

  describe(`Test ${Class.prototype.isRestrictedToType.name}()`, () => {
    const model = new Project().createModel();
    const type = model.createType('type');
    const abstract = model.createAbstract('abstract');

    it(`Test ${type.name}`, () => expect(type.isRestrictedToType()).toBe(true));
    it(`Test ${abstract.name}`, () => expect(abstract.isRestrictedToType()).toBe(false));
  });

  describe(`Test ${Class.prototype.isRestrictedToAbstract.name}()`, () => {
    const model = new Project().createModel();
    const abstract = model.createAbstract('abstract');
    const event = model.createEvent('event');

    it(`Test ${abstract.name}`, () => expect(abstract.isRestrictedToAbstract()).toBe(true));
    it(`Test ${event.name}`, () => expect(event.isRestrictedToAbstract()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasValidStereotypeValue.name}()`, () => {
    const model = new Project().createModel();
    const classWithValidStereotype = model.createClass('classWithValidStereotype');
    const classWithNonValidStereotype = model.createClass('classWithNonValidStereotype');
    const classWithoutStereotypes = model.createClass('classWithoutStereotypes');
    const classWithMultipleStereotypes = model.createClass('classWithMultipleStereotypes');

    stereotypes.ClassStereotypes.forEach((stereotype: ClassStereotype) =>
      it(`Test class with stereotype '${stereotype}'`, () => {
        classWithValidStereotype.stereotypes = [stereotype];
        expect(classWithValidStereotype.hasValidStereotypeValue()).toBe(true);
      })
    );

    classWithNonValidStereotype.stereotypes = [PropertyStereotype.BEGIN as any];
    classWithMultipleStereotypes.stereotypes = [ClassStereotype.ABSTRACT, ClassStereotype.CATEGORY];

    it(`Test ${classWithNonValidStereotype.name}`, () =>
      expect(classWithNonValidStereotype.hasValidStereotypeValue()).toBe(false));
    it(`Test ${classWithoutStereotypes.name}`, () => expect(classWithoutStereotypes.hasValidStereotypeValue()).toBe(false));
    it(`Test ${classWithMultipleStereotypes.name}`, () =>
      expect(classWithMultipleStereotypes.hasValidStereotypeValue()).toBe(false));
  });

  describe(`Test ${Class.prototype.getUniqueStereotype.name}()`, () => {
    const model = new Project().createModel();
    const classWithoutStereotypes = model.createClass();
    const classWithUniqueStereotype = model.createKind();
    const classWithMultipleStereotypes = model.createClass();

    classWithMultipleStereotypes.stereotypes = [ClassStereotype.ABSTRACT, ClassStereotype.CATEGORY];

    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.getUniqueStereotype()).toBeFalsy());
    it('Test classWithUniqueStereotype', () =>
      expect(classWithUniqueStereotype.getUniqueStereotype()).toBe(ClassStereotype.KIND));
    it('Test classWithMultipleStereotypes', () => expect(() => classWithMultipleStereotypes.getUniqueStereotype()).toThrow());
  });

  describe(`Test ${Class.prototype.hasStereotypeContainedIn.name}()`, () => {
    const model = new Project().createModel();
    const classWithoutStereotypes = model.createClass();
    const classWithUniqueStereotype = model.createKind();
    const classWithMultipleStereotypes = model.createClass();

    classWithMultipleStereotypes.stereotypes = [ClassStereotype.ABSTRACT, ClassStereotype.CATEGORY];

    it('Test classWithoutStereotypes', () =>
      expect(classWithoutStereotypes.hasStereotypeContainedIn(stereotypes.ClassStereotypes)).toBe(false));
    it('Test classWithUniqueStereotype', () =>
      expect(classWithUniqueStereotype.hasStereotypeContainedIn(ClassStereotype.KIND)).toBe(true));
    it('Test classWithMultipleStereotypes', () =>
      expect(() => classWithMultipleStereotypes.hasStereotypeContainedIn(stereotypes.NonSortalStereotypes)).toThrow());
  });

  describe(`Test ${Class.prototype.hasTypeStereotype.name}()`, () => {
    const model = new Project().createModel();
    const type = model.createType();
    const anotherClass = model.createKind();
    const classWithoutStereotypes = model.createClass();

    it('Test type', () => expect(type.hasTypeStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasTypeStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasTypeStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasEventStereotype.name}()`, () => {
    const model = new Project().createModel();
    const event = model.createEvent();
    const anotherClass = model.createSituation();
    const classWithoutStereotypes = model.createClass();

    it('Test event', () => expect(event.hasEventStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasEventStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasEventStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasSituationStereotype.name}()`, () => {
    const model = new Project().createModel();
    const situation = model.createSituation();
    const anotherClass = model.createAbstract();
    const classWithoutStereotypes = model.createClass();

    it('Test situation', () => expect(situation.hasSituationStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasSituationStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasSituationStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasAbstractStereotype.name}()`, () => {
    const model = new Project().createModel();
    const abstract = model.createAbstract();
    const anotherClass = model.createDatatype();
    const classWithoutStereotypes = model.createClass();

    it('Test abstract', () => expect(abstract.hasAbstractStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasAbstractStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasAbstractStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasDatatypeStereotype.name}()`, () => {
    const model = new Project().createModel();
    const datatype = model.createDatatype();
    const anotherClass = model.createEnumeration();
    const classWithoutStereotypes = model.createClass();

    it('Test datatype', () => expect(datatype.hasDatatypeStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasDatatypeStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasDatatypeStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasEnumerationStereotype.name}()`, () => {
    const model = new Project().createModel();
    const enumeration = model.createEnumeration();
    const anotherClass = model.createType();
    const classWithoutStereotypes = model.createClass();

    it('Test enumeration', () => expect(enumeration.hasEnumerationStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasEnumerationStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasEnumerationStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.isComplexDatatype.name}()`, () => {
    const model = new Project().createModel();
    const rgbColor = model.createDatatype();
    const red = model.createDatatype();
    const green = model.createDatatype();
    const blue = model.createDatatype();

    rgbColor.createAttribute(red);
    rgbColor.createAttribute(green);
    rgbColor.createAttribute(blue);

    const anotherClass = model.createEnumeration();
    const classWithoutStereotypes = model.createClass();

    it('Test complex datatype', () => expect(rgbColor.isComplexDatatype()).toBe(true));
    it('Test atomic/simple datatype', () => expect(red.isComplexDatatype()).toBe(false));
    it('Test anotherClass', () => expect(anotherClass.isComplexDatatype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.isComplexDatatype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasEndurantOnlyStereotype.name}()`, () => {
    const model = new Project().createModel();
    const category = model.createCategory();
    const kind = model.createKind();
    const relator = model.createRelator();
    const subkind = model.createSubkind();
    const anotherClass = model.createEvent();
    const classWithoutStereotypes = model.createClass();

    it('Test category', () => expect(category.hasEndurantOnlyStereotype()).toBe(true));
    it('Test kind', () => expect(kind.hasEndurantOnlyStereotype()).toBe(true));
    it('Test relator', () => expect(relator.hasEndurantOnlyStereotype()).toBe(true));
    it('Test subkind', () => expect(subkind.hasEndurantOnlyStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasEndurantOnlyStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasEndurantOnlyStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasMomentOnlyStereotype.name}()`, () => {
    const model = new Project().createModel();
    const mode = model.createIntrinsicMode();
    const relator = model.createRelator();
    const roleMixin = model.createRoleMixin();
    const collective = model.createCollective();
    const role = model.createRole();
    const anotherClass = model.createEvent();
    const classWithoutStereotypes = model.createClass();

    it('Test mode', () => expect(mode.hasMomentOnlyStereotype()).toBe(true));
    it('Test relator', () => expect(relator.hasMomentOnlyStereotype()).toBe(true));
    it('Test roleMixin', () => expect(roleMixin.hasMomentOnlyStereotype()).toBe(false));
    it('Test collective', () => expect(collective.hasMomentOnlyStereotype()).toBe(false));
    it('Test role', () => expect(role.hasMomentOnlyStereotype()).toBe(false));
    it('Test anotherClass', () => expect(anotherClass.hasMomentOnlyStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasMomentOnlyStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasSubstantialOnlyStereotype.name}()`, () => {
    const model = new Project().createModel();
    const collective = model.createCollective();
    const quantity = model.createQuantity();
    const phaseMixin = model.createPhaseMixin();
    const relator = model.createRelator();
    const phase = model.createPhase();
    const anotherClass = model.createEvent();
    const classWithoutStereotypes = model.createClass();

    it('Test collective', () => expect(collective.hasSubstantialOnlyStereotype()).toBe(true));
    it('Test quantity', () => expect(quantity.hasSubstantialOnlyStereotype()).toBe(true));
    it('Test relator', () => expect(relator.hasSubstantialOnlyStereotype()).toBe(false));
    it('Test phaseMixin', () => expect(phaseMixin.hasSubstantialOnlyStereotype()).toBe(false));
    it('Test phase', () => expect(phase.hasSubstantialOnlyStereotype()).toBe(false));
    it('Test anotherClass', () => expect(anotherClass.hasSubstantialOnlyStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasSubstantialOnlyStereotype()).toBe(false));
  });

  describe(`Test Class.${Class.haveRigidStereotypes.name}()`, () => {
    const model = new Project().createModel();
    const quality = model.createQuality();
    const subkind = model.createQuantity();
    const event = model.createEvent();
    const mixin = model.createMixin();
    const phase = model.createPhase();
    const classWithoutStereotypes = model.createClass();

    it('Test rigid classes', () => expect(Class.haveRigidStereotypes([quality, subkind])).toBe(true));
    it('Test non-rigid classes', () => expect(Class.haveRigidStereotypes([mixin, phase])).toBe(false));
    it('Test mixed classes', () => expect(Class.haveRigidStereotypes([classWithoutStereotypes, event])).toBe(false));
  });

  describe(`Test ${Class.prototype.hasRigidStereotype.name}()`, () => {
    const model = new Project().createModel();
    const quality = model.createQuality();
    const subkind = model.createQuantity();
    const mixin = model.createMixin();
    const phase = model.createPhase();
    const event = model.createEvent();
    const abstract = model.createAbstract();
    const classWithoutStereotypes = model.createClass();

    it('Test quality', () => expect(quality.hasRigidStereotype()).toBe(true));
    it('Test subkind', () => expect(subkind.hasRigidStereotype()).toBe(true));
    it('Test event', () => expect(event.hasRigidStereotype()).toBe(true));
    it('Test abstract', () => expect(abstract.hasRigidStereotype()).toBe(true));
    it('Test mixin', () => expect(mixin.hasRigidStereotype()).toBe(false));
    it('Test phase', () => expect(phase.hasRigidStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasRigidStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasSemiRigidStereotype.name}()`, () => {
    const model = new Project().createModel();
    const mixin = model.createMixin();
    const quality = model.createQuality();
    const phase = model.createPhase();
    const event = model.createEvent();
    const classWithoutStereotypes = model.createClass();

    it('Test mixin', () => expect(mixin.hasSemiRigidStereotype()).toBe(true));
    it('Test quality', () => expect(quality.hasSemiRigidStereotype()).toBe(false));
    it('Test event', () => expect(event.hasSemiRigidStereotype()).toBe(false));
    it('Test phase', () => expect(phase.hasSemiRigidStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasSemiRigidStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasAntiRigidStereotype.name}()`, () => {
    const model = new Project().createModel();
    const historicalRole = model.createHistoricalRole();
    const historicalRoleMixin = model.createHistoricalRoleMixin();
    const mixin = model.createMixin();
    const type = model.createType();
    const classWithoutStereotypes = model.createClass();

    it('Test historicalRole', () => expect(historicalRole.hasAntiRigidStereotype()).toBe(true));
    it('Test historicalRoleMixin', () => expect(historicalRoleMixin.hasAntiRigidStereotype()).toBe(true));
    it('Test mixin', () => expect(mixin.hasAntiRigidStereotype()).toBe(false));
    it('Test type', () => expect(type.hasAntiRigidStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasAntiRigidStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasNonSortalStereotype.name}()`, () => {
    const model = new Project().createModel();
    const historicalRoleMixin = model.createHistoricalRoleMixin();
    const mixin = model.createMixin();
    const historicalRole = model.createHistoricalRole();
    const type = model.createType();
    const classWithoutStereotypes = model.createClass();

    it('Test historicalRoleMixin', () => expect(historicalRoleMixin.hasNonSortalStereotype()).toBe(true));
    it('Test mixin', () => expect(mixin.hasNonSortalStereotype()).toBe(true));
    it('Test historicalRole', () => expect(historicalRole.hasNonSortalStereotype()).toBe(false));
    it('Test type', () => expect(type.hasNonSortalStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasNonSortalStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasSortalStereotype.name}()`, () => {
    const model = new Project().createModel();
    const historicalRoleMixin = model.createHistoricalRoleMixin();
    const mixin = model.createMixin();
    const historicalRole = model.createHistoricalRole();
    const type = model.createType();
    const classWithoutStereotypes = model.createClass();

    it('Test historicalRoleMixin', () => expect(historicalRoleMixin.hasNonSortalStereotype()).toBe(true));
    it('Test mixin', () => expect(mixin.hasNonSortalStereotype()).toBe(true));
    it('Test historicalRole', () => expect(historicalRole.hasNonSortalStereotype()).toBe(false));
    it('Test type', () => expect(type.hasNonSortalStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasNonSortalStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasUltimateSortalStereotype.name}()`, () => {
    const model = new Project().createModel();
    const quality = model.createQuality();
    const anotherClass = model.createHistoricalRole();
    const classWithoutStereotypes = model.createClass();

    it('Test quality', () => expect(quality.hasUltimateSortalStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasUltimateSortalStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasUltimateSortalStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasBaseSortalStereotype.name}()`, () => {
    const model = new Project().createModel();
    const subkind = model.createSubkind();
    const anotherClass = model.createKind();
    const classWithoutStereotypes = model.createClass();

    it('Test subkind', () => expect(subkind.hasBaseSortalStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasBaseSortalStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasBaseSortalStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasKindStereotype.name}()`, () => {
    const model = new Project().createModel();
    const kind = model.createKind();
    const anotherClass = model.createCollective();
    const classWithoutStereotypes = model.createClass();

    it('Test kind', () => expect(kind.hasKindStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasKindStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasKindStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasCollectiveStereotype.name}()`, () => {
    const model = new Project().createModel();
    const collective = model.createCollective();
    const anotherClass = model.createQuantity();
    const classWithoutStereotypes = model.createClass();

    it('Test collective', () => expect(collective.hasCollectiveStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasCollectiveStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasCollectiveStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasQuantityStereotype.name}()`, () => {
    const model = new Project().createModel();
    const quantity = model.createQuantity();
    const anotherClass = model.createRelator();
    const classWithoutStereotypes = model.createClass();

    it('Test quantity', () => expect(quantity.hasQuantityStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasQuantityStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasQuantityStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasRelatorStereotype.name}()`, () => {
    const model = new Project().createModel();
    const relator = model.createRelator();
    const anotherClass = model.createIntrinsicMode();
    const classWithoutStereotypes = model.createClass();

    it('Test relator', () => expect(relator.hasRelatorStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasRelatorStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasRelatorStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasQualityStereotype.name}()`, () => {
    const model = new Project().createModel();
    const quality = model.createQuality();
    const anotherClass = model.createExtrinsicMode();
    const classWithoutStereotypes = model.createClass();

    it('Test quality', () => expect(quality.hasQualityStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasQualityStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasQualityStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasModeStereotype.name}()`, () => {
    const model = new Project().createModel();
    const intrinsicMode = model.createIntrinsicMode();
    const extrinsicMode = model.createExtrinsicMode();
    const anotherClass = model.createQuality();
    const classWithoutStereotypes = model.createClass();

    it('Test intrinsicMode', () => expect(intrinsicMode.hasModeStereotype()).toBe(true));
    it('Test extrinsicMode', () => expect(extrinsicMode.hasModeStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasModeStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasModeStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasSubkindStereotype.name}()`, () => {
    const model = new Project().createModel();
    const subkind = model.createSubkind();
    const anotherClass = model.createRole();
    const classWithoutStereotypes = model.createClass();

    it('Test subkind', () => expect(subkind.hasSubkindStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasSubkindStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasSubkindStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasPhaseStereotype.name}()`, () => {
    const model = new Project().createModel();
    const phase = model.createPhase();
    const anotherClass = model.createHistoricalRole();
    const classWithoutStereotypes = model.createClass();

    it('Test phase', () => expect(phase.hasPhaseStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasPhaseStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasPhaseStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasRoleStereotype.name}()`, () => {
    const model = new Project().createModel();
    const role = model.createRole();
    const anotherClass = model.createPhase();
    const classWithoutStereotypes = model.createClass();

    it('Test role', () => expect(role.hasRoleStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasRoleStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasRoleStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasHistoricalRoleStereotype.name}()`, () => {
    const model = new Project().createModel();
    const historicalRole = model.createHistoricalRole();
    const anotherClass = model.createHistoricalRoleMixin();
    const classWithoutStereotypes = model.createClass();

    it('Test historicalRole', () => expect(historicalRole.hasHistoricalRoleStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasHistoricalRoleStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasHistoricalRoleStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasCategoryStereotype.name}()`, () => {
    const model = new Project().createModel();
    const category = model.createCategory();
    const anotherClass = model.createPhaseMixin();
    const classWithoutStereotypes = model.createClass();

    it('Test category', () => expect(category.hasCategoryStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasCategoryStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasCategoryStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasPhaseMixinStereotype.name}()`, () => {
    const model = new Project().createModel();
    const phaseMixin = model.createPhaseMixin();
    const anotherClass = model.createRoleMixin();
    const classWithoutStereotypes = model.createClass();

    it('Test phaseMixin', () => expect(phaseMixin.hasPhaseMixinStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasPhaseMixinStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasPhaseMixinStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasRoleMixinStereotype.name}()`, () => {
    const model = new Project().createModel();
    const roleMixin = model.createRoleMixin();
    const anotherClass = model.createHistoricalRoleMixin();
    const classWithoutStereotypes = model.createClass();

    it('Test roleMixin', () => expect(roleMixin.hasRoleMixinStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasRoleMixinStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasRoleMixinStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasHistoricalRoleMixinStereotype.name}()`, () => {
    const model = new Project().createModel();
    const historicalRoleMixin = model.createHistoricalRoleMixin();
    const anotherClass = model.createMixin();
    const classWithoutStereotypes = model.createClass();

    it('Test historicalRoleMixin', () => expect(historicalRoleMixin.hasHistoricalRoleMixinStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasHistoricalRoleMixinStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasHistoricalRoleMixinStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.hasMixinStereotype.name}()`, () => {
    const model = new Project().createModel();
    const mixin = model.createMixin();
    const anotherClass = model.createType();
    const classWithoutStereotypes = model.createClass();

    it('Test mixin', () => expect(mixin.hasMixinStereotype()).toBe(true));
    it('Test anotherClass', () => expect(anotherClass.hasMixinStereotype()).toBe(false));
    it('Test classWithoutStereotypes', () => expect(classWithoutStereotypes.hasMixinStereotype()).toBe(false));
  });

  describe(`Test ${Class.prototype.getGeneralizations.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();
    model.createGeneralization(agent, person);

    it('Test function call', () => expect(agent.getGeneralizations().length).toBe(1));
  });

  describe(`Test ${Class.prototype.getGeneralizationSets.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();
    const agentIntoPerson = model.createGeneralization(agent, person);
    model.createGeneralizationSet(agentIntoPerson);

    it('Test function call', () => expect(agent.getGeneralizationSets().length).toBe(1));
  });

  describe(`Test ${Class.prototype.getGeneralizationsWhereGeneral.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();
    model.createGeneralization(agent, person);

    it('Test function call', () => expect(agent.getGeneralizationsWhereGeneral().length).toBe(1));
  });

  describe(`Test ${Class.prototype.getGeneralizationsWhereSpecific.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();
    model.createGeneralization(agent, person);

    it('Test function call', () => expect(agent.getGeneralizationsWhereGeneral().length).toBe(1));
  });

  describe(`Test ${Class.prototype.getGeneralizationSetsWhereGeneral.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();
    const agentIntoPerson = model.createGeneralization(agent, person);
    model.createGeneralizationSet(agentIntoPerson);

    it('Test function call', () => expect(agent.getGeneralizationSetsWhereGeneral().length).toBe(1));
  });

  describe(`Test ${Class.prototype.getGeneralizationSetsWhereSpecific.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();
    const agentIntoPerson = model.createGeneralization(agent, person);
    model.createGeneralizationSet(agentIntoPerson);

    it('Test function call', () => expect(person.getGeneralizationSetsWhereSpecific().length).toBe(1));
  });

  describe(`Test ${Class.prototype.getGeneralizationSetsWhereCategorizer.name}()`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const agent = model.createClass();
    const agentType = model.createClass();
    const person = model.createClass();
    const organization = pkg.createClass();
    const agentIntoPerson = model.createGeneralization(agent, person);
    const agentIntoOrganization = model.createGeneralization(agent, organization);
    const genSet = pkg.createGeneralizationSet([agentIntoPerson, agentIntoOrganization], false, false, agentType);

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

  describe(`Test ${Class.prototype.getParents.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();
    model.createGeneralization(agent, person);

    it('Test function call', () => expect(person.getParents().length).toBe(1));
  });

  describe(`Test ${Class.prototype.getChildren.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();
    model.createGeneralization(agent, person);

    it('Test function call', () => expect(agent.getChildren().length).toBe(1));
  });

  describe(`Test ${Class.prototype.getAncestors.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();
    model.createGeneralization(agent, person);

    it('Test function call', () => expect(person.getAncestors().length).toBe(1));
  });

  describe(`Test ${Class.prototype.getDescendants.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();
    model.createGeneralization(agent, person);

    it('Test function call', () => expect(agent.getDescendants().length).toBe(1));
  });

  describe(`Test ${Class.prototype.getFilteredAncestors.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();
    const passFilter = () => true;
    model.createGeneralization(agent, person);

    it('Test function call', () => expect(person.getFilteredAncestors(passFilter).length).toBe(1));
  });

  describe(`Test ${Class.prototype.getFilteredDescendants.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();
    const passFilter = () => true;
    model.createGeneralization(agent, person);

    it('Test function call', () => expect(agent.getFilteredDescendants(passFilter).length).toBe(1));
  });

  describe(`Test ${Class.prototype.getUltimateSortalAncestors.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createCategory();
    const person = model.createKind();
    const student = model.createRole();
    model.createGeneralization(agent, person);
    model.createGeneralization(person, student);

    it('Test function call', () => {
      const studentAncestors = student.getUltimateSortalAncestors();
      expect(studentAncestors).toContain(person);
      expect(studentAncestors.length).toBe(1);
      expect(agent.getUltimateSortalAncestors().length).toBe(0);
      expect(person.getUltimateSortalAncestors().length).toBe(0);
    });
  });

  describe(`Test ${Class.prototype.getUltimateSortalsDescendants.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createCategory();
    const person = model.createKind();
    const student = model.createRole();
    model.createGeneralization(agent, person);
    model.createGeneralization(person, student);

    it('Test function call', () => {
      const agentDescendants = agent.getUltimateSortalsDescendants();
      expect(agentDescendants).toContain(person);
      expect(agentDescendants.length).toBe(1);
      expect(person.getUltimateSortalsDescendants().length).toBe(0);
      expect(student.getUltimateSortalsDescendants().length).toBe(0);
    });
  });

  describe(`Test ${Class.prototype.getSortalAncestors.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createCategory();
    const person = model.createKind();
    const student = model.createRole();
    model.createGeneralization(agent, person);
    model.createGeneralization(person, student);

    it('Test function call', () => {
      const studentAncestors = student.getSortalAncestors();
      expect(studentAncestors).toContain(person);
      expect(studentAncestors.length).toBe(1);
      expect(agent.getSortalAncestors().length).toBe(0);
      expect(person.getSortalAncestors().length).toBe(0);
    });
  });

  describe(`Test ${Class.prototype.getSortalDescendants.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createCategory();
    const person = model.createKind();
    const student = model.createRole();
    model.createGeneralization(agent, person);
    model.createGeneralization(person, student);

    it('Test function call', () => {
      const agentDescendants = agent.getSortalDescendants();
      expect(agentDescendants).toContain(person);
      expect(agentDescendants).toContain(student);
      expect(agentDescendants.length).toBe(2);
      expect(person.getSortalDescendants().length).toBe(1);
      expect(student.getSortalDescendants().length).toBe(0);
    });
  });

  describe(`Test ${Class.prototype.getBaseSortalAncestors.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createCategory();
    const person = model.createKind();
    const student = model.createRole();
    const phdStudent = model.createRole();
    model.createGeneralization(agent, person);
    model.createGeneralization(person, student);
    model.createGeneralization(student, phdStudent);

    it('Test function call', () => {
      const phdStudentAncestors = phdStudent.getBaseSortalAncestors();
      expect(phdStudentAncestors).toContain(student);
      expect(phdStudentAncestors.length).toBe(1);
      expect(agent.getBaseSortalAncestors().length).toBe(0);
      expect(person.getBaseSortalAncestors().length).toBe(0);
      expect(student.getBaseSortalAncestors().length).toBe(0);
    });
  });

  describe(`Test ${Class.prototype.getBaseSortalDescendants.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createCategory();
    const person = model.createKind();
    const student = model.createRole();
    model.createGeneralization(agent, person);
    model.createGeneralization(person, student);

    it('Test function call', () => {
      const agentDescendants = agent.getBaseSortalDescendants();
      expect(agentDescendants).toContain(student);
      expect(agentDescendants.length).toBe(1);
      expect(person.getBaseSortalDescendants().length).toBe(1);
      expect(student.getBaseSortalDescendants().length).toBe(0);
    });
  });

  describe(`Test ${Class.prototype.getNonSortalAncestors.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createCategory();
    const person = model.createKind();
    const student = model.createRole();
    model.createGeneralization(agent, person);
    model.createGeneralization(person, student);

    it('Test function call', () => {
      const studentAncestors = student.getNonSortalAncestors();
      expect(studentAncestors).toContain(agent);
      expect(studentAncestors.length).toBe(1);
      expect(agent.getNonSortalAncestors().length).toBe(0);
      expect(person.getNonSortalAncestors().length).toBe(1);
    });
  });

  describe(`Test ${Class.prototype.getNonSortalDescendants.name}()`, () => {
    const model = new Project().createModel();
    const entity = model.createCategory();
    const agent = model.createCategory();
    const person = model.createKind();
    const student = model.createRole();
    model.createGeneralization(entity, agent);
    model.createGeneralization(agent, person);
    model.createGeneralization(person, student);

    it('Test function call', () => {
      const entityDescendants = entity.getNonSortalDescendants();
      expect(entityDescendants).toContain(agent);
      expect(entityDescendants.length).toBe(1);
      expect(agent.getNonSortalDescendants().length).toBe(0);
      expect(person.getNonSortalDescendants().length).toBe(0);
      expect(student.getNonSortalDescendants().length).toBe(0);
    });
  });

  describe(`Test ${Class.prototype.getRigidAncestors.name}()`, () => {});

  describe(`Test ${Class.prototype.getRigidDescendants.name}()`, () => {});

  describe(`Test ${Class.prototype.getSemiRigidAncestors.name}()`, () => {});

  describe(`Test ${Class.prototype.getSemiRigidDescendants.name}()`, () => {});

  describe(`Test ${Class.prototype.getAntiRigidAncestors.name}()`, () => {});

  describe(`Test ${Class.prototype.getAntiRigidDescendants.name}()`, () => {});

  describe(`Test ${Class.prototype.getOwnAttributes.name}()`, () => {});

  describe(`Test ${Class.prototype.getAllAttributes.name}()`, () => {});

  describe(`Test ${Class.prototype.getOwnLiterals.name}()`, () => {});

  describe(`Test ${Class.prototype.getAllLiterals.name}()`, () => {});

  describe(`Test ${Class.prototype.clone.name}()`, () => {});

  describe(`Test ${Class.prototype.replace.name}()`, () => {});
});
