import { Project } from '../../src';

describe('Test toJSON()', () => {
  const model = new Project().createModel();
  const person = proj.classBuilder().build();
  const knows = model.createMaterialRelation(person, person);

  it('Test serialization', () =>
    expect(() => JSON.stringify(knows)).not.toThrow());
});
