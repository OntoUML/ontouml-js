import { Project } from '../../src';

describe('Relation: test descendants-related query methods', () => {
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

  describe('Test getChildren()', () => {
    let children;

    it('should return [ ] for bestFriendOf', () => {
      children = bestFriendOf.getChildren();
      expect(children).toBeEmpty();
    });

    it('should return [ bestFriendOf ] for friendOf', () => {
      children = friendOf.getChildren();
      expect(children).toIncludeSameMembers([bestFriendOf]);
    });

    it('should return [ friendOf ] for knows', () => {
      children = knows.getChildren();
      expect(children).toIncludeSameMembers([friendOf]);
    });
  });

  describe('Test getDescendants()', () => {
    let descendants;

    it('should return [ ] for bestFriendOf', () => {
      descendants = bestFriendOf.getDescendants();
      expect(descendants).toBeEmpty();
    });

    it('should return [ bestFriendOf ] for friendOf', () => {
      descendants = friendOf.getDescendants();
      expect(descendants).toIncludeSameMembers([bestFriendOf]);
    });

    it('should return [ friendOf, knows ] for knows', () => {
      descendants = knows.getDescendants();
      expect(descendants).toIncludeSameMembers([friendOf, bestFriendOf]);
    });
  });
});
