import { modelExample1 } from 'ontouml-example-models';
import OntoUMLModel from '@libs/ontouml_model';

describe('OntoUML Model', () => {
  it('Should validate the model', async () => {
    const model = new OntoUMLModel(modelExample1);

    expect(model.isValid()).toBe(true);
  });
});
