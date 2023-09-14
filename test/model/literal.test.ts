import { Class, Literal, Project } from '../../src';

describe(`${Literal.name} Tests`, () => {
  let proj: Project;
  let gameStatus: Class;
  let scheduled: Literal, ongoing: Literal, completed: Literal;

  beforeEach(() => {
    proj = new Project();
    gameStatus = proj.classBuilder().enumeration().build();
    scheduled = gameStatus.literalBuilder().build();
    ongoing = gameStatus.literalBuilder().build();
    completed = gameStatus.literalBuilder().build();
  });

  describe(`Test ${Literal.prototype.toJSON.name}()`, () => {
    it('should serialize a literal without throwing an exception', () => {
      expect(() => JSON.stringify(scheduled)).not.toThrow();
    });
  });

  describe(`Use addLiteral to transfer a literal from another enumeration`, () => {
    let playerStatus: Class;

    beforeEach(() => {
      playerStatus = proj.classBuilder().enumeration().build();
      playerStatus.addLiteral(scheduled);
    });

    it('literal should be added to target enumeration', () => {
      expect(playerStatus.literals).toContain(scheduled);
    });

    it('literal should be removed from source enumeration', () => {
      expect(gameStatus.literals).not.toContain(scheduled);
    });
  });

  it(`Test ${Literal.prototype.clone.name}()`, () => {
    const cloned = gameStatus.clone();
    expect(cloned).toEqual(gameStatus);
  });
});
