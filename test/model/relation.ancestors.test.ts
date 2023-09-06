import { Project, Relation } from '../../src';

describe('Relation: test ancestor-related query methods', () => {
  const proj = new Project();
  const person = proj.classBuilder().build();

  const knows = proj
    .binaryRelationBuilder()
    .source(person)
    .target(person)
    .build();

  const friendOf = proj
    .binaryRelationBuilder()
    .source(person)
    .target(person)
    .build();

  const bestFriendOf = proj
    .binaryRelationBuilder()
    .source(person)
    .target(person)
    .build();

  proj.generalizationBuilder().general(knows).specific(friendOf).build();
  proj.generalizationBuilder().general(friendOf).specific(bestFriendOf).build();

  describe('Test getParents()', () => {
    let parents;

    it('should return [ friendOf ] for bestFriendOf', () => {
      parents = bestFriendOf.getParents();
      expect(parents).toIncludeSameMembers([friendOf]);
    });

    it('should return [ knows ] for friendOf', () => {
      parents = friendOf.getParents();
      expect(parents).toIncludeSameMembers([knows]);
    });

    it('should return [ ] for knows', () => {
      parents = knows.getParents();
      expect(parents).toBeEmpty();
    });
  });

  describe('Test getAncestors()', () => {
    let ancestors;

    it('should return [ friendOf, knows ] for bestFriendOf', () => {
      ancestors = bestFriendOf.getAncestors();
      expect(ancestors).toIncludeSameMembers([friendOf, knows]);
    });

    it('should return [ knows ] for friendOf', () => {
      ancestors = friendOf.getAncestors();
      expect(ancestors).toIncludeSameMembers([knows]);
    });

    it('should return [ ] for knows', () => {
      ancestors = knows.getAncestors();
      expect(ancestors).toBeEmpty();
    });
  });
});
