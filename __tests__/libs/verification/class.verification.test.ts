import { ModelManager } from '@libs/model';
import { classVerification } from '@test-models/verification';
import { OntoUML2Verification } from '@libs/verification';
import {
  VerificationIssue,
  VerificationIssueCode,
} from '@libs/verification/issues';
import { IPackage, IClass } from '@types';

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

  it(`Checks code ${VerificationIssueCode.class_identity_provider_specialization}`, () => {
    const _package: IPackage = modelManager.getElementById('1BBqXI6GAqACnBVG');
    const agent = _package.contents.find(
      (_class: IClass) => _class.name === 'Agent',
    );
    const person = _package.contents.find(
      (_class: IClass) => _class.name === 'Person',
    );
    const organization = _package.contents.find(
      (_class: IClass) => _class.name === 'Organization',
    );

    const agentIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === agent.id &&
        issue.code ===
          VerificationIssueCode.class_identity_provider_specialization,
    );
    const otherIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        (issue.source.id === person.id ||
          issue.source.id === organization.id) &&
        issue.code ===
          VerificationIssueCode.class_identity_provider_specialization,
    );

    expect(agentIssue).toBeDefined();
    expect(otherIssue).toBeUndefined();
  });

  it(`Checks code ${VerificationIssueCode.class_missing_identity_provider}`, () => {
    const _package: IPackage = modelManager.getElementById('q96KXI6GAqACnBOC');
    const person = _package.contents.find(
      (_class: IClass) => _class.name === 'Person',
    );
    const student = _package.contents.find(
      (_class: IClass) => _class.name === 'Student',
    );
    const institution = _package.contents.find(
      (_class: IClass) => _class.name === 'Educational Institution',
    );

    const institutionIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === institution.id &&
        issue.code === VerificationIssueCode.class_missing_identity_provider,
    );
    const otherIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        (issue.source.id === person.id || issue.source.id === student.id) &&
        issue.code === VerificationIssueCode.class_missing_identity_provider,
    );

    expect(institutionIssue).toBeDefined();
    expect(otherIssue).toBeUndefined();
  });

  it(`Checks code ${VerificationIssueCode.class_multiple_identity_provider}`, () => {
    const _package: IPackage = modelManager.getElementById('KEDKXI6GAqACnBSo');
    const person = _package.contents.find(
      (_class: IClass) => _class.name === 'Person',
    );
    const student = _package.contents.find(
      (_class: IClass) => _class.name === 'Student',
    );
    const organization = _package.contents.find(
      (_class: IClass) => _class.name === 'Organization',
    );
    const customer = _package.contents.find(
      (_class: IClass) => _class.name === 'Customer',
    );

    const customerIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === customer.id &&
        issue.code === VerificationIssueCode.class_multiple_identity_provider,
    );
    const otherIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        (issue.source.id === person.id ||
          issue.source.id === organization.id ||
          issue.source.id === student.id) &&
        issue.code === VerificationIssueCode.class_multiple_identity_provider,
    );

    expect(customerIssue).toBeDefined();
    expect(otherIssue).toBeUndefined();
  });
});
