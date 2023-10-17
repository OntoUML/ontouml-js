import { Project } from '../../src';

describe('Test toJSON()', () => {
  const proj = new Project();
  const person = proj.classBuilder().build();
  const knows = proj
    .binaryRelationBuilder()
    .material()
    .name('knows')
    .source(person)
    .target(person);

  it('Test serialization', () =>
    expect(() => JSON.stringify(knows)).not.toThrow());
});
