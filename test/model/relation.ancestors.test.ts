import { Project, Relation } from '../../src';

describe('Relation: test ancestor-related query methods', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const knows = model.createBinaryRelation(person, person);
  const isFriendsWith = model.createBinaryRelation(person, person);
  const isBestFriendsWith = model.createBinaryRelation(person, person);
  model.createGeneralization(knows, isFriendsWith);
  model.createGeneralization(isFriendsWith, isBestFriendsWith);

  describe('Test getParents()', () => {
    it('Test function call', () =>
      expect(isBestFriendsWith.getParents()).toContain(isFriendsWith));
    it('Test function call', () =>
      expect(isBestFriendsWith.getParents().length).toBe(1));
  });

  describe('Test getAncestors()', () => {
    it('Test function call', () =>
      expect(isBestFriendsWith.getAncestors()).toContain(isFriendsWith));
    it('Test function call', () =>
      expect(isBestFriendsWith.getAncestors()).toContain(knows));
    it('Test function call', () =>
      expect(isBestFriendsWith.getAncestors().length).toBe(2));
  });

  describe('Test getFilteredAncestors()', () => {
    const filter = (ancestor: Relation) => ancestor === knows;

    it('Test function call', () =>
      expect(isBestFriendsWith.getFilteredAncestors(filter)).toContain(knows));
    it('Test function call', () =>
      expect(isBestFriendsWith.getFilteredAncestors(filter).length).toBe(1));
  });
});
