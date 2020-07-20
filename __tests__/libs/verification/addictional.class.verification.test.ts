import { ModelManager } from '@libs/model';
import { additionalClassVerification } from '@test-models/verification';
import { OntoUML2Verification } from '@libs/verification';
import {
  VerificationIssue,
  VerificationIssueCode,
} from '@libs/verification/issues';
import { IPackage, IClass, IElement } from '@types';

describe('Model deserializing', () => {
  const inputModel = additionalClassVerification;
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

  it(`Checks code ${VerificationIssueCode.class_missing_nature_restrictions}`, () => {
    const pkg = modelManager.getElementById('Pwi8Ns6GAqACHQ0l') as IPackage;
    const nativeAmerican = pkg.contents.find(
      (element: IElement) => element.name === 'Native American',
    ) as IClass;
    const child = pkg.contents.find(
      (element: IElement) => element.name === 'Child',
    ) as IClass;
    const student = pkg.contents.find(
      (element: IElement) => element.name === 'Student',
    ) as IClass;
    const formerPresident = pkg.contents.find(
      (element: IElement) => element.name === 'Former President',
    ) as IClass;

    const nativeAmericanIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === nativeAmerican.id &&
        issue.code === VerificationIssueCode.class_missing_nature_restrictions,
    );
    const childIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === child.id &&
        issue.code === VerificationIssueCode.class_missing_nature_restrictions,
    );
    const studentIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === student.id &&
        issue.code === VerificationIssueCode.class_missing_nature_restrictions,
    );
    const formerPresidentIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === formerPresident.id &&
        issue.code === VerificationIssueCode.class_missing_nature_restrictions,
    );

    expect(nativeAmerican).toBeDefined();
    expect(child).toBeDefined();
    expect(student).toBeDefined();
    expect(formerPresident).toBeDefined();

    expect(nativeAmericanIssue).toBeDefined();
    expect(childIssue).toBeDefined();
    expect(studentIssue).toBeDefined();
    expect(formerPresidentIssue).toBeDefined();

    const agent = pkg.contents.find(
      (element: IElement) => element.name === 'Agent',
    ) as IClass;
    const activeOrganization = pkg.contents.find(
      (element: IElement) => element.name === 'Active Organization',
    ) as IClass;
    const customer = pkg.contents.find(
      (element: IElement) => element.name === 'Customer',
    ) as IClass;
    const extinctOrganization = pkg.contents.find(
      (element: IElement) => element.name === 'Extinct Organization',
    ) as IClass;
    const socialAgent = pkg.contents.find(
      (element: IElement) => element.name === 'Social Agent',
    ) as IClass;

    const agentIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === agent.id &&
        issue.code === VerificationIssueCode.class_missing_nature_restrictions,
    );
    const activeOrganizationIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === activeOrganization.id &&
        issue.code === VerificationIssueCode.class_missing_nature_restrictions,
    );
    const customerIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === customer.id &&
        issue.code === VerificationIssueCode.class_missing_nature_restrictions,
    );
    const extinctOrganizationIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === extinctOrganization.id &&
        issue.code === VerificationIssueCode.class_missing_nature_restrictions,
    );
    const socialAgentIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === socialAgent.id &&
        issue.code === VerificationIssueCode.class_missing_nature_restrictions,
    );

    expect(agent).toBeDefined();
    expect(activeOrganization).toBeDefined();
    expect(customer).toBeDefined();
    expect(extinctOrganization).toBeDefined();
    expect(socialAgent).toBeDefined();

    expect(agentIssue).toBeDefined();
    expect(activeOrganizationIssue).toBeDefined();
    expect(customerIssue).toBeDefined();
    expect(extinctOrganizationIssue).toBeDefined();
    expect(socialAgentIssue).toBeDefined();

    // console.log(formerPresidentIssue);
    // console.log(agentIssue);
  });

  it(`Checks code ${VerificationIssueCode.class_missing_nature_restrictions}`, () => {
    const pkg = modelManager.getElementById('mflots6GAqACHQia') as IPackage;

    const productModel = pkg.contents.find(
      (element: IElement) => element.name === 'Product Model',
    ) as IClass;
    const carModel = pkg.contents.find(
      (element: IElement) => element.name === 'Car Model',
    ) as IClass;
    const sportCarModel = pkg.contents.find(
      (element: IElement) => element.name === 'Sport Car Model',
    ) as IClass;
    const discontinuedModel = pkg.contents.find(
      (element: IElement) => element.name === 'Discontinued Model',
    ) as IClass;
    const highDemandModel = pkg.contents.find(
      (element: IElement) => element.name === 'High-Demand Model',
    ) as IClass;
    const bestProduct = pkg.contents.find(
      (element: IElement) =>
        element.name === 'Best Product Model of the Year Winner',
    ) as IClass;

    const productModelIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === productModel.id &&
        // issue.code === VerificationIssueCode.class_missing_identity_provider ||
        issue.code === VerificationIssueCode.class_incompatible_natures,
    );
    const carModelIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === carModel.id &&
        // issue.code === VerificationIssueCode.class_missing_identity_provider ||
        issue.code === VerificationIssueCode.class_incompatible_natures,
    );
    const sportCarModelIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === sportCarModel.id &&
        // issue.code === VerificationIssueCode.class_missing_identity_provider ||
        issue.code === VerificationIssueCode.class_incompatible_natures,
    );
    const discontinuedModelIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === discontinuedModel.id &&
        // issue.code === VerificationIssueCode.class_missing_identity_provider ||
        issue.code === VerificationIssueCode.class_incompatible_natures,
    );
    const highDemandModelIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === highDemandModel.id &&
        // issue.code === VerificationIssueCode.class_missing_identity_provider ||
        issue.code === VerificationIssueCode.class_incompatible_natures,
    );
    const bestProductIssue: VerificationIssue = issues.find(
      (issue: VerificationIssue) =>
        issue.source.id === bestProduct.id &&
        // issue.code === VerificationIssueCode.class_missing_identity_provider ||
        issue.code === VerificationIssueCode.class_incompatible_natures,
    );

    expect(productModel).toBeDefined();
    expect(carModel).toBeDefined();
    expect(sportCarModel).toBeDefined();
    expect(discontinuedModel).toBeDefined();
    expect(highDemandModel).toBeDefined();
    expect(bestProduct).toBeDefined();

    expect(productModelIssue).toBeUndefined();
    expect(carModelIssue).toBeUndefined();
    expect(discontinuedModelIssue).toBeUndefined();
    expect(highDemandModelIssue).toBeUndefined();
    expect(bestProductIssue).toBeUndefined();

    expect(sportCarModelIssue).toBeDefined();

    console.log(sportCarModelIssue);
  });
});
