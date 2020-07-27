import { ModelManager } from '@libs/model';
import { classVerification } from '@test-models/verification';
import { OntoUML2Verification } from '@libs/verification';
import { VerificationIssue, VerificationIssueCode } from '@libs/verification/issues';
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
    const agent = _package.contents.find((_class: IClass) => _class.name === 'Agent');
    const person = _package.contents.find((_class: IClass) => _class.name === 'Person');
    const organization = _package.contents.find((_class: IClass) => _class.name === 'Organization');

    const agentIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === agent.id &&
        issue.code === VerificationIssueCode.class_identity_provider_specialization
    );
    const otherIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        (issue.source.id === person.id || issue.source.id === organization.id) &&
        issue.code === VerificationIssueCode.class_identity_provider_specialization
    );

    expect(agentIssue).toBeDefined();
    expect(otherIssue).toBeUndefined();
  });

  it(`Checks code ${VerificationIssueCode.class_missing_identity_provider}`, () => {
    const _package: IPackage = modelManager.getElementById('q96KXI6GAqACnBOC');
    const person = _package.contents.find((_class: IClass) => _class.name === 'Person');
    const student = _package.contents.find((_class: IClass) => _class.name === 'Student');
    const institution = _package.contents.find((_class: IClass) => _class.name === 'Educational Institution');

    const institutionIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === institution.id &&
        issue.code === VerificationIssueCode.class_missing_identity_provider
    );
    const otherIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        (issue.source.id === person.id || issue.source.id === student.id) &&
        issue.code === VerificationIssueCode.class_missing_identity_provider
    );

    expect(institutionIssue).toBeDefined();
    expect(otherIssue).toBeUndefined();
  });

  it(`Checks code ${VerificationIssueCode.class_multiple_identity_provider}`, () => {
    const _package: IPackage = modelManager.getElementById('KEDKXI6GAqACnBSo');
    const person = _package.contents.find((_class: IClass) => _class.name === 'Person');
    const student = _package.contents.find((_class: IClass) => _class.name === 'Student');
    const organization = _package.contents.find((_class: IClass) => _class.name === 'Organization');
    const customer = _package.contents.find((_class: IClass) => _class.name === 'Customer');

    const customerIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === customer.id &&
        issue.code === VerificationIssueCode.class_multiple_identity_provider
    );
    const otherIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        (issue.source.id === person.id ||
          issue.source.id === organization.id ||
          issue.source.id === student.id) &&
        issue.code === VerificationIssueCode.class_multiple_identity_provider
    );

    expect(customerIssue).toBeDefined();
    expect(otherIssue).toBeUndefined();
  });

  it(`Checks code ${VerificationIssueCode.class_incompatible_natures}`, () => {
    const weight = modelManager.getElementById('Swdj_46GAqACnA0m');
    const weightIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === weight.id && issue.code === VerificationIssueCode.class_incompatible_natures
    );
    expect(weightIssue).toBeUndefined();

    const difficulty = modelManager.getElementById('53jj_46GAqACnA00');
    const difficultyIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === difficulty.id && issue.code === VerificationIssueCode.class_incompatible_natures
    );
    expect(difficultyIssue).toBeDefined();

    const party = modelManager.getElementById('NeAT_46GAqACnA1Z');
    const partyIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === party.id && issue.code === VerificationIssueCode.class_incompatible_natures
    );
    expect(partyIssue).toBeUndefined();

    const president = modelManager.getElementById('HVwT_46GAqACnA1n');
    const presidentIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === president.id && issue.code === VerificationIssueCode.class_incompatible_natures
    );
    expect(presidentIssue).toBeDefined();

    const model = modelManager.getElementById('q.sT_46GAqACnA15');
    const modelIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === model.id && issue.code === VerificationIssueCode.class_incompatible_natures
    );
    expect(modelIssue).toBeUndefined();

    const species = modelManager.getElementById('7VKT_46GAqACnA2V');
    const speciesIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === species.id && issue.code === VerificationIssueCode.class_incompatible_natures
    );
    expect(speciesIssue).toBeDefined();
  });

  it(`Checks code ${VerificationIssueCode.class_missing_allowed_natures}`, () => {
    const person = modelManager.getElementById('ncWiXI6GAqACnBFg');
    const organization = modelManager.getElementById('kJRiXI6GAqACnBF2');
    const legalEntity = modelManager.getElementById('22mF_46GAqACnAuj');

    const personIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === person.id && issue.code === VerificationIssueCode.class_missing_allowed_natures
    );
    const organizationIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === organization.id &&
        issue.code === VerificationIssueCode.class_missing_allowed_natures
    );
    const legalEntityIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === legalEntity.id &&
        issue.code === VerificationIssueCode.class_missing_allowed_natures
    );

    expect(organizationIssue).toBeDefined();
    expect(legalEntityIssue).toBeDefined();
    expect(personIssue).toBeUndefined();
  });

  it(`Checks code ${VerificationIssueCode.class_missing_is_extensional}`, () => {
    const deck = modelManager.getElementById('cboSXI6GAqACnBHk');
    const forest = modelManager.getElementById('dtISXI6GAqACnBHY');

    const forestIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === forest.id && issue.code === VerificationIssueCode.class_missing_is_extensional
    );
    const deckIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === deck.id && issue.code === VerificationIssueCode.class_missing_is_extensional
    );

    expect(deckIssue).toBeDefined();
    expect(forestIssue).toBeUndefined();
  });

  it(`Checks code ${VerificationIssueCode.class_missing_order}`, () => {
    const animalSpecies = modelManager.getElementById('5ELyXI6GAqACnBME');
    const treeSpecies = modelManager.getElementById('ECHyXI6GAqACnBMQ');

    const animalSpeciesIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === animalSpecies.id && issue.code === VerificationIssueCode.class_missing_order
    );
    const treeSpeciesIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === treeSpecies.id && issue.code === VerificationIssueCode.class_missing_order
    );

    expect(treeSpeciesIssue).toBeDefined();
    expect(animalSpeciesIssue).toBeUndefined();
  });
});
