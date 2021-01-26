import { Package, Project } from '@libs/ontouml';
import { OntoumlVerification } from '@libs/verification';

describe(`${OntoumlVerification.name} tests`, () => {
  describe(`${OntoumlVerification.prototype.run.name} test`, () => {
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

      expect(service.run().length).toBe(0);
    });

    it('Verification of inconsistent models should return issues', () => {
      const model = new Project().createModel();
      const service = new OntoumlVerification(model);

      model.createGeneralization(model.createSubkind(), model.createKind());

      expect(service.run().length).toBeGreaterThan(0);
    });

    it('Successive verifications can yield different results', () => {
      const model = new Project().createModel();
      const service = new OntoumlVerification(model);

      model.createGeneralization(model.createKind(), model.createSubkind());
      const issueBeforeChange = service.run();
      model.createGeneralization(model.createSubkind(), model.createKind());
      const issueAfterChange = service.run();

      expect(issueBeforeChange.length).not.toBe(issueAfterChange.length);
    });
  });
});
