import { Class, Property, ClassStereotype, Literal, Package, OntologicalNature } from '@libs/ontouml';
import { ClassVerification, VerificationIssueCode } from '@libs/verification';

describe(`${ClassVerification.name} tests`, () => {
  describe(`Test ClassVerification.${ClassVerification.verifyClass.name}`, () => {
    it(`Class verification stops when minimal check raises issues, but continues additional verification otherwise.`, () => {
      const stereotypelessClass = new Class();
      const issuesOfStereotypeless = ClassVerification.verifyClass(stereotypelessClass);

      expect(issuesOfStereotypeless).toHaveLength(1);
      expect(issuesOfStereotypeless[0]).toMatchObject({ code: VerificationIssueCode.class_not_unique_stereotype });

      const model = new Package();
      const agent = model.createSubkind();
      const agentType = model.createType();
      const issuesOfAgent = ClassVerification.verifyClass(agent);
      const issuesOfAgentType = ClassVerification.verifyClass(agentType);

      expect(issuesOfAgent).toHaveLength(1);
      expect(issuesOfAgent[0]).toMatchObject({ code: VerificationIssueCode.class_missing_identity_provider });
      expect(issuesOfAgentType).toHaveLength(0);
    });
  });

  describe(`Test ClassVerification.${ClassVerification.checkMinimalConsistency.name}`, () => {
    it(`Classes without stereotype must raise the issue '${VerificationIssueCode.class_not_unique_stereotype}'`, () => {
      const stereotypelessClass = new Class();
      const issues = ClassVerification.checkMinimalConsistency(stereotypelessClass);

      expect(issues[0]).toMatchObject({ code: VerificationIssueCode.class_not_unique_stereotype });
    });

    it(`Classes with unknown stereotypes must raise the issue '${VerificationIssueCode.class_invalid_ontouml_stereotype}'`, () => {
      const irregularStereotypeClass = new Class({ stereotype: 'asd' } as any);
      const issues = ClassVerification.checkMinimalConsistency(irregularStereotypeClass);

      expect(issues[0]).toMatchObject({ code: VerificationIssueCode.class_invalid_ontouml_stereotype });
    });

    it(`Classes with «enumeration» stereotype that contain properties must raise the issue '${VerificationIssueCode.class_enumeration_with_properties}'`, () => {
      const enumeration = new Class({
        stereotype: ClassStereotype.ENUMERATION,
        properties: [new Property()]
      });
      const issues = ClassVerification.checkMinimalConsistency(enumeration);

      expect(issues[0]).toMatchObject({ code: VerificationIssueCode.class_enumeration_with_properties });
    });

    it(`Classes with stereotypes distinct from «enumeration» and that contain literals must raise the issue '${VerificationIssueCode.class_non_enumeration_with_literals}'`, () => {
      const datatype = new Class({
        stereotype: ClassStereotype.DATATYPE,
        literals: [new Literal()]
      });
      const issues = ClassVerification.checkMinimalConsistency(datatype);

      expect(issues[0]).toMatchObject({ code: VerificationIssueCode.class_non_enumeration_with_literals });
    });

    it(`Classes and enumerations with regular stereotypes and proper property/literal declarations should raise no issues on minimal checks.`, () => {
      const model = new Package();
      const person = model.createKind();
      const enumeration = model.createEnumeration();

      person.createAttribute(person);
      enumeration.createLiteral();

      expect(ClassVerification.checkMinimalConsistency(person)).toHaveLength(0);
      expect(ClassVerification.checkMinimalConsistency(enumeration)).toHaveLength(0);
    });
  });

  describe(`Test ClassVerification.${ClassVerification.checkKindSpecialization.name}`, () => {
    it(`Ultimate sortals that specialize other ultimate sortals must raise the issue '${VerificationIssueCode.class_identity_provider_specialization}'`, () => {
      const model = new Package();
      const person = model.createKind();
      const organization = model.createKind();

      model.createGeneralization(person, organization);

      const issue = ClassVerification.checkKindSpecialization(organization);

      expect(issue).toMatchObject({ code: VerificationIssueCode.class_identity_provider_specialization });
    });

    it(`Ultimate sortals that specialize other ultimate sortals must raise the issue '${VerificationIssueCode.class_identity_provider_specialization}'`, () => {
      const model = new Package();
      const person = model.createKind();
      const organization = model.createKind();
      const agent = model.createSubkind();

      model.createGeneralization(organization, agent);
      model.createGeneralization(person, agent);

      const issue = ClassVerification.checkKindSpecialization(agent);

      expect(issue).toMatchObject({ code: VerificationIssueCode.class_multiple_identity_providers });
    });

    it(`Sortals that specialize no ultimate sortals must raise the issue '${VerificationIssueCode.class_missing_identity_provider}'`, () => {
      const model = new Package();
      const agent = model.createSubkind();
      const issue = ClassVerification.checkKindSpecialization(agent);

      expect(issue).toMatchObject({ code: VerificationIssueCode.class_missing_identity_provider });
    });

    it(`Properly defined sortals must not raise issues regarding identity`, () => {
      const model = new Package();
      const agent = model.createCategory();
      const person = model.createKind();
      const organization = model.createKind();
      const forProfitOrganization = model.createSubkind();
      const native = model.createSubkind();

      model.createGeneralization(agent, organization);
      model.createGeneralization(organization, forProfitOrganization);
      model.createGeneralization(agent, person);
      model.createGeneralization(person, native);

      expect(ClassVerification.checkKindSpecialization(agent)).toBeNull();
      expect(ClassVerification.checkKindSpecialization(person)).toBeNull();
      expect(ClassVerification.checkKindSpecialization(organization)).toBeNull();
      expect(ClassVerification.checkKindSpecialization(forProfitOrganization)).toBeNull();
      expect(ClassVerification.checkKindSpecialization(native)).toBeNull();
    });
  });

  describe(`Test ClassVerification.${ClassVerification.checkCompatibleNatures.name}`, () => {
    it(`Classes with mismatching stereotype/restrictedTo values must raise the issue '${VerificationIssueCode.class_incompatible_natures}'`, () => {
      const model = new Package();
      const category = model.createCategory(null, OntologicalNature.abstract);

      expect(ClassVerification.checkCompatibleNatures(category)).toMatchObject({
        code: VerificationIssueCode.class_incompatible_natures
      });
    });
  });

  describe(`Test ClassVerification.${ClassVerification.checkMissingNatures.name}`, () => {
    it(`Classes with no restrictedTo value must raise the issue '${VerificationIssueCode.class_missing_nature_restrictions}'`, () => {
      const model = new Package();
      const _class = model.createCategory();
      _class.restrictedTo = [];

      expect(ClassVerification.checkMissingNatures(_class)).toMatchObject({
        code: VerificationIssueCode.class_missing_nature_restrictions
      });
    });
  });

  describe(`Test ClassVerification.${ClassVerification.checkMissingIsExtensional.name}`, () => {
    it(`Endurant classes with no isExtensional value must raise the issue '${VerificationIssueCode.class_missing_is_extensional}'`, () => {
      const model = new Package();
      const _class = model.createCategory();
      _class.isExtensional = null;

      expect(ClassVerification.checkMissingIsExtensional(_class)).toMatchObject({
        code: VerificationIssueCode.class_missing_is_extensional
      });
    });
  });

  describe(`Test ClassVerification.${ClassVerification.checkMissingIsPowertype.name}`, () => {
    it(`Higher-order classes with no isPowertype value must raise the issue '${VerificationIssueCode.class_missing_is_powertype}'`, () => {
      const model = new Package();
      const _class = model.createType();
      _class.isPowertype = null;

      expect(ClassVerification.checkMissingIsPowertype(_class)).toMatchObject({
        code: VerificationIssueCode.class_missing_is_powertype
      });
    });
  });

  describe(`Test ClassVerification.${ClassVerification.checkMissingOrder.name}`, () => {
    it(`Higher-order classes with no order value must raise the issue '${VerificationIssueCode.class_missing_order}'`, () => {
      const model = new Package();
      const _class = model.createType();
      _class.order = null;

      expect(ClassVerification.checkMissingOrder(_class)).toMatchObject({
        code: VerificationIssueCode.class_missing_order
      });
    });
  });
});
