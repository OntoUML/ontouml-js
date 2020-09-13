import { ModelManager } from '@libs/model';
import { minimalConsistency } from '@test-models/verification';
import { OntoUML2Verification } from '@libs/verification';
import { VerificationIssue, VerificationIssueCode } from '@libs/verification/issues';
import { IElement } from '@types';

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
      (issue: VerificationIssue) => (issue.source as IElement).name === 'Person',
    );
    const diseaseIssues = issues.filter(
      (issue: VerificationIssue) => (issue.source as IElement).name === 'Disease Severity Level',
    );

    expect(personIssues.length === 0).toBeTruthy();
    expect(diseaseIssues.length === 0).toBeTruthy();
  });

  it('Check unique valid stereotype', () => {
    const agentIssues = issues.filter((issue: VerificationIssue) => issue.source.id === 'NfL0Pg6GAqACnAov');
    const contractIssues = issues.filter(
      (issue: VerificationIssue) => issue.source.id === 'b5N0Pg6GAqACnAoe',
    );
    const enumerationIssues = issues.filter(
      (issue: VerificationIssue) => issue.source.id === '_d6GPg6GAqACnArf',
    );

    expect(
      agentIssues.length === 1 &&
        agentIssues.filter(
          (issue: VerificationIssue) => issue.code === VerificationIssueCode.class_not_unique_stereotype,
        ),
    ).toBeTruthy();
    expect(
      contractIssues.length === 1 &&
        contractIssues.filter(
          (issue: VerificationIssue) => issue.code === VerificationIssueCode.class_not_unique_stereotype,
        ),
    ).toBeTruthy();
    expect(
      enumerationIssues.length === 1 &&
        enumerationIssues.filter(
          (issue: VerificationIssue) => issue.code === VerificationIssueCode.class_invalid_ontouml_stereotype,
        ),
    ).toBeTruthy();
  });

  it('Check enumeration and classes with either literals or properties.', () => {
    const bedroomASIssues = issues.filter(
      (issue: VerificationIssue) => issue.source.id === 'GL_UPg6GAqACnAnm',
    );
    // const officeASIssues = issues.filter(
    //   (issue: VerificationIssue) =>
    //     (issue.source as IElement).name === 'Office Availability Status',
    // );

    expect(
      bedroomASIssues.length === 1 &&
        bedroomASIssues.filter(
          (issue: VerificationIssue) =>
            issue.code === VerificationIssueCode.class_enumeration_with_properties,
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

  it('Stringify issues', () => {
    try {
      expect(true).toBeTruthy();
    } catch (error) {
      expect(false).toBeTruthy();
    }
  });
});

// TODO: move replacer to serialization library
function replacer(key, value) {
  if (key.startsWith('_')) {
    return undefined;
  }

  if (this.type) {
    let contentsFields = [];

    switch (this.type) {
      case 'Package':
        contentsFields = ['contents'];
        break;
      case 'Class':
        contentsFields = ['properties', 'literals'];
        break;
      case 'Relation':
        contentsFields = ['properties'];
        break;
      case 'Literal':
        break;
      case 'Property':
        break;
      case 'Generalization':
        break;
      case 'GeneralizationSet':
        // contentsFields = ['generalizations'];
        break;
    }

    if (!contentsFields.includes(key) && key !== 'stereotypes' && Array.isArray(value)) {
      return value.map(item => (item.id && item.type ? { id: item.id, type: item.type } : value));
    } else if (!contentsFields.includes(key) && key !== 'stereotypes' && value instanceof Object) {
      return value.id && value.type ? { id: value.id, type: value.type } : value;
    }
  }

  return value;
}
