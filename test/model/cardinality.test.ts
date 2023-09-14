import {
  Property,
  Cardinality,
  CARDINALITY_MAX_AS_NUMBER,
  Project,
  Class
} from '../../src';

describe(`Cardinality Tests`, () => {
  let proj: Project;
  let clazz: Class;
  let prop: Property;

  beforeEach(() => {
    proj = new Project();
    clazz = proj.classBuilder().build();
    prop = clazz.attributeBuilder().build();
  });

  describe(`Test setCardinality()`, () => {
    it('Test 0..* (CARDINALITY_MAX_AS_NUMBER)', () => {
      prop.cardinality.setBounds(0, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isZeroToMany()).toBeTrue();
    });

    it('Test 0..* (lowerBound only)', () => {
      prop.cardinality.setBounds(0);
      expect(prop.cardinality.isZeroToMany()).toBeTrue();
    });

    it('Test 0..1', () => {
      prop.cardinality.setBounds(0, 1);
      expect(prop.cardinality.isZeroToOne()).toBeTrue();
    });

    it('Test 1..*', () => {
      prop.cardinality.setBounds(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isOneToMany()).toBeTrue();
    });

    it('Test 1..1', () => {
      prop.cardinality.setBounds(1, 1);
      expect(prop.cardinality.isOneToOne()).toBeTrue();
    });
  });

  describe(`Test ${Cardinality.prototype.setAsZeroToOne.name}()`, () => {
    it('Test cardinality', () => {
      prop.cardinality.setAsZeroToOne();
      expect(prop.cardinality.isZeroToOne()).toBeTrue();
    });
  });

  describe(`Test ${Cardinality.prototype.setAsZeroToMany.name}()`, () => {
    it('Test cardinality', () => {
      prop.cardinality.setAsZeroToMany();
      expect(prop.cardinality.isZeroToMany()).toBeTrue();
    });
  });

  describe(`Test ${Cardinality.prototype.setAsOneToOne.name}()`, () => {
    it('Test cardinality', () => {
      prop.cardinality.setAsOneToOne();
      expect(prop.cardinality.isOneToOne()).toBeTrue();
    });
  });

  describe(`Test ${Cardinality.prototype.setAsOneToMany.name}()`, () => {
    it('Test cardinality', () => {
      prop.cardinality.setAsOneToMany();
      expect(prop.cardinality.isOneToMany()).toBeTrue();
    });
  });

  describe(`Test ${Cardinality.prototype.isOptional.name}()`, () => {
    it('should be true if lower bound is 0', () => {
      prop.cardinality.setLowerBound(0);
      expect(prop.cardinality.isOptional()).toBeTrue();
    });

    it('should be false if lower bound is 1', () => {
      prop.cardinality.setLowerBound(1);
      expect(prop.cardinality.isOptional()).toBeFalse();
    });

    it('should be false if lower bound is 3', () => {
      prop.cardinality.setBounds(3, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isOptional()).toBeFalse();
    });
  });

  describe(`Test ${Cardinality.prototype.isMandatory.name}()`, () => {
    it('should be false if lower bound is 0', () => {
      prop.cardinality.setLowerBound(0);
      expect(prop.cardinality.isMandatory()).toBeFalse();
    });

    it('should be true if lower bound is 1', () => {
      prop.cardinality.setLowerBound(1);
      expect(prop.cardinality.isMandatory()).toBeTrue();
    });

    it('should be true if lower bound is 3', () => {
      prop.cardinality.setBounds(3, 7);
      expect(prop.cardinality.isMandatory()).toBeTrue();
    });
  });

  describe(`Test ${Cardinality.prototype.isZeroToOne.name}()`, () => {
    it('should be true if lower bound is 0 and upper bound is 1', () => {
      prop.cardinality.setLowerBound(0);
      prop.cardinality.setUpperBound(1);
      expect(prop.cardinality.isZeroToOne()).toBeTrue();
    });

    it('should be false if lower bound is 1 and upper bound is 1', () => {
      prop.cardinality.setBounds(1, 1);
      expect(prop.cardinality.isZeroToOne()).toBeFalse();
    });

    it('should be false if lower bound is 0 and upper bound is 2', () => {
      prop.cardinality.setBounds(0, 2);
      expect(prop.cardinality.isZeroToOne()).toBeFalse();
    });

    it('should be false if lower bound is 0 and upper bound is *', () => {
      prop.cardinality.setBounds(0, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isZeroToOne()).toBeFalse();
    });

    it('should be false if lower bound is 1 and upper bound is *', () => {
      prop.cardinality.setBounds(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isZeroToOne()).toBeFalse();
    });
  });

  describe(`Test ${Cardinality.prototype.isZeroToMany.name}()`, () => {
    it('should be false if lower bound is 0 and upper bound is 1', () => {
      prop.cardinality.setBounds(0, 1);
      expect(prop.cardinality.isZeroToMany()).toBeFalse();
    });

    it('should be false if lower bound is 1 and upper bound is 1', () => {
      prop.cardinality.setBounds(1, 1);
      expect(prop.cardinality.isZeroToMany()).toBeFalse();
    });

    it('should be false if lower bound is 0 and upper bound is 2', () => {
      prop.cardinality.setBounds(0, 2);
      expect(prop.cardinality.isZeroToMany()).toBeFalse();
    });

    it('should be true if lower bound is 0 and upper bound is *', () => {
      prop.cardinality.setBounds(0, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isZeroToMany()).toBeTrue();
    });

    it('should be false if lower bound is 1 and upper bound is *', () => {
      prop.cardinality.setBounds(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isZeroToMany()).toBeFalse();
    });
  });

  describe(`Test ${Cardinality.prototype.isOneToOne.name}()`, () => {
    it('should be false if lower bound is 0 and upper bound is 1', () => {
      prop.cardinality.setBounds(0, 1);
      expect(prop.cardinality.isOneToOne()).toBeFalse();
    });

    it('should be true if lower bound is 1 and upper bound is 1', () => {
      prop.cardinality.setBounds(1, 1);
      expect(prop.cardinality.isOneToOne()).toBeTrue();
    });

    it('should be false if lower bound is 0 and upper bound is 2', () => {
      prop.cardinality.setBounds(0, 2);
      expect(prop.cardinality.isOneToOne()).toBeFalse();
    });

    it('should be false if lower bound is 0 and upper bound is *', () => {
      prop.cardinality.setBounds(0, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isOneToOne()).toBeFalse();
    });

    it('should be false if lower bound is 1 and upper bound is *', () => {
      prop.cardinality.setBounds(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isOneToOne()).toBeFalse();
    });
  });

  describe(`Test ${Cardinality.prototype.isOneToMany.name}()`, () => {
    it('should be false if lower bound is 0 and upper bound is 1', () => {
      prop.cardinality.setBounds(0, 1);
      expect(prop.cardinality.isOneToMany()).toBeFalse();
    });

    it('should be false if lower bound is 1 and upper bound is 1', () => {
      prop.cardinality.setBounds(1, 1);
      expect(prop.cardinality.isOneToMany()).toBeFalse();
    });

    it('should be false if lower bound is 0 and upper bound is 2', () => {
      prop.cardinality.setBounds(0, 2);
      expect(prop.cardinality.isOneToMany()).toBeFalse();
    });

    it('should be false if lower bound is 0 and upper bound is *', () => {
      prop.cardinality.setBounds(0, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isOneToMany()).toBeFalse();
    });

    it('should be true if lower bound is 1 and upper bound is *', () => {
      prop.cardinality.setBounds(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isOneToMany()).toBeTrue();
    });
  });

  describe(`Test ${Cardinality.prototype.isValid.name}()`, () => {
    it('should be true for the default cardinality', () => {
      expect(prop.cardinality.isValid()).toBeTrue();
    });

    it('should be true for 1..*', () => {
      prop.cardinality.setBounds(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isValid()).toBeTrue();
    });

    it('should be true when lower bound is equal to upper bound', () => {
      prop.cardinality.value = '1..1';
      expect(prop.cardinality.isValid()).toBeTrue();
    });

    it('should be false for negative lower bound', () => {
      prop.cardinality.value = '-1..2';
      expect(prop.cardinality.isValid()).toBeFalse();
    });

    it('should be false for negative upper bound', () => {
      prop.cardinality.value = '1..-2';
      expect(prop.cardinality.isValid()).toBeFalse();
    });

    it('should be false when lower bound is higher than upper bound', () => {
      prop.cardinality.value = '2..1';
      expect(prop.cardinality.isValid()).toBeFalse();
    });
  });
});
