import { Class, Package, Project } from '@libs/ontouml';

describe('Class: test ancestor-related query methods', () => {
  let project: Project;
  let model: Package;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

  describe(`Test ${Class.prototype.getParents.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createClass();
      const person = model.createClass();
      model.createGeneralization(agent, person);

      expect(person.getParents().length).toBe(1);
    });
  });

  describe(`Test ${Class.prototype.getAncestors.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createClass();
      const person = model.createClass();
      model.createGeneralization(agent, person);

      expect(person.getAncestors().length).toBe(1);
    });
  });

  describe(`Test ${Class.prototype.getFilteredAncestors.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createClass();
      const person = model.createClass();
      const passFilter = () => true;
      model.createGeneralization(agent, person);

      expect(person.getFilteredAncestors(passFilter).length).toBe(1);
    });
  });

  describe(`Test ${Class.prototype.getUltimateSortalAncestors.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createCategory();
      const person = model.createKind();
      const student = model.createRole();
      model.createGeneralization(agent, person);
      model.createGeneralization(person, student);
      const studentAncestors = student.getUltimateSortalAncestors();

      expect(studentAncestors).toContain(person);
      expect(studentAncestors.length).toBe(1);
      expect(agent.getUltimateSortalAncestors().length).toBe(0);
      expect(person.getUltimateSortalAncestors().length).toBe(0);
    });
  });

  describe(`Test ${Class.prototype.getSortalAncestors.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createCategory();
      const person = model.createKind();
      const student = model.createRole();
      model.createGeneralization(agent, person);
      model.createGeneralization(person, student);
      const studentAncestors = student.getSortalAncestors();

      expect(studentAncestors).toContain(person);
      expect(studentAncestors.length).toBe(1);
      expect(agent.getSortalAncestors().length).toBe(0);
      expect(person.getSortalAncestors().length).toBe(0);
    });
  });
  describe(`Test ${Class.prototype.getBaseSortalAncestors.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createCategory();
      const person = model.createKind();
      const student = model.createRole();
      const phdStudent = model.createRole();
      model.createGeneralization(agent, person);
      model.createGeneralization(person, student);
      model.createGeneralization(student, phdStudent);
      const phdStudentAncestors = phdStudent.getBaseSortalAncestors();

      expect(phdStudentAncestors).toContain(student);
      expect(phdStudentAncestors.length).toBe(1);
      expect(agent.getBaseSortalAncestors().length).toBe(0);
      expect(person.getBaseSortalAncestors().length).toBe(0);
      expect(student.getBaseSortalAncestors().length).toBe(0);
    });
  });
  describe(`Test ${Class.prototype.getNonSortalAncestors.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createCategory();
      const person = model.createKind();
      const student = model.createRole();
      model.createGeneralization(agent, person);
      model.createGeneralization(person, student);
      const studentAncestors = student.getNonSortalAncestors();

      expect(studentAncestors).toContain(agent);
      expect(studentAncestors.length).toBe(1);
      expect(agent.getNonSortalAncestors().length).toBe(0);
      expect(person.getNonSortalAncestors().length).toBe(1);
    });
  });
  describe(`Test ${Class.prototype.getRigidAncestors.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createCategory();
      const person = model.createKind();
      const student = model.createRole();
      const phdStudent = model.createRole();
      model.createGeneralization(agent, person);
      model.createGeneralization(person, student);
      model.createGeneralization(student, phdStudent);
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
      const agent = model.createMixin();
      const person = model.createKind();
      const student = model.createRole();
      const phdStudent = model.createRole();
      model.createGeneralization(agent, person);
      model.createGeneralization(person, student);
      model.createGeneralization(student, phdStudent);
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
      const agent = model.createCategory();
      const person = model.createKind();
      const student = model.createRole();
      const phdStudent = model.createRole();
      model.createGeneralization(agent, person);
      model.createGeneralization(person, student);
      model.createGeneralization(student, phdStudent);
      const phdStudentAncestors = phdStudent.getAntiRigidAncestors();

      expect(phdStudentAncestors).toContain(student);
      expect(phdStudentAncestors.length).toBe(1);
      expect(agent.getAntiRigidAncestors().length).toBe(0);
      expect(person.getAntiRigidAncestors().length).toBe(0);
      expect(student.getAntiRigidAncestors().length).toBe(0);
    });
  });
});
