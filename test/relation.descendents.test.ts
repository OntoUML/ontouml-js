import { describe, expect, it } from '@jest/globals';
import { Project, Relation } from '../src';

describe('Relation: test ancestor-related query methods', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const knows = model.createBinaryRelation(person, person);
  const isFriendsWith = model.createBinaryRelation(person, person);
  const isBestFriendsWith = model.createBinaryRelation(person, person);
  model.createGeneralization(knows, isFriendsWith);
  model.createGeneralization(isFriendsWith, isBestFriendsWith);

  describe('Test getChildren()', () => {
    it('Test function call', () => expect(knows.getChildren()).toContain(isFriendsWith));
    it('Test function call', () => expect(knows.getChildren().length).toBe(1));
  });

  describe('Test getDescendants()', () => {
    it('Test function call', () => expect(knows.getDescendants()).toContain(isFriendsWith));
    it('Test function call', () => expect(knows.getDescendants()).toContain(isBestFriendsWith));
    it('Test function call', () => expect(knows.getDescendants().length).toBe(2));
  });

  describe('Test getFilteredDescendants()', () => {
    const filter = (descendent: Relation) => descendent === isBestFriendsWith;

    it('Test function call', () => expect(knows.getFilteredDescendants(filter)).toContain(isBestFriendsWith));
    it('Test function call', () => expect(knows.getFilteredDescendants(filter).length).toBe(1));
  });
});
