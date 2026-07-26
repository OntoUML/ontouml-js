import { Generalization, Package, Project } from '../../src';
import { GeneralizationVerification, VerificationIssueCode } from '../../src';

function createModel(): Package {
  return new Project().packageBuilder().root().build();
}

describe(`${GeneralizationVerification.name} tests`, () => {
  describe(`Test GeneralizationVerification.${GeneralizationVerification.verifyGeneralization.name}`, () => {});

  describe(`Test GeneralizationVerification.${GeneralizationVerification.checkMinimalConsistency.name}`, () => {
    it(`Generalizations between a class and a relation must raise the issue '${VerificationIssueCode.generalization_incompatible_general_and_specific_types}'`, () => {
      const model = createModel();
      const _class = model.classBuilder().build();
      const source = model.classBuilder().build();
      const target = model.classBuilder().build();
      const relation = model
        .binaryRelationBuilder()
        .source(source)
        .target(target)
        .build();
      const generalization = model
        .generalizationBuilder()
        .general(_class)
        .specific(relation)
        .build();
      const issues =
        GeneralizationVerification.checkMinimalConsistency(generalization);

      expect(issues[0]).toMatchObject({
        code: VerificationIssueCode.generalization_incompatible_general_and_specific_types
      });
    });

    it(`Circular generalizations must raise the issue '${VerificationIssueCode.generalization_circular}'`, () => {
      const project = new Project();
      const model = project.packageBuilder().root().build();
      const _class = model.classBuilder().build();
      // The new GeneralizationBuilder rejects self-specializations, but the state
      // remains representable through direct construction or deserialization.
      const generalization = new Generalization(project, _class, _class);
      const issues =
        GeneralizationVerification.checkMinimalConsistency(generalization);

      expect(issues[0]).toMatchObject({
        code: VerificationIssueCode.generalization_circular
      });
    });
  });

  describe(`Test GeneralizationVerification.${GeneralizationVerification.checkGeneralizationSortality.name}`, () => {
    it(`Generalizations of non-sortal classes into sortal classes must raise the issue '${VerificationIssueCode.generalization_incompatible_class_sortality}'`, () => {
      const model = createModel();
      const person = model.classBuilder().kind().build();
      const agent = model.classBuilder().category().build();
      const generalization = model
        .generalizationBuilder()
        .general(person)
        .specific(agent)
        .build();
      const issue =
        GeneralizationVerification.checkGeneralizationSortality(generalization);

      expect(issue).toMatchObject({
        code: VerificationIssueCode.generalization_incompatible_class_sortality
      });
    });
  });

  describe(`Test GeneralizationVerification.${GeneralizationVerification.checkGeneralizationRigidity.name}`, () => {
    it(`Generalizations of rigid and semi-rigid classes into anti-rigid classes must raise the issue '${VerificationIssueCode.generalization_incompatible_class_rigidity}'`, () => {
      const model = createModel();
      const animal = model.classBuilder().category().build();
      const adultAnimal = model.classBuilder().phaseMixin().build();
      const socialLeader = model.classBuilder().mixin().build();
      const generalizationOne = model
        .generalizationBuilder()
        .general(adultAnimal)
        .specific(animal)
        .build();
      const generalizationTwo = model
        .generalizationBuilder()
        .general(adultAnimal)
        .specific(socialLeader)
        .build();

      expect(
        GeneralizationVerification.checkGeneralizationRigidity(
          generalizationOne
        )
      ).toMatchObject({
        code: VerificationIssueCode.generalization_incompatible_class_rigidity
      });
      expect(
        GeneralizationVerification.checkGeneralizationRigidity(
          generalizationTwo
        )
      ).toMatchObject({
        code: VerificationIssueCode.generalization_incompatible_class_rigidity
      });
    });
  });

  describe(`Test GeneralizationVerification.${GeneralizationVerification.checkGeneralizationDatatype.name}`, () => {
    it(`Generalizations involving datatypes and non-datatypes must raise the issue '${VerificationIssueCode.generalization_incompatible_datatype}'`, () => {
      const model = createModel();
      const object = model.classBuilder().category().build();
      const weight = model.classBuilder().datatype().build();
      const color = model.classBuilder().datatype().build();
      const generalizationOne = model
        .generalizationBuilder()
        .general(object)
        .specific(weight)
        .build();
      const generalizationTwo = model
        .generalizationBuilder()
        .general(color)
        .specific(object)
        .build();

      expect(
        GeneralizationVerification.checkGeneralizationDatatype(
          generalizationOne
        )
      ).toMatchObject({
        code: VerificationIssueCode.generalization_incompatible_datatype
      });
      expect(
        GeneralizationVerification.checkGeneralizationDatatype(
          generalizationTwo
        )
      ).toMatchObject({
        code: VerificationIssueCode.generalization_incompatible_datatype
      });
    });
  });

  describe(`Test GeneralizationVerification.${GeneralizationVerification.checkGeneralizationEnumeration.name}`, () => {
    it(`Generalizations involving enumerations and non-enumerations must raise the issue '${VerificationIssueCode.generalization_incompatible_enumeration}'`, () => {
      const model = createModel();
      const person = model.classBuilder().category().build();
      const ageStatus = model.classBuilder().enumeration().build();
      const wealthTier = model.classBuilder().enumeration().build();
      const generalizationOne = model
        .generalizationBuilder()
        .general(person)
        .specific(ageStatus)
        .build();
      const generalizationTwo = model
        .generalizationBuilder()
        .general(wealthTier)
        .specific(person)
        .build();

      expect(
        GeneralizationVerification.checkGeneralizationEnumeration(
          generalizationOne
        )
      ).toMatchObject({
        code: VerificationIssueCode.generalization_incompatible_enumeration
      });
      expect(
        GeneralizationVerification.checkGeneralizationEnumeration(
          generalizationTwo
        )
      ).toMatchObject({
        code: VerificationIssueCode.generalization_incompatible_enumeration
      });
    });
  });

  describe(`Test GeneralizationVerification.${GeneralizationVerification.checkGeneralizationCompatibleNatures.name}`, () => {
    it(`Generalizations where the restrictedTo value of the specific is not included in the general class must raise the issue '${VerificationIssueCode.generalization_incompatible_natures}'`, () => {
      const model = createModel();
      const person = model.classBuilder().category().build();
      const event = model.classBuilder().event().build();
      const generalization = model
        .generalizationBuilder()
        .general(person)
        .specific(event)
        .build();

      expect(
        GeneralizationVerification.checkGeneralizationCompatibleNatures(
          generalization
        )
      ).toMatchObject({
        code: VerificationIssueCode.generalization_incompatible_natures
      });
    });
  });
});
