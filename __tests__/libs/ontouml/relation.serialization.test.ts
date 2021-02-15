import { Project, serializationUtils } from '@libs/ontouml';

describe('Test toJSON()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const knows = model.createMaterialRelation(person, person);

  it('Test serialization', () => expect(() => JSON.stringify(knows)).not.toThrow());
  it('Test serialization validation', () => expect(serializationUtils.validate(knows.project)).toBeTruthy());
});
