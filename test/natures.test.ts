import { describe, expect, it } from '@jest/globals';
import { natureUtils, Nature } from '../src';

describe(`Test ontological nature handling utility`, () => {
  describe('Test natures array', () => {
    it('There should be a know number of natures', () => expect(natureUtils.Natures).toHaveLength(11));
    it('Each of these must be a in the array', () => {
      expect(natureUtils.Natures).toContain(Nature.FUNCTIONAL_COMPLEX);
      expect(natureUtils.Natures).toContain(Nature.COLLECTIVE);
      expect(natureUtils.Natures).toContain(Nature.QUANTITY);
      expect(natureUtils.Natures).toContain(Nature.RELATOR);
      expect(natureUtils.Natures).toContain(Nature.INTRINSIC_MODE);
      expect(natureUtils.Natures).toContain(Nature.EXTRINSIC_MODE);
      expect(natureUtils.Natures).toContain(Nature.QUALITY);
      expect(natureUtils.Natures).toContain(Nature.EVENT);
      expect(natureUtils.Natures).toContain(Nature.SITUATION);
      expect(natureUtils.Natures).toContain(Nature.TYPE);
      expect(natureUtils.Natures).toContain(Nature.ABSTRACT);
    });
  });

  describe('Test endurant natures array', () => {
    it('There should be a know number of natures', () => expect(natureUtils.EndurantNatures).toHaveLength(7));
    it('Each of these must be a in the array', () => {
      expect(natureUtils.EndurantNatures).toContain(Nature.FUNCTIONAL_COMPLEX);
      expect(natureUtils.EndurantNatures).toContain(Nature.COLLECTIVE);
      expect(natureUtils.EndurantNatures).toContain(Nature.QUANTITY);
      expect(natureUtils.EndurantNatures).toContain(Nature.RELATOR);
      expect(natureUtils.EndurantNatures).toContain(Nature.INTRINSIC_MODE);
      expect(natureUtils.EndurantNatures).toContain(Nature.EXTRINSIC_MODE);
      expect(natureUtils.EndurantNatures).toContain(Nature.QUALITY);
    });
  });

  describe('Test substantial natures array', () => {
    it('There should be a know number of natures', () => expect(natureUtils.SubstantialNatures).toHaveLength(3));
    it('Each of these must be a in the array', () => {
      expect(natureUtils.SubstantialNatures).toContain(Nature.FUNCTIONAL_COMPLEX);
      expect(natureUtils.SubstantialNatures).toContain(Nature.COLLECTIVE);
      expect(natureUtils.SubstantialNatures).toContain(Nature.QUANTITY);
    });
  });

  describe('Test moment natures array', () => {
    it('There should be a know number of natures', () => expect(natureUtils.MomentNatures).toHaveLength(4));
    it('Each of these must be a in the array', () => {
      expect(natureUtils.MomentNatures).toContain(Nature.RELATOR);
      expect(natureUtils.MomentNatures).toContain(Nature.INTRINSIC_MODE);
      expect(natureUtils.MomentNatures).toContain(Nature.EXTRINSIC_MODE);
      expect(natureUtils.MomentNatures).toContain(Nature.QUALITY);
    });
  });

  describe('Test intrinsic moment natures array', () => {
    it('There should be a know number of natures', () => expect(natureUtils.IntrinsicMomentNatures).toHaveLength(2));
    it('Each of these must be a in the array', () => {
      expect(natureUtils.IntrinsicMomentNatures).toContain(Nature.INTRINSIC_MODE);
      expect(natureUtils.IntrinsicMomentNatures).toContain(Nature.QUALITY);
    });
  });

  describe('Test extrinsic moment natures array', () => {
    it('There should be a know number of natures', () => expect(natureUtils.ExtrinsicMomentNatures).toHaveLength(2));
    it('Each of these must be a in the array', () => {
      expect(natureUtils.ExtrinsicMomentNatures).toContain(Nature.EXTRINSIC_MODE);
      expect(natureUtils.ExtrinsicMomentNatures).toContain(Nature.RELATOR);
    });
  });
});
