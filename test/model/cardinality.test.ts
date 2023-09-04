import { Property, Cardinality, CARDINALITY_MAX_AS_NUMBER } from '../../src';

describe(`Cardinality Tests`, () => {
  describe(`Test setCardinality()`, () => {
    const prop = new Property();

    it('Test 0..* (CARDINALITY_MAX_AS_NUMBER)', () => {
      prop.cardinality.setCardinality(0, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isZeroToMany()).toBeTrue();
    });

    it('Test 0..* (lowerBound only)', () => {
      prop.cardinality.setCardinality(0);
      expect(prop.cardinality.isZeroToMany()).toBeTrue();
    });

    it('Test 0..1', () => {
      prop.cardinality.setCardinality(0, 1);
      expect(prop.cardinality.isZeroToOne()).toBeTrue();
    });

    it('Test 1..*', () => {
      prop.cardinality.setCardinality(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isOneToMany()).toBeTrue();
    });

    it('Test 1..1', () => {
      prop.cardinality.setCardinality(1, 1);
      expect(prop.cardinality.isOneToOne()).toBeTrue();
    });
  });

  describe(`Test ${Cardinality.prototype.setZeroToOne.name}()`, () => {
    const prop = new Property();
    prop.cardinality.setZeroToOne();

    it('Test cardinality', () =>
      expect(prop.cardinality.isZeroToOne()).toBeTrue());
  });

  describe(`Test ${Cardinality.prototype.setZeroToMany.name}()`, () => {
    const prop = new Property();
    prop.cardinality.setZeroToMany();

    it('Test cardinality', () =>
      expect(prop.cardinality.isZeroToMany()).toBeTrue());
  });

  describe(`Test ${Cardinality.prototype.setOneToOne.name}()`, () => {
    const prop = new Property();
    prop.cardinality.setOneToOne();

    it('Test cardinality', () =>
      expect(prop.cardinality.isOneToOne()).toBeTrue());
  });

  describe(`Test ${Cardinality.prototype.setOneToMany.name}()`, () => {
    const prop = new Property();
    prop.cardinality.setOneToMany();

    it('Test cardinality', () =>
      expect(prop.cardinality.isOneToMany()).toBeTrue());
  });

  describe(`Test ${Cardinality.prototype.isOptional.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.cardinality.isOptional()).toBeTrue();
      prop.cardinality.setCardinality(0, 1);
      expect(prop.cardinality.isOptional()).toBeTrue();
      prop.cardinality.setCardinality(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isOptional()).toBeFalse();
      prop.cardinality.setCardinality(1, 1);
      expect(prop.cardinality.isOptional()).toBeFalse();
    });
  });

  describe(`Test ${Cardinality.prototype.isMandatory.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.cardinality.isMandatory()).toBeFalse();
      prop.cardinality.setCardinality(0, 1);
      expect(prop.cardinality.isMandatory()).toBeFalse();
      prop.cardinality.setCardinality(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isMandatory()).toBeTrue();
      prop.cardinality.setCardinality(1, 1);
      expect(prop.cardinality.isMandatory()).toBeTrue();
    });
  });

  describe(`Test ${Cardinality.prototype.isZeroToOne.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.cardinality.isZeroToOne()).toBeFalse();
      prop.cardinality.setCardinality(0, 1);
      expect(prop.cardinality.isZeroToOne()).toBeTrue();
      prop.cardinality.setCardinality(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isZeroToOne()).toBeFalse();
      prop.cardinality.setCardinality(1, 1);
      expect(prop.cardinality.isZeroToOne()).toBeFalse();
    });
  });

  describe(`Test ${Cardinality.prototype.isZeroToMany.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.cardinality.isZeroToMany()).toBeTrue();
      prop.cardinality.setCardinality(0, 1);
      expect(prop.cardinality.isZeroToMany()).toBeFalse();
      prop.cardinality.setCardinality(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isZeroToMany()).toBeFalse();
      prop.cardinality.setCardinality(1, 1);
      expect(prop.cardinality.isZeroToMany()).toBeFalse();
    });
  });

  describe(`Test ${Cardinality.prototype.isOneToOne.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.cardinality.isOneToOne()).toBeFalse();
      prop.cardinality.setCardinality(0, 1);
      expect(prop.cardinality.isOneToOne()).toBeFalse();
      prop.cardinality.setCardinality(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isOneToOne()).toBeFalse();
      prop.cardinality.setCardinality(1, 1);
      expect(prop.cardinality.isOneToOne()).toBeTrue();
    });
  });

  describe(`Test ${Cardinality.prototype.isOneToMany.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.cardinality.isOneToMany()).toBeFalse();
      prop.cardinality.setCardinality(0, 1);
      expect(prop.cardinality.isOneToMany()).toBeFalse();
      prop.cardinality.setCardinality(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isOneToMany()).toBeTrue();
      prop.cardinality.setCardinality(1, 1);
      expect(prop.cardinality.isOneToMany()).toBeFalse();
    });
  });

  describe(`Test ${Cardinality.prototype.isValid.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.cardinality.isValid()).toBeTrue();
      prop.cardinality.setCardinality(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isValid()).toBeTrue();
      prop.cardinality.value = '-1..-1';
      expect(prop.cardinality.isValid()).toBeFalse();
    });
  });
});
