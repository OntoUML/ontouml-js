import { Class, Project } from '../../src';

describe('Class: test ancestor-related query methods', () => {
  let proj: Project;
  let agent: Class, person: Class, student: Class, phdStudent: Class;

  beforeEach(() => {
    proj = new Project();
    agent = proj.classBuilder().category().build();
    person = proj.classBuilder().kind().build();
    student = proj.classBuilder().role().build();
    phdStudent = proj.classBuilder().role().build();
    person.addParent(agent);
    student.addParent(person);
    phdStudent.addParent(student);
  });

  describe(`Test ${Class.prototype.getParents.name}()`, () => {
    it('should return «category» agent as the only parent of «kind» person', () => {
      expect(person.getParents()).toIncludeSameMembers([agent]);
    });
  });

  describe(`Test ${Class.prototype.getAncestors.name}()`, () => {
    it('Test function call', () => {
      expect(person.getAncestors()).toBe(1);
    });
  });

  describe(`Test ${Class.prototype.getIdentityProviderAncestors.name}()`, () => {
    it('Test function call', () => {
      const studentAncestors = student.getIdentityProviderAncestors();
      expect(studentAncestors).toContain(person);
      expect(studentAncestors).toHaveLength(1);
      expect(agent.getIdentityProviderAncestors()).toBeEmpty();
      expect(person.getIdentityProviderAncestors()).toBeEmpty();
    });
  });

  describe(`Test ${Class.prototype.getSortalAncestors.name}()`, () => {
    it('Test function call', () => {
      const studentAncestors = student.getSortalAncestors();
      expect(studentAncestors).toContain(person);
      expect(studentAncestors.length).toBe(1);
      expect(agent.getSortalAncestors().length).toBe(0);
      expect(person.getSortalAncestors().length).toBe(0);
    });
  });

  describe(`Test ${Class.prototype.getBaseSortalAncestors.name}()`, () => {
    it('Test function call', () => {
      const phdStudentAncestors = phdStudent.getBaseSortalAncestors();
      expect(phdStudentAncestors).toContain(student);
      expect(phdStudentAncestors.length).toBe(1);
      expect(agent.getBaseSortalAncestors()).toBeEmpty();
      expect(person.getBaseSortalAncestors()).toBeEmpty();
      expect(student.getBaseSortalAncestors()).toBeEmpty();
    });
  });

  describe(`Test ${Class.prototype.getNonSortalAncestors.name}()`, () => {
    it('Test function call', () => {
      const studentAncestors = student.getNonSortalAncestors();
      expect(studentAncestors).toContain(agent);
      expect(studentAncestors.length).toBe(1);
      expect(agent.getNonSortalAncestors()).toBeEmpty();
      expect(person.getNonSortalAncestors().length).toBe(1);
    });
  });

  describe(`Test ${Class.prototype.getRigidAncestors.name}()`, () => {
    it('Test function call', () => {
      const phdStudentAncestors = phdStudent.getRigidAncestors();
      expect(phdStudentAncestors).toContain(agent);
      expect(phdStudentAncestors.length).toBe(2);
      expect(agent.getRigidAncestors().length).toBe(0);
      expect(person.getRigidAncestors().length).toBe(1);
      expect(student.getRigidAncestors().length).toBe(2);
    });
  });

  describe(`Test ${Class.prototype.getSemiRigidAncestors.name}()`, () => {
    it('Test function call', () => {
      const phdStudentAncestors = phdStudent.getSemiRigidAncestors();
      expect(phdStudentAncestors).toContain(agent);
      expect(phdStudentAncestors.length).toBe(1);
      expect(agent.getSemiRigidAncestors().length).toBe(0);
      expect(person.getSemiRigidAncestors().length).toBe(1);
      expect(student.getSemiRigidAncestors().length).toBe(1);
    });
  });

  describe(`Test ${Class.prototype.getAntiRigidAncestors.name}()`, () => {
    it('Test function call', () => {
      const phdStudentAncestors = phdStudent.getAntiRigidAncestors();
      expect(phdStudentAncestors).toContain(student);
      expect(phdStudentAncestors.length).toBe(1);
      expect(agent.getAntiRigidAncestors().length).toBe(0);
      expect(person.getAntiRigidAncestors().length).toBe(0);
      expect(student.getAntiRigidAncestors().length).toBe(0);
    });
  });
});
