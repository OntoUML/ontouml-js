import { Class, Project } from '../../src';

describe('Class: test descendents-related query methods', () => {
  let proj: Project;
  let thing: Class,
    agent: Class,
    person: Class,
    student: Class,
    researcher: Class,
    phdStudent: Class;

  beforeEach(() => {
    proj = new Project();
    thing = proj.classBuilder().mixin().build();
    agent = proj.classBuilder().category().build();
    person = proj.classBuilder().kind().build();
    student = proj.classBuilder().role().build();
    researcher = proj.classBuilder().role().build();
    phdStudent = proj.classBuilder().role().build();
    agent.addParent(thing);
    person.addParent(agent);
    student.addParent(person);
    researcher.addParent(person);
    phdStudent.addParent(student);
    phdStudent.addParent(researcher);
  });

  describe(`Test ${Class.prototype.getChildren.name}()`, () => {
    it('should return an empty array for «mixin» thing', () => {
      const children = thing.getChildren();
      expect(children).toIncludeSameMembers([agent]);
    });

    it('should return «kind» person for «category» agent', () => {
      const children = agent.getChildren();
      expect(children).toIncludeSameMembers([person]);
    });

    it('should return «role» student and «role» researcher for «kind» person', () => {
      const children = person.getChildren();
      expect(children).toIncludeSameMembers([student, researcher]);
    });

    it('should return «role» phdStudent for «role» student', () => {
      const children = student.getChildren();
      expect(children).toIncludeSameMembers([phdStudent]);
    });

    it('should return «role» phdStudent for «role» researcher', () => {
      const children = researcher.getChildren();
      expect(children).toIncludeSameMembers([phdStudent]);
    });

    it('should return an empty array for «role» phdStudent', () => {
      const children = phdStudent.getChildren();
      expect(children).toBeEmpty();
    });
  });

  describe(`Test ${Class.prototype.getDescendants.name}()`, () => {
    it('should return «category» agent, «kind» person, «role» student, «role» researcher, and «role» phdStudent for «mixin» thing', () => {
      const descendants = thing.getDescendants();
      expect(descendants).toIncludeSameMembers([
        agent,
        person,
        student,
        researcher,
        phdStudent
      ]);
    });

    it('should return «kind» person, «role» student, «role» researcher, and «role» phdStudent for «category» agent', () => {
      const descendants = agent.getDescendants();
      expect(descendants).toIncludeSameMembers([
        person,
        student,
        researcher,
        phdStudent
      ]);
    });

    it('should return «role» student, «role» researcher, and «role» phdStudent for «kind» person', () => {
      const descendants = person.getDescendants();
      expect(descendants).toIncludeSameMembers([
        student,
        researcher,
        phdStudent
      ]);
    });

    it('should return «role» phdStudent for «role» student', () => {
      const descendants = student.getDescendants();
      expect(descendants).toIncludeSameMembers([phdStudent]);
    });

    it('should return «role» phdStudent for «role» researcher', () => {
      const descendants = researcher.getDescendants();
      expect(descendants).toIncludeSameMembers([phdStudent]);
    });

    it('should return an empty array for «role» phdStudent', () => {
      const children = phdStudent.getDescendants();
      expect(children).toBeEmpty();
    });
  });

  describe(`Test ${Class.prototype.getIdentityProviderDescendants.name}()`, () => {
    it('should return «kind» person for «mixin» thing', () => {
      const descendants = thing.getIdentityProviderDescendants();
      expect(descendants).toIncludeSameMembers([person]);
    });

    it('should return «kind» person for «category» agent', () => {
      const descendants = agent.getIdentityProviderDescendants();
      expect(descendants).toIncludeSameMembers([person]);
    });

    it('should return an empty array for «kind» person', () => {
      const descendants = person.getIdentityProviderDescendants();
      expect(descendants).toBeEmpty();
    });

    it('should return an empty array for «role» student', () => {
      const descendants = student.getIdentityProviderDescendants();
      expect(descendants).toBeEmpty();
    });

    it('should return an empty array for «role» researcher', () => {
      const descendants = researcher.getIdentityProviderDescendants();
      expect(descendants).toBeEmpty();
    });

    it('should return an empty array for «role» phdStudent', () => {
      const descendants = phdStudent.getIdentityProviderDescendants();
      expect(descendants).toBeEmpty();
    });
  });

  describe(`Test ${Class.prototype.getSortalDescendants.name}()`, () => {
    it('should return «kind» person, «role» researcher, «role» student, «role» phdStudent for «mixin» thing', () => {
      const descendants = thing.getSortalDescendants();
      expect(descendants).toIncludeSameMembers([
        person,
        student,
        researcher,
        phdStudent
      ]);
    });

    it('should return «kind» person, «role» researcher, «role» student, «role» phdStudent for «category» agent', () => {
      const descendants = agent.getSortalDescendants();
      expect(descendants).toIncludeSameMembers([
        person,
        student,
        researcher,
        phdStudent
      ]);
    });

    it('should return «role» researcher, «role» student, «role» phdStudent for «kind» person', () => {
      const descendants = person.getSortalDescendants();
      expect(descendants).toIncludeSameMembers([
        student,
        researcher,
        phdStudent
      ]);
    });

    it('should return «role» phdStudent for «role» student', () => {
      const descendants = student.getSortalDescendants();
      expect(descendants).toIncludeSameMembers([phdStudent]);
    });

    it('should return «role» phdStudent for «role» researcher', () => {
      const descendants = researcher.getSortalDescendants();
      expect(descendants).toIncludeSameMembers([phdStudent]);
    });

    it('should return empty array for «role» phdStudent', () => {
      const descendants = phdStudent.getSortalDescendants();
      expect(descendants).toBeEmpty();
    });
  });

  describe(`Test ${Class.prototype.getBaseSortalDescendants.name}()`, () => {
    it('should return «role» researcher, «role» student, «role» phdStudent for «mixin» thing', () => {
      const descendants = thing.getBaseSortalDescendants();
      expect(descendants).toIncludeSameMembers([
        student,
        researcher,
        phdStudent
      ]);
    });

    it('should return «role» researcher, «role» student, «role» phdStudent for «category» agent', () => {
      const descendants = agent.getBaseSortalDescendants();
      expect(descendants).toIncludeSameMembers([
        student,
        researcher,
        phdStudent
      ]);
    });

    it('should return «role» researcher, «role» student, «role» phdStudent for «kind» person', () => {
      const descendants = person.getBaseSortalDescendants();
      expect(descendants).toIncludeSameMembers([
        student,
        researcher,
        phdStudent
      ]);
    });

    it('should return «role» phdStudent for «role» student', () => {
      const descendants = student.getBaseSortalDescendants();
      expect(descendants).toIncludeSameMembers([phdStudent]);
    });

    it('should return «role» phdStudent for «role» researcher', () => {
      const descendants = researcher.getBaseSortalDescendants();
      expect(descendants).toIncludeSameMembers([phdStudent]);
    });

    it('should return empty array for «role» phdStudent', () => {
      const descendants = phdStudent.getBaseSortalDescendants();
      expect(descendants).toBeEmpty();
    });
  });

  describe(`Test ${Class.prototype.getNonSortalDescendants.name}()`, () => {
    it('should return «category» agent for «mixin» thing', () => {
      const descendants = thing.getNonSortalDescendants();
      expect(descendants).toIncludeSameMembers([agent]);
    });

    it('should return empty array for «category» agent', () => {
      const descendants = agent.getNonSortalDescendants();
      expect(descendants).toBeEmpty();
    });

    it('should return empty array for «kind» person', () => {
      const descendants = person.getNonSortalDescendants();
      expect(descendants).toBeEmpty();
    });

    it('should return empty array for «role» student', () => {
      const descendants = student.getNonSortalDescendants();
      expect(descendants).toBeEmpty();
    });

    it('should return empty array for «role» researcher', () => {
      const descendants = researcher.getNonSortalDescendants();
      expect(descendants).toBeEmpty();
    });

    it('should return empty array for «role» phdStudent', () => {
      const descendants = phdStudent.getNonSortalDescendants();
      expect(descendants).toBeEmpty();
    });
  });

  describe(`Test ${Class.prototype.getRigidDescendants.name}()`, () => {
    it('should return «category» agent, «kind» person for «mixin» thing', () => {
      const descendants = thing.getRigidDescendants();
      expect(descendants).toIncludeSameMembers([person, agent]);
    });

    it('should return «kind» person for «category» agent', () => {
      const descendants = agent.getRigidDescendants();
      expect(descendants).toIncludeSameMembers([person]);
    });

    it('should return empty array for «kind» person', () => {
      const descendants = person.getRigidDescendants();
      expect(descendants).toBeEmpty();
    });

    it('should return empty array for «role» student', () => {
      const descendants = student.getRigidDescendants();
      expect(descendants).toBeEmpty();
    });

    it('should return empty array for «role» researcher', () => {
      const descendants = researcher.getRigidDescendants();
      expect(descendants).toBeEmpty();
    });

    it('should return empty array for «role» phdStudent', () => {
      const descendants = phdStudent.getRigidDescendants();
      expect(descendants).toBeEmpty();
    });
  });

  describe(`Test ${Class.prototype.getSemiRigidDescendants.name}()`, () => {
    it('should return empty array for «mixin» thing', () => {
      const descendants = thing.getSemiRigidDescendants();
      expect(descendants).toBeEmpty();
    });

    it('should return empty array for «category» agent', () => {
      const descendants = agent.getSemiRigidDescendants();
      expect(descendants).toBeEmpty();
    });

    it('should return empty array for «kind» person', () => {
      const descendants = person.getSemiRigidDescendants();
      expect(descendants).toBeEmpty();
    });

    it('should return empty array for «role» student', () => {
      const descendants = student.getSemiRigidDescendants();
      expect(descendants).toBeEmpty();
    });

    it('should return empty array for «role» researcher', () => {
      const descendants = researcher.getSemiRigidDescendants();
      expect(descendants).toBeEmpty();
    });

    it('should return empty array for «role» phdStudent', () => {
      const descendants = phdStudent.getSemiRigidDescendants();
      expect(descendants).toBeEmpty();
    });
  });

  describe(`Test ${Class.prototype.getAntiRigidDescendants.name}()`, () => {
    it('should return «role» researcher, «role» student, «role» phdStudent for «mixin» thing', () => {
      const descendants = thing.getAntiRigidDescendants();
      expect(descendants).toIncludeSameMembers([
        student,
        researcher,
        phdStudent
      ]);
    });

    it('should return «role» researcher, «role» student, «role» phdStudent for «category» agent', () => {
      const descendants = agent.getAntiRigidDescendants();
      expect(descendants).toIncludeSameMembers([
        student,
        researcher,
        phdStudent
      ]);
    });

    it('should return «role» researcher, «role» student, «role» phdStudent for «kind» person', () => {
      const descendants = person.getAntiRigidDescendants();
      expect(descendants).toIncludeSameMembers([
        student,
        researcher,
        phdStudent
      ]);
    });

    it('should return «role» phdStudent for «role» student', () => {
      const descendants = student.getAntiRigidDescendants();
      expect(descendants).toIncludeSameMembers([phdStudent]);
    });

    it('should return «role» phdStudent for «role» researcher', () => {
      const descendants = researcher.getAntiRigidDescendants();
      expect(descendants).toIncludeSameMembers([phdStudent]);
    });

    it('should return empty array for «role» phdStudent', () => {
      const descendants = phdStudent.getAntiRigidDescendants();
      expect(descendants).toBeEmpty();
    });
  });
});
