import { describe, expect, it, beforeEach } from '@jest/globals';
import { AggregationKind, Class, Generalization, GeneralizationSet, Package, Project, Relation } from '../src';

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
      expect(clazz.isType()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isHighOrderType()).toBe(true);
    });
  });

  describe(`Test createHistoricalRole()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createHistoricalRole();
    });

    it('Test stereotype', () => {
      expect(clazz.isHistoricalRole()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBe(true);
    });
  });

  describe(`Test createHistoricalRoleMixin()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createHistoricalRoleMixin();
    });

    it('Test stereotype', () => {
      expect(clazz.isHistoricalRoleMixin()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBe(true);
    });
  });

  describe(`Test createEvent()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createEvent();
    });

    it('Test stereotype', () => {
      expect(clazz.isEvent()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isEventType()).toBe(true);
    });
  });

  describe(`Test createSituation()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createSituation();
    });

    it('Test stereotype', () => {
      expect(clazz.isSituation()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isSituationType()).toBe(true);
    });
  });

  describe(`Test createCategory()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createCategory();
    });

    it('Test stereotype', () => {
      expect(clazz.isCategory()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBe(true);
    });
  });

  describe(`Test createMixin()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createMixin();
    });

    it('Test stereotype', () => {
      expect(clazz.isMixin()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBe(true);
    });
  });

  describe(`Test createRoleMixin()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createRoleMixin();
    });

    it('Test stereotype', () => {
      expect(clazz.isRoleMixin()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBe(true);
    });
  });

  describe(`Test createPhaseMixin()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createPhaseMixin();
    });

    it('Test stereotype', () => {
      expect(clazz.isPhaseMixin()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBe(true);
    });
  });

  describe(`Test createKind()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createKind();
    });

    it('Test stereotype', () => {
      expect(clazz.isKind()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBe(true);
    });
  });

  describe(`Test createCollective()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createCollective();
    });

    it('Test stereotype', () => {
      expect(clazz.isCollective()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isCollectiveType()).toBe(true);
    });
  });

  describe(`Test createQuantity()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createQuantity();
    });

    it('Test stereotype', () => {
      expect(clazz.isQuantity()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isQuantityType()).toBe(true);
    });
  });

  describe(`Test createRelator()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createRelator();
    });

    it('Test stereotype', () => {
      expect(clazz.isRelator()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isRelatorType()).toBe(true);
    });
  });

  describe(`Test createQuality()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createQuality();
    });

    it('Test stereotype', () => {
      expect(clazz.isQuality()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isRestrictedToQuality()).toBe(true);
    });
  });

  describe(`Test createIntrinsicMode()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createIntrinsicMode();
    });

    it('Test stereotype', () => {
      expect(clazz.isMode()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.allowsOnlyIntrinsicModes()).toBe(true);
    });
  });

  describe(`Test createExtrinsicMode()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createExtrinsicMode();
    });

    it('Test stereotype', () => {
      expect(clazz.isMode()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isExtrinsicModeType()).toBe(true);
    });
  });

  describe(`Test createSubkind()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createSubkind();
    });

    it('Test stereotype', () => {
      expect(clazz.isSubkind()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBe(true);
    });
  });

  describe(`Test createRole()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createRole();
    });

    it('Test stereotype', () => {
      expect(clazz.isRole()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBe(true);
    });
  });

  describe(`Test createPhase()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createPhase();
    });

    it('Test stereotype', () => {
      expect(clazz.isPhase()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isFunctionalComplexType()).toBe(true);
    });
  });

  describe(`Test createAbstract()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createAbstract();
    });

    it('Test stereotype', () => {
      expect(clazz.stereotypedAsAbstract()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isAbstractType()).toBe(true);
    });
  });

  describe(`Test createDatatype()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createDatatype();
    });

    it('Test stereotype', () => {
      expect(clazz.isDatatype()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isAbstractType()).toBe(true);
    });
  });

  describe(`Test createEnumeration()`, () => {
    let clazz: Class;

    beforeEach(() => {
      clazz = model.createEnumeration();
    });

    it('Test stereotype', () => {
      expect(clazz.stereotypedAsEnumeration()).toBe(true);
    });

    it('Test nature', () => {
      expect(clazz.isAbstractType()).toBe(true);
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
      expect(relation.isBinary()).toBe(true);
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
      derivation = model.createDerivationRelation(heavierThan, weight);
    });

    it('Test is binary', () => {
      expect(derivation.isDerivation()).toBe(true);
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
      relation = model.createTernaryRelation([memberA, memberB, memberC]);
    });

    it('relation should be ternary', () => {
      expect(relation.isHighArity()).toBe(true);
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
      expect(relation.hasMaterialStereotype()).toBe(true);
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
      expect(relation.hasComparativeStereotype()).toBe(true);
    });
  });

  describe(`Test createMediationRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createMediationRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasMediationStereotype()).toBe(true);
    });
  });

  describe(`Test createCharacterizationRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createCharacterizationRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasCharacterizationStereotype()).toBe(true);
    });
  });

  describe(`Test createExternalDependencyRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createExternalDependencyRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasExternalDependenceStereotype()).toBe(true);
    });
  });

  describe(`Test createComponentOfRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createComponentOfRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasComponentOfStereotype()).toBe(true);
    });
    it('Test aggregation kind', () => {
      expect(relation.getTargetEnd().aggregationKind).toBe(AggregationKind.COMPOSITE);
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
      expect(relation.hasMemberOfStereotype()).toBe(true);
    });
    it('Test aggregation kind', () => {
      expect(relation.getTargetEnd().aggregationKind).toBe(AggregationKind.SHARED);
    });
  });

  describe(`Test createSubCollectionOfRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createSubCollectionOfRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasSubCollectionOfStereotype()).toBe(true);
    });
    it('Test aggregation kind', () => {
      expect(relation.getTargetEnd().aggregationKind).toBe(AggregationKind.COMPOSITE);
    });
  });

  describe(`Test createSubQuantityOfRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createSubQuantityOfRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasSubQuantityOfStereotype()).toBe(true);
    });
    it('Test aggregation kind', () => {
      expect(relation.getTargetEnd().aggregationKind).toBe(AggregationKind.COMPOSITE);
    });
  });

  describe(`Test createInstantiationRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createInstantiationRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasInstantiationStereotype()).toBe(true);
    });
  });

  describe(`Test createTerminationRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createTerminationRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasTerminationStereotype()).toBe(true);
    });
  });

  describe(`Test createParticipationalRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createParticipationalRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasParticipationalStereotype()).toBe(true);
    });
    it('Test aggregation kind', () => {
      expect(relation.getTargetEnd().aggregationKind).toBe(AggregationKind.COMPOSITE);
    });
  });

  describe(`Test createParticipationRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createParticipationRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasParticipationStereotype()).toBe(true);
    });
  });

  describe(`Test createHistoricalDependenceRelation()`, () => {
    let relation: Relation;
    let source, target: Class;

    beforeEach(() => {
      source = model.createClass();
      target = model.createClass();
      relation = model.createHistoricalDependenceRelation(source, target);
    });

    it('Test stereotype', () => {
      expect(relation.hasHistoricalDependenceStereotype()).toBe(true);
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
      expect(relation.hasCreationStereotype()).toBe(true);
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
      expect(relation.hasManifestationStereotype()).toBe(true);
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
      expect(relation.hasBringsAboutStereotype()).toBe(true);
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
      expect(relation.hasTriggersStereotype()).toBe(true);
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
      expect(relation.getTargetEnd().aggregationKind).toBe(AggregationKind.COMPOSITE);
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
      expect(genSet.isDisjoint && genSet.isComplete).toBe(true);
    });
  });
});
