import { Literal, Project } from '../../src';

describe(`${Literal.name} Tests`, () => {
  describe(`Test ${Literal.prototype.toJSON.name}()`, () => {
    const model = new Project().createModel();
    const gameStatus = model.createEnumeration();
    const started = gameStatus.createLiteral();
    gameStatus.createLiteral();
    gameStatus.createLiteral();

    it('Test serialization', () =>
      expect(() => JSON.stringify(started)).not.toThrow());
  });

  describe(`Test ${Literal.prototype.setContainer.name}()`, () => {
    const model = new Project().createModel();
    const _enum = proj.classBuilder().build();
    const lit = new Literal({ project: model.project });

    it('Test function call', () => {
      expect(lit.container).not.toBe(_enum);
      expect(_enum.literals).toHaveLength(0);

      _enum.addLiteral(lit);

      expect(lit.container).toBe(_enum);
      expect(lit.project).toBe(_enum.project);
      expect(_enum.literals).toContain(lit);
    });
  });

  describe(`Test ${Literal.prototype.clone.name}()`, () => {
    const model = new Project().createModel();
    const classA = model.createEnumeration();
    const litA = classA.createLiteral();
    const litB = litA.clone();

    const litC = new Literal();
    const litD = litC.clone();

    it('Test method', () => expect(litA).toEqual(litB));
    it('Test method', () => expect(litC).toEqual(litD));
  });
});
