import { Class, ClassStereotype, Package, Project, PropertyStereotype, stereotypeUtils } from '@libs/ontouml';

describe('Test Class stereotype-related query methods', () => {
  let project: Project;
  let model: Package;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

  describe(`Test ${Class.prototype.isStereotypeValid.name}()`, () => {
    stereotypeUtils.ClassStereotypes.forEach((stereotype: ClassStereotype) =>
      it(`Test class with stereotype '${stereotype}'`, () => {
        const clazz = model.createClass('classWithValidStereotype');
        clazz.stereotype = stereotype;
        expect(clazz.isStereotypeValid()).toBe(true);
      })
    );

    it(`Test class with invalid stereotype`, () => {
      const clazz = model.createClass();
      clazz.stereotype = 'custom' as any;
      expect(clazz.isStereotypeValid()).toBe(false);
    });

    it(`Test without stereotype`, () => {
      const clazz = model.createClass();
      expect(clazz.isStereotypeValid()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasAnyStereotype.name}()`, () => {
    it('Test classWithoutStereotypes', () => {
      const clazz = model.createClass();
      expect(clazz.hasAnyStereotype(stereotypeUtils.ClassStereotypes)).toBe(false);
    });

    it('Test classWithUniqueStereotype', () => {
      const clazz = model.createKind();
      expect(clazz.hasAnyStereotype(ClassStereotype.KIND)).toBe(true);
    });
  });

  describe(`Test ${Class.prototype.hasTypeStereotype.name}()`, () => {
    it('Test type', () => {
      const clazz = model.createType();
      expect(clazz.hasTypeStereotype()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createKind();
      expect(clazz.hasTypeStereotype()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const clazz = model.createClass();
      expect(clazz.hasTypeStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasEventStereotype.name}()`, () => {
    it('Test event', () => {
      const event = model.createEvent();
      expect(event.hasEventStereotype()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createSituation();
      expect(clazz.hasEventStereotype()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasEventStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasSituationStereotype.name}()`, () => {
    it('Test situation', () => {
      const situation = model.createSituation();
      expect(situation.hasSituationStereotype()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createAbstract();
      expect(clazz.hasSituationStereotype()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasSituationStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasAbstractStereotype.name}()`, () => {
    it('Test abstract', () => {
      const abstract = model.createAbstract();
      expect(abstract.hasAbstractStereotype()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createDatatype();
      expect(clazz.hasAbstractStereotype()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasAbstractStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasDatatypeStereotype.name}()`, () => {
    it('Test datatype', () => {
      const datatype = model.createDatatype();
      expect(datatype.hasDatatypeStereotype()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createEnumeration();
      expect(clazz.hasDatatypeStereotype()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasDatatypeStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasEnumerationStereotype.name}()`, () => {
    it('Test enumeration', () => {
      const enumeration = model.createEnumeration();
      expect(enumeration.hasEnumerationStereotype()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createType();
      expect(clazz.hasEnumerationStereotype()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasEnumerationStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.isComplexDatatype.name}()`, () => {
    let rgbColor, red, green, blue: Class;

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

  describe(`Test ${Class.prototype.hasEndurantOnlyStereotype.name}()`, () => {
    it('Test category', () => {
      const category = model.createCategory();
      expect(category.hasEndurantOnlyStereotype()).toBe(true);
    });
    it('Test kind', () => {
      const kind = model.createKind();
      expect(kind.hasEndurantOnlyStereotype()).toBe(true);
    });
    it('Test relator', () => {
      const relator = model.createRelator();
      expect(relator.hasEndurantOnlyStereotype()).toBe(true);
    });
    it('Test subkind', () => {
      const subkind = model.createSubkind();
      expect(subkind.hasEndurantOnlyStereotype()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createEvent();
      expect(clazz.hasEndurantOnlyStereotype()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasEndurantOnlyStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasMomentOnlyStereotype.name}()`, () => {
    it('Test mode', () => {
      const mode = model.createIntrinsicMode();
      expect(mode.hasMomentOnlyStereotype()).toBe(true);
    });

    it('Test relator', () => {
      const relator = model.createRelator();
      expect(relator.hasMomentOnlyStereotype()).toBe(true);
    });

    it('Test roleMixin', () => {
      const roleMixin = model.createRoleMixin();
      expect(roleMixin.hasMomentOnlyStereotype()).toBe(false);
    });

    it('Test collective', () => {
      const collective = model.createCollective();
      expect(collective.hasMomentOnlyStereotype()).toBe(false);
    });

    it('Test role', () => {
      const role = model.createRole();
      expect(role.hasMomentOnlyStereotype()).toBe(false);
    });

    it('Test anotherClass', () => {
      const clazz = model.createEvent();
      expect(clazz.hasMomentOnlyStereotype()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasMomentOnlyStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasSubstantialOnlyStereotype.name}()`, () => {
    it('Test collective', () => {
      const collective = model.createCollective();
      expect(collective.hasSubstantialOnlyStereotype()).toBe(true);
    });

    it('Test quantity', () => {
      const quantity = model.createQuantity();
      expect(quantity.hasSubstantialOnlyStereotype()).toBe(true);
    });

    it('Test relator', () => {
      const relator = model.createRelator();
      expect(relator.hasSubstantialOnlyStereotype()).toBe(false);
    });

    it('Test phaseMixin', () => {
      const phaseMixin = model.createPhaseMixin();
      expect(phaseMixin.hasSubstantialOnlyStereotype()).toBe(false);
    });

    it('Test phase', () => {
      const phase = model.createPhase();
      expect(phase.hasSubstantialOnlyStereotype()).toBe(false);
    });

    it('Test anotherClass', () => {
      const clazz = model.createEvent();
      expect(clazz.hasSubstantialOnlyStereotype()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasSubstantialOnlyStereotype()).toBe(false);
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

  describe(`Test ${Class.prototype.hasRigidStereotype.name}()`, () => {
    it('Test quality', () => {
      const quality = model.createQuality();
      expect(quality.hasRigidStereotype()).toBe(true);
    });
    it('Test subkind', () => {
      const subkind = model.createQuantity();
      expect(subkind.hasRigidStereotype()).toBe(true);
    });
    it('Test event', () => {
      const event = model.createEvent();
      expect(event.hasRigidStereotype()).toBe(true);
    });
    it('Test abstract', () => {
      const abstract = model.createAbstract();
      expect(abstract.hasRigidStereotype()).toBe(true);
    });
    it('Test mixin', () => {
      const mixin = model.createMixin();
      expect(mixin.hasRigidStereotype()).toBe(false);
    });
    it('Test phase', () => {
      const phase = model.createPhase();
      expect(phase.hasRigidStereotype()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasRigidStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasSemiRigidStereotype.name}()`, () => {
    it('Test mixin', () => {
      const mixin = model.createMixin();
      expect(mixin.hasSemiRigidStereotype()).toBe(true);
    });
    it('Test quality', () => {
      const quality = model.createQuality();
      expect(quality.hasSemiRigidStereotype()).toBe(false);
    });
    it('Test event', () => {
      const event = model.createEvent();
      expect(event.hasSemiRigidStereotype()).toBe(false);
    });
    it('Test phase', () => {
      const phase = model.createPhase();
      expect(phase.hasSemiRigidStereotype()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasSemiRigidStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasAntiRigidStereotype.name}()`, () => {
    it('Test historicalRole', () => {
      const historicalRole = model.createHistoricalRole();
      expect(historicalRole.hasAntiRigidStereotype()).toBe(true);
    });

    it('Test historicalRoleMixin', () => {
      const historicalRoleMixin = model.createHistoricalRoleMixin();
      expect(historicalRoleMixin.hasAntiRigidStereotype()).toBe(true);
    });

    it('Test mixin', () => {
      const mixin = model.createMixin();
      expect(mixin.hasAntiRigidStereotype()).toBe(false);
    });

    it('Test type', () => {
      const type = model.createType();
      expect(type.hasAntiRigidStereotype()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasAntiRigidStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasNonSortalStereotype.name}()`, () => {
    it('Test historicalRoleMixin', () => {
      const historicalRoleMixin = model.createHistoricalRoleMixin();
      expect(historicalRoleMixin.hasNonSortalStereotype()).toBe(true);
    });

    it('Test mixin', () => {
      const mixin = model.createMixin();
      expect(mixin.hasNonSortalStereotype()).toBe(true);
    });

    it('Test historicalRole', () => {
      const historicalRole = model.createHistoricalRole();
      expect(historicalRole.hasNonSortalStereotype()).toBe(false);
    });

    it('Test type', () => {
      const type = model.createType();
      expect(type.hasNonSortalStereotype()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasNonSortalStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasSortalStereotype.name}()`, () => {
    it('Test historicalRoleMixin', () => {
      const historicalRoleMixin = model.createHistoricalRoleMixin();
      expect(historicalRoleMixin.hasNonSortalStereotype()).toBe(true);
    });

    it('Test mixin', () => {
      const mixin = model.createMixin();
      expect(mixin.hasNonSortalStereotype()).toBe(true);
    });

    it('Test historicalRole', () => {
      const historicalRole = model.createHistoricalRole();
      expect(historicalRole.hasNonSortalStereotype()).toBe(false);
    });

    it('Test type', () => {
      const type = model.createType();
      expect(type.hasNonSortalStereotype()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasNonSortalStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasUltimateSortalStereotype.name}()`, () => {
    it('Test quality', () => {
      const quality = model.createQuality();
      expect(quality.hasUltimateSortalStereotype()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createHistoricalRole();
      expect(clazz.hasUltimateSortalStereotype()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasUltimateSortalStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasBaseSortalStereotype.name}()`, () => {
    it('Test subkind', () => {
      const subkind = model.createSubkind();
      expect(subkind.hasBaseSortalStereotype()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createKind();
      expect(clazz.hasBaseSortalStereotype()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasBaseSortalStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasKindStereotype.name}()`, () => {
    it('Test kind', () => {
      const kind = model.createKind();
      expect(kind.hasKindStereotype()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createCollective();
      expect(clazz.hasKindStereotype()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasKindStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasCollectiveStereotype.name}()`, () => {
    it('Test collective', () => {
      const collective = model.createCollective();
      expect(collective.hasCollectiveStereotype()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createQuantity();
      expect(clazz.hasCollectiveStereotype()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasCollectiveStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasQuantityStereotype.name}()`, () => {
    it('Test quantity', () => {
      const quantity = model.createQuantity();
      expect(quantity.hasQuantityStereotype()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createRelator();
      expect(clazz.hasQuantityStereotype()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasQuantityStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasRelatorStereotype.name}()`, () => {
    it('Test relator', () => {
      const relator = model.createRelator();
      expect(relator.hasRelatorStereotype()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createIntrinsicMode();
      expect(clazz.hasRelatorStereotype()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasRelatorStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasQualityStereotype.name}()`, () => {
    it('Test quality', () => {
      const quality = model.createQuality();
      expect(quality.hasQualityStereotype()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createExtrinsicMode();
      expect(clazz.hasQualityStereotype()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasQualityStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasModeStereotype.name}()`, () => {
    it('Test intrinsicMode', () => {
      const intrinsicMode = model.createIntrinsicMode();
      expect(intrinsicMode.hasModeStereotype()).toBe(true);
    });
    it('Test extrinsicMode', () => {
      const extrinsicMode = model.createExtrinsicMode();
      expect(extrinsicMode.hasModeStereotype()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createQuality();
      expect(clazz.hasModeStereotype()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasModeStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasSubkindStereotype.name}()`, () => {
    it('Test subkind', () => {
      const subkind = model.createSubkind();
      expect(subkind.hasSubkindStereotype()).toBe(true);
    });
    it('Test anotherClass', () => {
      const clazz = model.createRole();
      expect(clazz.hasSubkindStereotype()).toBe(false);
    });
    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasSubkindStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasPhaseStereotype.name}()`, () => {
    it('Test phase', () => {
      const phase = model.createPhase();
      expect(phase.hasPhaseStereotype()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createHistoricalRole();
      expect(clazz.hasPhaseStereotype()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasPhaseStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasRoleStereotype.name}()`, () => {
    it('Test role', () => {
      const role = model.createRole();
      expect(role.hasRoleStereotype()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createPhase();
      expect(clazz.hasRoleStereotype()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasRoleStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasHistoricalRoleStereotype.name}()`, () => {
    it('Test historicalRole', () => {
      const historicalRole = model.createHistoricalRole();
      expect(historicalRole.hasHistoricalRoleStereotype()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createHistoricalRoleMixin();
      expect(clazz.hasHistoricalRoleStereotype()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasHistoricalRoleStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasCategoryStereotype.name}()`, () => {
    it('Test category', () => {
      const category = model.createCategory();
      expect(category.hasCategoryStereotype()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createPhaseMixin();
      expect(clazz.hasCategoryStereotype()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasCategoryStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasPhaseMixinStereotype.name}()`, () => {
    it('Test phaseMixin', () => {
      const phaseMixin = model.createPhaseMixin();
      expect(phaseMixin.hasPhaseMixinStereotype()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createRoleMixin();
      expect(clazz.hasPhaseMixinStereotype()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasPhaseMixinStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasRoleMixinStereotype.name}()`, () => {
    it('Test roleMixin', () => {
      const roleMixin = model.createRoleMixin();
      expect(roleMixin.hasRoleMixinStereotype()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createHistoricalRoleMixin();
      expect(clazz.hasRoleMixinStereotype()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasRoleMixinStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasHistoricalRoleMixinStereotype.name}()`, () => {
    it('Test historicalRoleMixin', () => {
      const historicalRoleMixin = model.createHistoricalRoleMixin();
      expect(historicalRoleMixin.hasHistoricalRoleMixinStereotype()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createMixin();
      expect(clazz.hasHistoricalRoleMixinStereotype()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasHistoricalRoleMixinStereotype()).toBe(false);
    });
  });

  describe(`Test ${Class.prototype.hasMixinStereotype.name}()`, () => {
    it('Test mixin', () => {
      const mixin = model.createMixin();
      expect(mixin.hasMixinStereotype()).toBe(true);
    });

    it('Test anotherClass', () => {
      const clazz = model.createType();
      expect(clazz.hasMixinStereotype()).toBe(false);
    });

    it('Test classWithoutStereotypes', () => {
      const classWithoutStereotypes = model.createClass();
      expect(classWithoutStereotypes.hasMixinStereotype()).toBe(false);
    });
  });
});
