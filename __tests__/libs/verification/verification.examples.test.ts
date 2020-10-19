import { ModelManager } from '@libs/model';
import { OntoUML2Verification } from '@libs/verification';
import { VerificationIssue } from '@libs/verification/issues';
import Ontouml2Gufo from '@libs/ontouml2gufo';

describe('Model deserializing', () => {
  const inputModel = require('./test_resources/alpinebits.json');
  let modelManager: ModelManager = new ModelManager(inputModel);

  let verification: OntoUML2Verification;
  let issues: VerificationIssue[];

  it('Run verification', async () => {
    verification = new OntoUML2Verification(modelManager);
    issues = await verification.run();

    expect(issues.length).toBe(0);
  });
});
