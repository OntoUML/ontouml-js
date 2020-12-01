import { Class, containerUtils, ModelElement, Package, Project, serializationUtils } from '@libs/ontouml';

describe(`${ModelElement.name} Tests`, () => {
  describe(`Test ${ModelElement.prototype.isClassifier.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createClass();
    const _enum = model.createEnumeration();
    const att = _class.createAttribute(_enum);
    const lit = _enum.createLiteral();
    const gen = model.createGeneralization(_class, _class);
    const genSet = model.createGeneralizationSet([gen]);
    const pkg = model.createPackage();
    const relation = model.createRelation();

    it('Test function call on _class', () => expect(_class.isClassifier()).toBe(true));
    it('Test function call on _enum', () => expect(_enum.isClassifier()).toBe(true));
    it('Test function call on att', () => expect(att.isClassifier()).toBe(false));
    it('Test function call on lit', () => expect(lit.isClassifier()).toBe(false));
    it('Test function call on gen', () => expect(gen.isClassifier()).toBe(false));
    it('Test function call on genSet', () => expect(genSet.isClassifier()).toBe(false));
    it('Test function call on pkg', () => expect(pkg.isClassifier()).toBe(false));
    it('Test function call on relation', () => expect(relation.isClassifier()).toBe(true));
  });

  describe(`Test ${Package.prototype.getContents.name}`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const pkg2 = pkg.createPackage();

    it('Test function call', () => expect(model.getContents()).toContain(pkg));
    it('Test function call', () => expect(model.getContents().length).toBe(1));
    it('Test function call', () => expect(pkg2.getContents().length).toBe(0));
  });

  describe(`Test ${Package.prototype.getAllContents.name}`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const pkg2 = pkg.createPackage();

    it('Test function call', () => expect(model.getAllContents()).toContain(pkg));
    it('Test function call', () => expect(model.getAllContents()).toContain(pkg2));
    it('Test function call', () => expect(model.getAllContents().length).toBe(2));
    it('Test function call', () => expect(pkg2.getAllContents().length).toBe(0));
  });

  describe(`Test ${Package.prototype.getAllAttributes.name}`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const pkg2 = pkg.createPackage();
    const person = pkg2.createClass();
    const att = person.createAttribute(person, 'knows');

    it('Test function call', () => expect(model.getAllAttributes()).toContain(att));
    it('Test function call', () => expect(model.getAllAttributes().length).toBe(1));
  });

  describe(`Test ${Package.prototype.getAllRelationEnds.name}`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const pkg2 = pkg.createPackage();
    const person = pkg2.createClass();
    const knows = pkg2.createBinaryRelation(person, person);

    it('Test function call', () => expect(model.getAllRelationEnds()).toContain(knows.getSourceEnd()));
    it('Test function call', () => expect(model.getAllRelationEnds().length).toBe(2));
  });

  describe(`Test ${Package.prototype.getAllRelations.name}`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const pkg2 = pkg.createPackage();
    const person = pkg2.createClass();
    const knows = pkg2.createBinaryRelation(person, person);

    it('Test function call', () => expect(model.getAllRelations()).toContain(knows));
    it('Test function call', () => expect(model.getAllRelations().length).toBe(1));
  });

  describe(`Test ${Package.prototype.getAllGeneralizations.name}`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const pkg2 = pkg.createPackage();
    const agent = pkg2.createClass();
    const person = pkg2.createClass();
    const gen = pkg2.createGeneralization(agent, person);

    it('Test function call', () => expect(model.getAllGeneralizations()).toContain(gen));
    it('Test function call', () => expect(model.getAllGeneralizations().length).toBe(1));
  });

  describe(`Test ${Package.prototype.getAllGeneralizationSets.name}`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const pkg2 = pkg.createPackage();
    const agent = pkg2.createClass();
    const person = pkg2.createClass();
    const gen = pkg2.createGeneralization(agent, person);
    const genSet = pkg2.createGeneralizationSet(gen);

    it('Test function call', () => expect(model.getAllGeneralizationSets()).toContain(genSet));
    it('Test function call', () => expect(model.getAllGeneralizationSets().length).toBe(1));
  });

  describe(`Test ${Package.prototype.getAllPackages.name}`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const pkg2 = pkg.createPackage();
    const agent = pkg2.createClass();
    const person = pkg2.createClass();
    const gen = pkg2.createGeneralization(agent, person);
    pkg2.createGeneralizationSet(gen);

    it('Test function call', () => expect(model.getAllPackages()).toContain(pkg));
    it('Test function call', () => expect(model.getAllPackages()).toContain(pkg2));
    it('Test function call', () => expect(model.getAllPackages().length).toBe(2));
  });

  describe(`Test ${Package.prototype.getAllClasses.name}`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const pkg2 = pkg.createPackage();
    const agent = pkg2.createClass();
    const person = pkg2.createClass();
    const gen = pkg2.createGeneralization(agent, person);
    pkg2.createGeneralizationSet(gen);

    it('Test function call', () => expect(model.getAllClasses()).toContain(agent));
    it('Test function call', () => expect(model.getAllClasses()).toContain(person));
    it('Test function call', () => expect(model.getAllClasses().length).toBe(2));
  });

  describe(`Test ${Package.prototype.getAllEnumerations.name}`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const pkg2 = pkg.createPackage();
    const _enum = pkg2.createEnumeration();
    pkg2.createClass();

    it('Test function call', () => expect(model.getAllEnumerations()).toContain(_enum));
    it('Test function call', () => expect(model.getAllEnumerations().length).toBe(1));
  });

  describe(`Test ${Package.prototype.getAllLiterals.name}`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const pkg2 = pkg.createPackage();
    const _enum = pkg2.createEnumeration();
    const lit1 = _enum.createLiteral();
    const lit2 = _enum.createLiteral();

    it('Test function call', () => expect(model.getAllLiterals()).toContain(lit1));
    it('Test function call', () => expect(model.getAllLiterals()).toContain(lit2));
    it('Test function call', () => expect(model.getAllLiterals().length).toBe(2));
  });

  describe(`Test ${Package.prototype.toJSON.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createPackage.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createClass.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createType.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createHistoricalRole.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createHistoricalRoleMixin.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createEvent.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createSituation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createCategory.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createMixin.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createRoleMixin.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createPhaseMixin.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createKind.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createCollective.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createQuantity.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createRelator.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createQuality.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createIntrinsicMode.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createExtrinsicMode.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createSubkind.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createRole.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createPhase.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createAbstract.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createDatatype.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createEnumeration.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createBinaryRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createDerivationRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createTernaryRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createMaterialRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createComparativeRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createMediationRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createCharacterizationRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createExternalDependencyRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createComponentOfRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createMemberOfRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createSubCollectionOfRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createSubQuantityOfRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createInstantiationRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createTerminationRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createParticipationalRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createParticipationRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createHistoricalDependenceRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createCreationRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createManifestationRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createBringsAboutRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createTriggersRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createPartWholeRelation.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createGeneralization.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createGeneralizationSet.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.createPartition.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.setContainer.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.clone.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Package.prototype.replace.name}`, () => {
    // TODO: implement test
  });

  describe(`Test Package.${Package.triggersReplaceOnClonedPackage.name}`, () => {
    // TODO: implement test
  });
});
