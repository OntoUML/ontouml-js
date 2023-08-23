import { describe, expect, it } from '@jest/globals';
import { Property, Cardinality, CARDINALITY_MAX_AS_NUMBER } from '../src';

describe(`Cardinality Tests`, () => {
  describe(`Test setCardinality()`, () => {
    const prop = new Property();

    it('Test 0..* (CARDINALITY_MAX_AS_NUMBER)', () => {
      prop.cardinality.setCardinality(0, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isZeroToMany()).toBe(true);
    });

    it('Test 0..* (lowerBound only)', () => {
      prop.cardinality.setCardinality(0);
      expect(prop.cardinality.isZeroToMany()).toBe(true);
    });

    it('Test 0..1', () => {
      prop.cardinality.setCardinality(0, 1);
      expect(prop.cardinality.isZeroToOne()).toBe(true);
    });

    it('Test 1..*', () => {
      prop.cardinality.setCardinality(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isOneToMany()).toBe(true);
    });

    it('Test 1..1', () => {
      prop.cardinality.setCardinality(1, 1);
      expect(prop.cardinality.isOneToOne()).toBe(true);
    });
  });

  describe(`Test ${Cardinality.prototype.setZeroToOne.name}()`, () => {
    const prop = new Property();
    prop.cardinality.setZeroToOne();

    it('Test cardinality', () =>
      expect(prop.cardinality.isZeroToOne()).toBe(true));
  });

  describe(`Test ${Cardinality.prototype.setZeroToMany.name}()`, () => {
    const prop = new Property();
    prop.cardinality.setZeroToMany();

    it('Test cardinality', () =>
      expect(prop.cardinality.isZeroToMany()).toBe(true));
  });

  describe(`Test ${Cardinality.prototype.setOneToOne.name}()`, () => {
    const prop = new Property();
    prop.cardinality.setOneToOne();

    it('Test cardinality', () =>
      expect(prop.cardinality.isOneToOne()).toBe(true));
  });

  describe(`Test ${Cardinality.prototype.setOneToMany.name}()`, () => {
    const prop = new Property();
    prop.cardinality.setOneToMany();

    it('Test cardinality', () =>
      expect(prop.cardinality.isOneToMany()).toBe(true));
  });

  describe(`Test ${Cardinality.prototype.isOptional.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.cardinality.isOptional()).toBe(true);
      prop.cardinality.setCardinality(0, 1);
      expect(prop.cardinality.isOptional()).toBe(true);
      prop.cardinality.setCardinality(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isOptional()).toBe(false);
      prop.cardinality.setCardinality(1, 1);
      expect(prop.cardinality.isOptional()).toBe(false);
    });
  });

  describe(`Test ${Cardinality.prototype.isMandatory.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.cardinality.isMandatory()).toBe(false);
      prop.cardinality.setCardinality(0, 1);
      expect(prop.cardinality.isMandatory()).toBe(false);
      prop.cardinality.setCardinality(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isMandatory()).toBe(true);
      prop.cardinality.setCardinality(1, 1);
      expect(prop.cardinality.isMandatory()).toBe(true);
    });
  });

  describe(`Test ${Cardinality.prototype.isZeroToOne.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.cardinality.isZeroToOne()).toBe(false);
      prop.cardinality.setCardinality(0, 1);
      expect(prop.cardinality.isZeroToOne()).toBe(true);
      prop.cardinality.setCardinality(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isZeroToOne()).toBe(false);
      prop.cardinality.setCardinality(1, 1);
      expect(prop.cardinality.isZeroToOne()).toBe(false);
    });
  });

  describe(`Test ${Cardinality.prototype.isZeroToMany.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.cardinality.isZeroToMany()).toBe(true);
      prop.cardinality.setCardinality(0, 1);
      expect(prop.cardinality.isZeroToMany()).toBe(false);
      prop.cardinality.setCardinality(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isZeroToMany()).toBe(false);
      prop.cardinality.setCardinality(1, 1);
      expect(prop.cardinality.isZeroToMany()).toBe(false);
    });
  });

  describe(`Test ${Cardinality.prototype.isOneToOne.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.cardinality.isOneToOne()).toBe(false);
      prop.cardinality.setCardinality(0, 1);
      expect(prop.cardinality.isOneToOne()).toBe(false);
      prop.cardinality.setCardinality(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isOneToOne()).toBe(false);
      prop.cardinality.setCardinality(1, 1);
      expect(prop.cardinality.isOneToOne()).toBe(true);
    });
  });

  describe(`Test ${Cardinality.prototype.isOneToMany.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.cardinality.isOneToMany()).toBe(false);
      prop.cardinality.setCardinality(0, 1);
      expect(prop.cardinality.isOneToMany()).toBe(false);
      prop.cardinality.setCardinality(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isOneToMany()).toBe(true);
      prop.cardinality.setCardinality(1, 1);
      expect(prop.cardinality.isOneToMany()).toBe(false);
    });
  });

  describe(`Test ${Cardinality.prototype.isValid.name}()`, () => {
    const prop = new Property();

    it('Test prop', () => {
      expect(prop.cardinality.isValid()).toBe(true);
      prop.cardinality.setCardinality(1, CARDINALITY_MAX_AS_NUMBER);
      expect(prop.cardinality.isValid()).toBe(true);
      prop.cardinality.value = '-1..-1';
      expect(prop.cardinality.isValid()).toBe(false);
    });
  });
});
