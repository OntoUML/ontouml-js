import { ModelManager } from '@libs/model';
import { OntoUML2Verification } from '@libs/verification';
import { VerificationIssue } from '@libs/verification/issues';
import { OntoUML2GUFO } from '@libs/ontouml2gufo';

describe('Model deserializing', () => {
  const inputModel = require('./test_resources/alpinebits.json');
  let modelManager: ModelManager = new ModelManager(inputModel);

  let verification: OntoUML2Verification;
  let issues: VerificationIssue[];

  it('Run verification', async () => {
    verification = new OntoUML2Verification(modelManager);
    issues = await verification.run();
    let service = new OntoUML2GUFO(modelManager);

    expect(issues.length).toBe(0);
    expect(service).toBeDefined();
  });
});
