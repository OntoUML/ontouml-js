import {
  AggregationKind,
  Class,
  Generalization,
  GeneralizationSet,
  Package,
  Project,
  Relation
} from '../../src';

describe(`Package tests`, () => {
  let project: Project;
  let model: Package;

  beforeEach(() => {
    project = new Project();
    model = project.createModel();
  });

  describe(`Test createPackage()`, () => {
    let pkg: Package;

    beforeEach(() => {
      pkg = model.createPackage();
    });

    it('Test instantiation', () => {
      expect(pkg).toBeInstanceOf(Package);
    });

    it('Test container', () => {
      expect(pkg.container).toBe(model);
    });

    it('Test project', () => {
      expect(pkg.project).toBe(model.project);
    });
  });

  describe(`Test createClass()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createClass();
    });

    it('Test instantiation', () => {
      expect(clazz).toBeInstanceOf(Class);
    });

    it('Test container', () => {
      expect(clazz.container).toBe(model);
    });

    it('Test project', () => {
      expect(clazz.project).toBe(model.project);
    });
  });

  describe(`Test createType()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createType();
    });

    it('Test stereotype', () => {
      expect(clazz.isType()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isHighOrderType()).toBeTrue();
    });
  });

  describe(`Test createHistoricalRole()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createHistoricalRole();
    });

    it('Test stereotype', () => {
      expect(clazz.isHistoricalRole()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBeTrue();
    });
  });

  describe(`Test createHistoricalRoleMixin()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createHistoricalRoleMixin();
    });

    it('Test stereotype', () => {
      expect(clazz.isHistoricalRoleMixin()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBeTrue();
    });
  });

  describe(`Test createEvent()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createEvent();
    });

    it('Test stereotype', () => {
      expect(clazz.isEvent()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isEventType()).toBeTrue();
    });
  });

  describe(`Test createSituation()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createSituation();
    });

    it('Test stereotype', () => {
      expect(clazz.isSituation()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isSituationType()).toBeTrue();
    });
  });

  describe(`Test createCategory()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createCategory();
    });

    it('Test stereotype', () => {
      expect(clazz.isCategory()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBeTrue();
    });
  });

  describe(`Test createMixin()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createMixin();
    });

    it('Test stereotype', () => {
      expect(clazz.isMixin()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBeTrue();
    });
  });

  describe(`Test createRoleMixin()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createRoleMixin();
    });

    it('Test stereotype', () => {
      expect(clazz.isRoleMixin()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBeTrue();
    });
  });

  describe(`Test createPhaseMixin()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createPhaseMixin();
    });

    it('Test stereotype', () => {
      expect(clazz.isPhaseMixin()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBeTrue();
    });
  });

  describe(`Test createKind()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createKind();
    });

    it('Test stereotype', () => {
      expect(clazz.isKind()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBeTrue();
    });
  });

  describe(`Test createCollective()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createCollective();
    });

    it('Test stereotype', () => {
      expect(clazz.isCollective()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isCollectiveType()).toBeTrue();
    });
  });

  describe(`Test createQuantity()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createQuantity();
    });

    it('Test stereotype', () => {
      expect(clazz.isQuantity()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isQuantityType()).toBeTrue();
    });
  });

  describe(`Test createRelator()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createRelator();
    });

    it('Test stereotype', () => {
      expect(clazz.isRelator()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isRelatorType()).toBeTrue();
    });
  });

  describe(`Test createQuality()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createQuality();
    });

    it('Test stereotype', () => {
      expect(clazz.isQuality()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isRestrictedToQuality()).toBeTrue();
    });
  });

  describe(`Test createIntrinsicMode()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createIntrinsicMode();
    });

    it('Test stereotype', () => {
      expect(clazz.isMode()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.allowsOnlyIntrinsicModes()).toBeTrue();
    });
  });

  describe(`Test createExtrinsicMode()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createExtrinsicMode();
    });

    it('Test stereotype', () => {
      expect(clazz.isMode()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isExtrinsicModeType()).toBeTrue();
    });
  });

  describe(`Test createSubkind()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createSubkind();
    });

    it('Test stereotype', () => {
      expect(clazz.isSubkind()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBeTrue();
    });
  });

  describe(`Test createRole()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createRole();
    });

    it('Test stereotype', () => {
      expect(clazz.isRole()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBeTrue();
    });
  });

  describe(`Test createPhase()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createPhase();
    });

    it('Test stereotype', () => {
      expect(clazz.isPhase()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBeTrue();
    });
  });

  describe(`Test createAbstract()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createAbstract();
    });

    it('Test stereotype', () => {
      expect(clazz.stereotypedAsAbstract()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isAbstractType()).toBeTrue();
    });
  });

  describe(`Test createDatatype()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createDatatype();
    });

    it('Test stereotype', () => {
      expect(clazz.isDatatype()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isAbstractType()).toBeTrue();
    });
  });

  describe(`Test createEnumeration()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createEnumeration();
    });

    it('Test stereotype', () => {
      expect(clazz.stereotypedAsEnumeration()).toBeTrue();
    });

    it('Test nature', () => {
      expect(clazz.isAbstractType()).toBeTrue();
    });
  });

  describe(`Test createRelation()`, () => {
    let rel: Relation;

    beforeEach(() => {
      rel = model.createRelation();
    });

    it('Test instantiation', () => {
      expect(rel).toBeInstanceOf(Relation);
    });

    it('Test container', () => {
      expect(rel.container).toBe(model);
    });

    it('Test project', () => {
      expect(rel.project).toBe(model.project);
    });
  });

  describe(`Test createBinaryRelation()`, () => {
    let relation: Relation;
    let source: Class, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createBinaryRelation(source, target);
    });

    it('Test is binary', () => {
      expect(relation.isBinary()).toBeTrue();
    });
    it('Test source', () => {
      expect(relation.getSource()).toBe(source);
    });
    it('Test target', () => {
      expect(relation.getTarget()).toBe(target);
    });
  });

  describe(`Test createDerivationRelation()`, () => {
    let heavierThan: Relation, derivation: Relation;
    let person, weight: Class;

    beforeEach(() => {
      person = model.createClass();
      weight = model.createClass();
      heavierThan = model.createBinaryRelation(person, person);
      derivation = model.createDerivation(heavierThan, weight);
    });

    it('Test is binary', () => {
      expect(derivation.fromRelationToClass()).toBeTrue();
    });

    it('Test source', () => {
      expect(derivation.getSource()).toBe(heavierThan);
    });

    it('Test target', () => {
      expect(derivation.getTarget()).toBe(weight);
    });
  });

  describe(`Test createTernaryRelation()`, () => {
    let relation: Relation;
    let memberA: Class, memberB: Class, memberC: Class;

    beforeEach(() => {
      memberA = model.createClass();
      memberB = model.createClass();
      memberC = model.createClass();
      relation = model.createNaryRelation([memberA, memberB, memberC]);
    });

    it('relation should be ternary', () => {
      expect(relation.isNary()).toBeTrue();
    });

    it('relation should have the correct first member', () => {
      expect(relation.getMember(0)).toBe(memberA);
    });

    it('relation should have the correct second member', () => {
      expect(relation.getMember(1)).toBe(memberB);
    });

    it('relation should have the correct third member', () => {
      expect(relation.getMember(2)).toBe(memberC);
    });
  });

  describe(`Test createMaterialRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createMaterialRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasMaterialStereotype()).toBeTrue();
    });
  });

  describe(`Test createComparativeRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createComparativeRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasComparativeStereotype()).toBeTrue();
    });
  });

  describe(`Test createMediationRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createMediation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasMediationStereotype()).toBeTrue();
    });
  });

  describe(`Test createCharacterizationRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createCharacterization(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasCharacterizationStereotype()).toBeTrue();
    });
  });

  describe(`Test createExternalDependencyRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createExternalDependence(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasExternalDependenceStereotype()).toBeTrue();
    });
  });

  describe(`Test createComponentOfRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createComponentOf(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasComponentOfStereotype()).toBeTrue();
    });
    it('Test aggregation kind', () => {
      expect(relation.getTargetEnd().aggregationKind).toBe(
        AggregationKind.COMPOSITE
      );
    });
  });

  describe(`Test createMemberOfRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createMemberOfRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasMemberOfStereotype()).toBeTrue();
    });
    it('Test aggregation kind', () => {
      expect(relation.getTargetEnd().aggregationKind).toBe(
        AggregationKind.SHARED
      );
    });
  });

  describe(`Test createSubCollectionOfRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createSubCollectionOf(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasSubCollectionOfStereotype()).toBeTrue();
    });
    it('Test aggregation kind', () => {
      expect(relation.getTargetEnd().aggregationKind).toBe(
        AggregationKind.COMPOSITE
      );
    });
  });

  describe(`Test createSubQuantityOfRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createSubQuantityOf(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasSubQuantityOfStereotype()).toBeTrue();
    });
    it('Test aggregation kind', () => {
      expect(relation.getTargetEnd().aggregationKind).toBe(
        AggregationKind.COMPOSITE
      );
    });
  });

  describe(`Test createInstantiationRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createInstantiation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasInstantiationStereotype()).toBeTrue();
    });
  });

  describe(`Test createTerminationRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createTermination(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasTerminationStereotype()).toBeTrue();
    });
  });

  describe(`Test createParticipationalRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createParticipational(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasParticipationalStereotype()).toBeTrue();
    });
    it('Test aggregation kind', () => {
      expect(relation.getTargetEnd().aggregationKind).toBe(
        AggregationKind.COMPOSITE
      );
    });
  });

  describe(`Test createParticipationRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createParticipation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasParticipationStereotype()).toBeTrue();
    });
  });

  describe(`Test createHistoricalDependenceRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createHistoricalDependence(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasHistoricalDependenceStereotype()).toBeTrue();
    });
  });

  describe(`Test createCreationRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createCreationRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasCreationStereotype()).toBeTrue();
    });
  });

  describe(`Test createManifestationRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createManifestationRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasManifestationStereotype()).toBeTrue();
    });
  });

  describe(`Test createBringsAboutRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createBringsAboutRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasBringsAboutStereotype()).toBeTrue();
    });
  });

  describe(`Test createTriggersRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createTriggersRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasTriggersStereotype()).toBeTrue();
    });
  });

  describe(`Test createPartWholeRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createPartWholeRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.stereotype).toBeNull();
    });
    it('Test aggregation kind', () => {
      expect(relation.getTargetEnd().aggregationKind).toBe(
        AggregationKind.COMPOSITE
      );
    });
  });

  describe(`Test createGeneralization()`, () => {
    let gen: Generalization;
    let general, specific: Class;

    beforeEach(() => {
      general = model.createClass();
      specific = model.createClass();
      gen = model.createGeneralization(general, specific);
    });

    it('Test instantiation', () => {
      expect(gen).toBeInstanceOf(Generalization);
    });

    it('Test container', () => {
      expect(gen.container).toBe(model);
    });

    it('Test project', () => {
      expect(gen.project).toBe(model.project);
    });
  });

  describe(`Test createGeneralizationSet()`, () => {
    let genSet: GeneralizationSet;
    let gen: Generalization;
    let general, specific: Class;

    beforeEach(() => {
      general = model.createClass();
      specific = model.createClass();
      gen = model.createGeneralization(general, specific);
      genSet = model.createGeneralizationSet(gen);
    });

    it('Test instantiation', () => {
      expect(genSet).toBeInstanceOf(GeneralizationSet);
    });

    it('Test container', () => {
      expect(genSet.container).toBe(model);
    });

    it('Test project', () => {
      expect(genSet.project).toBe(model.project);
    });
  });

  describe(`Test createPartition()`, () => {
    let genSet: GeneralizationSet;
    let gen: Generalization;
    let general, specific: Class;

    beforeEach(() => {
      general = model.createClass();
      specific = model.createClass();
      gen = model.createGeneralization(general, specific);
      genSet = model.createPartition(gen);
    });

    it('Test container', () => {
      expect(genSet.isDisjoint && genSet.isComplete).toBeTrue();
    });
  });
});
