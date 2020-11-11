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
  PropertyStereotype
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

  describe(`Test ${Class.prototype.hasTypeStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasEventStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasSituationStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasAbstractStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasDatatypeStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasEnumerationStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.isComplexDatatype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasEndurantOnlyStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasMomentOnlyStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasSubstantialOnlyStereotype.name}()`, () => {});

  describe(`Test Class.${Class.haveRigidStereotypes.name}()`, () => {});

  describe(`Test ${Class.prototype.hasRigidStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasSemiRigidStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasAntiRigidStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasNonSortalStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasSortalStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasUltimateSortalStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasBaseSortalStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasKindStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasCollectiveStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasQuantityStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasRelatorStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasQualityStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasModeStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasSubkindStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasPhaseStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasRoleStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasHistoricalRoleStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasCategoryStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasPhaseMixinStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasRoleMixinStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasHistoricalRoleMixinStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.hasMixinStereotype.name}()`, () => {});

  describe(`Test ${Class.prototype.getGeneralizations.name}()`, () => {});

  describe(`Test ${Class.prototype.getGeneralizationSets.name}()`, () => {});

  describe(`Test ${Class.prototype.getGeneralizationsWhereGeneral.name}()`, () => {});

  describe(`Test ${Class.prototype.getGeneralizationsWhereSpecific.name}()`, () => {});

  describe(`Test ${Class.prototype.getGeneralizationSetsWhereGeneral.name}()`, () => {});

  describe(`Test ${Class.prototype.getGeneralizationSetsWhereSpecific.name}()`, () => {});

  describe(`Test ${Class.prototype.getGeneralizationSetsWhereCategorizer.name}()`, () => {});

  describe(`Test ${Class.prototype.getParents.name}()`, () => {});

  describe(`Test ${Class.prototype.getChildren.name}()`, () => {});

  describe(`Test ${Class.prototype.getAncestors.name}()`, () => {});

  describe(`Test ${Class.prototype.getDescendants.name}()`, () => {});

  describe(`Test ${Class.prototype.getFilteredAncestors.name}()`, () => {});

  describe(`Test ${Class.prototype.getFilteredDescendants.name}()`, () => {});

  describe(`Test ${Class.prototype.getUltimateSortalAncestors.name}()`, () => {});

  describe(`Test ${Class.prototype.getUltimateSortalsDescendants.name}()`, () => {});

  describe(`Test ${Class.prototype.getSortalAncestors.name}()`, () => {});

  describe(`Test ${Class.prototype.getSortalDescendants.name}()`, () => {});

  describe(`Test ${Class.prototype.getBaseSortalAncestors.name}()`, () => {});

  describe(`Test ${Class.prototype.getBaseSortalDescendants.name}()`, () => {});

  describe(`Test ${Class.prototype.getNonSortalAncestors.name}()`, () => {});

  describe(`Test ${Class.prototype.getNonSortalDescendants.name}()`, () => {});

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
