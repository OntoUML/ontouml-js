import {
  COLLECTIVE,
  Class,
  ClassStereotype,
  Decoratable,
  KIND,
  Project,
  RELATOR
} from '../../src';

describe('Test Class stereotype-related query methods', () => {
  let proj: Project;
  let c: Class;

  beforeEach(() => {
    proj = new Project();
  });

  describe(`Test ${Decoratable.prototype.hasValidStereotype.name}()`, () => {
    Object.values(ClassStereotype).forEach(stereotype =>
      it(`should be true if valid class stereotype ('${stereotype}')`, () => {
        c = proj.classBuilder().stereotype(stereotype).build();
        expect(c.hasValidStereotype()).toBeTrue();
      })
    );

    it(`should be false if invalid class stereotype`, () => {
      c = proj.classBuilder().stereotype('custom').build();
      expect(c.hasValidStereotype()).toBeFalse();
    });

    it(`should be false if class has no stereotype and allowsNone = false`, () => {
      c = proj.classBuilder().build();
      expect(c.hasValidStereotype(false)).toBeFalse();
    });

    it(`should be false if class has no stereotype and allowsNone is not given (false by default)`, () => {
      c = proj.classBuilder().build();
      expect(c.hasValidStereotype()).toBeFalse();
    });

    it(`should be true if class has no stereotype and allowsNone = true`, () => {
      c = proj.classBuilder().build();
      expect(c.hasValidStereotype(true)).toBeTrue();
    });
  });

  describe(`Test ${Decoratable.prototype.isStereotypeOneOf.name}()`, () => {
    it('Should throw an Error if the class has no stereotype', () => {
      c = proj.classBuilder().build();

      const func = () => c.isStereotypeOneOf(KIND);
      expect(func).toThrowError();
    });

    it('should be true if the class is decorated with one of the stereotypes listed in the input (one)', () => {
      c = proj.classBuilder().kind().build();

      expect(c.isStereotypeOneOf(KIND)).toBeTrue();
    });

    it('should be true if the class is decorated with one of the stereotypes listed in the input (list)', () => {
      c = proj.classBuilder().kind().build();

      expect(c.isStereotypeOneOf([KIND, COLLECTIVE])).toBeTrue();
    });

    it('should be false if the class is not decorated with one of the stereotypes listed in the input (list)', () => {
      c = proj.classBuilder().kind().build();

      expect(c.isStereotypeOneOf([RELATOR, COLLECTIVE])).toBeFalse();
    });
  });

  describe(`Test ${Class.prototype.isKind.name}()`, () => {
    it('should be true if the class is a «kind»', () => {
      c = proj.classBuilder().kind().build();

      expect(c.isKind()).toBeTrue();
    });

    it('should be false if the class is a not a «kind» (e.g. «event»)', () => {
      c = proj.classBuilder().event().build();
      expect(c.isKind()).toBeFalse();
    });

    it('should be false if the class is not decorated with a stereotype', () => {
      c = proj.classBuilder().build();
      expect(c.isKind()).toBeFalse();
    });
  });

  describe(`Test ${Class.prototype.isComplexDatatype.name}()`, () => {
    let c: Class;

    it('should be false if the datatype has no attribute', () => {
      c = proj.classBuilder().datatype().build();
      expect(c.isComplexDatatype()).toBeFalse();
    });

    it('should be true if the datatype has one attribute', () => {
      c = proj.classBuilder().datatype().build();
      c.propertyBuilder().build();

      expect(c.isComplexDatatype()).toBeTrue();
    });

    it('should be true if the datatype has two attributes', () => {
      c = proj.classBuilder().datatype().build();
      c.propertyBuilder().build();
      c.propertyBuilder().build();

      expect(c.isComplexDatatype()).toBeTrue();
    });

    it('should be false if the class is stereotyped as «enum»', () => {
      c = proj.classBuilder().enumeration().build();
      c.propertyBuilder().build();
      c.propertyBuilder().build();

      expect(c.isComplexDatatype()).toBeFalse();
    });

    it('should be false if the class is stereotyped as «abstract»', () => {
      c = proj.classBuilder().abstract().build();
      c.propertyBuilder().build();
      c.propertyBuilder().build();

      expect(c.isComplexDatatype()).toBeFalse();
    });

    it('should be false if the class is stereotyped as «kind»', () => {
      c = proj.classBuilder().kind().build();
      c.propertyBuilder().build();
      c.propertyBuilder().build();

      expect(c.isComplexDatatype()).toBeFalse();
    });

    it('should be false if the class is not decorated with a stereotype', () => {
      c = proj.classBuilder().build();
      c.propertyBuilder().build();
      c.propertyBuilder().build();

      expect(c.isComplexDatatype()).toBeFalse();
    });
  });

  describe(`Test ${Class.prototype.isRigid.name}()`, () => {
    it('should be true if «kind»', () => {
      c = proj.classBuilder().kind().build();
      expect(c.isRigid()).toBeTrue();
    });

    it('should be true if «category»', () => {
      c = proj.classBuilder().category().build();
      expect(c.isRigid()).toBeTrue();
    });

    it('should be false if «mixin»', () => {
      c = proj.classBuilder().mixin().build();
      expect(c.isRigid()).toBeFalse();
    });

    it('should be false if «phaseMixin»', () => {
      c = proj.classBuilder().phaseMixin().build();
      expect(c.isRigid()).toBeFalse();
    });

    it('should be false if «role»', () => {
      c = proj.classBuilder().role().build();
      expect(c.isRigid()).toBeFalse();
    });

    it('should throw an error if the class is not decorated with a stereotype', () => {
      c = proj.classBuilder().build();
      expect(() => c.isRigid()).toThrowError();
    });
  });

  describe(`Test ${Class.prototype.isSemiRigid.name}()`, () => {
    it('should be true if «mixin»', () => {
      c = proj.classBuilder().mixin().build();
      expect(c.isSemiRigid()).toBeTrue();
    });

    it('should be false if «kind»', () => {
      c = proj.classBuilder().kind().build();
      expect(c.isSemiRigid()).toBeFalse();
    });

    it('should be false if «category»', () => {
      c = proj.classBuilder().category().build();
      expect(c.isSemiRigid()).toBeFalse();
    });

    it('should be false if «phaseMixin»', () => {
      c = proj.classBuilder().phaseMixin().build();
      expect(c.isSemiRigid()).toBeFalse();
    });

    it('should be false if «role»', () => {
      c = proj.classBuilder().role().build();
      expect(c.isSemiRigid()).toBeFalse();
    });

    it('should throw an error if the class is not decorated with a stereotype', () => {
      c = proj.classBuilder().build();
      expect(() => c.isSemiRigid()).toThrowError();
    });
  });

  describe(`Test ${Class.prototype.isAntiRigid.name}()`, () => {
    it('should be true if «phaseMixin»', () => {
      c = proj.classBuilder().phaseMixin().build();
      expect(c.isAntiRigid()).toBeTrue();
    });

    it('should be true if «role»', () => {
      c = proj.classBuilder().role().build();
      expect(c.isAntiRigid()).toBeTrue();
    });

    it('should be false if «mixin»', () => {
      c = proj.classBuilder().mixin().build();
      expect(c.isAntiRigid()).toBeFalse();
    });

    it('should be false if «kind»', () => {
      c = proj.classBuilder().kind().build();
      expect(c.isAntiRigid()).toBeFalse();
    });

    it('should be false if «category»', () => {
      c = proj.classBuilder().category().build();
      expect(c.isAntiRigid()).toBeFalse();
    });

    it('should throw an error if the class is not decorated with a stereotype', () => {
      c = proj.classBuilder().build();
      expect(() => c.isAntiRigid()).toThrowError();
    });
  });

  describe(`Test ${Class.prototype.isNonSortal.name}()`, () => {
    it('should be true if «phaseMixin»', () => {
      c = proj.classBuilder().phaseMixin().build();
      expect(c.isNonSortal()).toBeTrue();
    });

    it('should be true if «mixin»', () => {
      c = proj.classBuilder().mixin().build();
      expect(c.isNonSortal()).toBeTrue();
    });

    it('should be true if «category»', () => {
      c = proj.classBuilder().category().build();
      expect(c.isNonSortal()).toBeTrue();
    });

    it('should be false if «role»', () => {
      c = proj.classBuilder().role().build();
      expect(c.isNonSortal()).toBeFalse();
    });

    it('should be false if «kind»', () => {
      c = proj.classBuilder().kind().build();
      expect(c.isNonSortal()).toBeFalse();
    });

    it('should throw an error if the class is not decorated with a stereotype', () => {
      c = proj.classBuilder().build();
      expect(() => c.isNonSortal()).toThrowError();
    });
  });

  describe(`Test ${Class.prototype.isSortal.name}()`, () => {
    it('should be true if «role»', () => {
      c = proj.classBuilder().role().build();
      expect(c.isSortal()).toBeTrue();
    });

    it('should be true if «kind»', () => {
      c = proj.classBuilder().kind().build();
      expect(c.isSortal()).toBeTrue();
    });

    it('should be false if «phaseMixin»', () => {
      c = proj.classBuilder().phaseMixin().build();
      expect(c.isSortal()).toBeFalse();
    });

    it('should be false if «mixin»', () => {
      c = proj.classBuilder().mixin().build();
      expect(c.isSortal()).toBeFalse();
    });

    it('should be false if «category»', () => {
      c = proj.classBuilder().category().build();
      expect(c.isSortal()).toBeFalse();
    });

    it('should throw an error if the class is not decorated with a stereotype', () => {
      c = proj.classBuilder().build();
      expect(() => c.isSortal()).toThrowError();
    });
  });

  describe(`Test ${Class.prototype.isIdentityProvider.name}()`, () => {
    it('should be false if «role»', () => {
      c = proj.classBuilder().role().build();
      expect(c.isIdentityProvider()).toBeFalse();
    });

    it('should be true if «kind»', () => {
      c = proj.classBuilder().kind().build();
      expect(c.isIdentityProvider()).toBeTrue();
    });

    it('should be false if «phaseMixin»', () => {
      c = proj.classBuilder().phaseMixin().build();
      expect(c.isIdentityProvider()).toBeFalse();
    });

    it('should throw an error if the class is not decorated with a stereotype', () => {
      c = proj.classBuilder().build();
      expect(() => c.isIdentityProvider()).toThrowError();
    });
  });

  describe(`Test ${Class.prototype.isBaseSortal.name}()`, () => {
    it('should be true if «role»', () => {
      c = proj.classBuilder().role().build();
      expect(c.isBaseSortal()).toBeTrue();
    });

    it('should be false if «kind»', () => {
      c = proj.classBuilder().kind().build();
      expect(c.isBaseSortal()).toBeFalse();
    });

    it('should be false if «phaseMixin»', () => {
      c = proj.classBuilder().phaseMixin().build();
      expect(c.isBaseSortal()).toBeFalse();
    });

    it('should throw an error if the class is not decorated with a stereotype', () => {
      c = proj.classBuilder().build();
      expect(() => c.isBaseSortal()).toThrowError();
    });
  });
});
