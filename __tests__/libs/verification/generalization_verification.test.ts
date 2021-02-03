import { Class, Generalization, Package, Relation } from '@libs/ontouml';
import { GeneralizationVerification, VerificationIssueCode } from '@libs/verification';

describe(`${GeneralizationVerification.name} tests`, () => {
  describe(`Test GeneralizationVerification.${GeneralizationVerification.verifyGeneralization.name}`, () => {});

  describe(`Test GeneralizationVerification.${GeneralizationVerification.checkMinimalConsistency.name}`, () => {
    it(`Generalizations between a class and a relation must raise the issue '${VerificationIssueCode.generalization_incompatible_general_and_specific_types}'`, () => {
      const _class = new Class();
      const relation = new Relation();
      const generalization = new Generalization({ general: _class, specific: relation });
      const issues = GeneralizationVerification.checkMinimalConsistency(generalization);

      expect(issues[0]).toMatchObject({ code: VerificationIssueCode.generalization_incompatible_general_and_specific_types });
    });

    it(`Circular generalizations must raise the issue '${VerificationIssueCode.generalization_circular}'`, () => {
      const model = new Package();
      const _class = model.createClass();
      const generalization = model.createGeneralization(_class, _class);
      const issues = GeneralizationVerification.checkMinimalConsistency(generalization);

      expect(issues[0]).toMatchObject({ code: VerificationIssueCode.generalization_circular });
    });
  });

  describe(`Test GeneralizationVerification.${GeneralizationVerification.checkGeneralizationSortality.name}`, () => {
    it(`Generalizations of non-sortal classes into sortal classes must raise the issue '${VerificationIssueCode.generalization_incompatible_class_sortality}'`, () => {
      const model = new Package();
      const person = model.createKind();
      const agent = model.createCategory();
      const generalization = model.createGeneralization(person, agent);
      const issue = GeneralizationVerification.checkGeneralizationSortality(generalization);

      expect(issue).toMatchObject({ code: VerificationIssueCode.generalization_incompatible_class_sortality });
    });
  });

  describe(`Test GeneralizationVerification.${GeneralizationVerification.checkGeneralizationRigidity.name}`, () => {
    it(`Generalizations of rigid and semi-rigid classes into anti-rigid classes must raise the issue '${VerificationIssueCode.generalization_incompatible_class_rigidity}'`, () => {
      const model = new Package();
      const animal = model.createCategory();
      const adultAnimal = model.createPhaseMixin();
      const socialLeader = model.createMixin();
      const generalizationOne = model.createGeneralization(adultAnimal, animal);
      const generalizationTwo = model.createGeneralization(adultAnimal, socialLeader);

      expect(GeneralizationVerification.checkGeneralizationRigidity(generalizationOne)).toMatchObject({
        code: VerificationIssueCode.generalization_incompatible_class_rigidity
      });
      expect(GeneralizationVerification.checkGeneralizationRigidity(generalizationTwo)).toMatchObject({
        code: VerificationIssueCode.generalization_incompatible_class_rigidity
      });
    });
  });

  describe(`Test GeneralizationVerification.${GeneralizationVerification.checkGeneralizationDatatype.name}`, () => {
    it(`Generalizations involving datatypes and non-datatypes must raise the issue '${VerificationIssueCode.generalization_incompatible_datatype}'`, () => {
      const model = new Package();
      const object = model.createCategory();
      const weight = model.createDatatype();
      const color = model.createDatatype();
      const generalizationOne = model.createGeneralization(object, weight);
      const generalizationTwo = model.createGeneralization(color, object);

      expect(GeneralizationVerification.checkGeneralizationDatatype(generalizationOne)).toMatchObject({
        code: VerificationIssueCode.generalization_incompatible_datatype
      });
      expect(GeneralizationVerification.checkGeneralizationDatatype(generalizationTwo)).toMatchObject({
        code: VerificationIssueCode.generalization_incompatible_datatype
      });
    });
  });

  describe(`Test GeneralizationVerification.${GeneralizationVerification.checkGeneralizationEnumeration.name}`, () => {
    it(`Generalizations involving enumerations and non-enumerations must raise the issue '${VerificationIssueCode.generalization_incompatible_enumeration}'`, () => {
      const model = new Package();
      const person = model.createCategory();
      const ageStatus = model.createEnumeration();
      const wealthTier = model.createEnumeration();
      const generalizationOne = model.createGeneralization(person, ageStatus);
      const generalizationTwo = model.createGeneralization(wealthTier, person);

      expect(GeneralizationVerification.checkGeneralizationEnumeration(generalizationOne)).toMatchObject({
        code: VerificationIssueCode.generalization_incompatible_enumeration
      });
      expect(GeneralizationVerification.checkGeneralizationEnumeration(generalizationTwo)).toMatchObject({
        code: VerificationIssueCode.generalization_incompatible_enumeration
      });
    });
  });

  describe(`Test GeneralizationVerification.${GeneralizationVerification.checkGeneralizationCompatibleNatures.name}`, () => {
    it(`Generalizations where the restrictedTo value of the specific is not included in the general class must raise the issue '${VerificationIssueCode.generalization_incompatible_natures}'`, () => {
      const model = new Package();
      const person = model.createCategory();
      const event = model.createEvent();
      const generalization = model.createGeneralization(person, event);

      expect(GeneralizationVerification.checkGeneralizationCompatibleNatures(generalization)).toMatchObject({
        code: VerificationIssueCode.generalization_incompatible_natures
      });
    });
  });
});
