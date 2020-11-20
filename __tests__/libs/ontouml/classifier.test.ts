import { Class, Project, classifier } from '@libs/ontouml';

describe('Classifier Tests', () => {
  describe(`Test ${classifier.getGeneralizationsInvolvingClassifier.name}()`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const agent = model.createClass();
    const person = model.createClass();
    const organization = pkg.createClass();
    const agentIntoPerson = model.createGeneralization(agent, person);
    const agentIntoOrganization = model.createGeneralization(agent, organization);
    const car = model.createClass();

    it('Test agent generalization', () => {
      const agentGeneralizations = agent.getGeneralizations();
      expect(agentGeneralizations).toContain(agentIntoPerson);
      expect(agentGeneralizations).toContain(agentIntoOrganization);
      expect(agentGeneralizations.length).toBe(2);
    });

    it('Test person generalizations', () => {
      const personGeneralizations = person.getGeneralizations();
      expect(personGeneralizations).toContain(agentIntoPerson);
      expect(personGeneralizations.length).toBe(1);
    });

    it('Test organization generalizations', () => {
      const organizationGeneralizations = organization.getGeneralizations();
      expect(organizationGeneralizations).toContain(agentIntoOrganization);
      expect(organizationGeneralizations.length).toBe(1);
    });

    it('Test car generalizations', () => {
      const carGeneralizations = car.getGeneralizations();
      expect(carGeneralizations.length).toBe(0);
    });
  });

  describe(`Test ${classifier.getGeneralizationSetsInvolvingClassifier.name}()`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const agent = model.createClass();
    const person = model.createClass();
    const organization = pkg.createClass();
    const agentIntoPerson = model.createGeneralization(agent, person);
    const agentIntoOrganization = model.createGeneralization(agent, organization);
    const genset = pkg.createGeneralizationSet([agentIntoPerson, agentIntoOrganization]);
    const car = model.createClass();

    it('Test agent generalization sets', () => {
      const agentGeneralizationSets = agent.getGeneralizationSets();
      expect(agentGeneralizationSets).toContain(genset);
      expect(agentGeneralizationSets.length).toBe(1);
    });

    it('Test person generalization sets', () => {
      const personGeneralizationSets = person.getGeneralizationSets();
      expect(personGeneralizationSets).toContain(genset);
      expect(personGeneralizationSets.length).toBe(1);
    });

    it('Test organization generalization sets', () => {
      const organizationGeneralizationSets = organization.getGeneralizationSets();
      expect(organizationGeneralizationSets).toContain(genset);
      expect(organizationGeneralizationSets.length).toBe(1);
    });

    it('Test car generalization sets', () => {
      const carGeneralizationSets = car.getGeneralizationSets();
      expect(carGeneralizationSets.length).toBe(0);
    });
  });

  describe(`Test ${classifier.getGeneralizationsWhereGeneral.name}()`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const agent = model.createClass();
    const person = model.createClass();
    const organization = pkg.createClass();
    const agentIntoPerson = model.createGeneralization(agent, person);
    const agentIntoOrganization = model.createGeneralization(agent, organization);

    it('Test agent generalizations', () => {
      const agentGeneralizations = agent.getGeneralizationsWhereGeneral();
      expect(agentGeneralizations).toContain(agentIntoPerson);
      expect(agentGeneralizations).toContain(agentIntoOrganization);
      expect(agentGeneralizations.length).toBe(2);
    });

    it('Test person generalizations', () => {
      const personGeneralizations = person.getGeneralizationsWhereGeneral();
      expect(personGeneralizations.length).toBe(0);
    });

    it('Test organization generalizations', () => {
      const organizationGeneralizations = organization.getGeneralizationsWhereGeneral();
      expect(organizationGeneralizations.length).toBe(0);
    });
  });

  describe(`Test ${classifier.getGeneralizationsWhereSpecific.name}()`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const agent = model.createClass();
    const person = model.createClass();
    const organization = pkg.createClass();
    const agentIntoPerson = model.createGeneralization(agent, person);
    const agentIntoOrganization = model.createGeneralization(agent, organization);

    it('Test agent generalizations', () => {
      const agentGeneralizations = agent.getGeneralizationsWhereSpecific();
      expect(agentGeneralizations.length).toBe(0);
    });

    it('Test person generalizations', () => {
      const personGeneralizations = person.getGeneralizationsWhereSpecific();
      expect(personGeneralizations).toContain(agentIntoPerson);
      expect(personGeneralizations.length).toBe(1);
    });

    it('Test organization generalizations', () => {
      const organizationGeneralizations = organization.getGeneralizationsWhereSpecific();
      expect(organizationGeneralizations).toContain(agentIntoOrganization);
      expect(organizationGeneralizations.length).toBe(1);
    });
  });

  describe(`Test ${classifier.getGeneralizationSetsWhereGeneral.name}()`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const agent = model.createClass();
    const person = model.createClass();
    const organization = pkg.createClass();
    const agentIntoPerson = model.createGeneralization(agent, person);
    const agentIntoOrganization = model.createGeneralization(agent, organization);
    const genset = pkg.createGeneralizationSet([agentIntoPerson, agentIntoOrganization]);

    it('Test agent generalization sets', () => {
      const agentGeneralizationSets = agent.getGeneralizationSetsWhereGeneral();
      expect(agentGeneralizationSets).toContain(genset);
      expect(agentGeneralizationSets.length).toBe(1);
    });

    it('Test person generalization sets', () => {
      const personGeneralizationSets = person.getGeneralizationSetsWhereGeneral();
      expect(personGeneralizationSets.length).toBe(0);
    });

    it('Test organization generalization sets', () => {
      const organizationGeneralizationSets = organization.getGeneralizationSetsWhereGeneral();
      expect(organizationGeneralizationSets.length).toBe(0);
    });
  });

  describe(`Test ${classifier.getGeneralizationSetsWhereSpecific.name}()`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const agent = model.createClass();
    const person = model.createClass();
    const organization = pkg.createClass();
    const agentIntoPerson = model.createGeneralization(agent, person);
    const agentIntoOrganization = model.createGeneralization(agent, organization);
    const genset = pkg.createGeneralizationSet([agentIntoPerson, agentIntoOrganization]);

    it('Test agent generalization sets', () => {
      const agentGeneralizationSets = agent.getGeneralizationSetsWhereSpecific();
      expect(agentGeneralizationSets.length).toBe(0);
    });

    it('Test person generalization sets', () => {
      const personGeneralizationSets = person.getGeneralizationSetsWhereSpecific();
      expect(personGeneralizationSets).toContain(genset);
      expect(personGeneralizationSets.length).toBe(1);
    });

    it('Test organization generalization sets', () => {
      const organizationGeneralizationSets = organization.getGeneralizationSetsWhereSpecific();
      expect(organizationGeneralizationSets).toContain(genset);
      expect(organizationGeneralizationSets.length).toBe(1);
    });
  });

  describe(`Test ${classifier.getParents.name}()`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const agent = model.createClass();
    const person = model.createClass();
    const organization = pkg.createClass();
    model.createGeneralization(agent, person);
    model.createGeneralization(agent, organization);

    const selfParent = model.createClass();
    model.createGeneralization(selfParent, selfParent);

    it('Test agent parents', () => {
      const agentParents = agent.getParents();
      expect(agentParents.length).toBe(0);
    });

    it('Test person parents', () => {
      const personParents = person.getParents();
      expect(personParents).toContain(agent);
      expect(personParents.length).toBe(1);
    });

    it('Test organization parents', () => {
      const organizationParents = organization.getParents();
      expect(organizationParents).toContain(agent);
      expect(organizationParents.length).toBe(1);
    });

    it('Test selfParent parents', () => {
      const selfParentParents = selfParent.getParents();
      expect(selfParentParents).toContain(selfParent);
      expect(selfParentParents.length).toBe(1);
    });
  });

  describe(`Test ${classifier.getChildren.name}()`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const agent = model.createClass();
    const person = model.createClass();
    const organization = pkg.createClass();
    model.createGeneralization(agent, person);
    model.createGeneralization(agent, organization);

    const selfParent = model.createClass();
    model.createGeneralization(selfParent, selfParent);

    it('Test agent children', () => {
      const agentChildren = agent.getChildren();
      expect(agentChildren).toContain(person);
      expect(agentChildren).toContain(organization);
      expect(agentChildren.length).toBe(2);
    });

    it('Test person children', () => {
      const personChildren = person.getChildren();
      expect(personChildren.length).toBe(0);
    });

    it('Test organization children', () => {
      const organizationChildren = organization.getChildren();
      expect(organizationChildren.length).toBe(0);
    });

    it('Test selfParent children', () => {
      const selfParentChildren = selfParent.getChildren();
      expect(selfParentChildren).toContain(selfParent);
      expect(selfParentChildren.length).toBe(1);
    });
  });

  describe(`Test ${classifier.getAncestors.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass('agent');
    const person = model.createClass('person');
    const student = model.createClass('student');
    const phdStudent = model.createClass('phdStudent');
    const organization = model.createClass('organization');
    const nonProfitOrganization = model.createClass('nonProfitOrganization');
    const forProfitOrganization = model.createClass('forProfitOrganization');
    const lemonadeStand = model.createClass('lemonadeStand');

    model.createGeneralization(agent, person);
    model.createGeneralization(person, student);
    model.createGeneralization(student, phdStudent);
    model.createGeneralization(agent, organization);
    model.createGeneralization(organization, nonProfitOrganization);
    model.createGeneralization(organization, forProfitOrganization);
    model.createGeneralization(forProfitOrganization, lemonadeStand);
    model.createGeneralization(lemonadeStand, forProfitOrganization);

    it('Test agent ancestors', () => {
      const agentAncestors = agent.getAncestors();
      expect(agentAncestors.length).toBe(0);
    });

    it('Test phdStudent ancestors', () => {
      const phdStudentAncestors = phdStudent.getAncestors();
      expect(phdStudentAncestors).toContain(agent);
      expect(phdStudentAncestors.length).toBe(3);
    });

    it('Test lemonadeStand ancestors', () => {
      const lemonadeStandAncestors = lemonadeStand.getAncestors();
      expect(lemonadeStandAncestors).toContain(agent);
      expect(lemonadeStandAncestors).toContain(lemonadeStand);
      expect(lemonadeStandAncestors).toContain(forProfitOrganization);
      expect(lemonadeStandAncestors.length).toBe(4);
    });

    it('Test forProfitOrganization ancestors', () => {
      const forProfitOrganizationAncestors = forProfitOrganization.getAncestors();
      expect(forProfitOrganizationAncestors).toContain(agent);
      expect(forProfitOrganizationAncestors).toContain(lemonadeStand);
      expect(forProfitOrganizationAncestors).toContain(forProfitOrganization);
      expect(forProfitOrganizationAncestors.length).toBe(4);
    });
  });

  describe(`Test ${classifier.getDescendants.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createClass('agent');
    const person = model.createClass('person');
    const student = model.createClass('student');
    const phdStudent = model.createClass('phdStudent');
    const organization = model.createClass('organization');
    const nonProfitOrganization = model.createClass('nonProfitOrganization');
    const forProfitOrganization = model.createClass('forProfitOrganization');
    const lemonadeStand = model.createClass('lemonadeStand');

    model.createGeneralization(agent, person);
    model.createGeneralization(person, student);
    model.createGeneralization(student, phdStudent);
    model.createGeneralization(agent, organization);
    model.createGeneralization(organization, nonProfitOrganization);
    model.createGeneralization(organization, forProfitOrganization);
    model.createGeneralization(forProfitOrganization, lemonadeStand);
    model.createGeneralization(lemonadeStand, forProfitOrganization);

    it('Test agent descendants', () => {
      const agentDescendants = agent.getDescendants();
      expect(agentDescendants).toContain(phdStudent);
      expect(agentDescendants).toContain(lemonadeStand);
      expect(agentDescendants).toContain(nonProfitOrganization);
      expect(agentDescendants.length).toBe(7);
    });

    it('Test phdStudent descendants', () => {
      const phdStudentDescendants = phdStudent.getDescendants();
      expect(phdStudentDescendants.length).toBe(0);
    });

    it('Test lemonadeStand descendants', () => {
      const lemonadeStandDescendants = lemonadeStand.getDescendants();
      expect(lemonadeStandDescendants).toContain(lemonadeStand);
      expect(lemonadeStandDescendants).toContain(forProfitOrganization);
      expect(lemonadeStandDescendants.length).toBe(2);
    });

    it('Test forProfitOrganization descendants', () => {
      const forProfitOrganizationDescendants = forProfitOrganization.getDescendants();
      expect(forProfitOrganizationDescendants).toContain(lemonadeStand);
      expect(forProfitOrganizationDescendants).toContain(forProfitOrganization);
      expect(forProfitOrganizationDescendants.length).toBe(2);
    });
  });

  describe(`Test ${classifier.getFilteredAncestors.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createCategory('agent');
    const person = model.createKind('person');
    const student = model.createRole('student');
    const phdStudent = model.createRole('phdStudent');
    const organization = model.createKind('organization');
    const nonProfitOrganization = model.createSubkind('nonProfitOrganization');
    const forProfitOrganization = model.createSubkind('forProfitOrganization');
    const lemonadeStand = model.createSubkind('lemonadeStand');

    model.createGeneralization(agent, person);
    model.createGeneralization(person, student);
    model.createGeneralization(student, phdStudent);
    model.createGeneralization(agent, organization);
    model.createGeneralization(organization, nonProfitOrganization);
    model.createGeneralization(organization, forProfitOrganization);
    model.createGeneralization(forProfitOrganization, lemonadeStand);
    model.createGeneralization(lemonadeStand, forProfitOrganization);

    it('Test phdStudent ancestors', () => {
      const ultimateSortalFilter = (_class: Class) => _class.hasUltimateSortalStereotype();
      const phdStudentAncestors = phdStudent.getFilteredAncestors(ultimateSortalFilter);
      expect(phdStudentAncestors).toContain(person);
      expect(phdStudentAncestors.length).toBe(1);
    });

    it('Test lemonadeStand ancestors', () => {
      const subkindFilter = (_class: Class) => _class.hasSubkindStereotype();
      const lemonadeStandAncestors = lemonadeStand.getFilteredAncestors(subkindFilter);
      expect(lemonadeStandAncestors).toContain(lemonadeStand);
      expect(lemonadeStandAncestors).toContain(forProfitOrganization);
      expect(lemonadeStandAncestors.length).toBe(2);
    });
  });

  describe(`Test ${classifier.getFilteredDescendants.name}()`, () => {
    const model = new Project().createModel();
    const agent = model.createCategory('agent');
    const person = model.createKind('person');
    const student = model.createRole('student');
    const phdStudent = model.createRole('phdStudent');
    const organization = model.createKind('organization');
    const nonProfitOrganization = model.createSubkind('nonProfitOrganization');
    const forProfitOrganization = model.createSubkind('forProfitOrganization');
    const lemonadeStand = model.createSubkind('lemonadeStand');

    model.createGeneralization(agent, person);
    model.createGeneralization(person, student);
    model.createGeneralization(student, phdStudent);
    model.createGeneralization(agent, organization);
    model.createGeneralization(organization, nonProfitOrganization);
    model.createGeneralization(organization, forProfitOrganization);
    model.createGeneralization(forProfitOrganization, lemonadeStand);
    model.createGeneralization(lemonadeStand, forProfitOrganization);

    it('Test agent descendants', () => {
      const ultimateSortalFilter = (_class: Class) => _class.hasUltimateSortalStereotype();
      const agentDescendants = agent.getFilteredDescendants(ultimateSortalFilter);
      expect(agentDescendants).toContain(person);
      expect(agentDescendants).toContain(organization);
      expect(agentDescendants.length).toBe(2);
    });

    it('Test lemonadeStand descendants', () => {
      const subkindFilter = (_class: Class) => _class.hasSubkindStereotype();
      const lemonadeStandDescendants = lemonadeStand.getFilteredDescendants(subkindFilter);
      expect(lemonadeStandDescendants).toContain(lemonadeStand);
      expect(lemonadeStandDescendants).toContain(forProfitOrganization);
      expect(lemonadeStandDescendants.length).toBe(2);
    });
  });
});
