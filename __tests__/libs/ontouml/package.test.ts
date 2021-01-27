import {
  AggregationKind,
  Class,
  Generalization,
  GeneralizationSet,
  ModelElement,
  Package,
  Project,
  Relation,
  serializationUtils
} from '@libs/ontouml';

describe(`${Package.name} Tests`, () => {
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
    const model = new Project().createModel();
    const pkg = model.createPackage();

    it('Test serialization', () => expect(() => JSON.stringify(pkg)).not.toThrow());
    it('Test serialization validation', () => expect(serializationUtils.validate(model.project)).toBeTruthy());
  });

  describe(`Test ${Package.prototype.createPackage.name}`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();

    it('Test instantiation', () => expect(pkg).toBeInstanceOf(Package));
    it('Test container', () => expect(pkg.container).toBe(model));
    it('Test project', () => expect(pkg.project).toBe(model.project));
  });

  describe(`Test ${Package.prototype.createClass.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createClass();

    it('Test instantiation', () => expect(_class).toBeInstanceOf(Class));
    it('Test container', () => expect(_class.container).toBe(model));
    it('Test project', () => expect(_class.project).toBe(model.project));
  });

  describe(`Test ${Package.prototype.createType.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createType();

    it('Test stereotype', () => expect(_class.hasTypeStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToType()).toBe(true));
  });

  describe(`Test ${Package.prototype.createHistoricalRole.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createHistoricalRole();

    it('Test stereotype', () => expect(_class.hasHistoricalRoleStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToFunctionalComplex()).toBe(true));
  });

  describe(`Test ${Package.prototype.createHistoricalRoleMixin.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createHistoricalRoleMixin();

    it('Test stereotype', () => expect(_class.hasHistoricalRoleMixinStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToFunctionalComplex()).toBe(true));
  });

  describe(`Test ${Package.prototype.createEvent.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createEvent();

    it('Test stereotype', () => expect(_class.hasEventStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToEvent()).toBe(true));
  });

  describe(`Test ${Package.prototype.createSituation.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createSituation();

    it('Test stereotype', () => expect(_class.hasSituationStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToSituation()).toBe(true));
  });

  describe(`Test ${Package.prototype.createCategory.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createCategory();

    it('Test stereotype', () => expect(_class.hasCategoryStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToFunctionalComplex()).toBe(true));
  });

  describe(`Test ${Package.prototype.createMixin.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createMixin();

    it('Test stereotype', () => expect(_class.hasMixinStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToFunctionalComplex()).toBe(true));
  });

  describe(`Test ${Package.prototype.createRoleMixin.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createRoleMixin();

    it('Test stereotype', () => expect(_class.hasRoleMixinStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToFunctionalComplex()).toBe(true));
  });

  describe(`Test ${Package.prototype.createPhaseMixin.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createPhaseMixin();

    it('Test stereotype', () => expect(_class.hasPhaseMixinStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToFunctionalComplex()).toBe(true));
  });

  describe(`Test ${Package.prototype.createKind.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createKind();

    it('Test stereotype', () => expect(_class.hasKindStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToFunctionalComplex()).toBe(true));
  });

  describe(`Test ${Package.prototype.createCollective.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createCollective();

    it('Test stereotype', () => expect(_class.hasCollectiveStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToCollective()).toBe(true));
  });

  describe(`Test ${Package.prototype.createQuantity.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createQuantity();

    it('Test stereotype', () => expect(_class.hasQuantityStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToQuantity()).toBe(true));
  });

  describe(`Test ${Package.prototype.createRelator.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createRelator();

    it('Test stereotype', () => expect(_class.hasRelatorStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToRelator()).toBe(true));
  });

  describe(`Test ${Package.prototype.createQuality.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createQuality();

    it('Test stereotype', () => expect(_class.hasQualityStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToQuality()).toBe(true));
  });

  describe(`Test ${Package.prototype.createIntrinsicMode.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createIntrinsicMode();

    it('Test stereotype', () => expect(_class.hasModeStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToIntrinsicMode()).toBe(true));
  });

  describe(`Test ${Package.prototype.createExtrinsicMode.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createExtrinsicMode();

    it('Test stereotype', () => expect(_class.hasModeStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToExtrinsicMode()).toBe(true));
  });

  describe(`Test ${Package.prototype.createSubkind.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createSubkind();

    it('Test stereotype', () => expect(_class.hasSubkindStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToFunctionalComplex()).toBe(true));
  });

  describe(`Test ${Package.prototype.createRole.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createRole();

    it('Test stereotype', () => expect(_class.hasRoleStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToFunctionalComplex()).toBe(true));
  });

  describe(`Test ${Package.prototype.createPhase.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createPhase();

    it('Test stereotype', () => expect(_class.hasPhaseStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToFunctionalComplex()).toBe(true));
  });

  describe(`Test ${Package.prototype.createAbstract.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createAbstract();

    it('Test stereotype', () => expect(_class.hasAbstractStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToAbstract()).toBe(true));
  });

  describe(`Test ${Package.prototype.createDatatype.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createDatatype();

    it('Test stereotype', () => expect(_class.hasDatatypeStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToAbstract()).toBe(true));
  });

  describe(`Test ${Package.prototype.createEnumeration.name}`, () => {
    const model = new Project().createModel();
    const _class = model.createEnumeration();

    it('Test stereotype', () => expect(_class.hasEnumerationStereotype()).toBe(true));
    it('Test nature', () => expect(_class.isRestrictedToAbstract()).toBe(true));
  });

  describe(`Test ${Package.prototype.createRelation.name}`, () => {
    const model = new Project().createModel();
    const pkg = model.createRelation();

    it('Test instantiation', () => expect(pkg).toBeInstanceOf(Relation));
    it('Test container', () => expect(pkg.container).toBe(model));
    it('Test project', () => expect(pkg.project).toBe(model.project));
  });

  describe(`Test ${Package.prototype.createBinaryRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createBinaryRelation(source, target);

    it('Test is binary', () => expect(relation.isBinaryRelation()).toBe(true));
    it('Test source', () => expect(relation.getSource()).toBe(source));
    it('Test target', () => expect(relation.getTarget()).toBe(target));
  });

  describe(`Test ${Package.prototype.createDerivationRelation.name}`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);

    it('Test is binary', () => expect(derivation.isDerivationRelation()).toBe(true));
    it('Test source', () => expect(derivation.getSource()).toBe(heavierThan));
    it('Test target', () => expect(derivation.getTarget()).toBe(weight));
  });

  describe(`Test ${Package.prototype.createTernaryRelation.name}`, () => {
    const model = new Project().createModel();
    const memberA = model.createClass();
    const memberB = model.createClass();
    const memberC = model.createClass();
    const relation = model.createTernaryRelation([memberA, memberB, memberC]);

    it('Test is binary', () => expect(relation.isTernaryRelation()).toBe(true));
    it('Test source', () => expect(relation.getMember(0)).toBe(memberA));
    it('Test source', () => expect(relation.getMember(1)).toBe(memberB));
    it('Test source', () => expect(relation.getMember(2)).toBe(memberC));
  });

  describe(`Test ${Package.prototype.createMaterialRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createMaterialRelation(source, target);

    it('Test stereotype', () => expect(relation.hasMaterialStereotype()).toBe(true));
  });

  describe(`Test ${Package.prototype.createComparativeRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createComparativeRelation(source, target);

    it('Test stereotype', () => expect(relation.hasComparativeStereotype()).toBe(true));
  });

  describe(`Test ${Package.prototype.createMediationRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createMediationRelation(source, target);

    it('Test stereotype', () => expect(relation.hasMediationStereotype()).toBe(true));
  });

  describe(`Test ${Package.prototype.createCharacterizationRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createCharacterizationRelation(source, target);

    it('Test stereotype', () => expect(relation.hasCharacterizationStereotype()).toBe(true));
  });

  describe(`Test ${Package.prototype.createExternalDependencyRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createExternalDependencyRelation(source, target);

    it('Test stereotype', () => expect(relation.hasExternalDependenceStereotype()).toBe(true));
  });

  describe(`Test ${Package.prototype.createComponentOfRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createComponentOfRelation(source, target);

    it('Test stereotype', () => expect(relation.hasComponentOfStereotype()).toBe(true));
    it('Test aggregation kind', () => expect(relation.getTargetEnd().aggregationKind).toBe(AggregationKind.COMPOSITE));
  });

  describe(`Test ${Package.prototype.createMemberOfRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createMemberOfRelation(source, target);

    it('Test stereotype', () => expect(relation.hasMemberOfStereotype()).toBe(true));
    it('Test aggregation kind', () => expect(relation.getTargetEnd().aggregationKind).toBe(AggregationKind.SHARED));
  });

  describe(`Test ${Package.prototype.createSubCollectionOfRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createSubCollectionOfRelation(source, target);

    it('Test stereotype', () => expect(relation.hasSubCollectionOfStereotype()).toBe(true));
    it('Test aggregation kind', () => expect(relation.getTargetEnd().aggregationKind).toBe(AggregationKind.COMPOSITE));
  });

  describe(`Test ${Package.prototype.createSubQuantityOfRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createSubQuantityOfRelation(source, target);

    it('Test stereotype', () => expect(relation.hasSubQuantityOfStereotype()).toBe(true));
    it('Test aggregation kind', () => expect(relation.getTargetEnd().aggregationKind).toBe(AggregationKind.COMPOSITE));
  });

  describe(`Test ${Package.prototype.createInstantiationRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createInstantiationRelation(source, target);

    it('Test stereotype', () => expect(relation.hasInstantiationStereotype()).toBe(true));
  });

  describe(`Test ${Package.prototype.createTerminationRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createTerminationRelation(source, target);

    it('Test stereotype', () => expect(relation.hasTerminationStereotype()).toBe(true));
  });

  describe(`Test ${Package.prototype.createParticipationalRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createParticipationalRelation(source, target);

    it('Test stereotype', () => expect(relation.hasParticipationalStereotype()).toBe(true));
    it('Test aggregation kind', () => expect(relation.getTargetEnd().aggregationKind).toBe(AggregationKind.COMPOSITE));
  });

  describe(`Test ${Package.prototype.createParticipationRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createParticipationRelation(source, target);

    it('Test stereotype', () => expect(relation.hasParticipationStereotype()).toBe(true));
  });

  describe(`Test ${Package.prototype.createHistoricalDependenceRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createHistoricalDependenceRelation(source, target);

    it('Test stereotype', () => expect(relation.hasHistoricalDependenceStereotype()).toBe(true));
  });

  describe(`Test ${Package.prototype.createCreationRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createCreationRelation(source, target);

    it('Test stereotype', () => expect(relation.hasCreationStereotype()).toBe(true));
  });

  describe(`Test ${Package.prototype.createManifestationRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createManifestationRelation(source, target);

    it('Test stereotype', () => expect(relation.hasManifestationStereotype()).toBe(true));
  });

  describe(`Test ${Package.prototype.createBringsAboutRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createBringsAboutRelation(source, target);

    it('Test stereotype', () => expect(relation.hasBringsAboutStereotype()).toBe(true));
  });

  describe(`Test ${Package.prototype.createTriggersRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createTriggersRelation(source, target);

    it('Test stereotype', () => expect(relation.hasTriggersStereotype()).toBe(true));
  });

  describe(`Test ${Package.prototype.createPartWholeRelation.name}`, () => {
    const model = new Project().createModel();
    const source = model.createClass();
    const target = model.createClass();
    const relation = model.createPartWholeRelation(source, target);

    it('Test stereotype', () => expect(relation.getUniqueStereotype()).toBeFalsy());
    it('Test aggregation kind', () => expect(relation.getTargetEnd().aggregationKind).toBe(AggregationKind.COMPOSITE));
  });

  describe(`Test ${Package.prototype.createGeneralization.name}`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();
    const gen = model.createGeneralization(agent, person);

    it('Test instantiation', () => expect(gen).toBeInstanceOf(Generalization));
    it('Test container', () => expect(gen.container).toBe(model));
    it('Test project', () => expect(gen.project).toBe(model.project));
  });

  describe(`Test ${Package.prototype.createGeneralizationSet.name}`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();
    const gen = model.createGeneralization(agent, person);
    const genSet = model.createGeneralizationSet(gen);

    it('Test instantiation', () => expect(genSet).toBeInstanceOf(GeneralizationSet));
    it('Test container', () => expect(genSet.container).toBe(model));
    it('Test project', () => expect(genSet.project).toBe(model.project));
  });

  describe(`Test ${Package.prototype.createPartition.name}`, () => {
    const model = new Project().createModel();
    const agent = model.createClass();
    const person = model.createClass();
    const gen = model.createGeneralization(agent, person);
    const genSet = model.createPartition(gen);

    it('Test container', () => expect(genSet.isDisjoint && genSet.isComplete).toBe(true));
  });

  describe(`Test ${Package.prototype.setContainer.name}`, () => {
    const projectA = new Project();
    const modelA = projectA.createModel();
    const pkgA = modelA.createPackage();

    const projectB = new Project();
    const modelB = projectB.createModel();

    const _class = new Class();
    _class.setProject(projectA);

    it('Test set container within common project', () => {
      _class.setContainer(modelA);
      expect(_class.container).toBe(modelA);
      expect(modelA.contents).toContain(_class);
    });

    it('Test change container within common project', () => {
      _class.setContainer(pkgA);
      expect(_class.container).toBe(pkgA);
      expect(pkgA.contents).toContain(_class);
      expect(modelA.getAllContents()).toContain(_class);
    });

    it('Test exception when changing enclosing project', () => {
      expect(() => _class.setContainer(modelB)).toThrow();
    });
  });

  describe(`Test ${Package.prototype.clone.name}`, () => {
    const smallModel = new Project().createModel();
    const packageA = smallModel.createPackage();
    const packageB = packageA.clone();

    const packageC = new Package();
    const packageD = packageC.clone();

    it('Test method', () => expect(packageA).toEqual(packageB));
    it('Test method', () => expect(packageC).toEqual(packageD));

    const project = new Project({ name: 'Project' });
    const model = project.createModel({ name: 'Model' });

    const agent = model.createCategory('Agent');
    const person = model.createKind('Person');
    const organization = model.createKind('Organization');
    const text = model.createDatatype('Text');

    agent.createAttribute(text, { name: 'name' });
    person.createAttribute(text, { name: 'surname' });

    model.createBinaryRelation(person, organization, 'works-for');

    const agentIntoPerson = model.createGeneralization(agent, person, 'agentIntoPerson');
    const agentIntoOrganization = model.createGeneralization(agent, organization, 'agentIntoOrganization');

    model.createPartition([agentIntoPerson, agentIntoOrganization], null, 'agentsSet');

    it('Test method', () => expect(model).toEqual(model.clone()));
  });
});
