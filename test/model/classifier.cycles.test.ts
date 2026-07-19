import { Class, Generalization, Project } from '../../src';

describe('Classifier: circular generalization chains', () => {
  let proj: Project;

  beforeEach(() => {
    proj = new Project();
  });

  describe('Cycle of length 3 (A specializes B, B specializes C, C specializes A)', () => {
    let a: Class, b: Class, c: Class;

    beforeEach(() => {
      a = proj.classBuilder().kind().name('A').build();
      b = proj.classBuilder().kind().name('B').build();
      c = proj.classBuilder().kind().name('C').build();

      a.addParent(b);
      b.addParent(c);
      c.addParent(a);
    });

    it('getAncestors() should throw for every classifier in the cycle', () => {
      expect(() => a.getAncestors()).toThrow(/circular/i);
      expect(() => b.getAncestors()).toThrow(/circular/i);
      expect(() => c.getAncestors()).toThrow(/circular/i);
    });

    it('getDescendants() should throw for every classifier in the cycle', () => {
      expect(() => a.getDescendants()).toThrow(/circular/i);
      expect(() => b.getDescendants()).toThrow(/circular/i);
      expect(() => c.getDescendants()).toThrow(/circular/i);
    });

    it('methods that traverse ancestors should also throw', () => {
      expect(() => a.getAllRelations()).toThrow(/circular/i);
      expect(() => a.getAllIncomingRelations()).toThrow(/circular/i);
      expect(() => a.getAllOutgoingRelations()).toThrow(/circular/i);
      expect(() => a.getIdentityProviderAncestors()).toThrow(/circular/i);
    });

    it('getParents() and getChildren() should still work, as they do not traverse the hierarchy', () => {
      expect(a.getParents()).toIncludeSameMembers([b]);
      expect(a.getChildren()).toIncludeSameMembers([c]);
    });

    it('getAncestors() should not throw for a classifier below the cycle, returning the cycle members', () => {
      const d = proj.classBuilder().subkind().name('D').build();
      d.addParent(a);

      expect(d.getAncestors()).toIncludeSameMembers([a, b, c]);
    });

    it('getDescendants() should not throw for a classifier below the cycle', () => {
      const d = proj.classBuilder().subkind().name('D').build();
      d.addParent(a);

      expect(d.getDescendants()).toBeEmpty();
    });
  });

  describe('Cycle of length 2 (A specializes B, B specializes A)', () => {
    it('getAncestors() and getDescendants() should throw for both classifiers', () => {
      const a = proj.classBuilder().kind().name('A').build();
      const b = proj.classBuilder().kind().name('B').build();

      a.addParent(b);
      b.addParent(a);

      expect(() => a.getAncestors()).toThrow(/circular/i);
      expect(() => b.getAncestors()).toThrow(/circular/i);
      expect(() => a.getDescendants()).toThrow(/circular/i);
      expect(() => b.getDescendants()).toThrow(/circular/i);
    });
  });

  describe('Self-generalization (A specializes A)', () => {
    it('the generalization builder should reject a self-generalization', () => {
      const a = proj.classBuilder().kind().name('A').build();

      expect(() => a.addParent(a)).toThrow(/cannot specialize itself/i);
    });

    it('getAncestors() and getDescendants() should throw on a self-generalization created without the builder (e.g., in a corrupted model)', () => {
      const a = proj.classBuilder().kind().name('A').build();
      proj.add(new Generalization(proj, a, a));

      expect(() => a.getAncestors()).toThrow(/circular/i);
      expect(() => a.getDescendants()).toThrow(/circular/i);
    });
  });

  describe('Acyclic diamond (no false positives)', () => {
    it('getAncestors() and getDescendants() should not throw when a classifier is reachable through multiple paths', () => {
      const top = proj.classBuilder().category().name('Top').build();
      const left = proj.classBuilder().kind().name('Left').build();
      const right = proj.classBuilder().kind().name('Right').build();
      const bottom = proj.classBuilder().subkind().name('Bottom').build();

      left.addParent(top);
      right.addParent(top);
      bottom.addParent(left);
      bottom.addParent(right);

      expect(bottom.getAncestors()).toIncludeSameMembers([left, right, top]);
      expect(top.getDescendants()).toIncludeSameMembers([left, right, bottom]);
    });
  });
});
