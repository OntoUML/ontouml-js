import {
  Project,
  Diagram,
  ClassView,
  RelationView,
  GeneralizationView,
  GeneralizationSetView,
  OntologicalNature
} from '@libs/ontouml';
import { Modularizer } from '@libs/complexity';

function expectToContainDiagram(diagrams: Diagram[], name: string): Diagram {
  const diagram = diagrams.find(d => d.getName() === name);
  expect(diagram).toBeTruthy();
  return diagram;
}

describe('Extended clusterization example', () => {
  const project = new Project();
  const model = project.createModel();

  const person = model.createKind('Person');
  const woman = model.createSubkind('Woman');
  const man = model.createSubkind('Man');
  const living = model.createPhase('Living');
  const deceased = model.createPhase('Deceased');
  const child = model.createPhase('Child');
  const teenager = model.createPhase('Teenager');
  const adult = model.createPhase('Adult');
  const husband = model.createRole('Husband');
  const wife = model.createRole('Wife');
  const marriage = model.createRelator('Marriage');
  const employee = model.createRole('Employee');
  const responsible = model.createRole('Responsible Employee');
  const employment = model.createRelator('Employment');
  const organization = model.createKind('Organization');
  const agency = model.createSubkind('Car Agency');
  const operator = model.createSubkind('Logistics Operator');
  const ownership = model.createCategory('Ownership');
  ownership.restrictedTo = [OntologicalNature.relator];
  const car = model.createKind('Car');
  const available = model.createPhase('Available Car');
  const underMaintenance = model.createPhase('Under Maintenance Car');
  const rentalCar = model.createRole('Rental Car');
  const rental = model.createRelator('Car Rental');
  const customer = model.createRoleMixin('Customer');
  const corporateCustomer = model.createRole('Corporate Customer');
  const personalCustomer = model.createRole('Personal Customer');
  const notary = model.createRole('Notary');
  const agreement = model.createCategory('Registered Agreement');
  agreement.restrictedTo = [OntologicalNature.relator];
  const contract = model.createKind('Contract');
  const insurance = model.createRelator('Rental Insurance');
  const insurer = model.createRole('Insurer');
  const carOwnership = model.createRelator('Car Ownership');

  woman.addChild(wife);
  man.addChild(husband);
  employee.addChild(responsible);
  available.addChild(rentalCar);
  organization.addChild(corporateCustomer);
  const personalCustomerIsAdult = adult.addChild(personalCustomer);
  const employeeIsAPerson = person.addChild(employee);
  const notaryIsAPerson = person.addChild(notary);
  const employmentIsAnAgreement = agreement.addChild(employment);

  model.createPartitionFromClasses(person, [woman, man]);
  model.createPartitionFromClasses(person, [living, deceased]);
  model.createPartitionFromClasses(living, [child, teenager, adult]);
  model.createPartitionFromClasses(car, [available, underMaintenance]);
  model.createPartitionFromClasses(customer, [personalCustomer, corporateCustomer]);
  model.createGeneralizationSetFromClasses(organization, [agency, insurer, operator], true, false);

  model.createMediationRelation(ownership, agency);
  model.createMediationRelation(ownership, car);
  model.createMediationRelation(marriage, wife);
  model.createMediationRelation(marriage, husband);
  const protects = model.createMediationRelation(insurance, rental);
  const providedBy = model.createMediationRelation(insurance, insurer);
  const requestedBy = model.createMediationRelation(rental, customer);
  const processedBy = model.createMediationRelation(rental, responsible);
  const includes = model.createMediationRelation(rental, rentalCar);
  const involvesEmployer = model.createMediationRelation(employment, organization);
  const involvesEmployee = model.createMediationRelation(employment, employee);
  const formalizedBy = model.createMediationRelation(agreement, contract);
  const confirmedBy = model.createMediationRelation(agreement, notary);

  let diagrams: Diagram[] = new Modularizer(project).buildAll();

  it('Should generate 7 diagrams', () => {
    expect(diagrams).toHaveLength(7);
  });

  it('Should contain the expected clusters', () => {
    expectToContainDiagram(diagrams, 'Cluster of Registered Agreement');
    expectToContainDiagram(diagrams, 'Cluster of Employment');
    expectToContainDiagram(diagrams, 'Cluster of Car Rental');
    expectToContainDiagram(diagrams, 'Cluster of Marriage');
    expectToContainDiagram(diagrams, 'Cluster of Car Ownership');
    expectToContainDiagram(diagrams, 'Cluster of Ownership');
    expectToContainDiagram(diagrams, 'Cluster of Rental Insurance');
  });

  describe('`Registered Agreement` cluster (Non sortal relator mediating sortal types)', () => {
    let diagram: Diagram;

    beforeAll(() => {
      diagram = diagrams.find(d => d.getName() === 'Cluster of Registered Agreement');
    });

    it('Should contain the expected classes', () => {
      expect(diagram.findView(agreement)).toBeTruthy();
      expect(diagram.findView(notary)).toBeTruthy();
      expect(diagram.findView(contract)).toBeTruthy();
      expect(diagram.findView(person)).toBeTruthy();
    });

    it('Should contain the relation lines', () => {
      expect(diagram.findView(confirmedBy)).toBeTruthy();
      expect(diagram.findView(formalizedBy)).toBeTruthy();
    });

    it('Should contain the expected generalizations lines', () => {
      expect(diagram.findView(notaryIsAPerson)).toBeTruthy();
    });

    it('Should contain 4 class views', () => {
      expect(diagram.getClassViews()).toHaveLength(4);
    });

    it('Should contain 2 relation views', () => {
      expect(diagram.getRelationViews()).toHaveLength(2);
    });

    it('Should contain 1 generalization view', () => {
      expect(diagram.getGeneralizationViews()).toHaveLength(1);
    });

    it('Should contain 0 generalizations set views', () => {
      expect(diagram.getGeneralizationSetViews()).toHaveLength(0);
    });
  });

  describe('`Employement` cluster (Sortal relator that specializes a non sortal) ', () => {
    let diagram: Diagram;

    beforeAll(() => {
      diagram = diagrams.find(d => d.getName() === 'Cluster of Employment');
    });

    it('Should contain the expected class shapes', () => {
      expect(diagram.findView(agreement)).toBeTruthy();
      expect(diagram.findView(notary)).toBeTruthy();
      expect(diagram.findView(contract)).toBeTruthy();
      expect(diagram.findView(person)).toBeTruthy();
      expect(diagram.findView(employment)).toBeTruthy();
      expect(diagram.findView(employee)).toBeTruthy();
      expect(diagram.findView(organization)).toBeTruthy();
    });

    it('Should contain the expected relation lines', () => {
      expect(diagram.findView(confirmedBy)).toBeTruthy();
      expect(diagram.findView(formalizedBy)).toBeTruthy();
      expect(diagram.findView(involvesEmployee)).toBeTruthy();
      expect(diagram.findView(involvesEmployer)).toBeTruthy();
    });

    it('Should contain the expected generalizations lines', () => {
      expect(diagram.findView(notaryIsAPerson)).toBeTruthy();
      expect(diagram.findView(employeeIsAPerson)).toBeTruthy();
      expect(diagram.findView(employmentIsAnAgreement)).toBeTruthy();
    });

    it('Should contain 7 class views', () => {
      expect(diagram.getClassViews()).toHaveLength(7);
    });

    it('Should contain 4 relation views', () => {
      expect(diagram.getRelationViews()).toHaveLength(4);
    });

    it('Should contain 3 generalization views', () => {
      expect(diagram.getGeneralizationViews()).toHaveLength(3);
    });

    it('Should contain 0 generalizations set views', () => {
      expect(diagram.getGeneralizationSetViews()).toHaveLength(0);
    });
  });

  describe('`Rental Insurance` cluster (Linked relators) ', () => {
    let diagram: Diagram;

    beforeAll(() => {
      diagram = diagrams.find(d => d.getName() === 'Cluster of Rental Insurance');
    });

    it('Should contain the expected class shapes', () => {
      expect(diagram.findView(insurance)).toBeTruthy();
      expect(diagram.findView(rental)).toBeTruthy();
      expect(diagram.findView(rentalCar)).toBeTruthy();
      expect(diagram.findView(available)).toBeTruthy();
      expect(diagram.findView(underMaintenance)).toBeTruthy();
      expect(diagram.findView(car)).toBeTruthy();
      expect(diagram.findView(insurer)).toBeTruthy();
      expect(diagram.findView(organization)).toBeTruthy();
      expect(diagram.findView(corporateCustomer)).toBeTruthy();
      expect(diagram.findView(customer)).toBeTruthy();
      expect(diagram.findView(personalCustomer)).toBeTruthy();
      expect(diagram.findView(adult)).toBeTruthy();
      expect(diagram.findView(teenager)).toBeTruthy();
      expect(diagram.findView(child)).toBeTruthy();
      expect(diagram.findView(living)).toBeTruthy();
      expect(diagram.findView(deceased)).toBeTruthy();
      expect(diagram.findView(person)).toBeTruthy();
      expect(diagram.findView(employee)).toBeTruthy();
      expect(diagram.findView(responsible)).toBeTruthy();
    });

    it('Should not contain unrelated classes shapes', () => {
      expect(diagram.findView(agency)).toBeFalsy();
      expect(diagram.findView(operator)).toBeFalsy();
    });

    it('Should contain the expected relation lines', () => {
      expect(diagram.findView(protects)).toBeTruthy();
      expect(diagram.findView(providedBy)).toBeTruthy();
      expect(diagram.findView(requestedBy)).toBeTruthy();
      expect(diagram.findView(processedBy)).toBeTruthy();
      expect(diagram.findView(includes)).toBeTruthy();
    });

    it('Should contain the expected generalizations lines', () => {
      expect(diagram.findView(employeeIsAPerson)).toBeTruthy();
      expect(diagram.findView(personalCustomerIsAdult)).toBeTruthy();
    });

    it('Should contain 19 class views', () => {
      expect(diagram.getClassViews()).toHaveLength(19);
    });

    it('Should contain 5 relation views', () => {
      expect(diagram.getRelationViews()).toHaveLength(5);
    });

    it('Should contain 15 generalization view', () => {
      expect(diagram.getGeneralizationViews()).toHaveLength(15);
    });

    it('Should contain 4 generalizations set views', () => {
      expect(diagram.getGeneralizationSetViews()).toHaveLength(4);
    });
  });
});
