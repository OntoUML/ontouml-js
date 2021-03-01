import { Package, Project } from '@libs/ontouml';
import { OntoumlVerification } from '@libs/verification';

describe(`${OntoumlVerification.name} tests`, () => {
  describe(`${OntoumlVerification.name}.${OntoumlVerification.prototype.run.name}() test`, () => {
    it('Verification of empty projects should not throw exceptions', () => {
      const service = new OntoumlVerification(new Project());
      expect(() => service.run()).not.toThrow();
    });

    it('Verification of model elements should not throw exceptions', () => {
      const service = new OntoumlVerification(new Package());
      expect(() => service.run()).not.toThrow();
    });

    it('Verification of consistent models should not return issues', () => {
      const model = new Project().createModel();
      const service = new OntoumlVerification(model);

      model.createGeneralization(model.createKind(), model.createSubkind());

      expect(service.run().result.length).toBe(0);
    });

    it('Verification of inconsistent models should return issues', () => {
      const model = new Project().createModel();
      const service = new OntoumlVerification(model);

      model.createGeneralization(model.createSubkind(), model.createKind());

      expect(service.run().result.length).toBeGreaterThan(0);
    });

    it('Successive verifications can yield different results', () => {
      const model = new Project().createModel();
      const service = new OntoumlVerification(model);

      model.createGeneralization(model.createKind(), model.createSubkind());
      const issueBeforeChange = service.run();
      model.createGeneralization(model.createSubkind(), model.createKind());
      const issueAfterChange = service.run();

      expect(issueBeforeChange.result.length).not.toBe(issueAfterChange.result.length);
    });

    it('Verifying a fully-featured model should not throw exceptions', () => {
      const project = new Project();
      const model = project.createModel();

      project.setName('Project');
      model.setName('Model');

      const agent = model.createCategory('Agent');
      const person = model.createKind('Person');
      const organization = model.createKind('Organization');
      const text = model.createDatatype('Text');
      const status = model.createEnumeration('Status');

      status.createLiteral('Active');
      status.createLiteral('Inactive');
      agent.createAttribute(text, 'name');
      agent.createAttribute(status, 'status');
      person.createAttribute(text, 'surname');

      model.createMaterialRelation(person, organization, 'works-for');

      const agentIntoPerson = model.createGeneralization(agent, person, 'agentIntoPerson');
      const agentIntoOrganization = model.createGeneralization(agent, organization, 'agentIntoOrganization');

      model.createPartition([agentIntoPerson, agentIntoOrganization], null, 'agentsSet');

      expect(() => new OntoumlVerification(model).run()).not.toThrow();
    });
  });
});
