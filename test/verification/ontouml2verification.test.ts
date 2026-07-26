import { Nature, Package, Project } from '../../src';
import { OntoumlVerification } from '../../src';

function createSubkind(model: Package) {
  // The old factories assigned the functional complex nature to subkinds by default;
  // the new subkind builder assigns no nature, so it is set explicitly here.
  return model
    .classBuilder()
    .subkind()
    .restrictedTo(Nature.FUNCTIONAL_COMPLEX)
    .build();
}

describe(`${OntoumlVerification.name} tests`, () => {
  describe(`${OntoumlVerification.name}.${OntoumlVerification.prototype.run.name}() test`, () => {
    it('Verification of empty projects should not throw exceptions', () => {
      const service = new OntoumlVerification(new Project());
      expect(() => service.run()).not.toThrow();
    });

    it('Verification of model elements should not throw exceptions', () => {
      const service = new OntoumlVerification(
        new Project().packageBuilder().build()
      );
      expect(() => service.run()).not.toThrow();
    });

    it('Verification of consistent models should not return issues', () => {
      const model = new Project().packageBuilder().root().build();
      const service = new OntoumlVerification(model);

      const kind = model.classBuilder().kind().build();
      const subkind = createSubkind(model);
      model.generalizationBuilder().general(kind).specific(subkind).build();

      expect(service.run().result.length).toBe(0);
    });

    it('Verification of inconsistent models should return issues', () => {
      const model = new Project().packageBuilder().root().build();
      const service = new OntoumlVerification(model);

      const subkind = createSubkind(model);
      const kind = model.classBuilder().kind().build();
      model.generalizationBuilder().general(subkind).specific(kind).build();

      expect(service.run().result.length).toBeGreaterThan(0);
    });

    it('Successive verifications can yield different results', () => {
      const model = new Project().packageBuilder().root().build();
      const service = new OntoumlVerification(model);

      const kind = model.classBuilder().kind().build();
      const subkind = createSubkind(model);
      model.generalizationBuilder().general(kind).specific(subkind).build();
      const issueBeforeChange = service.run();

      const anotherSubkind = createSubkind(model);
      const anotherKind = model.classBuilder().kind().build();
      model
        .generalizationBuilder()
        .general(anotherSubkind)
        .specific(anotherKind)
        .build();
      const issueAfterChange = service.run();

      expect(issueBeforeChange.result.length).not.toBe(
        issueAfterChange.result.length
      );
    });

    it('Verifying a fully-featured model should not throw exceptions', () => {
      const project = new Project();
      project.name.add('Project');

      const model = project.packageBuilder().root().name('Model').build();

      const agent = model.classBuilder().category().name('Agent').build();
      const person = model.classBuilder().kind().name('Person').build();
      const organization = model
        .classBuilder()
        .kind()
        .name('Organization')
        .build();
      const text = model.classBuilder().datatype().name('Text').build();
      const status = model.classBuilder().enumeration().name('Status').build();

      status.literalBuilder().name('Active').build();
      status.literalBuilder().name('Inactive').build();
      agent.propertyBuilder().type(text).name('name').build();
      agent.propertyBuilder().type(status).name('status').build();
      person.propertyBuilder().type(text).name('surname').build();

      model
        .binaryRelationBuilder()
        .material()
        .source(person)
        .target(organization)
        .name('works-for')
        .build();

      const agentIntoPerson = model
        .generalizationBuilder()
        .general(agent)
        .specific(person)
        .name('agentIntoPerson')
        .build();
      const agentIntoOrganization = model
        .generalizationBuilder()
        .general(agent)
        .specific(organization)
        .name('agentIntoOrganization')
        .build();

      model
        .generalizationSetBuilder()
        .partition()
        .generalizations(agentIntoPerson, agentIntoOrganization)
        .name('agentsSet')
        .build();

      expect(() => new OntoumlVerification(model).run()).not.toThrow();
    });
  });
});
