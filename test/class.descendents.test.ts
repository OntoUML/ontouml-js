import { describe, expect, it, beforeEach } from '@jest/globals';
import { Class, Package, Project } from '../src';

describe('Test class ancestors-related query methods', () => {
  let project: Project;
  let model: Package;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

  describe(`Test ${Class.prototype.getChildren.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createClass();
      const person = model.createClass();
      model.createGeneralization(agent, person);

      expect(agent.getChildren().length).toBe(1);
    });
  });

  describe(`Test ${Class.prototype.getDescendants.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createClass();
      const person = model.createClass();
      model.createGeneralization(agent, person);

      expect(agent.getDescendants().length).toBe(1);
    });
  });

  describe(`Test ${Class.prototype.getFilteredDescendants.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createClass();
      const person = model.createClass();
      const passFilter = () => true;
      model.createGeneralization(agent, person);

      expect(agent.getFilteredDescendants(passFilter).length).toBe(1);
    });
  });

  describe(`Test ${Class.prototype.getUltimateSortalsDescendants.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createCategory();
      const person = model.createKind();
      const student = model.createRole();
      model.createGeneralization(agent, person);
      model.createGeneralization(person, student);
      const agentDescendants = agent.getUltimateSortalsDescendants();

      expect(agentDescendants).toContain(person);
      expect(agentDescendants.length).toBe(1);
      expect(person.getUltimateSortalsDescendants().length).toBe(0);
      expect(student.getUltimateSortalsDescendants().length).toBe(0);
    });
  });

  describe(`Test ${Class.prototype.getSortalDescendants.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createCategory();
      const person = model.createKind();
      const student = model.createRole();
      model.createGeneralization(agent, person);
      model.createGeneralization(person, student);
      const agentDescendants = agent.getSortalDescendants();

      expect(agentDescendants).toContain(person);
      expect(agentDescendants).toContain(student);
      expect(agentDescendants.length).toBe(2);
      expect(person.getSortalDescendants().length).toBe(1);
      expect(student.getSortalDescendants().length).toBe(0);
    });
  });

  describe(`Test ${Class.prototype.getBaseSortalDescendants.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createCategory();
      const person = model.createKind();
      const student = model.createRole();
      model.createGeneralization(agent, person);
      model.createGeneralization(person, student);
      const agentDescendants = agent.getBaseSortalDescendants();

      expect(agentDescendants).toContain(student);
      expect(agentDescendants.length).toBe(1);
      expect(person.getBaseSortalDescendants().length).toBe(1);
      expect(student.getBaseSortalDescendants().length).toBe(0);
    });
  });

  describe(`Test ${Class.prototype.getNonSortalDescendants.name}()`, () => {
    it('Test function call', () => {
      const entity = model.createCategory();
      const agent = model.createCategory();
      const person = model.createKind();
      const student = model.createRole();
      model.createGeneralization(entity, agent);
      model.createGeneralization(agent, person);
      model.createGeneralization(person, student);
      const entityDescendants = entity.getNonSortalDescendants();

      expect(entityDescendants).toContain(agent);
      expect(entityDescendants.length).toBe(1);
      expect(agent.getNonSortalDescendants().length).toBe(0);
      expect(person.getNonSortalDescendants().length).toBe(0);
      expect(student.getNonSortalDescendants().length).toBe(0);
    });
  });

  describe(`Test ${Class.prototype.getRigidDescendants.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createCategory();
      const person = model.createKind();
      const student = model.createRole();
      model.createGeneralization(agent, person);
      model.createGeneralization(person, student);
      const agentDescendants = agent.getRigidDescendants();

      expect(agentDescendants).toContain(person);
      expect(agentDescendants.length).toBe(1);
      expect(person.getRigidDescendants().length).toBe(0);
      expect(student.getRigidDescendants().length).toBe(0);
    });
  });

  describe(`Test ${Class.prototype.getSemiRigidDescendants.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createCategory();
      const diplomaticAgent = model.createMixin();
      const person = model.createKind();
      const student = model.createRole();
      model.createGeneralization(agent, person);
      model.createGeneralization(agent, diplomaticAgent);
      model.createGeneralization(person, student);
      const agentDescendants = agent.getSemiRigidDescendants();

      expect(agentDescendants).toContain(diplomaticAgent);
      expect(agentDescendants.length).toBe(1);
      expect(person.getSemiRigidDescendants().length).toBe(0);
      expect(student.getSemiRigidDescendants().length).toBe(0);
    });
  });

  describe(`Test ${Class.prototype.getAntiRigidDescendants.name}()`, () => {
    it('Test function call', () => {
      const agent = model.createCategory();
      const person = model.createKind();
      const student = model.createRole();
      model.createGeneralization(agent, person);
      model.createGeneralization(person, student);
      const agentDescendants = agent.getAntiRigidDescendants();

      expect(agentDescendants).toContain(student);
      expect(agentDescendants.length).toBe(1);
      expect(person.getAntiRigidDescendants().length).toBe(1);
      expect(student.getAntiRigidDescendants().length).toBe(0);
    });
  });
});
