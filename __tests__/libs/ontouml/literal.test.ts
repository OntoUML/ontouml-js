import { Literal, Project, serializationUtils } from '@libs/ontouml';

describe(`${Literal.name} Tests`, () => {
  describe(`Test ${Literal.prototype.setContainer.name}()`, () => {
    const model = new Project().createModel();
    const gameStatus = model.createEnumeration();
    const started = gameStatus.createLiteral();
    gameStatus.createLiteral();
    gameStatus.createLiteral();

    it('Test serialization', () => expect(() => JSON.stringify(started)).not.toThrow());
    it('Test serialization validation', () => expect(serializationUtils.validate(started.project)).toBeTruthy());
  });

  describe(`Test ${Literal.prototype.clone.name}()`, () => {
    // TODO: implement test
  });

  describe(`Test ${Literal.prototype.replace.name}()`, () => {
    // TODO: implement test
  });
});
