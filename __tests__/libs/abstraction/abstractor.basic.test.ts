import { Project, Diagram } from '@libs/ontouml';
import { Abstractor } from '@libs/abstraction';

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
  const medRentalCustomer =  model.createMediationRelation(rental, customer);
  const medRentalRentalCar = model.createMediationRelation(rental, rentalCar);
  const medOwnershipAgency = model.createMediationRelation(ownership, agency);
  const medOwnershipCar = model.createMediationRelation(ownership, car);
  
  let diagrams: Diagram[] = new Abstractor(project).buildAll();

  
  describe('Relator Abstraction Test', () => {
    let diagram: Diagram = diagrams.find(d => d.getName() === 'Relator Abstraction');

  

    it('Should not contain the main relator: Marriage', () => {
      expect(diagram.findView(marriage)).toBeFalsy();
    });
    it('Should not contain the main relator: Car Rental', () => {
      expect(diagram.findView(rental)).toBeFalsy();
    });
    it('Should not contain the main relator: Ownership', () => {
      expect(diagram.findView(ownership)).toBeFalsy();
    });


    



    it('Should contain the expected classes (19)', () => {
      expect(diagram.findView(person)).toBeTruthy();
      expect(diagram.findView(woman)).toBeTruthy();
      expect(diagram.findView(man)).toBeTruthy();
      expect(diagram.findView(husband)).toBeTruthy();
      expect(diagram.findView(wife)).toBeTruthy();
      expect(diagram.findView(deceased)).toBeTruthy();
      expect(diagram.findView(living)).toBeTruthy();
      expect(diagram.findView(child)).toBeTruthy();
      expect(diagram.findView(adult)).toBeTruthy();
      expect(diagram.findView(teenager)).toBeTruthy();
      expect(diagram.findView(personalCustomer)).toBeTruthy();
      expect(diagram.findView(organization)).toBeTruthy();
      expect(diagram.findView(agency)).toBeTruthy();
      expect(diagram.findView(car)).toBeTruthy();
      expect(diagram.findView(customer)).toBeTruthy();
      expect(diagram.findView(underMaintenance)).toBeTruthy();
      expect(diagram.findView(available)).toBeTruthy();
      expect(diagram.findView(corporateCustomer)).toBeTruthy();
      expect(diagram.findView(rentalCar)).toBeTruthy();
      
      expect(diagram.getClassViews()).toHaveLength(19);
    });

   it('Should not contain the expected relations (6)', () => {
      expect(diagram.findView(medMarriageWife)).toBeFalsy();
      expect(diagram.findView(medMarriagHusband)).toBeFalsy();
      expect(diagram.findView(medRentalRentalCar)).toBeFalsy();
      expect(diagram.findView(medRentalCustomer)).toBeFalsy();
      expect(diagram.findView(medOwnershipAgency)).toBeFalsy();
      expect(diagram.findView(medOwnershipCar)).toBeFalsy();

    });

    
  });
  
  describe('Non Sortal Abstraction Test', () => {
    let diagram: Diagram = diagrams.find(d => d.getName() === 'Non Sortal Abstraction');

    it('Should not contain the main relator: Ownership', () => {
      expect(diagram.findView(customer)).toBeFalsy();
    });

    it('Should not contain the expected relations (1)', () => {
      expect(diagram.findView(medRentalCustomer)).toBeFalsy();
    });

  });
});
