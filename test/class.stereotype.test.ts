import {describe, expect, it, beforeEach, beforeAll} from '@jest/globals';
import { Class, ClassStereotype, Package, Project, stereotypeUtils } from '../src';

describe('Test Class stereotype-related query methods', () => {
  let project: Project;
  let model: Package;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

  describe(`Test ${Class.prototype.hasValidStereotype.name}()`, () => {
    stereotypeUtils.ClassStereotypes.forEach((stereotype: ClassStereotype) =>
      it(`Test class with stereotype '${stereotype}'`, () => {
        const clazz = model.createClass('classWithValidStereotype');
        clazz.stereotype = stereotype;
        expect(clazz.hasValidStereotype()).toBe(true);
      })
    );

    it(`Test class with invalid stereotype`, () => {
      const clazz = model.createClass();
      clazz.stereotype = 'custom' as any;
      expect(clazz.hasValidStereotype()).toBe(false);
    });

    it(`Test without stereotype`, () => {
      const clazz = model.createClass();
      expect(clazz.hasValidStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isStereotypeOneOf.name}()`, () => {
    it('Test classWithoutStereotypes', () => {
      const clazz = model.createClass();
      expect(clazz.isStereotypeOneOf(stereotypeUtils.ClassStereotypes)).toBe(false);
    });

    it('Test classWithUniqueStereotype', () => {
      const clazz = model.createKind();
      expect(clazz.isStereotypeOneOf(ClassStereotype.KIND)).toBe(true);
    });
  });

  describe(`Test ${Class.prototype.isType.name}()`, () => {
    it('Test type', () => {
      const clazz = model.createType();
      expect(clazz.isType()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createKind();
      expect(clazz.isType()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const clazz = model.createClass();
      expect(clazz.isType()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isEvent.name}()`, () => {
    it('Test event', () => {
      const event = model.createEvent();
      expect(event.isEvent()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createSituation();
      expect(clazz.isEvent()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isEvent()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isSituation.name}()`, () => {
    it('Test situation', () => {
      const situation = model.createSituation();
      expect(situation.isSituation()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createAbstract();
      expect(clazz.isSituation()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isSituation()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.stereotypedAsAbstract.name}()`, () => {
    it('Test abstract', () => {
      const abstract = model.createAbstract();
      expect(abstract.stereotypedAsAbstract()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createDatatype();
      expect(clazz.stereotypedAsAbstract()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.stereotypedAsAbstract()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isDatatype.name}()`, () => {
    it('Test datatype', () => {
      const datatype = model.createDatatype();
      expect(datatype.isDatatype()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createEnumeration();
      expect(clazz.isDatatype()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isDatatype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.stereotypedAsEnumeration.name}()`, () => {
    it('Test enumeration', () => {
      const enumeration = model.createEnumeration();
      expect(enumeration.stereotypedAsEnumeration()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createType();
      expect(clazz.stereotypedAsEnumeration()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.stereotypedAsEnumeration()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isComplexDatatype.name}()`, () => {
    let rgbColor: Class, red: Class, green: Class, blue: Class;

    beforeAll(() => {
      rgbColor = model.createDatatype();
      red = model.createDatatype();
      green = model.createDatatype();
      blue = model.createDatatype();

      rgbColor.createAttribute(red);
      rgbColor.createAttribute(green);
      rgbColor.createAttribute(blue);
    });

    it('Test complex datatype', () => {
      expect(rgbColor.isComplexDatatype()).toBe(true);
    });
    it('Test atomic/simple datatype', () => {
      expect(red.isComplexDatatype()).toBe(false);
    });
    it('Test anotherClass', () => {
      const clazz = model.createEnumeration();
      expect(clazz.isComplexDatatype()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isComplexDatatype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isEndurantType.name}()`, () => {
    it('Test category', () => {
      const category = model.createCategory();
      expect(category.isEndurantType()).toBe(true);
    });
    it('Test kind', () => {
      const kind = model.createKind();
      expect(kind.isEndurantType()).toBe(true);
    });
    it('Test relator', () => {
      const relator = model.createRelator();
      expect(relator.isEndurantType()).toBe(true);
    });
    it('Test subkind', () => {
      const subkind = model.createSubkind();
      expect(subkind.isEndurantType()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createEvent();
      expect(clazz.isEndurantType()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isEndurantType()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isMomentType.name}()`, () => {
    it('Test mode', () => {
      const mode = model.createIntrinsicMode();
      expect(mode.isMomentType()).toBe(true);
    });

    it('Test relator', () => {
      const relator = model.createRelator();
      expect(relator.isMomentType()).toBe(true);
    });

    it('Test roleMixin', () => {
      const roleMixin = model.createRoleMixin();
      expect(roleMixin.isMomentType()).toBe(false);
    });

    it('Test collective', () => {
      const collective = model.createCollective();
      expect(collective.isMomentType()).toBe(false);
    });

    it('Test role', () => {
      const role = model.createRole();
      expect(role.isMomentType()).toBe(false);
    });

    it('Test anotherClass', () => {
      const clazz = model.createEvent();
      expect(clazz.isMomentType()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isMomentType()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isSubstantialType.name}()`, () => {
    it('Test collective', () => {
      const collective = model.createCollective();
      expect(collective.isSubstantialType()).toBe(true);
    });

    it('Test quantity', () => {
      const quantity = model.createQuantity();
      expect(quantity.isSubstantialType()).toBe(true);
    });

    it('Test relator', () => {
      const relator = model.createRelator();
      expect(relator.isSubstantialType()).toBe(false);
    });

    it('Test phaseMixin', () => {
      const phaseMixin = model.createPhaseMixin();
      expect(phaseMixin.isSubstantialType()).toBe(false);
    });

    it('Test phase', () => {
      const phase = model.createPhase();
      expect(phase.isSubstantialType()).toBe(false);
    });

    it('Test anotherClass', () => {
      const clazz = model.createEvent();
      expect(clazz.isSubstantialType()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isSubstantialType()).toBe(false);
    });
  });

  describe(`Test Class.${Class.haveRigidStereotypes.name}()`, () => {
    it('Test rigid classes', () => {
      const quality = model.createQuality();
      const subkind = model.createQuantity();
      expect(Class.haveRigidStereotypes([quality, subkind])).toBe(true);
    });

    it('Test non-rigid classes', () => {
      const mixin = model.createMixin();
      const phase = model.createPhase();
      expect(Class.haveRigidStereotypes([mixin, phase])).toBe(false);
    });

    it('Test mixed classes', () => {
      const event = model.createEvent();
      const classWithoutStereotypes = model.createClass();
      expect(Class.haveRigidStereotypes([classWithoutStereotypes, event])).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRigid.name}()`, () => {
    it('Test quality', () => {
      const quality = model.createQuality();
      expect(quality.isRigid()).toBe(true);
    });
    it('Test subkind', () => {
      const subkind = model.createQuantity();
      expect(subkind.isRigid()).toBe(true);
    });
    it('Test event', () => {
      const event = model.createEvent();
      expect(event.isRigid()).toBe(true);
    });
    it('Test abstract', () => {
      const abstract = model.createAbstract();
      expect(abstract.isRigid()).toBe(true);
    });
    it('Test mixin', () => {
      const mixin = model.createMixin();
      expect(mixin.isRigid()).toBe(false);
    });
    it('Test phase', () => {
      const phase = model.createPhase();
      expect(phase.isRigid()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isRigid()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isSemiRigid.name}()`, () => {
    it('Test mixin', () => {
      const mixin = model.createMixin();
      expect(mixin.isSemiRigid()).toBe(true);
    });
    it('Test quality', () => {
      const quality = model.createQuality();
      expect(quality.isSemiRigid()).toBe(false);
    });
    it('Test event', () => {
      const event = model.createEvent();
      expect(event.isSemiRigid()).toBe(false);
    });
    it('Test phase', () => {
      const phase = model.createPhase();
      expect(phase.isSemiRigid()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isSemiRigid()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isAntiRigid.name}()`, () => {
    it('Test historicalRole', () => {
      const historicalRole = model.createHistoricalRole();
      expect(historicalRole.isAntiRigid()).toBe(true);
    });

    it('Test historicalRoleMixin', () => {
      const historicalRoleMixin = model.createHistoricalRoleMixin();
      expect(historicalRoleMixin.isAntiRigid()).toBe(true);
    });

    it('Test mixin', () => {
      const mixin = model.createMixin();
      expect(mixin.isAntiRigid()).toBe(false);
    });

    it('Test type', () => {
      const type = model.createType();
      expect(type.isAntiRigid()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isAntiRigid()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isNonSortal.name}()`, () => {
    it('Test historicalRoleMixin', () => {
      const historicalRoleMixin = model.createHistoricalRoleMixin();
      expect(historicalRoleMixin.isNonSortal()).toBe(true);
    });

    it('Test mixin', () => {
      const mixin = model.createMixin();
      expect(mixin.isNonSortal()).toBe(true);
    });

    it('Test historicalRole', () => {
      const historicalRole = model.createHistoricalRole();
      expect(historicalRole.isNonSortal()).toBe(false);
    });

    it('Test type', () => {
      const type = model.createType();
      expect(type.isNonSortal()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isNonSortal()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isSortal.name}()`, () => {
    it('Test historicalRoleMixin', () => {
      const historicalRoleMixin = model.createHistoricalRoleMixin();
      expect(historicalRoleMixin.isNonSortal()).toBe(true);
    });

    it('Test mixin', () => {
      const mixin = model.createMixin();
      expect(mixin.isNonSortal()).toBe(true);
    });

    it('Test historicalRole', () => {
      const historicalRole = model.createHistoricalRole();
      expect(historicalRole.isNonSortal()).toBe(false);
    });

    it('Test type', () => {
      const type = model.createType();
      expect(type.isNonSortal()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isNonSortal()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isIdentityProvider.name}()`, () => {
    it('Test quality', () => {
      const quality = model.createQuality();
      expect(quality.isIdentityProvider()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createHistoricalRole();
      expect(clazz.isIdentityProvider()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isIdentityProvider()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isBaseSortal.name}()`, () => {
    it('Test subkind', () => {
      const subkind = model.createSubkind();
      expect(subkind.isBaseSortal()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createKind();
      expect(clazz.isBaseSortal()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isBaseSortal()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isKind.name}()`, () => {
    it('Test kind', () => {
      const kind = model.createKind();
      expect(kind.isKind()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createCollective();
      expect(clazz.isKind()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isKind()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isCollective.name}()`, () => {
    it('Test collective', () => {
      const collective = model.createCollective();
      expect(collective.isCollective()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createQuantity();
      expect(clazz.isCollective()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isCollective()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isQuantity.name}()`, () => {
    it('Test quantity', () => {
      const quantity = model.createQuantity();
      expect(quantity.isQuantity()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createRelator();
      expect(clazz.isQuantity()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isQuantity()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRelator.name}()`, () => {
    it('Test relator', () => {
      const relator = model.createRelator();
      expect(relator.isRelator()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createIntrinsicMode();
      expect(clazz.isRelator()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isRelator()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isQuality.name}()`, () => {
    it('Test quality', () => {
      const quality = model.createQuality();
      expect(quality.isQuality()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createExtrinsicMode();
      expect(clazz.isQuality()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isQuality()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isMode.name}()`, () => {
    it('Test intrinsicMode', () => {
      const intrinsicMode = model.createIntrinsicMode();
      expect(intrinsicMode.isMode()).toBe(true);
    });
    it('Test extrinsicMode', () => {
      const extrinsicMode = model.createExtrinsicMode();
      expect(extrinsicMode.isMode()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createQuality();
      expect(clazz.isMode()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isMode()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isSubkind.name}()`, () => {
    it('Test subkind', () => {
      const subkind = model.createSubkind();
      expect(subkind.isSubkind()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createRole();
      expect(clazz.isSubkind()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isSubkind()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isPhase.name}()`, () => {
    it('Test phase', () => {
      const phase = model.createPhase();
      expect(phase.isPhase()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createHistoricalRole();
      expect(clazz.isPhase()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isPhase()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRole.name}()`, () => {
    it('Test role', () => {
      const role = model.createRole();
      expect(role.isRole()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createPhase();
      expect(clazz.isRole()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isRole()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isHistoricalRole.name}()`, () => {
    it('Test historicalRole', () => {
      const historicalRole = model.createHistoricalRole();
      expect(historicalRole.isHistoricalRole()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createHistoricalRoleMixin();
      expect(clazz.isHistoricalRole()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isHistoricalRole()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isCategory.name}()`, () => {
    it('Test category', () => {
      const category = model.createCategory();
      expect(category.isCategory()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createPhaseMixin();
      expect(clazz.isCategory()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isCategory()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isPhaseMixin.name}()`, () => {
    it('Test phaseMixin', () => {
      const phaseMixin = model.createPhaseMixin();
      expect(phaseMixin.isPhaseMixin()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createRoleMixin();
      expect(clazz.isPhaseMixin()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isPhaseMixin()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isRoleMixin.name}()`, () => {
    it('Test roleMixin', () => {
      const roleMixin = model.createRoleMixin();
      expect(roleMixin.isRoleMixin()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createHistoricalRoleMixin();
      expect(clazz.isRoleMixin()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isRoleMixin()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isHistoricalRoleMixin.name}()`, () => {
    it('Test historicalRoleMixin', () => {
      const historicalRoleMixin = model.createHistoricalRoleMixin();
      expect(historicalRoleMixin.isHistoricalRoleMixin()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createMixin();
      expect(clazz.isHistoricalRoleMixin()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isHistoricalRoleMixin()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isMixin.name}()`, () => {
    it('Test mixin', () => {
      const mixin = model.createMixin();
      expect(mixin.isMixin()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createType();
      expect(clazz.isMixin()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.isMixin()).toBe(false);
    });
  });
});
