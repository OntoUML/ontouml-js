import {describe, expect, it, beforeEach, beforeAll} from '@jest/globals';
import { COLLECTIVE, Class, ClassStereotype, Decoratable, KIND, Project, RELATOR } from '../src';

describe('Test Class stereotype-related query methods', () => {
  let proj: Project;
  let c: Class;

  beforeEach(() => {
    proj = new Project();
  });

  describe(`Test ${Decoratable.prototype.hasValidStereotype.name}()`, () => {
    
    Object.values(ClassStereotype).forEach(stereotype =>
      it(`Should return true if valid class stereotype ('${stereotype}')`, () => {
        c = proj.classBuilder()
                .stereotype(stereotype)
                .build();

        expect(c.hasValidStereotype()).toBeTruthy();
      })
    );

    it(`Should return false if invalid class stereotype`, () => {
      c = proj.classBuilder()
              .stereotype('custom')
              .build();

      expect(c.hasValidStereotype()).toBeFalsy();
    });

    it(`Should return false if class has no stereotype and allowsNone = false`, () => {
      c = proj.classBuilder().build();
      expect(c.hasValidStereotype(false)).toBeFalsy();
    });

    it(`Should return false if class has no stereotype and allowsNone is not given (false by default)`, () => {
      c = proj.classBuilder().build();
      expect(c.hasValidStereotype()).toBeFalsy();
    });

    it(`Should return true if class has no stereotype and allowsNone = true`, () => {
      c = proj.classBuilder().build();
      expect(c.hasValidStereotype(true)).toBeTruthy();
    });
  });

  describe(`Test ${Decoratable.prototype.isStereotypeOneOf.name}()`, () => {
    it('Should throw an Error if the class has no stereotype', () => {
      c = proj.classBuilder().build();

      const func = () => c.isStereotypeOneOf(KIND);
      expect(func).toThrowError();
    });

    it('Should return true if the class is decorated with one of the stereotypes listed in the input (one)', () => {
      c = proj.classBuilder()
              .kind()
              .build();
      
      expect(c.isStereotypeOneOf(KIND)).toBeTruthy();
    });

    it('Should return true if the class is decorated with one of the stereotypes listed in the input (list)', () => {
      c = proj.classBuilder()
              .kind()
              .build();
      
      expect(c.isStereotypeOneOf([KIND, COLLECTIVE])).toBeTruthy();
    });

    it('Should return false if the class is not decorated with one of the stereotypes listed in the input (list)', () => {
      c = proj.classBuilder()
              .kind()
              .build();
      
      expect(c.isStereotypeOneOf([RELATOR, COLLECTIVE])).toBeFalsy();
    });
  });

  describe(`Test ${Class.prototype.isKind.name}()`, () => {
    it('Should return true if the class is a «kind»', () => {
      c = proj.classBuilder()
              .kind()
              .build();
              
      expect(c.isKind()).toBeTruthy();
    });

    it('Should return false if the class is a not a «kind» (e.g. «event»)', () => {
      c = proj.classBuilder()
              .event()
              .build();
      expect(c.isKind()).toBeFalsy();
    });

    it('Should return false if the class is not decorated with a stereotype', () => {
      c = proj.classBuilder()
              .build();
      expect(c.isKind()).toBeFalsy();
    });
  });

  describe(`Test ${Class.prototype.isComplexDatatype.name}()`, () => {
    let dt1: Class, dt2: Class;

    it('Test complex datatype', () => {
      dt1 = proj.classBuilder()
                .datatype()
                .build();

      dt2 = proj.classBuilder()
                .datatype()
                .build();
      
      dt1.createAttribute(dt2);
      
      expect(dt1.isComplexDatatype()).toBeTruthy();
    });
    
    it('Test complex datatype', () => {
      dt1 = proj.classBuilder().Datatype();
      dt2 = proj.classBuilder().Datatype();
      
      dt1.createAttribute(dt2);
      dt1.createAttribute(dt2);
      expect(dt1.isComplexDatatype()).toBeTruthy();
    });

    it('Test atomic/simple datatype', () => {
      dt1 = proj.classBuilder().Datatype();
      expect(d.isComplexDatatype()).toBeFalsy();
    });

    it('Test anotherClass', () => {
      dt1 = proj.classBuilder().Enumeration();
      expect(c.isComplexDatatype()).toBeFalsy();
    });

    it('Test classWithoutStereotypes', () => {
      classWithoutStereotypes = proj.classBuilder().Class();
      expect(classWithoutStereotypes.isComplexDatatype()).toBeFalsy();
    });
  });

  // describe(`Test ${Class.prototype.isEndurantType.name}()`, () => {
  //   it('Test category', () => {
  //     category = proj.classBuilder().Category();
  //     expect(category.isEndurantType()).toBeTruthy();
  //   });
  //   it('Test kind', () => {
  //     kind = proj.classBuilder().Kind();
  //     expect(kind.isEndurantType()).toBeTruthy();
  //   });
  //   it('Test relator', () => {
  //     relator = proj.classBuilder().Relator();
  //     expect(relator.isEndurantType()).toBeTruthy();
  //   });
  //   it('Test subkind', () => {
  //     subkind = proj.classBuilder().Subkind();
  //     expect(subkind.isEndurantType()).toBeTruthy();
  //   });
  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().Event();
  //     expect(c.isEndurantType()).toBeFalsy();
  //   });
  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isEndurantType()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isMomentType.name}()`, () => {
  //   it('Test mode', () => {
  //     mode = proj.classBuilder().IntrinsicMode();
  //     expect(mode.isMomentType()).toBeTruthy();
  //   });

  //   it('Test relator', () => {
  //     relator = proj.classBuilder().Relator();
  //     expect(relator.isMomentType()).toBeTruthy();
  //   });

  //   it('Test roleMixin', () => {
  //     roleMixin = proj.classBuilder().RoleMixin();
  //     expect(roleMixin.isMomentType()).toBeFalsy();
  //   });

  //   it('Test collective', () => {
  //     collective = proj.classBuilder().Collective();
  //     expect(collective.isMomentType()).toBeFalsy();
  //   });

  //   it('Test role', () => {
  //     role = proj.classBuilder().Role();
  //     expect(role.isMomentType()).toBeFalsy();
  //   });

  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().Event();
  //     expect(c.isMomentType()).toBeFalsy();
  //   });

  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isMomentType()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isSubstantialType.name}()`, () => {
  //   it('Test collective', () => {
  //     collective = proj.classBuilder().Collective();
  //     expect(collective.isSubstantialType()).toBeTruthy();
  //   });

  //   it('Test quantity', () => {
  //     quantity = proj.classBuilder().Quantity();
  //     expect(quantity.isSubstantialType()).toBeTruthy();
  //   });

  //   it('Test relator', () => {
  //     relator = proj.classBuilder().Relator();
  //     expect(relator.isSubstantialType()).toBeFalsy();
  //   });

  //   it('Test phaseMixin', () => {
  //     phaseMixin = proj.classBuilder().PhaseMixin();
  //     expect(phaseMixin.isSubstantialType()).toBeFalsy();
  //   });

  //   it('Test phase', () => {
  //     phase = proj.classBuilder().Phase();
  //     expect(phase.isSubstantialType()).toBeFalsy();
  //   });

  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().Event();
  //     expect(c.isSubstantialType()).toBeFalsy();
  //   });

  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isSubstantialType()).toBeFalsy();
  //   });
  // });

  // describe(`Test Class.${Class.haveRigidStereotypes.name}()`, () => {
  //   it('Test rigid classes', () => {
  //     quality = proj.classBuilder().Quality();
  //     subkind = proj.classBuilder().Quantity();
  //     expect(Class.haveRigidStereotypes([quality, subkind])).toBeTruthy();
  //   });

  //   it('Test non-rigid classes', () => {
  //     mixin = proj.classBuilder().Mixin();
  //     phase = proj.classBuilder().Phase();
  //     expect(Class.haveRigidStereotypes([mixin, phase])).toBeFalsy();
  //   });

  //   it('Test mixed classes', () => {
  //     event = proj.classBuilder().Event();
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(Class.haveRigidStereotypes([classWithoutStereotypes, event])).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isRigid.name}()`, () => {
  //   it('Test quality', () => {
  //     quality = proj.classBuilder().Quality();
  //     expect(quality.isRigid()).toBeTruthy();
  //   });
  //   it('Test subkind', () => {
  //     subkind = proj.classBuilder().Quantity();
  //     expect(subkind.isRigid()).toBeTruthy();
  //   });
  //   it('Test event', () => {
  //     event = proj.classBuilder().Event();
  //     expect(event.isRigid()).toBeTruthy();
  //   });
  //   it('Test abstract', () => {
  //     abstract = proj.classBuilder().Abstract();
  //     expect(abstract.isRigid()).toBeTruthy();
  //   });
  //   it('Test mixin', () => {
  //     mixin = proj.classBuilder().Mixin();
  //     expect(mixin.isRigid()).toBeFalsy();
  //   });
  //   it('Test phase', () => {
  //     phase = proj.classBuilder().Phase();
  //     expect(phase.isRigid()).toBeFalsy();
  //   });
  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isRigid()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isSemiRigid.name}()`, () => {
  //   it('Test mixin', () => {
  //     mixin = proj.classBuilder().Mixin();
  //     expect(mixin.isSemiRigid()).toBeTruthy();
  //   });
  //   it('Test quality', () => {
  //     quality = proj.classBuilder().Quality();
  //     expect(quality.isSemiRigid()).toBeFalsy();
  //   });
  //   it('Test event', () => {
  //     event = proj.classBuilder().Event();
  //     expect(event.isSemiRigid()).toBeFalsy();
  //   });
  //   it('Test phase', () => {
  //     phase = proj.classBuilder().Phase();
  //     expect(phase.isSemiRigid()).toBeFalsy();
  //   });
  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isSemiRigid()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isAntiRigid.name}()`, () => {
  //   it('Test historicalRole', () => {
  //     historicalRole = proj.classBuilder().HistoricalRole();
  //     expect(historicalRole.isAntiRigid()).toBeTruthy();
  //   });

  //   it('Test historicalRoleMixin', () => {
  //     historicalRoleMixin = proj.classBuilder().HistoricalRoleMixin();
  //     expect(historicalRoleMixin.isAntiRigid()).toBeTruthy();
  //   });

  //   it('Test mixin', () => {
  //     mixin = proj.classBuilder().Mixin();
  //     expect(mixin.isAntiRigid()).toBeFalsy();
  //   });

  //   it('Test type', () => {
  //     type = proj.classBuilder().Type();
  //     expect(type.isAntiRigid()).toBeFalsy();
  //   });

  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isAntiRigid()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isNonSortal.name}()`, () => {
  //   it('Test historicalRoleMixin', () => {
  //     historicalRoleMixin = proj.classBuilder().HistoricalRoleMixin();
  //     expect(historicalRoleMixin.isNonSortal()).toBeTruthy();
  //   });

  //   it('Test mixin', () => {
  //     mixin = proj.classBuilder().Mixin();
  //     expect(mixin.isNonSortal()).toBeTruthy();
  //   });

  //   it('Test historicalRole', () => {
  //     historicalRole = proj.classBuilder().HistoricalRole();
  //     expect(historicalRole.isNonSortal()).toBeFalsy();
  //   });

  //   it('Test type', () => {
  //     type = proj.classBuilder().Type();
  //     expect(type.isNonSortal()).toBeFalsy();
  //   });

  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isNonSortal()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isSortal.name}()`, () => {
  //   it('Test historicalRoleMixin', () => {
  //     historicalRoleMixin = proj.classBuilder().HistoricalRoleMixin();
  //     expect(historicalRoleMixin.isNonSortal()).toBeTruthy();
  //   });

  //   it('Test mixin', () => {
  //     mixin = proj.classBuilder().Mixin();
  //     expect(mixin.isNonSortal()).toBeTruthy();
  //   });

  //   it('Test historicalRole', () => {
  //     historicalRole = proj.classBuilder().HistoricalRole();
  //     expect(historicalRole.isNonSortal()).toBeFalsy();
  //   });

  //   it('Test type', () => {
  //     type = proj.classBuilder().Type();
  //     expect(type.isNonSortal()).toBeFalsy();
  //   });

  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isNonSortal()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isIdentityProvider.name}()`, () => {
  //   it('Test quality', () => {
  //     quality = proj.classBuilder().Quality();
  //     expect(quality.isIdentityProvider()).toBeTruthy();
  //   });

  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().HistoricalRole();
  //     expect(c.isIdentityProvider()).toBeFalsy();
  //   });

  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isIdentityProvider()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isBaseSortal.name}()`, () => {
  //   it('Test subkind', () => {
  //     subkind = proj.classBuilder().Subkind();
  //     expect(subkind.isBaseSortal()).toBeTruthy();
  //   });
  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().Kind();
  //     expect(c.isBaseSortal()).toBeFalsy();
  //   });
  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isBaseSortal()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isKind.name}()`, () => {
  //   it('Test kind', () => {
  //     kind = proj.classBuilder().Kind();
  //     expect(kind.isKind()).toBeTruthy();
  //   });
  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().Collective();
  //     expect(c.isKind()).toBeFalsy();
  //   });
  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isKind()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isCollective.name}()`, () => {
  //   it('Test collective', () => {
  //     collective = proj.classBuilder().Collective();
  //     expect(collective.isCollective()).toBeTruthy();
  //   });
  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().Quantity();
  //     expect(c.isCollective()).toBeFalsy();
  //   });
  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isCollective()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isQuantity.name}()`, () => {
  //   it('Test quantity', () => {
  //     quantity = proj.classBuilder().Quantity();
  //     expect(quantity.isQuantity()).toBeTruthy();
  //   });
  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().Relator();
  //     expect(c.isQuantity()).toBeFalsy();
  //   });
  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isQuantity()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isRelator.name}()`, () => {
  //   it('Test relator', () => {
  //     relator = proj.classBuilder().Relator();
  //     expect(relator.isRelator()).toBeTruthy();
  //   });
  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().IntrinsicMode();
  //     expect(c.isRelator()).toBeFalsy();
  //   });
  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isRelator()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isQuality.name}()`, () => {
  //   it('Test quality', () => {
  //     quality = proj.classBuilder().Quality();
  //     expect(quality.isQuality()).toBeTruthy();
  //   });
  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().ExtrinsicMode();
  //     expect(c.isQuality()).toBeFalsy();
  //   });
  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isQuality()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isMode.name}()`, () => {
  //   it('Test intrinsicMode', () => {
  //     intrinsicMode = proj.classBuilder().IntrinsicMode();
  //     expect(intrinsicMode.isMode()).toBeTruthy();
  //   });
  //   it('Test extrinsicMode', () => {
  //     extrinsicMode = proj.classBuilder().ExtrinsicMode();
  //     expect(extrinsicMode.isMode()).toBeTruthy();
  //   });
  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().Quality();
  //     expect(c.isMode()).toBeFalsy();
  //   });
  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isMode()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isSubkind.name}()`, () => {
  //   it('Test subkind', () => {
  //     subkind = proj.classBuilder().Subkind();
  //     expect(subkind.isSubkind()).toBeTruthy();
  //   });
  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().Role();
  //     expect(c.isSubkind()).toBeFalsy();
  //   });
  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isSubkind()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isPhase.name}()`, () => {
  //   it('Test phase', () => {
  //     phase = proj.classBuilder().Phase();
  //     expect(phase.isPhase()).toBeTruthy();
  //   });

  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().HistoricalRole();
  //     expect(c.isPhase()).toBeFalsy();
  //   });

  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isPhase()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isRole.name}()`, () => {
  //   it('Test role', () => {
  //     role = proj.classBuilder().Role();
  //     expect(role.isRole()).toBeTruthy();
  //   });

  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().Phase();
  //     expect(c.isRole()).toBeFalsy();
  //   });

  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isRole()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isHistoricalRole.name}()`, () => {
  //   it('Test historicalRole', () => {
  //     historicalRole = proj.classBuilder().HistoricalRole();
  //     expect(historicalRole.isHistoricalRole()).toBeTruthy();
  //   });

  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().HistoricalRoleMixin();
  //     expect(c.isHistoricalRole()).toBeFalsy();
  //   });

  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isHistoricalRole()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isCategory.name}()`, () => {
  //   it('Test category', () => {
  //     category = proj.classBuilder().Category();
  //     expect(category.isCategory()).toBeTruthy();
  //   });

  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().PhaseMixin();
  //     expect(c.isCategory()).toBeFalsy();
  //   });

  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isCategory()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isPhaseMixin.name}()`, () => {
  //   it('Test phaseMixin', () => {
  //     phaseMixin = proj.classBuilder().PhaseMixin();
  //     expect(phaseMixin.isPhaseMixin()).toBeTruthy();
  //   });

  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().RoleMixin();
  //     expect(c.isPhaseMixin()).toBeFalsy();
  //   });

  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isPhaseMixin()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isRoleMixin.name}()`, () => {
  //   it('Test roleMixin', () => {
  //     roleMixin = proj.classBuilder().RoleMixin();
  //     expect(roleMixin.isRoleMixin()).toBeTruthy();
  //   });

  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().HistoricalRoleMixin();
  //     expect(c.isRoleMixin()).toBeFalsy();
  //   });

  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isRoleMixin()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isHistoricalRoleMixin.name}()`, () => {
  //   it('Test historicalRoleMixin', () => {
  //     historicalRoleMixin = proj.classBuilder().HistoricalRoleMixin();
  //     expect(historicalRoleMixin.isHistoricalRoleMixin()).toBeTruthy();
  //   });

  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().Mixin();
  //     expect(c.isHistoricalRoleMixin()).toBeFalsy();
  //   });

  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isHistoricalRoleMixin()).toBeFalsy();
  //   });
  // });

  // describe(`Test ${Class.prototype.isMixin.name}()`, () => {
  //   it('Test mixin', () => {
  //     mixin = proj.classBuilder().Mixin();
  //     expect(mixin.isMixin()).toBeTruthy();
  //   });

  //   it('Test anotherClass', () => {
  //     c = proj.classBuilder().Type();
  //     expect(c.isMixin()).toBeFalsy();
  //   });

  //   it('Test classWithoutStereotypes', () => {
  //     classWithoutStereotypes = proj.classBuilder().Class();
  //     expect(classWithoutStereotypes.isMixin()).toBeFalsy();
  //   });
  // });
});
