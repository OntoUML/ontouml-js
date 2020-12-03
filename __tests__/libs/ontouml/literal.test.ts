import { Literal, Project, serializationUtils } from '@libs/ontouml';

describe(`${Literal.name} Tests`, () => {
  describe(`Test ${Literal.prototype.toJSON.name}()`, () => {
    const model = new Project().createModel();
    const gameStatus = model.createEnumeration();
    const started = gameStatus.createLiteral();
    gameStatus.createLiteral();
    gameStatus.createLiteral();

    it('Test serialization', () => expect(() => JSON.stringify(started)).not.toThrow());
    it('Test serialization validation', () => expect(serializationUtils.validate(started.project)).toBeTruthy());
  });

  describe(`Test ${Literal.prototype.setContainer.name}()`, () => {
    const model = new Project().createModel();
    const _enum = model.createClass();
    const lit = new Literal({ project: model.project });

    it('Test function call', () => {
      expect(lit.container).not.toBe(_enum);
      expect(_enum.literals).toBeNull();

      lit.setContainer(_enum);

      expect(lit.container).toBe(_enum);
      expect(lit.project).toBe(_enum.project);
      expect(_enum.literals).toContain(lit);
    });
  });

  describe(`Test ${Literal.prototype.clone.name}()`, () => {
    // TODO: implement test
  });

  describe(`Test ${Literal.prototype.replace.name}()`, () => {
    // TODO: implement test
  });
});
