import { annotations as annotationsModel } from '@test-models/valids';
import { transformOntoUML2GUFO } from './helpers';

describe('Docs', () => {
  let docs;

  beforeAll(async () => {
    docs = (await transformOntoUML2GUFO(annotationsModel, {
      createDocumentation: true,
      format: 'Turtle',
    })).documentation;
  });

  it('should generate documentation', async () => {
    expect(docs).not.toBe('');
    expect(docs).not.toBeNull();
  });
});
