import { Class, Literal, Project } from '../../src';
import { LiteralBuilder } from '../../src/builder/model/literal_builder';

describe(`${LiteralBuilder.name} Tests`, () => {
  let proj: Project;
  let enumeration: Class;
  let literal: Literal;

  beforeEach(() => {
    proj = new Project();
    enumeration = proj.classBuilder().enumeration().build();
    literal = enumeration.literalBuilder().build();
  });

  describe(`Test defaults`, () => {
    it("Literal should be added to the class' literal field", () => {
      expect(enumeration.literals).toContain(literal);
    });

    it('Literal should have the class as its container', () => {
      expect(literal.container).toBe(enumeration);
    });

    it('Literal should have the same project as its container', () => {
      expect(literal.project).toBe(enumeration.project);
    });
  });
});
