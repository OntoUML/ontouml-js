import { ModelManager } from '@libs/model';
import { alpinebits } from '@test-models/valids';
import { OntoUML2Verification } from '@libs/verification';
import {
  VerificationIssue,
  VerificationIssueCode,
} from '@libs/verification/issues';
import { OntoUML2GUFO } from '@libs/ontuml2gufo';
import { IGeneralizationSet } from '@types';

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

    let service = new OntoUML2GUFO(modelManager);
    let output = await service.transformOntoUML2GUFO({
      baseIRI: 'http://api.ontouml.org',
      format: 'Turtle',
      uriFormatBy: 'name',
    });
  });
});
