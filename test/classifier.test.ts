import {describe, expect, it, beforeEach, beforeAll} from '@jest/globals';
import { Class, Generalization, GeneralizationSet, Package, Project } from '../src';

describe('Classifier Tests', () => {
  let project: Project;
  let model: Package, pkg: Package;
  let agent: Class, person: Class, organization: Class, car: Class, student: Class, phdStudent: Class, nonProfitOrganization: Class, forProfitOrganization: Class, lemonadeStand: Class;
  let agentToPerson: Generalization,
    agentToOrganization: Generalization,
    personToStudent: Generalization,
    organizationToNpo: Generalization,
    organizationToFpo: Generalization,
    fpoToLemonadeStand: Generalization;
  let genset: GeneralizationSet;

  beforeAll(() => {
    project = new Project();
    model = project.createModel();
    pkg = model.createPackage();

    agent = model.createCategory('Agent');
    person = model.createKind('Person');
    student = model.createRole('Student');
    phdStudent = model.createRole('PhdStudent');
    organization = pkg.createKind('Organization');
    nonProfitOrganization = model.createSubkind('nonProfitOrganization');
    forProfitOrganization = model.createSubkind('forProfitOrganization');
    lemonadeStand = model.createSubkind('lemonadeStand');
    car = model.createKind('Car');

    agentToPerson = model.createGeneralization(agent, person);
    agentToOrganization = model.createGeneralization(agent, organization);
    personToStudent = model.createGeneralization(person, student);
    model.createGeneralization(student, phdStudent);
    organizationToNpo = model.createGeneralization(organization, nonProfitOrganization);
    organizationToFpo = model.createGeneralization(organization, forProfitOrganization);
    fpoToLemonadeStand = model.createGeneralization(forProfitOrganization, lemonadeStand);
    model.createGeneralization(lemonadeStand, forProfitOrganization);

    genset = pkg.createGeneralizationSet([agentToPerson, agentToOrganization]);
  });

  describe(`Test getGeneralizationsInvolvingClassifier()`, () => {
    it('Test agent generalization', () => {
      const agentGeneralizations = agent.getGeneralizations();
      expect(agentGeneralizations).toContain(agentToPerson);
      expect(agentGeneralizations).toContain(agentToOrganization);
      expect(agentGeneralizations.length).toBe(2);
    });

    it('Test person generalizations', () => {
      const personGeneralizations = person.getGeneralizations();
      expect(personGeneralizations).toContain(agentToPerson);
      expect(personGeneralizations).toContain(personToStudent);
      expect(personGeneralizations.length).toBe(2);
    });

    it('Test organization generalizations', () => {
      const organizationGeneralizations = organization.getGeneralizations();
      expect(organizationGeneralizations).toContain(agentToOrganization);
      expect(organizationGeneralizations).toContain(organizationToNpo);
      expect(organizationGeneralizations).toContain(organizationToFpo);
      expect(organizationGeneralizations.length).toBe(3);
    });

    it('Test car generalizations', () => {
      const carGeneralizations = car.getGeneralizations();
      expect(carGeneralizations.length).toBe(0);
    });
  });

  describe(`Test getGeneralizationSetsInvolvingClassifier()`, () => {
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

  describe(`Test getGeneralizationsWhereGeneral()`, () => {
    it('Test agent generalizations', () => {
      const agentGeneralizations = agent.getGeneralizationsWhereGeneral();
      expect(agentGeneralizations).toContain(agentToPerson);
      expect(agentGeneralizations).toContain(agentToOrganization);
      expect(agentGeneralizations.length).toBe(2);
    });

    it('Test car generalizations', () => {
      const carGeneralizations = car.getGeneralizationsWhereGeneral();
      expect(carGeneralizations.length).toBe(0);
    });

    it('Test organization generalizations', () => {
      const organizationGeneralizations = organization.getGeneralizationsWhereGeneral();
      expect(organizationGeneralizations.length).toBe(2);
    });
  });

  describe(`Test getGeneralizationsWhereSpecific()`, () => {
    it('Test agent generalizations', () => {
      const agentGeneralizations = agent.getGeneralizationsWhereSpecific();
      expect(agentGeneralizations.length).toBe(0);
    });

    it('Test person generalizations', () => {
      const personGeneralizations = person.getGeneralizationsWhereSpecific();
      expect(personGeneralizations).toContain(agentToPerson);
      expect(personGeneralizations.length).toBe(1);
    });

    it('Test organization generalizations', () => {
      const organizationGeneralizations = organization.getGeneralizationsWhereSpecific();
      expect(organizationGeneralizations).toContain(agentToOrganization);
      expect(organizationGeneralizations.length).toBe(1);
    });
  });

  describe(`Test getGeneralizationSetsWhereGeneral()`, () => {
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

  describe(`Test getGeneralizationSetsWhereSpecific()`, () => {
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

  describe(`Test getParents()`, () => {
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
      const selfParent = model.createClass();
      model.createGeneralization(selfParent, selfParent);
      const selfParentParents = selfParent.getParents();
      expect(selfParentParents).toContain(selfParent);
      expect(selfParentParents.length).toBe(1);
    });
  });

  describe(`Test getChildren()`, () => {
    it('Test agent children', () => {
      const agentChildren = agent.getChildren();
      expect(agentChildren).toContain(person);
      expect(agentChildren).toContain(organization);
      expect(agentChildren.length).toBe(2);
    });

    it('Test person children', () => {
      const personChildren = person.getChildren();
      expect(personChildren.length).toBe(1);
    });

    it('Test organization children', () => {
      const organizationChildren = organization.getChildren();
      expect(organizationChildren.length).toBe(2);
    });

    it('Test selfParent children', () => {
      const selfParent = model.createClass();
      model.createGeneralization(selfParent, selfParent);
      const selfParentChildren = selfParent.getChildren();
      expect(selfParentChildren).toContain(selfParent);
      expect(selfParentChildren.length).toBe(1);
    });
  });

  describe(`Test getAncestors()`, () => {
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

  describe(`Test getDescendants()`, () => {
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

  describe(`Test getFilteredAncestors()`, () => {
    it('Test phdStudent ancestors', () => {
      const ultimateSortalFilter = (_class: Class) => _class.isIdentityProvider();
      const phdStudentAncestors = phdStudent.getFilteredAncestors(ultimateSortalFilter);
      expect(phdStudentAncestors).toContain(person);
      expect(phdStudentAncestors.length).toBe(1);
    });

    it('Test lemonadeStand ancestors', () => {
      const subkindFilter = (_class: Class) => _class.isSubkind();
      const lemonadeStandAncestors = lemonadeStand.getFilteredAncestors(subkindFilter);
      expect(lemonadeStandAncestors).toContain(lemonadeStand);
      expect(lemonadeStandAncestors).toContain(forProfitOrganization);
      expect(lemonadeStandAncestors.length).toBe(2);
    });
  });

  describe(`Test getFilteredDescendants()`, () => {
    it('Test agent descendants', () => {
      const ultimateSortalFilter = (_class: Class) => _class.isIdentityProvider();
      const agentDescendants = agent.getFilteredDescendants(ultimateSortalFilter);
      expect(agentDescendants).toContain(person);
      expect(agentDescendants).toContain(organization);
      expect(agentDescendants.length).toBe(2);
    });

    it('Test lemonadeStand descendants', () => {
      const subkindFilter = (_class: Class) => _class.isSubkind();
      const lemonadeStandDescendants = lemonadeStand.getFilteredDescendants(subkindFilter);
      expect(lemonadeStandDescendants).toContain(lemonadeStand);
      expect(lemonadeStandDescendants).toContain(forProfitOrganization);
      expect(lemonadeStandDescendants.length).toBe(2);
    });
  });
});
