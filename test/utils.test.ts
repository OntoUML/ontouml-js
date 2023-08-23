import { describe, expect, it } from '@jest/globals';
import { utils } from '../src';

describe('Utils Test', () => {
  describe(`Test utils.${utils.arrayFrom.name}()`, () => {
    it('Array from null', () => {
      const arr = utils.arrayFrom(null);
      expect(arr.length).toBe(0);
    });
    it('Array from non-array primitive', () => {
      const arr = utils.arrayFrom(1);
      expect(arr).toContain(1);
      expect(arr.length).toBe(1);
    });
    it('Array from set', () => {
      const arr = utils.arrayFrom(new Set([1, 2]));
      expect(arr).toContain(1);
      expect(arr).toContain(2);
      expect(arr.length).toBe(2);
    });
    it('Array from array', () => {
      const arr = utils.arrayFrom([1, 2]);
      expect(arr).toContain(1);
      expect(arr).toContain(2);
      expect(arr.length).toBe(2);
    });
  });

  describe(`Test utils.${utils.intersects.name}()`, () => {
    it('A and B are empty', () => {
      const A = [];
      const B = [];
      expect(utils.intersects(A, B)).toBe(false);
    });
    it('A superset of B', () => {
      const A = [2, 1, 3];
      const B = [1];
      expect(utils.intersects(A, B)).toBe(true);
    });
    it('A subset of B', () => {
      const A = [3];
      const B = [2, 1, 3];
      expect(utils.intersects(A, B)).toBe(true);
    });
    it('A same contents as B', () => {
      const A = [3, 2, 1];
      const B = [1, 3, 2];
      expect(utils.intersects(A, B)).toBe(true);
    });
    it('A overlaps with B', () => {
      const A = [2, 1];
      const B = [3, 2];
      expect(utils.intersects(A, B)).toBe(true);
    });
    it('A is disjoint with B', () => {
      const A = [3, 2];
      const B = [1, 4];
      expect(utils.intersects(A, B)).toBe(false);
    });
    it('A and B undefined or null', () => {
      const A = null;
      const B = undefined;
      expect(utils.intersects(A, B)).toBe(false);
    });
  });

  describe(`Test utils.${utils.includesAll.name}()`, () => {
    it('A and B are empty', () => {
      const A = [];
      const B = [];
      expect(utils.includesAll(A, B)).toBe(true);
    });
    it('A superset of B', () => {
      const A = [2, 1, 3];
      const B = [1];
      expect(utils.includesAll(A, B)).toBe(true);
    });
    it('A subset of B', () => {
      const A = [3];
      const B = [2, 1, 3];
      expect(utils.includesAll(A, B)).toBe(false);
    });
    it('A same contents as B', () => {
      const A = [3, 2, 1];
      const B = [1, 3, 2];
      expect(utils.includesAll(A, B)).toBe(true);
    });
    it('A overlaps with B', () => {
      const A = [2, 1];
      const B = [3, 2];
      expect(utils.includesAll(A, B)).toBe(false);
    });
    it('A is disjoint with B', () => {
      const A = [3, 2];
      const B = [1, 4];
      expect(utils.includesAll(A, B)).toBe(false);
    });
    it('A and B undefined or null', () => {
      const A = null;
      const B = undefined;
      expect(utils.includesAll(A, B)).toBe(false);
    });
  });

  describe(`Test utils.${utils.equalContents.name}()`, () => {
    it('A and B are empty', () => {
      const A = [];
      const B = [];
      expect(utils.equalContents(A, B)).toBe(true);
    });
    it('A superset of B', () => {
      const A = [2, 1, 3];
      const B = [1];
      expect(utils.equalContents(A, B)).toBe(false);
    });
    it('A subset of B', () => {
      const A = [3];
      const B = [2, 1, 3];
      expect(utils.equalContents(A, B)).toBe(false);
    });
    it('A same contents as B', () => {
      const A = [3, 2, 1];
      const B = [1, 3, 2];
      expect(utils.equalContents(A, B)).toBe(true);
    });
    it('A overlaps with B', () => {
      const A = [2, 1];
      const B = [3, 2];
      expect(utils.equalContents(A, B)).toBe(false);
    });
    it('A is disjoint with B', () => {
      const A = [3, 2];
      const B = [1, 4];
      expect(utils.equalContents(A, B)).toBe(false);
    });
    it('A and B undefined or null', () => {
      const A = null;
      const B = undefined;
      expect(utils.equalContents(A, B)).toBe(false);
    });
  });
});
