import { ModelManager } from '@libs/model';
import { alpinebits } from '@test-models/valids';
import { OntoUML2Verification } from '@libs/verification';
import { VerificationIssue } from '@libs/verification/issues';
import { Ontouml2Gufo } from '@libs/ontouml2gufo';

describe('Model deserializing', () => {
  const inputModel = alpinebits;
  let modelManager: ModelManager;

  it('Check input model against OntoUML Schema', () => {
    modelManager = new ModelManager(inputModel);
  });

  let verification: OntoUML2Verification;
  let issues: VerificationIssue[];

  it('Run verification', async () => {
    verification = new OntoUML2Verification(modelManager);
    issues = await verification.run();

    let service = new Ontouml2Gufo(modelManager);
  });
});
