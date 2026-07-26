import { ClassStereotype, Nature, Package, Project } from '../../src';
import { ClassVerification, VerificationIssueCode } from '../../src';

function createModel(): Package {
  return new Project().packageBuilder().root().build();
}

describe(`${ClassVerification.name} tests`, () => {
  describe(`Test ClassVerification.${ClassVerification.verifyClass.name}`, () => {
    it(`Class verification stops when minimal check raises issues, but continues additional verification otherwise.`, () => {
      const model = createModel();
      const stereotypelessClass = model.classBuilder().build();
      const issuesOfStereotypeless =
        ClassVerification.verifyClass(stereotypelessClass);

      expect(issuesOfStereotypeless).toHaveLength(1);
      expect(issuesOfStereotypeless[0]).toMatchObject({
        code: VerificationIssueCode.class_not_unique_stereotype
      });

      // The old factories assigned the functional complex nature to subkinds by default;
      // the new subkind builder assigns no nature, so it is set explicitly here.
      const agent = model
        .classBuilder()
        .subkind()
        .restrictedTo(Nature.FUNCTIONAL_COMPLEX)
        .build();
      const agentType = model.classBuilder().type().build();
      const issuesOfAgent = ClassVerification.verifyClass(agent);
      const issuesOfAgentType = ClassVerification.verifyClass(agentType);

      expect(issuesOfAgent).toHaveLength(1);
      expect(issuesOfAgent[0]).toMatchObject({
        code: VerificationIssueCode.class_missing_identity_provider
      });
      expect(issuesOfAgentType).toHaveLength(0);
    });
  });

  describe(`Test ClassVerification.${ClassVerification.checkMinimalConsistency.name}`, () => {
    it(`Classes without stereotype must raise the issue '${VerificationIssueCode.class_not_unique_stereotype}'`, () => {
      const stereotypelessClass = createModel().classBuilder().build();
      const issues =
        ClassVerification.checkMinimalConsistency(stereotypelessClass);

      expect(issues[0]).toMatchObject({
        code: VerificationIssueCode.class_not_unique_stereotype
      });
    });

    it(`Classes with unknown stereotypes must raise the issue '${VerificationIssueCode.class_invalid_ontouml_stereotype}'`, () => {
      const irregularStereotypeClass = createModel()
        .classBuilder()
        .stereotype('asd')
        .build();
      const issues = ClassVerification.checkMinimalConsistency(
        irregularStereotypeClass
      );

      expect(issues[0]).toMatchObject({
        code: VerificationIssueCode.class_invalid_ontouml_stereotype
      });
    });

    it(`Classes with «enumeration» stereotype that contain properties must raise the issue '${VerificationIssueCode.class_enumeration_with_properties}'`, () => {
      const enumeration = createModel().classBuilder().enumeration().build();
      enumeration.propertyBuilder().build();

      const issues = ClassVerification.checkMinimalConsistency(enumeration);

      expect(issues[0]).toMatchObject({
        code: VerificationIssueCode.class_enumeration_with_properties
      });
    });

    it(`Classes with stereotypes distinct from «enumeration» and that contain literals must raise the issue '${VerificationIssueCode.class_non_enumeration_with_literals}'`, () => {
      // The new builders make it impossible to add a literal to a non-enumeration,
      // so the state is reached by re-stereotyping an enumeration that owns a literal.
      const datatype = createModel().classBuilder().enumeration().build();
      datatype.literalBuilder().build();
      datatype.stereotype = ClassStereotype.DATATYPE;

      const issues = ClassVerification.checkMinimalConsistency(datatype);

      expect(issues[0]).toMatchObject({
        code: VerificationIssueCode.class_non_enumeration_with_literals
      });
    });

    it(`Classes and enumerations with regular stereotypes and proper property/literal declarations should raise no issues on minimal checks.`, () => {
      const model = createModel();
      const person = model.classBuilder().kind().build();
      const enumeration = model.classBuilder().enumeration().build();

      person.propertyBuilder().type(person).build();
      enumeration.literalBuilder().build();

      expect(ClassVerification.checkMinimalConsistency(person)).toHaveLength(0);
      expect(
        ClassVerification.checkMinimalConsistency(enumeration)
      ).toHaveLength(0);
    });
  });

  describe(`Test ClassVerification.${ClassVerification.checkKindSpecialization.name}`, () => {
    it(`Ultimate sortals that specialize other ultimate sortals must raise the issue '${VerificationIssueCode.class_identity_provider_specialization}'`, () => {
      const model = createModel();
      const person = model.classBuilder().kind().build();
      const organization = model.classBuilder().kind().build();

      model
        .generalizationBuilder()
        .general(person)
        .specific(organization)
        .build();

      const issue = ClassVerification.checkKindSpecialization(organization);

      expect(issue).toMatchObject({
        code: VerificationIssueCode.class_identity_provider_specialization
      });
    });

    it(`Sortals that specialize multiple ultimate sortals must raise the issue '${VerificationIssueCode.class_multiple_identity_providers}'`, () => {
      const model = createModel();
      const person = model.classBuilder().kind().build();
      const organization = model.classBuilder().kind().build();
      const agent = model
        .classBuilder()
        .subkind()
        .restrictedTo(Nature.FUNCTIONAL_COMPLEX)
        .build();

      model
        .generalizationBuilder()
        .general(organization)
        .specific(agent)
        .build();
      model.generalizationBuilder().general(person).specific(agent).build();

      const issue = ClassVerification.checkKindSpecialization(agent);

      expect(issue).toMatchObject({
        code: VerificationIssueCode.class_multiple_identity_providers
      });
    });

    it(`Sortals that specialize no ultimate sortals must raise the issue '${VerificationIssueCode.class_missing_identity_provider}'`, () => {
      const model = createModel();
      const agent = model
        .classBuilder()
        .subkind()
        .restrictedTo(Nature.FUNCTIONAL_COMPLEX)
        .build();
      const issue = ClassVerification.checkKindSpecialization(agent);

      expect(issue).toMatchObject({
        code: VerificationIssueCode.class_missing_identity_provider
      });
    });

    it(`Properly defined sortals must not raise issues regarding identity`, () => {
      const model = createModel();
      const agent = model.classBuilder().category().build();
      const person = model.classBuilder().kind().build();
      const organization = model.classBuilder().kind().build();
      const forProfitOrganization = model
        .classBuilder()
        .subkind()
        .restrictedTo(Nature.FUNCTIONAL_COMPLEX)
        .build();
      const native = model
        .classBuilder()
        .subkind()
        .restrictedTo(Nature.FUNCTIONAL_COMPLEX)
        .build();

      model
        .generalizationBuilder()
        .general(agent)
        .specific(organization)
        .build();
      model
        .generalizationBuilder()
        .general(organization)
        .specific(forProfitOrganization)
        .build();
      model.generalizationBuilder().general(agent).specific(person).build();
      model.generalizationBuilder().general(person).specific(native).build();

      expect(ClassVerification.checkKindSpecialization(agent)).toBeNull();
      expect(ClassVerification.checkKindSpecialization(person)).toBeNull();
      expect(
        ClassVerification.checkKindSpecialization(organization)
      ).toBeNull();
      expect(
        ClassVerification.checkKindSpecialization(forProfitOrganization)
      ).toBeNull();
      expect(ClassVerification.checkKindSpecialization(native)).toBeNull();
    });
  });

  describe(`Test ClassVerification.${ClassVerification.checkCompatibleNatures.name}`, () => {
    it(`Classes with mismatching stereotype/restrictedTo values must raise the issue '${VerificationIssueCode.class_incompatible_natures}'`, () => {
      const model = createModel();
      const category = model
        .classBuilder()
        .category()
        .restrictedTo(Nature.ABSTRACT)
        .build();

      expect(ClassVerification.checkCompatibleNatures(category)).toMatchObject({
        code: VerificationIssueCode.class_incompatible_natures
      });
    });
  });

  describe(`Test ClassVerification.${ClassVerification.checkMissingNatures.name}`, () => {
    it(`Classes with no restrictedTo value must raise the issue '${VerificationIssueCode.class_missing_nature_restrictions}'`, () => {
      const model = createModel();
      const _class = model.classBuilder().category().build();
      _class.restrictedTo = [];

      expect(ClassVerification.checkMissingNatures(_class)).toMatchObject({
        code: VerificationIssueCode.class_missing_nature_restrictions
      });
    });
  });

  // The 'class_missing_is_extensional' rule was dropped in this port: the new
  // ontouml-js metamodel does not include the 'isExtensional' meta-property on
  // classes, so the flagged state is no longer representable. See the "Porting
  // notes" section of the README.
  describe(`Test ClassVerification.checkMissingIsExtensional (dropped)`, () => {
    it.skip(`Endurant classes with no isExtensional value must raise the issue '${VerificationIssueCode.class_missing_is_extensional}'`, () => {
      // Unportable: Class no longer has an 'isExtensional' field.
    });
  });

  describe(`Test ClassVerification.${ClassVerification.checkMissingIsPowertype.name}`, () => {
    it(`Higher-order classes with no isPowertype value must raise the issue '${VerificationIssueCode.class_missing_is_powertype}'`, () => {
      const model = createModel();
      const _class = model.classBuilder().type().build();
      // The new API types 'isPowertype' as a plain boolean, but the unassigned
      // state remains reachable through direct mutation or deserialization.
      (_class as any).isPowertype = null;

      expect(ClassVerification.checkMissingIsPowertype(_class)).toMatchObject({
        code: VerificationIssueCode.class_missing_is_powertype
      });
    });
  });

  describe(`Test ClassVerification.${ClassVerification.checkMissingOrder.name}`, () => {
    it(`Higher-order classes with no order value must raise the issue '${VerificationIssueCode.class_missing_order}'`, () => {
      const model = createModel();
      const _class = model.classBuilder().type().build();
      // The 'order' setter of the new API rejects null, but the unassigned state
      // remains reachable through direct mutation or deserialization.
      (_class as any)._order = null;

      expect(ClassVerification.checkMissingOrder(_class)).toMatchObject({
        code: VerificationIssueCode.class_missing_order
      });
    });
  });
});
