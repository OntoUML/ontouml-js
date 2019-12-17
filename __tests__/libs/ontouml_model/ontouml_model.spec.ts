import { modelInvalidExample1 } from '@test-models/invalids';
import OntoUMLModel from '@libs/ontouml_model';

describe('OntoUML Model', () => {
  it('Should validate the model', async () => {
    const model = new OntoUMLModel(modelInvalidExample1);

    expect(model.isValid()).toBe(true);
  });
});
