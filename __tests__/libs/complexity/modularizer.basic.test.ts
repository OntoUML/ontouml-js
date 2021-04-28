import { Project, Diagram } from '@libs/ontouml';
import { Modularizer } from '@libs/complexity';

describe('Basic clusterization example', () => {
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
  const ownership = model.createRelator('Car Ownership');
  const car = model.createKind('Car');
  const available = model.createPhase('Available Car');
  const underMaintenance = model.createPhase('Under Maintenance Car');
  const rentalCar = model.createRole('Rental Car');
  const rental = model.createRelator('Car Rental');
  const customer = model.createRoleMixin('Customer');
  const corporateCustomer = model.createRole('Corporate Customer');
  const personalCustomer = model.createRole('Personal Customer');

  const genWifeWoman = woman.addChild(wife);
  const genHusbandMan = man.addChild(husband);
  person.addChild(employee);
  employee.addChild(responsible);
  available.addChild(rentalCar);
  adult.addChild(personalCustomer);
  organization.addChild(corporateCustomer);
  organization.addChild(agency);

  model.createPartitionFromClasses(person, [woman, man]);
  model.createPartitionFromClasses(person, [living, deceased]);
  model.createPartitionFromClasses(living, [child, teenager, adult]);
  model.createPartitionFromClasses(car, [available, underMaintenance]);
  model.createPartitionFromClasses(customer, [personalCustomer, corporateCustomer]);

  const medMarriageWife = model.createMediationRelation(marriage, wife);
  const medMarriagHusband = model.createMediationRelation(marriage, husband);
  model.createMediationRelation(rental, responsible);
  model.createMediationRelation(rental, customer);
  model.createMediationRelation(rental, rentalCar);
  model.createMediationRelation(ownership, agency);
  model.createMediationRelation(ownership, car);
  model.createMediationRelation(employment, organization);
  model.createMediationRelation(employment, employee);

  let diagrams: Diagram[] = new Modularizer(project).buildAll();

  it('Should generate 4 diagrams', () => {
    expect(diagrams).toHaveLength(4);
  });

  describe('Marriage cluster', () => {
    let diagram: Diagram = diagrams.find(d => d.getName() === 'Cluster of Marriage');

    it('Should contain the main relator: Marriage', () => {
      expect(diagram.findView(marriage)).toBeTruthy();
    });

    it('Should contain the expected classes (6)', () => {
      expect(diagram.findView(wife)).toBeTruthy();
      expect(diagram.findView(husband)).toBeTruthy();
      expect(diagram.findView(woman)).toBeTruthy();
      expect(diagram.findView(man)).toBeTruthy();
      expect(diagram.findView(person)).toBeTruthy();
      expect(diagram.getClassViews()).toHaveLength(6);
    });

    it('Should contain the expected relations (2)', () => {
      expect(diagram.findView(medMarriageWife)).toBeTruthy();
      expect(diagram.findView(medMarriagHusband)).toBeTruthy();
      expect(diagram.getRelationViews()).toHaveLength(2);
    });

    it('Should contain the expected generalizations (4)', () => {
      expect(diagram.findView(genWifeWoman)).toBeTruthy();
      expect(diagram.findView(genHusbandMan)).toBeTruthy();
      expect(diagram.getGeneralizationViews()).toHaveLength(4);
    });

    it('Should contain 1 labels (generalizations sets)', () => {
      expect(diagram.getGeneralizationSetViews()).toHaveLength(1);
    });
  });

  describe('Car Rental cluster', () => {
    let diagram: Diagram;

    beforeAll(() => {
      diagram = diagrams.find(d => d.getName() === 'Cluster of Car Rental');
    });

    it('Should contain the main relator: Car Rental', () => {
      expect(diagram.findView(rental)).toBeTruthy();
    });

    it('Should contain classes mediated by the main relator', () => {
      expect(diagram.findView(responsible)).toBeTruthy();
      expect(diagram.findView(customer)).toBeTruthy();
      expect(diagram.findView(rentalCar)).toBeTruthy();
    });

    it('Should contain ancestors of mediated sortal class: «role» Rental Car', () => {
      expect(diagram.findView(available)).toBeTruthy();
      expect(diagram.findView(car)).toBeTruthy();
    });

    it('Should contain ancestors of mediated sortal class: «role» Responsible Employee', () => {
      expect(diagram.findView(employee)).toBeTruthy();
      expect(diagram.findView(person)).toBeTruthy();
    });

    it('Should contain descendants of mediated non-sortal class: Customer', () => {
      expect(diagram.findView(personalCustomer)).toBeTruthy();
      expect(diagram.findView(corporateCustomer)).toBeTruthy();
    });

    it(
      'Should contain ancestors of sortal descendent («role» Personal Customer) of mediated non-' +
        'sortal class («roleMixin» Customer)',
      () => {
        expect(diagram.findView(adult)).toBeTruthy();
        expect(diagram.findView(living)).toBeTruthy();
        expect(diagram.findView(person)).toBeTruthy();
      }
    );

    it(
      'Should contain ancestors of sortal descendent («role» Corporate Customer) of mediated non-' +
        'sortal class («roleMixin» Customer)',
      () => {
        expect(diagram.findView(organization)).toBeTruthy();
      }
    );

    it('Should contain complement of phase partitions', () => {
      expect(diagram.findView(teenager)).toBeTruthy();
      expect(diagram.findView(child)).toBeTruthy();
      expect(diagram.findView(deceased)).toBeTruthy();
      expect(diagram.findView(underMaintenance)).toBeTruthy();
    });

    it('Should contain 17 shapes (classes)', () => {
      expect(diagram.getClassViews()).toHaveLength(17);
    });

    it('Should contain 3 relations views', () => {
      expect(diagram.getRelationViews()).toHaveLength(3);
    });

    it('Should contain 14 generalization views', () => {
      expect(diagram.getGeneralizationViews()).toHaveLength(14);
    });

    it('Should contain 4 generalization set views)', () => {
      expect(diagram.getGeneralizationSetViews()).toHaveLength(4);
    });
  });
});
