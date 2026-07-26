import { Class, Project, ClassBuilder } from '../../src';

describe(`${ClassBuilder.name} Tests`, () => {
  let proj: Project;
  let clazz: Class;

  beforeEach(() => {
    proj = new Project();
  });

  describe('Test defaults', () => {
    beforeEach(() => {
      clazz = proj.classBuilder().build();
    });

    it('Class should be created without a container', () => {
      expect(clazz.container).toBeUndefined();
    });

    it('Class should be created with a reference to the project', () => {
      expect(clazz.project).toBe(proj);
    });

    it('Class should be created with stereotype = undefined', () => {
      expect(clazz.stereotype).toBeUndefined();
    });

    it('Class should be created with an empty restrictedTo array', () => {
      expect(clazz.restrictedTo).toHaveLength(0);
    });

    it('Class should be created with an empty array of literals', () => {
      expect(clazz.literals).toEqual([]);
    });

    it('Class should be created with an empty array of properties', () => {
      expect(clazz.properties).toEqual([]);
    });

    it('Class should be created with isAbstract = false', () => {
      expect(clazz.isAbstract).toEqual(false);
    });

    it('Class should be created with isDerived = false', () => {
      expect(clazz.isDerived).toEqual(false);
    });

    it('Class should be created with isPowertype = false', () => {
      expect(clazz.isPowertype).toEqual(false);
    });

    it('Class should be created with order = 1', () => {
      expect(clazz.order).toEqual(1);
    });
  });

  describe(`Test type()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().type().build();
    });

    it('Class should be created with the «type» stereotype', () => {
      expect(clazz.isType()).toBeTrue();
    });

    it('Class should be created with the `type` nature', () => {
      expect(clazz.isHighOrderType()).toBeTrue();
    });

    it('Class should be created with order = 2', () => {
      expect(clazz.order).toEqual(2);
    });
  });

  describe(`Test historicalRole()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().historicalRole().build();
    });

    it('Class should be created with the «historicalRole» stereotype', () => {
      expect(clazz.isHistoricalRole()).toBeTrue();
    });

    it('Class should be created without any nature', () => {
      expect(clazz.restrictedTo).toBeEmpty();
    });

    it('Class should be created with order = 1', () => {
      expect(clazz.order).toEqual(1);
    });
  });

  describe(`Test historicalRoleMixin()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().historicalRoleMixin().build();
    });

    it('Class should be created with the «historicalRoleMixin» stereotype', () => {
      expect(clazz.isHistoricalRoleMixin()).toBeTrue();
    });

    it('Class should be created with the `functional-complex` nature', () => {
      expect(clazz.isFunctionalComplexType()).toBeTrue();
    });

    it('Class should be created with order = 1', () => {
      expect(clazz.order).toEqual(1);
    });
  });

  describe(`Test event()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().event().build();
    });

    it('Class should be created with the «event» stereotype', () => {
      expect(clazz.isEvent()).toBeTrue();
    });

    it('Class should be created with the `event` nature', () => {
      expect(clazz.isEventType()).toBeTrue();
    });

    it('Class should be created with order = 1', () => {
      expect(clazz.order).toEqual(1);
    });
  });

  describe(`Test situation()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().situation().build();
    });

    it('Class should be created with the «situation» stereotype', () => {
      expect(clazz.isSituation()).toBeTrue();
    });

    it('Class should be created with the `situation` nature', () => {
      expect(clazz.isSituationType()).toBeTrue();
    });

    it('Class should be created with order = 1', () => {
      expect(clazz.order).toEqual(1);
    });
  });

  describe(`Test category()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().category().build();
    });

    it('Class should be created with the «category» stereotype', () => {
      expect(clazz.isCategory()).toBeTrue();
    });

    it('Class should be created with the `functional-complex` nature', () => {
      expect(clazz.isFunctionalComplexType()).toBeTrue();
    });

    it('Class should be created with order = 1', () => {
      expect(clazz.order).toEqual(1);
    });
  });

  describe(`Test mixin()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().mixin().build();
    });

    it('Class should be created with the «mixin» stereotype', () => {
      expect(clazz.isMixin()).toBeTrue();
    });

    it('Class should be created with the `functional-complex` nature', () => {
      expect(clazz.isFunctionalComplexType()).toBeTrue();
    });

    it('Class should be created with order = 1', () => {
      expect(clazz.order).toEqual(1);
    });
  });

  describe(`Test roleMixin()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().roleMixin().build();
    });

    it('Class should be created with the «roleMixin» stereotype', () => {
      expect(clazz.isRoleMixin()).toBeTrue();
    });

    it('Class should be created with the `functional-complex` nature', () => {
      expect(clazz.isFunctionalComplexType()).toBeTrue();
    });

    it('Class should be created with order = 1', () => {
      expect(clazz.order).toEqual(1);
    });
  });

  describe(`Test phaseMixin()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().phaseMixin().build();
    });

    it('Class should be created with the «phaseMixin» stereotype', () => {
      expect(clazz.isPhaseMixin()).toBeTrue();
    });

    it('Class should be created with the `functional-complex` nature', () => {
      expect(clazz.isFunctionalComplexType()).toBeTrue();
    });
  });

  describe(`Test kind()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().kind().build();
    });

    it('Class should be created with the «kind» stereotype', () => {
      expect(clazz.isKind()).toBeTrue();
    });

    it('Class should be created with the `functional-complex` nature', () => {
      expect(clazz.isFunctionalComplexType()).toBeTrue();
    });

    it('Class should be created with order = 1', () => {
      expect(clazz.order).toEqual(1);
    });
  });

  describe(`Test collective()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().collective().build();
    });

    it('Class should be created with the «collective» stereotype', () => {
      expect(clazz.isCollective()).toBeTrue();
    });

    it('Class should be created with the `collective` nature', () => {
      expect(clazz.isCollectiveType()).toBeTrue();
    });

    it('Class should be created with order = 1', () => {
      expect(clazz.order).toEqual(1);
    });
  });

  describe(`Test quantity()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().quantity().build();
    });

    it('Class should be created with the «quantity» stereotype', () => {
      expect(clazz.isQuantity()).toBeTrue();
    });

    it('Class should be created with the `quantity` nature', () => {
      expect(clazz.isQuantityType()).toBeTrue();
    });

    it('Class should be created with order = 1', () => {
      expect(clazz.order).toEqual(1);
    });
  });

  describe(`Test relator()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().relator().build();
    });

    it('Class should be created with the «relator» stereotype', () => {
      expect(clazz.isRelator()).toBeTrue();
    });

    it('Class should be created with the `relator` nature', () => {
      expect(clazz.isRelatorType()).toBeTrue();
    });

    it('Class should be created with order = 1', () => {
      expect(clazz.order).toEqual(1);
    });
  });

  describe(`Test quality()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().quality().build();
    });

    it('Class should be created with the «quality» stereotype', () => {
      expect(clazz.isQuality()).toBeTrue();
    });

    it('Class should be created with the `quality` nature', () => {
      expect(clazz.isQualityType()).toBeTrue();
    });

    it('Class should be created with order = 1', () => {
      expect(clazz.order).toEqual(1);
    });
  });

  describe(`Test mode()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().mode().build();
    });

    it('Class should be created with the «mode» stereotype', () => {
      expect(clazz.isMode()).toBeTrue();
    });

    it('Class should be created with the intrinsic-mode nature', () => {
      expect(clazz.isIntrinsicModeType()).toBeTrue();
    });

    it('Class should be created with order = 1', () => {
      expect(clazz.order).toEqual(1);
    });
  });

  describe(`Test subkind()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().subkind().build();
    });

    it('Class should be created with the «subkind» stereotype', () => {
      expect(clazz.isSubkind()).toBeTrue();
    });

    it('Class should be created without any nature', () => {
      expect(clazz.restrictedTo).toBeEmpty();
    });
  });

  describe(`Test role()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().role().build();
    });

    it('Class should be created with the «role» stereotype', () => {
      expect(clazz.isRole()).toBeTrue();
    });

    it('Class should be created without any nature', () => {
      expect(clazz.restrictedTo).toBeEmpty();
    });
  });

  describe(`Test phase()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().phase().build();
    });

    it('Class should be created with the «phase» stereotype', () => {
      expect(clazz.isPhase()).toBeTrue();
    });

    it('Class should be created without any nature', () => {
      expect(clazz.restrictedTo).toBeEmpty();
    });
  });

  describe(`Test abstract()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().abstractClass().build();
    });

    it('Class should be created with the «abstract» stereotype', () => {
      expect(clazz.isAbstractStereotype()).toBeTrue();
    });

    it('Class should be created with the `abstract` nature', () => {
      expect(clazz.isAbstractType()).toBeTrue();
    });

    it('Class should be created with order = 1', () => {
      expect(clazz.order).toEqual(1);
    });
  });

  describe(`Test datatype()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().datatype().build();
    });

    it('Class should be created with the «datatype» stereotype', () => {
      expect(clazz.isDatatype()).toBeTrue();
    });

    it('Class should be created with the `abstract` nature', () => {
      expect(clazz.isAbstractType()).toBeTrue();
    });

    it('Class should be created with order = 1', () => {
      expect(clazz.order).toEqual(1);
    });
  });

  describe(`Test enumeration()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().enumeration().build();
    });

    it('Class should be created with the «enumeration» stereotype', () => {
      expect(clazz.isEnumeration()).toBeTrue();
    });

    it('Class should be created with the `abstract` nature', () => {
      expect(clazz.isAbstractType()).toBeTrue();
    });

    it('Class should be created with order = 1', () => {
      expect(clazz.order).toEqual(1);
    });
  });

  describe(`Test intrinsicMode()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().intrinsicModeType().build();
    });

    it('Class should be created without a stereotype', () => {
      expect(clazz.stereotype).toBeUndefined();
    });

    it('Class should be created with the `intrinsic-mode` nature', () => {
      expect(clazz.isIntrinsicModeType()).toBeTrue();
    });
  });

  describe(`Test extrinsicMode()`, () => {
    beforeEach(() => {
      clazz = proj.classBuilder().extrinsicModeType().build();
    });

    it('Class should be created without a stereotype', () => {
      expect(clazz.stereotype).toBeUndefined();
    });

    it('Class should be created with the `extrinsic-mode` nature', () => {
      expect(clazz.isExtrinsicModeType()).toBeTrue();
    });
  });
});
