import { ModelManager } from '@libs/model';
import { classVerification } from '@test-models/verification';
import { OntoUML2Verification } from '@libs/verification';
import { VerificationIssue, VerificationIssueCode } from '@libs/verification/issues';
import { IGeneralization } from '@types';

describe('Model deserializing', () => {
  const inputModel = classVerification;
  let modelManager: ModelManager;

  it('Check input model against OntoUML Schema', () => {
    modelManager = new ModelManager(inputModel);
  });

  let verification: OntoUML2Verification;
  let issues: VerificationIssue[];

  it('Run verification', async () => {
    verification = new OntoUML2Verification(modelManager);
    issues = await verification.run();
  });

  it(`Checks code ${VerificationIssueCode.generalization_incompatible_class_sortality}`, () => {
    const compatible: IGeneralization = modelManager.getElementById('_bfavI6GAqACnBo2');
    const incompatible: IGeneralization = modelManager.getElementById('u3_avI6GAqACnBpB');

    const incompatibleIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === incompatible.id && issue.code === VerificationIssueCode.generalization_incompatible_class_sortality
    );
    const otherIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === compatible.id && issue.code === VerificationIssueCode.generalization_incompatible_class_sortality
    );

    expect(incompatibleIssue).toBeDefined();
    expect(otherIssue).toBeUndefined();
  });

  it(`Checks code ${VerificationIssueCode.generalization_incompatible_class_rigidity}`, () => {
    const compatible: IGeneralization = modelManager.getElementById('KVGavI6GAqACnBms');
    const incompatible1: IGeneralization = modelManager.getElementById('V_WavI6GAqACnBnC');
    const incompatible2: IGeneralization = modelManager.getElementById('WLmavI6GAqACnBm3');

    const incompatibleIssue1: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === incompatible1.id && issue.code === VerificationIssueCode.generalization_incompatible_class_rigidity
    );
    const incompatibleIssue2: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === incompatible2.id && issue.code === VerificationIssueCode.generalization_incompatible_class_rigidity
    );
    const otherIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === compatible.id && issue.code === VerificationIssueCode.generalization_incompatible_class_rigidity
    );

    expect(incompatibleIssue1).toBeDefined();
    expect(incompatibleIssue2).toBeDefined();
    expect(otherIssue).toBeUndefined();
  });

  it(`Checks code ${VerificationIssueCode.generalization_incompatible_natures}`, () => {
    const compatible: IGeneralization = modelManager.getElementById('yWJivI6GAqACnBjE');
    const incompatible: IGeneralization = modelManager.getElementById('PWpivI6GAqACnBjT');

    const incompatibleIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === incompatible.id && issue.code === VerificationIssueCode.generalization_incompatible_natures
    );
    const otherIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === compatible.id && issue.code === VerificationIssueCode.generalization_incompatible_natures
    );

    expect(incompatibleIssue).toBeDefined();
    expect(otherIssue).toBeUndefined();
  });
});
