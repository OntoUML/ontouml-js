import { ModelManager } from '@libs/model';
import { minimalConsistency } from '@test-models/verification';
import { OntoUML2Verification } from '@libs/verification';
import {
  VerificationIssue,
  VerificationIssueCode,
} from '@libs/verification/issues';

describe('Model deserializing', () => {
  const inputModel = minimalConsistency;
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

  it('Checks classes with not issues', () => {
    const personIssues = issues.filter(
      (issue: VerificationIssue) => issue.source.name === 'Person',
    );
    const diseaseIssues = issues.filter(
      (issue: VerificationIssue) =>
        issue.source.name === 'Disease Severity Level',
    );

    expect(personIssues.length === 0).toBeTruthy();
    expect(diseaseIssues.length === 0).toBeTruthy();
  });

  it('Check unique valid stereotype', () => {
    const agentIssues = issues.filter(
      (issue: VerificationIssue) => issue.source.name === 'Agent',
    );
    const contractIssues = issues.filter(
      (issue: VerificationIssue) => issue.source.name === 'Contract',
    );
    const enumerationIssues = issues.filter(
      (issue: VerificationIssue) => issue.source.name === 'Enumeration',
    );

    expect(
      agentIssues.length === 1 &&
        agentIssues.filter(
          (issue: VerificationIssue) =>
            issue.code === VerificationIssueCode.CLASS_NOT_UNIQUE_STEREOTYPE,
        ),
    ).toBeTruthy();
    expect(
      contractIssues.length === 1 &&
        contractIssues.filter(
          (issue: VerificationIssue) =>
            issue.code === VerificationIssueCode.CLASS_NOT_UNIQUE_STEREOTYPE,
        ),
    ).toBeTruthy();
    expect(
      enumerationIssues.length === 1 &&
        enumerationIssues.filter(
          (issue: VerificationIssue) =>
            issue.code ===
            VerificationIssueCode.CLASS_INVALID_ONTOUML_STEREOTYPE,
        ),
    ).toBeTruthy();
  });

  it('Check enumeration and classes with either literals or properties.', () => {
    const bedroomASIssues = issues.filter(
      (issue: VerificationIssue) =>
        issue.source.name === 'Bedroom Availability Status',
    );
    // const officeASIssues = issues.filter(
    //   (issue: VerificationIssue) =>
    //     issue.source.name === 'Office Availability Status',
    // );

    expect(
      bedroomASIssues.length === 1 &&
        bedroomASIssues.filter(
          (issue: VerificationIssue) =>
            issue.code ===
            VerificationIssueCode.CLASS_ENUMERATION_WITH_PROPERTIES,
        ),
    ).toBeTruthy();

    // TODO: remove comment when serializing literals
    // expect(
    //   officeASIssues.length === 1 &&
    //     officeASIssues.filter(
    //       (issue: VerificationIssue) =>
    //         issue.code ===
    //         VerificationIssueCode.CLASS_NON_ENUMERATION_WITH_LITERALS,
    //     ),
    // ).toBeTruthy();
  });

  it('Check class with plural name warning.', () => {
    const peopleIssues = issues.filter(
      (issue: VerificationIssue) => issue.source.name === 'People',
    );

    expect(
      peopleIssues.length === 1 &&
        peopleIssues.filter(
          (issue: VerificationIssue) =>
            issue.code === VerificationIssueCode.CLASS_PLURAL_NAME,
        ),
    ).toBeTruthy();
  });
});
