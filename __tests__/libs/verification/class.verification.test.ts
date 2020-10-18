import { ModelManager } from '@libs/model';
import { OntoUML2Verification } from '@libs/verification';
import { VerificationIssue, VerificationIssueCode } from '@libs/verification/issues';
import { IPackage, IClass, IElement } from '@types';

function findElement(info: { name?: string; id?: string }, elements: IElement[]): IElement {
  return elements.find((element: IElement) => (info.id ? info.id === element.id : info.name === element.name));
}

function findIssue(source: IElement, code: string, issues: VerificationIssue[]): VerificationIssue {
  return issues.find((issue: VerificationIssue) => issue.source.id === source.id && issue.code === code);
}

describe('Class constraints verification', () => {
  let inputModel = require('./test_resources/models_for_class_verification.json');
  let modelManager: ModelManager;
  modelManager = new ModelManager(inputModel);

  let verification: OntoUML2Verification;
  let issues: VerificationIssue[];

  it('Run verification', async () => {
    verification = new OntoUML2Verification(modelManager);
    issues = await verification.run();
  });

  it(`Verification Code: ${VerificationIssueCode.class_not_unique_stereotype}`, () => {
    const _package: IPackage = findElement(
      { name: VerificationIssueCode.class_not_unique_stereotype },
      modelManager.getElements()
    ) as IPackage;

    const agent = findElement({ name: 'Agent' }, _package.contents);
    const person = findElement({ name: 'Person' }, _package.contents);
    const contract = findElement({ name: 'Contract' }, _package.contents);

    const agentIssue = findIssue(agent, VerificationIssueCode.class_not_unique_stereotype, issues);
    const personIssue = findIssue(person, VerificationIssueCode.class_not_unique_stereotype, issues);
    const contractIssue = findIssue(contract, VerificationIssueCode.class_not_unique_stereotype, issues);

    expect(agentIssue).toBeDefined();
    expect(personIssue).toBeDefined();
    expect(contractIssue).toBeUndefined();
  });

  it(`Verification Code: ${VerificationIssueCode.class_invalid_ontouml_stereotype}`, () => {
    const _package: IPackage = findElement(
      { name: VerificationIssueCode.class_invalid_ontouml_stereotype },
      modelManager.getElements()
    ) as IPackage;

    const species = findElement({ name: 'Species' }, _package.contents);
    const api = findElement({ name: 'API' }, _package.contents);

    const relatedIssues = issues.filter(
      (issue: VerificationIssue) =>
        issue.code === VerificationIssueCode.class_invalid_ontouml_stereotype &&
        _package.contents.some((content: IElement) => content.id === issue.source.id)
    );

    const speciesIssue = findIssue(species, VerificationIssueCode.class_invalid_ontouml_stereotype, issues);
    const apiIssue = findIssue(api, VerificationIssueCode.class_invalid_ontouml_stereotype, issues);

    expect(relatedIssues.length).toBe(2);
    expect(relatedIssues.includes(speciesIssue)).toBeTruthy();
    expect(relatedIssues.includes(apiIssue)).toBeTruthy();
  });

  it(`Verification Code: ${VerificationIssueCode.class_non_enumeration_with_literals}`, () => {
    const _package: IPackage = findElement(
      { name: VerificationIssueCode.class_non_enumeration_with_literals },
      modelManager.getElements()
    ) as IPackage;

    // const massInKG = findElement({ name: 'Mass in KG' }, _package.contents);
    const deliveryStatus = findElement({ name: 'Delivery Status' }, _package.contents);

    // const massInKGIssue = findIssue(massInKG, VerificationIssueCode.class_non_enumeration_with_literals, issues);
    const deliveryStatusIssue = findIssue(deliveryStatus, VerificationIssueCode.class_non_enumeration_with_literals, issues);

    // Cannot test for non-datatypes with literals
    // Visual Paradigm's serialization does not serialize literals in classes
    // expect(massInKGIssue).toBeDefined();
    expect(deliveryStatusIssue).toBeUndefined();
  });

  it(`Verification Code: ${VerificationIssueCode.class_enumeration_with_properties}`, () => {
    const _package: IPackage = findElement(
      { name: VerificationIssueCode.class_enumeration_with_properties },
      modelManager.getElements()
    ) as IPackage;

    const massInKG = findElement({ name: 'Mass in KG' }, _package.contents);
    const deliveryStatus = findElement({ name: 'Delivery Status' }, _package.contents);

    const massInKGIssue = findIssue(massInKG, VerificationIssueCode.class_enumeration_with_properties, issues);
    const deliveryStatusIssue = findIssue(deliveryStatus, VerificationIssueCode.class_enumeration_with_properties, issues);

    expect(deliveryStatusIssue).toBeDefined();
    expect(massInKGIssue).toBeUndefined();
  });

  it(`Verification Code: ${VerificationIssueCode.class_identity_provider_specialization}`, () => {
    const _package: IPackage = findElement(
      { name: VerificationIssueCode.class_identity_provider_specialization },
      modelManager.getElements()
    ) as IPackage;

    const vocalPerformer = findElement({ name: 'Vocal Performer' }, _package.contents);
    const liquidGold = findElement({ name: 'Liquid Gold' }, _package.contents);
    const rentalContract = findElement({ name: 'Rental Contract' }, _package.contents);
    const priorityGoal = findElement({ name: 'Priority Goal' }, _package.contents);
    const mainColor = findElement({ name: 'Main Color' }, _package.contents);

    const relatedIssues = issues.filter(
      (issue: VerificationIssue) =>
        issue.code === VerificationIssueCode.class_identity_provider_specialization &&
        _package.contents.some((content: IElement) => content.id === issue.source.id)
    );

    const vocalPerformerIssue = findIssue(vocalPerformer, VerificationIssueCode.class_identity_provider_specialization, issues);
    const liquidGoldIssue = findIssue(liquidGold, VerificationIssueCode.class_identity_provider_specialization, issues);
    const rentalContractIssue = findIssue(rentalContract, VerificationIssueCode.class_identity_provider_specialization, issues);
    const priorityGoalIssue = findIssue(priorityGoal, VerificationIssueCode.class_identity_provider_specialization, issues);
    const mainColorIssue = findIssue(mainColor, VerificationIssueCode.class_identity_provider_specialization, issues);

    expect(relatedIssues.length).toBe(5);
    expect(relatedIssues.includes(vocalPerformerIssue)).toBeTruthy();
    expect(relatedIssues.includes(liquidGoldIssue)).toBeTruthy();
    expect(relatedIssues.includes(rentalContractIssue)).toBeTruthy();
    expect(relatedIssues.includes(priorityGoalIssue)).toBeTruthy();
    expect(relatedIssues.includes(mainColorIssue)).toBeTruthy();
  });

  it(`Verification Code: ${VerificationIssueCode.class_multiple_identity_provider}`, () => {
    const _package: IPackage = findElement(
      { name: VerificationIssueCode.class_multiple_identity_provider },
      modelManager.getElements()
    ) as IPackage;

    const resolvedGoal = findElement({ name: 'Resolved Goal' }, _package.contents);
    const shortTermRent = findElement({ name: 'Short-Term Rent' }, _package.contents);

    const relatedIssues = issues.filter(
      (issue: VerificationIssue) =>
        issue.code === VerificationIssueCode.class_multiple_identity_provider &&
        _package.contents.some((content: IElement) => content.id === issue.source.id)
    );

    const resolvedGoalIssue = findIssue(resolvedGoal, VerificationIssueCode.class_multiple_identity_provider, issues);
    const shortTermRentIssue = findIssue(shortTermRent, VerificationIssueCode.class_multiple_identity_provider, issues);

    expect(relatedIssues.length).toBe(2);
    expect(relatedIssues.includes(resolvedGoalIssue)).toBeTruthy();
    expect(relatedIssues.includes(shortTermRentIssue)).toBeTruthy();
  });

  it(`Verification Code: ${VerificationIssueCode.class_missing_identity_provider}`, () => {
    const _package: IPackage = findElement(
      { name: VerificationIssueCode.class_missing_identity_provider },
      modelManager.getElements()
    ) as IPackage;

    const livingPerson = findElement({ name: 'Living Person' }, _package.contents);
    const child = findElement({ name: 'Child' }, _package.contents);
    const adult = findElement({ name: 'Adult' }, _package.contents);
    const riskyGoal = findElement({ name: 'Risky Goal' }, _package.contents);
    const formerlyScarceSubstance = findElement({ name: 'Formerly Scarce Substance' }, _package.contents);
    const law = findElement({ name: 'Law' }, _package.contents);

    const relatedIssues = issues.filter(
      (issue: VerificationIssue) =>
        issue.code === VerificationIssueCode.class_missing_identity_provider &&
        _package.contents.some((content: IElement) => content.id === issue.source.id)
    );

    const livingPersonIssue = findIssue(livingPerson, VerificationIssueCode.class_missing_identity_provider, issues);
    const childIssue = findIssue(child, VerificationIssueCode.class_missing_identity_provider, issues);
    const adultIssue = findIssue(adult, VerificationIssueCode.class_missing_identity_provider, issues);
    const riskyGoalIssue = findIssue(riskyGoal, VerificationIssueCode.class_missing_identity_provider, issues);
    const formerlyScarceSubstanceIssue = findIssue(
      formerlyScarceSubstance,
      VerificationIssueCode.class_missing_identity_provider,
      issues
    );
    const lawIssue = findIssue(law, VerificationIssueCode.class_missing_identity_provider, issues);

    expect(relatedIssues.length).toBe(6);
    expect(relatedIssues.includes(livingPersonIssue)).toBeTruthy();
    expect(relatedIssues.includes(childIssue)).toBeTruthy();
    expect(relatedIssues.includes(adultIssue)).toBeTruthy();
    expect(relatedIssues.includes(riskyGoalIssue)).toBeTruthy();
    expect(relatedIssues.includes(formerlyScarceSubstanceIssue)).toBeTruthy();
    expect(relatedIssues.includes(lawIssue)).toBeTruthy();
  });

  it(`Verification Code: ${VerificationIssueCode.class_incompatible_natures}`, () => {
    const _package: IPackage = findElement(
      { name: VerificationIssueCode.class_incompatible_natures },
      modelManager.getElements()
    ) as IPackage;

    const someEvent = findElement({ name: 'Some Event' }, _package.contents);
    const someSituation = findElement({ name: 'Some Situation' }, _package.contents);
    const someObject = findElement({ name: 'Some Object' }, _package.contents);
    const someRoleMixin = findElement({ name: 'Some Role Mixin' }, _package.contents);
    const someCategory = findElement({ name: 'Some Category' }, _package.contents);
    const someType = findElement({ name: 'Some Type' }, _package.contents);

    const relatedIssues = issues.filter(
      (issue: VerificationIssue) =>
        issue.code === VerificationIssueCode.class_incompatible_natures &&
        _package.contents.some((content: IElement) => content.id === issue.source.id)
    );

    const someEventIssue = findIssue(someEvent, VerificationIssueCode.class_incompatible_natures, issues);
    const someSituationIssue = findIssue(someSituation, VerificationIssueCode.class_incompatible_natures, issues);
    const someObjectIssue = findIssue(someObject, VerificationIssueCode.class_incompatible_natures, issues);
    const someRoleMixinIssue = findIssue(someRoleMixin, VerificationIssueCode.class_incompatible_natures, issues);
    const someCategoryIssue = findIssue(someCategory, VerificationIssueCode.class_incompatible_natures, issues);
    const someTypeIssue = findIssue(someType, VerificationIssueCode.class_incompatible_natures, issues);

    expect(relatedIssues.length).toBe(6);
    expect(relatedIssues.includes(someEventIssue)).toBeTruthy();
    expect(relatedIssues.includes(someSituationIssue)).toBeTruthy();
    expect(relatedIssues.includes(someObjectIssue)).toBeTruthy();
    expect(relatedIssues.includes(someRoleMixinIssue)).toBeTruthy();
    expect(relatedIssues.includes(someCategoryIssue)).toBeTruthy();
    expect(relatedIssues.includes(someTypeIssue)).toBeTruthy();
  });
});

describe('Class constraints verification - old set of tests', () => {
  let inputModel = require('./test_resources/old_verification_test_models.json');
  let modelManager: ModelManager;
  modelManager = new ModelManager(inputModel);

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
        issue.source.id === agent.id && issue.code === VerificationIssueCode.class_identity_provider_specialization
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
        issue.source.id === institution.id && issue.code === VerificationIssueCode.class_missing_identity_provider
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
        issue.source.id === customer.id && issue.code === VerificationIssueCode.class_multiple_identity_provider
    );
    const otherIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        (issue.source.id === person.id || issue.source.id === organization.id || issue.source.id === student.id) &&
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
        issue.source.id === organization.id && issue.code === VerificationIssueCode.class_missing_allowed_natures
    );
    const legalEntityIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === legalEntity.id && issue.code === VerificationIssueCode.class_missing_allowed_natures
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
      (issue: VerificationIssue) => issue.source.id === treeSpecies.id && issue.code === VerificationIssueCode.class_missing_order
    );

    expect(treeSpeciesIssue).toBeDefined();
    expect(animalSpeciesIssue).toBeUndefined();
  });
});
