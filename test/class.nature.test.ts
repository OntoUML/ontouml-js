import { describe, expect, it, beforeEach } from '@jest/globals';
import { Class, natureUtils, Nature, Package, Project } from '../src';

describe('Test restrictedTo-related methods', () => {
  let project: Project;
  let model: Package;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

  describe(`Test ${Class.prototype.allowsSome.name}()`, () => {
    let category: Class;

    beforeEach(() => {
      category = model.createCategory(undefined, [
        Nature.FUNCTIONAL_COMPLEX,
        Nature.COLLECTIVE
      ]);
    });

    it('Test empty restrictions', () => {
      expect(category.allowsSome([])).toBe(false);
    });
    it('Test disjoint restrictions', () => {
      expect(category.allowsSome([Nature.QUANTITY])).toBe(false);
    });
    it('Test subset restrictions', () => {
      expect(category.allowsSome([Nature.FUNCTIONAL_COMPLEX])).toBe(true);
    });
    it('Test overlapping restrictions', () => {
      expect(
        category.allowsSome([Nature.FUNCTIONAL_COMPLEX, Nature.QUANTITY])
      ).toBe(true);
    });
    it('Test matching restrictions', () => {
      expect(
        category.allowsSome([Nature.FUNCTIONAL_COMPLEX, Nature.COLLECTIVE])
      ).toBe(true);
    });
    it('Test super set restrictions', () => {
      expect(
        category.allowsSome([
          Nature.FUNCTIONAL_COMPLEX,
          Nature.COLLECTIVE,
          Nature.QUANTITY
        ])
      ).toBe(true);
    });
    it('Test empty own restrictions', () => {
      category.restrictedTo = [];
      expect(
        category.allowsSome([
          Nature.FUNCTIONAL_COMPLEX,
          Nature.COLLECTIVE,
          Nature.QUANTITY
        ])
      ).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.allowsOnly.name}()`, () => {
    let category: Class;

    beforeEach(() => {
      category = model.createCategory(undefined, [
        Nature.FUNCTIONAL_COMPLEX,
        Nature.COLLECTIVE
      ]);
    });

    it('Test empty restrictions', () => {
      expect(category.allowsOnly([])).toBe(false);
    });
    it('Test disjoint restrictions', () => {
      expect(category.allowsOnly([Nature.QUANTITY])).toBe(false);
    });
    it('Test subset restrictions', () => {
      expect(category.allowsOnly([Nature.FUNCTIONAL_COMPLEX])).toBe(false);
    });
    it('Test overlapping restrictions', () => {
      expect(
        category.allowsOnly([Nature.FUNCTIONAL_COMPLEX, Nature.QUANTITY])
      ).toBe(false);
    });
    it('Test matching restrictions', () => {
      expect(
        category.allowsOnly([Nature.FUNCTIONAL_COMPLEX, Nature.COLLECTIVE])
      ).toBe(true);
    });
    it('Test super set restrictions', () => {
      expect(
        category.allowsOnly([
          Nature.FUNCTIONAL_COMPLEX,
          Nature.COLLECTIVE,
          Nature.QUANTITY
        ])
      ).toBe(true);
    });
    it('Test empty own restrictions', () => {
      category.restrictedTo = [];
      expect(
        category.allowsOnly([
          Nature.FUNCTIONAL_COMPLEX,
          Nature.COLLECTIVE,
          Nature.QUANTITY
        ])
      ).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.allowsAll.name}()`, () => {
    let category: Class;

    beforeEach(() => {
      category = model.createCategory(undefined, [
        Nature.FUNCTIONAL_COMPLEX,
        Nature.COLLECTIVE
      ]);
    });

    it('Test empty restrictions', () => {
      expect(category.allowsAll([])).toBe(false);
    });
    it('Test disjoint restrictions', () => {
      expect(category.allowsAll([Nature.QUANTITY])).toBe(false);
    });
    it('Test subset restrictions', () => {
      expect(category.allowsAll([Nature.FUNCTIONAL_COMPLEX])).toBe(true);
    });
    it('Test overlapping restrictions', () => {
      expect(
        category.allowsAll([Nature.FUNCTIONAL_COMPLEX, Nature.QUANTITY])
      ).toBe(false);
    });
    it('Test matching restrictions', () => {
      expect(
        category.allowsAll([Nature.FUNCTIONAL_COMPLEX, Nature.COLLECTIVE])
      ).toBe(true);
    });
    it('Test super set restrictions', () => {
      expect(
        category.allowsAll([
          Nature.FUNCTIONAL_COMPLEX,
          Nature.COLLECTIVE,
          Nature.QUANTITY
        ])
      ).toBe(false);
    });
    it('Test empty own restrictions', () => {
      category.restrictedTo = [];
      expect(
        category.allowsAll([
          Nature.FUNCTIONAL_COMPLEX,
          Nature.COLLECTIVE,
          Nature.QUANTITY
        ])
      ).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.allowsExactly.name}()`, () => {
    let category: Class;

    beforeEach(() => {
      category = model.createCategory(undefined, [
        Nature.FUNCTIONAL_COMPLEX,
        Nature.COLLECTIVE
      ]);
    });

    it('Test empty restrictions', () => {
      expect(category.allowsExactly([])).toBe(false);
    });
    it('Test disjoint restrictions', () => {
      expect(category.allowsExactly([Nature.QUANTITY])).toBe(false);
    });
    it('Test subset restrictions', () => {
      expect(category.allowsExactly([Nature.FUNCTIONAL_COMPLEX])).toBe(false);
    });
    it('Test overlapping restrictions', () => {
      expect(
        category.allowsExactly([Nature.FUNCTIONAL_COMPLEX, Nature.QUANTITY])
      ).toBe(false);
    });
    it('Test matching restrictions', () => {
      expect(
        category.allowsExactly([Nature.FUNCTIONAL_COMPLEX, Nature.COLLECTIVE])
      ).toBe(true);
    });
    it('Test super set restrictions', () => {
      expect(
        category.allowsExactly([
          Nature.FUNCTIONAL_COMPLEX,
          Nature.COLLECTIVE,
          Nature.QUANTITY
        ])
      ).toBe(false);
    });
    it('Test empty own restrictions', () => {
      category.restrictedTo = [];
      expect(
        category.allowsExactly([
          Nature.FUNCTIONAL_COMPLEX,
          Nature.COLLECTIVE,
          Nature.QUANTITY
        ])
      ).toBe(false);
    });
    it('Test matching empty restrictions', () => {
      category.restrictedTo = [];
      expect(category.allowsExactly([])).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isEndurantType.name}()`, () => {
    it('Test regular kind', () => {
      const kind = model.createKind();
      expect(kind.isEndurantType()).toBe(true);
    });
    it('Test broad category', () => {
      const category = model.createCategory('category', [
        ...natureUtils.EndurantNatures
      ]);
      expect(category.isEndurantType()).toBe(true);
    });
    it('Test type', () => {
      const type = model.createType();
      expect(type.isEndurantType()).toBe(false);
    });
    it('Test event', () => {
      const event = model.createEvent();
      expect(event.isEndurantType()).toBe(false);
    });
    it('Test situation', () => {
      const situation = model.createSituation('situation');
      expect(situation.isEndurantType()).toBe(false);
    });
    it('Test abstract', () => {
      const abstract = model.createAbstract();
      expect(abstract.isEndurantType()).toBe(false);
    });
    it('Test datatype', () => {
      const datatype = model.createDatatype('datatype');
      expect(datatype.isEndurantType()).toBe(false);
    });
    it('Test enumeration', () => {
      const enumeration = model.createEnumeration('enumeration');
      expect(enumeration.isEndurantType()).toBe(false);
    });
    it('Test class with empty restrictedTo', () => {
      const emptyRestrictions = model.createClass('emptyRestrictions');
      expect(emptyRestrictions.isEndurantType()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isSubstantialType.name}()`, () => {
    it('Test regular kind', () => {
      const kind = model.createKind();
      expect(kind.isSubstantialType()).toBe(true);
    });
    it('Test broad categoryOfSubstantials', () => {
      const categoryOfSubstantials = model.createCategory(
        'categoryOfSubstantials',
        [...natureUtils.SubstantialNatures]
      );
      expect(categoryOfSubstantials.isSubstantialType()).toBe(true);
    });
    it('Test broad mode', () => {
      const mode = model.createIntrinsicMode('mode');
      expect(mode.isSubstantialType()).toBe(false);
    });
    it('Test broad categoryOfEndurants', () => {
      const categoryOfEndurants = model.createCategory('categoryOfEndurants', [
        ...natureUtils.EndurantNatures
      ]);
      expect(categoryOfEndurants.isSubstantialType()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isMomentType.name}()`, () => {
    it('Test broad mode', () => {
      const mode = model.createIntrinsicMode('mode');
      expect(mode.isMomentType()).toBe(true);
    });

    it('Test broad categoryOfSubstantials', () => {
      const categoryOfMoments = model.createCategory('categoryOfMoments', [
        ...natureUtils.MomentNatures
      ]);
      expect(categoryOfMoments.isMomentType()).toBe(true);
    });

    it('Test regular kind', () => {
      const kind = model.createKind();
      expect(kind.isMomentType()).toBe(false);
    });

    it('Test broad categoryOfEndurants', () => {
      const categoryOfEndurants = model.createCategory('categoryOfEndurants', [
        ...natureUtils.EndurantNatures
      ]);
      expect(categoryOfEndurants.isMomentType()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isFunctionalComplexType.name}()`, () => {
    it('Test broad kind', () => {
      const kind = model.createKind();
      expect(kind.isFunctionalComplexType()).toBe(true);
    });

    it('Test broad collective', () => {
      const collective = model.createCollective();
      expect(collective.isFunctionalComplexType()).toBe(false);
    });

    it('Test broad quantity', () => {
      const quantity = model.createQuantity();
      expect(quantity.isFunctionalComplexType()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isCollectiveType.name}()`, () => {
    it('Test broad kind', () => {
      const kind = model.createKind();
      expect(kind.isCollectiveType()).toBe(false);
    });

    it('Test broad collective', () => {
      const collective = model.createCollective();
      expect(collective.isCollectiveType()).toBe(true);
    });

    it('Test broad quantity', () => {
      const quantity = model.createQuantity();
      expect(quantity.isCollectiveType()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isQuantityType.name}()`, () => {
    it('Test broad kind', () => {
      const kind = model.createKind();
      expect(kind.isQuantityType()).toBe(false);
    });

    it('Test broad collective', () => {
      const collective = model.createCollective();
      expect(collective.isQuantityType()).toBe(false);
    });

    it('Test broad quantity', () => {
      const quantity = model.createQuantity();
      expect(quantity.isQuantityType()).toBe(true);
    });
  });

  describe(`Test ${Class.prototype.isIntrinsicMomentType.name}()`, () => {
    it('Test broad mode', () => {
      const mode = model.createIntrinsicMode('mode');
      expect(mode.isIntrinsicMomentType()).toBe(true);
    });

    it('Test broad quality', () => {
      const quality = model.createQuality('quality');
      expect(quality.isIntrinsicMomentType()).toBe(true);
    });

    it('Test broad categoryOfIntrinsicMoments', () => {
      const categoryOfIntrinsicMoments = model.createCategory(
        'categoryOfMoments',
        [...natureUtils.IntrinsicMomentNatures]
      );
      expect(categoryOfIntrinsicMoments.isIntrinsicMomentType()).toBe(true);
    });

    it('Test regular relator', () => {
      const relator = model.createRelator('relator');
      expect(relator.isIntrinsicMomentType()).toBe(false);
    });

    it('Test broad categoryOfExtrinsicMoments', () => {
      const categoryOfExtrinsicMoments = model.createCategory(
        'categoryOfExtrinsicMoments',
        [...natureUtils.ExtrinsicMomentNatures]
      );
      expect(categoryOfExtrinsicMoments.isIntrinsicMomentType()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isExtrinsicMomentType.name}()`, () => {
    it('Test broad mode', () => {
      const mode = model.createExtrinsicMode('mode');
      expect(mode.isExtrinsicMomentType()).toBe(true);
    });

    it('Test regular relator', () => {
      const relator = model.createRelator('relator');
      expect(relator.isExtrinsicMomentType()).toBe(true);
    });

    it('Test broad categoryOfExtrinsicMoments', () => {
      const categoryOfExtrinsicMoments = model.createCategory(
        'categoryOfExtrinsicMoments',
        [...natureUtils.ExtrinsicMomentNatures]
      );
      expect(categoryOfExtrinsicMoments.isExtrinsicMomentType()).toBe(true);
    });

    it('Test broad quality', () => {
      const quality = model.createQuality('quality');
      expect(quality.isExtrinsicMomentType()).toBe(false);
    });

    it('Test broad categoryOfIntrinsicMoments', () => {
      const categoryOfIntrinsicMoments = model.createCategory(
        'categoryOfMoments',
        [...natureUtils.IntrinsicMomentNatures]
      );
      expect(categoryOfIntrinsicMoments.isExtrinsicMomentType()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.allowsOnlyIntrinsicModes.name}()`, () => {
    it('Test mode', () => {
      const mode = model.createIntrinsicMode('mode');
      expect(mode.allowsOnlyIntrinsicModes()).toBe(true);
    });

    it('Test quality', () => {
      const quality = model.createQuality('quality');
      expect(quality.allowsOnlyIntrinsicModes()).toBe(false);
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

  describe(`Test ${Class.prototype.isExtrinsicModeType.name}()`, () => {
    it('Test mode', () => {
      const mode = model.createExtrinsicMode('mode');
      expect(mode.isExtrinsicModeType()).toBe(true);
    });

    it('Test relator', () => {
      const relator = model.createRelator('relator');
      expect(relator.isExtrinsicModeType()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRelatorType.name}()`, () => {
    it('Test relator', () => {
      const relator = model.createRelator('relator');
      expect(relator.isRelatorType()).toBe(true);
    });

    it('Test mode', () => {
      const mode = model.createExtrinsicMode('mode');
      expect(mode.isRelatorType()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isEventType.name}()`, () => {
    it(`Test event`, () => {
      const event = model.createEvent();
      expect(event.isEventType()).toBe(true);
    });

    it(`Test situation`, () => {
      const situation = model.createSituation('situation');
      expect(situation.isEventType()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isSituationType.name}()`, () => {
    it(`Test situation`, () => {
      const situation = model.createSituation('situation');
      expect(situation.isSituationType()).toBe(true);
    });

    it(`Test type`, () => {
      const type = model.createType();
      expect(type.isSituationType()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isHighOrderType.name}()`, () => {
    it(`Test type`, () => {
      const type = model.createType();
      expect(type.isHighOrderType()).toBe(true);
    });

    it(`Test abstract`, () => {
      const abstract = model.createAbstract();
      expect(abstract.isHighOrderType()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isAbstractType.name}()`, () => {
    it(`Test abstract`, () => {
      const abstract = model.createAbstract();
      expect(abstract.isAbstractType()).toBe(true);
    });

    it(`Test event`, () => {
      const event = model.createEvent();
      expect(event.isAbstractType()).toBe(false);
    });
  });
});
