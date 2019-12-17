// import { modelInvalidExample1 } from 'ontouml-example-models';
// TODO Replace local dependencies on example models for dependencies to 'ontouml-example-models' project
import { modelInvalidExample1 } from '@test-models/invalids';
import OntoUMLModel from '@libs/ontouml_model';

describe('OntoUML Model', () => {
  it('Should validate the model', async () => {
    const model = new OntoUMLModel(modelInvalidExample1);

    expect(model.isValid()).toBe(true);
  });
});
