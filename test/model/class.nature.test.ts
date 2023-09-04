import { Class, Project } from '../../src';
import { Nature as N } from '../../src';

describe('Test restrictedTo-related methods', () => {
  let proj: Project;
  let c: Class;

  beforeEach(() => {
    proj = new Project();
  });

  describe('Test allows* methods on a class with restrictedTo = [ ]', () => {
    beforeEach(() => {
      c = proj.classBuilder().build();
    });

    it('allowsSome() should return false', () => {
      expect(c.allowsSome([N.RELATOR, N.COLLECTIVE])).toBeFalse();
    });

    it('allowsOnly() should return false', () => {
      expect(c.allowsOnly([N.RELATOR, N.COLLECTIVE])).toBeFalse();
    });

    it('allowsAll() should return false', () => {
      expect(c.allowsAll([N.RELATOR, N.COLLECTIVE])).toBeFalse();
    });

    it('allowsExactly() should return false', () => {
      expect(c.allowsExactly([N.RELATOR, N.COLLECTIVE])).toBeFalse();
    });
  });

  describe('Test allows* methods on a class with restrictedTo = [ function-complex, collective ]', () => {
    beforeEach(() => {
      c = proj.classBuilder().relator().collectiveType().build();
    });

    describe(`Test ${Class.prototype.allowsSome.name}()`, () => {
      it('should be true for empty array', () => {
        expect(c.allowsSome([])).toBeFalse();
      });

      it('should be false for disjoint array - [ quantity ]', () => {
        expect(c.allowsSome([N.QUANTITY])).toBeFalse();
      });

      it('should be true for subset array - [ functional-complex ]', () => {
        expect(c.allowsSome([N.RELATOR])).toBeTrue();
      });

      it('should be true for overlapping array - [ functional-complex, quantity ]', () => {
        expect(c.allowsSome([N.RELATOR, N.QUANTITY])).toBeTrue();
      });

      it('should be true for matching array - [ functional-complex, collective ]', () => {
        expect(c.allowsSome([N.RELATOR, N.COLLECTIVE])).toBeTrue();
      });

      it('should be true for superset array', () => {
        expect(c.allowsSome([N.RELATOR, N.COLLECTIVE, N.QUANTITY])).toBeTrue();
      });
    });

    describe(`Test ${Class.prototype.allowsOnly.name}()`, () => {
      it('should return false for empty array', () => {
        expect(c.allowsOnly([])).toBeFalse();
      });

      it('Test disjoint restrictions', () => {
        expect(c.allowsOnly([N.QUANTITY])).toBeFalse();
      });

      it('Test subset restrictions', () => {
        expect(c.allowsOnly([N.RELATOR])).toBeFalse();
      });

      it('Test overlapping restrictions', () => {
        expect(c.allowsOnly([N.RELATOR, N.QUANTITY])).toBe(false);
      });

      it('Test matching restrictions', () => {
        expect(c.allowsOnly([N.RELATOR, N.COLLECTIVE])).toBeTrue();
      });

      it('Test super set restrictions', () => {
        expect(c.allowsOnly([N.RELATOR, N.COLLECTIVE, N.QUANTITY])).toBeTrue();
      });
    });

    describe(`Test ${Class.prototype.allowsAll.name}()`, () => {
      it('should return false for empty array', () => {
        expect(c.allowsAll([])).toBeFalse();
      });

      it('Test disjoint restrictions', () => {
        expect(c.allowsAll([N.QUANTITY])).toBeFalse();
      });

      it('Test subset restrictions', () => {
        expect(c.allowsAll([N.RELATOR])).toBeTrue();
      });

      it('Test overlapping restrictions', () => {
        expect(c.allowsAll([N.RELATOR, N.QUANTITY])).toBe(false);
      });

      it('Test matching restrictions', () => {
        expect(c.allowsAll([N.RELATOR, N.COLLECTIVE])).toBeTrue();
      });

      it('Test super set restrictions', () => {
        expect(c.allowsAll([N.RELATOR, N.COLLECTIVE, N.QUANTITY])).toBeFalse();
      });
    });

    describe(`Test ${Class.prototype.allowsExactly.name}()`, () => {
      it('should return false for empty array', () => {
        expect(c.allowsExactly([])).toBeFalse();
      });

      it('Test disjoint restrictions', () => {
        expect(c.allowsExactly([N.QUANTITY])).toBeFalse();
      });

      it('Test subset restrictions', () => {
        expect(c.allowsExactly([N.RELATOR])).toBeFalse();
      });

      it('Test overlapping restrictions', () => {
        expect(c.allowsExactly([N.RELATOR, N.QUANTITY])).toBeFalse();
      });

      it('Test matching restrictions', () => {
        expect(c.allowsExactly([N.RELATOR, N.COLLECTIVE])).toBeTrue();
      });

      it('Test super set restrictions', () => {
        expect(
          c.allowsExactly([N.RELATOR, N.COLLECTIVE, N.QUANTITY])
        ).toBeFalse();
      });
    });
  });

  describe(`Test ${Class.prototype.isEndurantType.name}()`, () => {
    it('should be true if restrictedTo = [ functional-complex ]', () => {
      c = proj.classBuilder().functionalComplexType().build();
      expect(c.isEndurantType()).toBeTrue();
    });

    it('should be true if restrictedTo = [ collective ]', () => {
      c = proj.classBuilder().collectiveType().build();
      expect(c.isEndurantType()).toBeTrue();
    });

    it('should be true if restrictedTo = [ quality, relator ]', () => {
      c = proj.classBuilder().quality().relator().build();
      expect(c.isEndurantType()).toBeTrue();
    });

    it('should be true if restrictedTo = [ intrinsic-mode, extrinsic-mode ]', () => {
      c = proj.classBuilder().intrinsicModeType().extrinsicModeType().build();
      expect(c.isEndurantType()).toBeTrue();
    });

    it('should be false if restrictedTo = [ functional-complex, event ]', () => {
      c = proj
        .classBuilder()
        .category()
        .functionalComplexType()
        .event()
        .build();
      expect(c.isEndurantType()).toBeFalse();
    });

    it('should be true if restrictedTo = [ functional-complex, type ]', () => {
      c = proj
        .classBuilder()
        .category()
        .functionalComplexType()
        .highOrderType()
        .build();
      expect(c.isEndurantType()).toBeTrue();
    });

    it('should be false if restrictedTo = [ abstract ]', () => {
      c = proj.classBuilder().abstractType().build();
      expect(c.isEndurantType()).toBeFalse();
    });

    it('should be false if restrictedTo = [ event ]', () => {
      c = proj.classBuilder().eventType().build();
      expect(c.isEndurantType()).toBeFalse();
    });

    it('should be false if restrictedTo = [ ]', () => {
      c = proj.classBuilder().build();
      expect(c.isEndurantType()).toBeFalse();
    });
  });

  describe(`Test ${Class.prototype.isMomentType.name}()`, () => {
    it('should be true if restrictedTo = [ intrinsic-mode ]', () => {
      c = proj.classBuilder().intrinsicModeType().build();
      expect(c.isMomentType()).toBeTrue();
    });

    it('should be true if restrictedTo = [ extrinsic-mode ]', () => {
      c = proj.classBuilder().extrinsicModeType().build();
      expect(c.isMomentType()).toBeTrue();
    });

    it('should be true if restrictedTo = [ relator ]', () => {
      c = proj.classBuilder().relatorType().build();
      expect(c.isMomentType()).toBeTrue();
    });

    it('should be true if restrictedTo = [ quality ]', () => {
      c = proj.classBuilder().qualityType().build();
      expect(c.isMomentType()).toBeTrue();
    });

    it('should be true if restrictedTo = [ intrinsic-mode, quality, relator, extrinsic-mode ]', () => {
      c = proj
        .classBuilder()
        .intrinsicModeType()
        .qualityType()
        .relator()
        .extrinsicModeType()
        .build();
      expect(c.isMomentType()).toBeTrue();
    });

    it('should be true if restrictedTo = [ quantity ]', () => {
      c = proj.classBuilder().quantity().build();
      expect(c.isMomentType()).toBeFalse();
    });

    it('should be false if restrictedTo = []', () => {
      c = proj.classBuilder().build();
      expect(c.isMomentType()).toBeFalse();
    });
  });

  describe(`Test ${Class.prototype.isSubstantialType.name}()`, () => {
    it('should be true if restrictedTo = [ collective ]', () => {
      c = proj.classBuilder().collectiveType().build();
      expect(c.isSubstantialType()).toBeTrue();
    });

    it('should be true if restrictedTo = [ functiona-complex ]', () => {
      c = proj.classBuilder().functionalComplexType().build();
      expect(c.isSubstantialType()).toBeTrue();
    });

    it('should be true if restrictedTo = [ quantity ]', () => {
      c = proj.classBuilder().quantity().build();
      expect(c.isSubstantialType()).toBeTrue();
    });

    it('should be true if restrictedTo = [ collective, functional-complex, quantity ]', () => {
      c = proj
        .classBuilder()
        .quantity()
        .functionalComplexType()
        .collectiveType()
        .build();
      expect(c.isSubstantialType()).toBeTrue();
    });

    it('should be false if restrictedTo = [ relator ]', () => {
      c = proj.classBuilder().relatorType().build();
      expect(c.isSubstantialType()).toBeFalse();
    });

    it('should be false if restrictedTo = []', () => {
      c = proj.classBuilder().build();
      expect(c.isSubstantialType()).toBeFalse();
    });
  });
});
