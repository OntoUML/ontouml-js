import { Project } from '../../src';

describe('Test toJSON()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const knows = model.createMaterialRelation(person, person);

  it('Test serialization', () =>
    expect(() => JSON.stringify(knows)).not.toThrow());
});
