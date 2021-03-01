import { Class, natureUtils, OntologicalNature, Package, Project } from '@libs/ontouml';

describe('Test restrictedTo-related methods', () => {
  let project: Project;
  let model: Package;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

  describe(`Test ${Class.prototype.restrictedToOverlaps.name}()`, () => {
    let category;

    beforeEach(() => {
      category = model.createCategory(null, [OntologicalNature.functional_complex, OntologicalNature.collective]);
    });

    it('Test empty restrictions', () => {
      expect(category.restrictedToOverlaps([])).toBe(false);
    });
    it('Test disjoint restrictions', () => {
      expect(category.restrictedToOverlaps([OntologicalNature.quantity])).toBe(false);
    });
    it('Test subset restrictions', () => {
      expect(category.restrictedToOverlaps([OntologicalNature.functional_complex])).toBe(true);
    });
    it('Test overlapping restrictions', () => {
      expect(category.restrictedToOverlaps([OntologicalNature.functional_complex, OntologicalNature.quantity])).toBe(true);
    });
    it('Test matching restrictions', () => {
      expect(category.restrictedToOverlaps([OntologicalNature.functional_complex, OntologicalNature.collective])).toBe(true);
    });
    it('Test super set restrictions', () => {
      expect(
        category.restrictedToOverlaps([
          OntologicalNature.functional_complex,
          OntologicalNature.collective,
          OntologicalNature.quantity
        ])
      ).toBe(true);
    });
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
    let category;

    beforeEach(() => {
      category = model.createCategory(null, [OntologicalNature.functional_complex, OntologicalNature.collective]);
    });

    it('Test empty restrictions', () => {
      expect(category.restrictedToContainedIn([])).toBe(false);
    });
    it('Test disjoint restrictions', () => {
      expect(category.restrictedToContainedIn([OntologicalNature.quantity])).toBe(false);
    });
    it('Test subset restrictions', () => {
      expect(category.restrictedToContainedIn([OntologicalNature.functional_complex])).toBe(false);
    });
    it('Test overlapping restrictions', () => {
      expect(category.restrictedToContainedIn([OntologicalNature.functional_complex, OntologicalNature.quantity])).toBe(false);
    });
    it('Test matching restrictions', () => {
      expect(category.restrictedToContainedIn([OntologicalNature.functional_complex, OntologicalNature.collective])).toBe(true);
    });
    it('Test super set restrictions', () => {
      expect(
        category.restrictedToContainedIn([
          OntologicalNature.functional_complex,
          OntologicalNature.collective,
          OntologicalNature.quantity
        ])
      ).toBe(true);
    });
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
    let category;

    beforeEach(() => {
      category = model.createCategory(null, [OntologicalNature.functional_complex, OntologicalNature.collective]);
    });

    it('Test empty restrictions', () => {
      expect(category.restrictedToContains([])).toBe(false);
    });
    it('Test disjoint restrictions', () => {
      expect(category.restrictedToContains([OntologicalNature.quantity])).toBe(false);
    });
    it('Test subset restrictions', () => {
      expect(category.restrictedToContains([OntologicalNature.functional_complex])).toBe(true);
    });
    it('Test overlapping restrictions', () => {
      expect(category.restrictedToContains([OntologicalNature.functional_complex, OntologicalNature.quantity])).toBe(false);
    });
    it('Test matching restrictions', () => {
      expect(category.restrictedToContains([OntologicalNature.functional_complex, OntologicalNature.collective])).toBe(true);
    });
    it('Test super set restrictions', () => {
      expect(
        category.restrictedToContains([
          OntologicalNature.functional_complex,
          OntologicalNature.collective,
          OntologicalNature.quantity
        ])
      ).toBe(false);
    });
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
    let category;

    beforeEach(() => {
      category = model.createCategory(null, [OntologicalNature.functional_complex, OntologicalNature.collective]);
    });

    it('Test empty restrictions', () => {
      expect(category.restrictedToEquals([])).toBe(false);
    });
    it('Test disjoint restrictions', () => {
      expect(category.restrictedToEquals([OntologicalNature.quantity])).toBe(false);
    });
    it('Test subset restrictions', () => {
      expect(category.restrictedToEquals([OntologicalNature.functional_complex])).toBe(false);
    });
    it('Test overlapping restrictions', () => {
      expect(category.restrictedToEquals([OntologicalNature.functional_complex, OntologicalNature.quantity])).toBe(false);
    });
    it('Test matching restrictions', () => {
      expect(category.restrictedToEquals([OntologicalNature.functional_complex, OntologicalNature.collective])).toBe(true);
    });
    it('Test super set restrictions', () => {
      expect(
        category.restrictedToEquals([
          OntologicalNature.functional_complex,
          OntologicalNature.collective,
          OntologicalNature.quantity
        ])
      ).toBe(false);
    });
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
    it('Test regular kind', () => {
      const kind = model.createKind();
      expect(kind.isRestrictedToEndurant()).toBe(true);
    });
    it('Test broad category', () => {
      const category = model.createCategory('category', [...natureUtils.EndurantNatures]);
      expect(category.isRestrictedToEndurant()).toBe(true);
    });
    it('Test type', () => {
      const type = model.createType();
      expect(type.isRestrictedToEndurant()).toBe(false);
    });
    it('Test event', () => {
      const event = model.createEvent();
      expect(event.isRestrictedToEndurant()).toBe(false);
    });
    it('Test situation', () => {
      const situation = model.createSituation('situation');
      expect(situation.isRestrictedToEndurant()).toBe(false);
    });
    it('Test abstract', () => {
      const abstract = model.createAbstract();
      expect(abstract.isRestrictedToEndurant()).toBe(false);
    });
    it('Test datatype', () => {
      const datatype = model.createDatatype('datatype');
      expect(datatype.isRestrictedToEndurant()).toBe(false);
    });
    it('Test enumeration', () => {
      const enumeration = model.createEnumeration('enumeration');
      expect(enumeration.isRestrictedToEndurant()).toBe(false);
    });
    it('Test class with empty restrictedTo', () => {
      const emptyRestrictions = model.createClass('emptyRestrictions');
      expect(emptyRestrictions.isRestrictedToEndurant()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRestrictedToSubstantial.name}()`, () => {
    it('Test regular kind', () => {
      const kind = model.createKind();
      expect(kind.isRestrictedToSubstantial()).toBe(true);
    });
    it('Test broad categoryOfSubstantials', () => {
      const categoryOfSubstantials = model.createCategory('categoryOfSubstantials', [...natureUtils.SubstantialNatures]);
      expect(categoryOfSubstantials.isRestrictedToSubstantial()).toBe(true);
    });
    it('Test broad mode', () => {
      const mode = model.createIntrinsicMode('mode');
      expect(mode.isRestrictedToSubstantial()).toBe(false);
    });
    it('Test broad categoryOfEndurants', () => {
      const categoryOfEndurants = model.createCategory('categoryOfEndurants', [...natureUtils.EndurantNatures]);
      expect(categoryOfEndurants.isRestrictedToSubstantial()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRestrictedToMoment.name}()`, () => {
    it('Test broad mode', () => {
      const mode = model.createIntrinsicMode('mode');
      expect(mode.isRestrictedToMoment()).toBe(true);
    });

    it('Test broad categoryOfSubstantials', () => {
      const categoryOfMoments = model.createCategory('categoryOfMoments', [...natureUtils.MomentNatures]);
      expect(categoryOfMoments.isRestrictedToMoment()).toBe(true);
    });

    it('Test regular kind', () => {
      const kind = model.createKind();
      expect(kind.isRestrictedToMoment()).toBe(false);
    });

    it('Test broad categoryOfEndurants', () => {
      const categoryOfEndurants = model.createCategory('categoryOfEndurants', [...natureUtils.EndurantNatures]);
      expect(categoryOfEndurants.isRestrictedToMoment()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRestrictedToFunctionalComplex.name}()`, () => {
    it('Test broad kind', () => {
      const kind = model.createKind();
      expect(kind.isRestrictedToFunctionalComplex()).toBe(true);
    });

    it('Test broad collective', () => {
      const collective = model.createCollective();
      expect(collective.isRestrictedToFunctionalComplex()).toBe(false);
    });

    it('Test broad quantity', () => {
      const quantity = model.createQuantity();
      expect(quantity.isRestrictedToFunctionalComplex()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRestrictedToCollective.name}()`, () => {
    it('Test broad kind', () => {
      const kind = model.createKind();
      expect(kind.isRestrictedToCollective()).toBe(false);
    });

    it('Test broad collective', () => {
      const collective = model.createCollective();
      expect(collective.isRestrictedToCollective()).toBe(true);
    });

    it('Test broad quantity', () => {
      const quantity = model.createQuantity();
      expect(quantity.isRestrictedToCollective()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRestrictedToQuantity.name}()`, () => {
    it('Test broad kind', () => {
      const kind = model.createKind();
      expect(kind.isRestrictedToQuantity()).toBe(false);
    });

    it('Test broad collective', () => {
      const collective = model.createCollective();
      expect(collective.isRestrictedToQuantity()).toBe(false);
    });

    it('Test broad quantity', () => {
      const quantity = model.createQuantity();
      expect(quantity.isRestrictedToQuantity()).toBe(true);
    });
  });

  describe(`Test ${Class.prototype.isRestrictedToIntrinsicMoment.name}()`, () => {
    it('Test broad mode', () => {
      const mode = model.createIntrinsicMode('mode');
      expect(mode.isRestrictedToIntrinsicMoment()).toBe(true);
    });

    it('Test broad quality', () => {
      const quality = model.createQuality('quality');
      expect(quality.isRestrictedToIntrinsicMoment()).toBe(true);
    });

    it('Test broad categoryOfIntrinsicMoments', () => {
      const categoryOfIntrinsicMoments = model.createCategory('categoryOfMoments', [...natureUtils.IntrinsicMomentNatures]);
      expect(categoryOfIntrinsicMoments.isRestrictedToIntrinsicMoment()).toBe(true);
    });

    it('Test regular relator', () => {
      const relator = model.createRelator('relator');
      expect(relator.isRestrictedToIntrinsicMoment()).toBe(false);
    });

    it('Test broad categoryOfExtrinsicMoments', () => {
      const categoryOfExtrinsicMoments = model.createCategory('categoryOfExtrinsicMoments', [
        ...natureUtils.ExtrinsicMomentNatures
      ]);
      expect(categoryOfExtrinsicMoments.isRestrictedToIntrinsicMoment()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRestrictedToExtrinsicMoment.name}()`, () => {
    it('Test broad mode', () => {
      const mode = model.createExtrinsicMode('mode');
      expect(mode.isRestrictedToExtrinsicMoment()).toBe(true);
    });

    it('Test regular relator', () => {
      const relator = model.createRelator('relator');
      expect(relator.isRestrictedToExtrinsicMoment()).toBe(true);
    });

    it('Test broad categoryOfExtrinsicMoments', () => {
      const categoryOfExtrinsicMoments = model.createCategory('categoryOfExtrinsicMoments', [
        ...natureUtils.ExtrinsicMomentNatures
      ]);
      expect(categoryOfExtrinsicMoments.isRestrictedToExtrinsicMoment()).toBe(true);
    });

    it('Test broad quality', () => {
      const quality = model.createQuality('quality');
      expect(quality.isRestrictedToExtrinsicMoment()).toBe(false);
    });

    it('Test broad categoryOfIntrinsicMoments', () => {
      const categoryOfIntrinsicMoments = model.createCategory('categoryOfMoments', [...natureUtils.IntrinsicMomentNatures]);
      expect(categoryOfIntrinsicMoments.isRestrictedToExtrinsicMoment()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRestrictedToIntrinsicMode.name}()`, () => {
    it('Test mode', () => {
      const mode = model.createIntrinsicMode('mode');
      expect(mode.isRestrictedToIntrinsicMode()).toBe(true);
    });

    it('Test quality', () => {
      const quality = model.createQuality('quality');
      expect(quality.isRestrictedToIntrinsicMode()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRestrictedToQuality.name}()`, () => {
    it('Test quality', () => {
      const quality = model.createQuality('quality');
      expect(quality.isRestrictedToQuality()).toBe(true);
    });

    it('Test mode', () => {
      const mode = model.createIntrinsicMode('mode');
      expect(mode.isRestrictedToQuality()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRestrictedToExtrinsicMode.name}()`, () => {
    it('Test mode', () => {
      const mode = model.createExtrinsicMode('mode');
      expect(mode.isRestrictedToExtrinsicMode()).toBe(true);
    });

    it('Test relator', () => {
      const relator = model.createRelator('relator');
      expect(relator.isRestrictedToExtrinsicMode()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRestrictedToRelator.name}()`, () => {
    it('Test relator', () => {
      const relator = model.createRelator('relator');
      expect(relator.isRestrictedToRelator()).toBe(true);
    });

    it('Test mode', () => {
      const mode = model.createExtrinsicMode('mode');
      expect(mode.isRestrictedToRelator()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRestrictedToEvent.name}()`, () => {
    it(`Test event`, () => {
      const event = model.createEvent();
      expect(event.isRestrictedToEvent()).toBe(true);
    });

    it(`Test situation`, () => {
      const situation = model.createSituation('situation');
      expect(situation.isRestrictedToEvent()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRestrictedToSituation.name}()`, () => {
    it(`Test situation`, () => {
      const situation = model.createSituation('situation');
      expect(situation.isRestrictedToSituation()).toBe(true);
    });

    it(`Test type`, () => {
      const type = model.createType();
      expect(type.isRestrictedToSituation()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRestrictedToType.name}()`, () => {
    it(`Test type`, () => {
      const type = model.createType();
      expect(type.isRestrictedToType()).toBe(true);
    });

    it(`Test abstract`, () => {
      const abstract = model.createAbstract();
      expect(abstract.isRestrictedToType()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRestrictedToAbstract.name}()`, () => {
    it(`Test abstract`, () => {
      const abstract = model.createAbstract();
      expect(abstract.isRestrictedToAbstract()).toBe(true);
    });

    it(`Test event`, () => {
      const event = model.createEvent();
      expect(event.isRestrictedToAbstract()).toBe(false);
    });
  });
});
