import { describe, expect, it } from '@jest/globals';
import {
  Project,
  Relation,
  RelationStereotype,
  ClassStereotype,
  Property
} from '../src';

describe('Relation Tests', () => {
  describe('Test getGeneralizations()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);
    const isFriendsWith = model.createBinaryRelation(person, person);
    const gen = model.createGeneralization(knows, isFriendsWith);

    it('Test function call', () =>
      expect(knows.getGeneralizations()).toContain(gen));
    it('Test function call', () =>
      expect(knows.getGeneralizations().length).toBe(1));
  });

  describe('Test getGeneralizationSets()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);
    const isFriendsWith = model.createBinaryRelation(person, person);
    const gen = model.createGeneralization(knows, isFriendsWith);
    const genSet = model.createGeneralizationSet(gen);

    it('Test function call', () =>
      expect(knows.getGeneralizationSets()).toContain(genSet));
    it('Test function call', () =>
      expect(knows.getGeneralizationSets().length).toBe(1));
  });

  describe('Test getGeneralizationsWhereGeneral()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);
    const isFriendsWith = model.createBinaryRelation(person, person);
    const gen = model.createGeneralization(knows, isFriendsWith);

    it('Test function call', () =>
      expect(knows.getGeneralizationsWhereGeneral()).toContain(gen));
    it('Test function call', () =>
      expect(knows.getGeneralizationsWhereGeneral().length).toBe(1));
  });

  describe('Test getGeneralizationsWhereSpecific()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);
    const isFriendsWith = model.createBinaryRelation(person, person);
    const gen = model.createGeneralization(knows, isFriendsWith);

    it('Test function call', () =>
      expect(isFriendsWith.getGeneralizationsWhereSpecific()).toContain(gen));
    it('Test function call', () =>
      expect(isFriendsWith.getGeneralizationsWhereSpecific().length).toBe(1));
  });

  describe('Test getGeneralizationSetsWhereGeneral()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);
    const isFriendsWith = model.createBinaryRelation(person, person);
    const gen = model.createGeneralization(knows, isFriendsWith);
    const genSet = model.createGeneralizationSet(gen);

    it('Test function call', () =>
      expect(knows.getGeneralizationSetsWhereGeneral()).toContain(genSet));
    it('Test function call', () =>
      expect(knows.getGeneralizationSetsWhereGeneral().length).toBe(1));
  });

  describe('Test getGeneralizationSetsWhereSpecific()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);
    const isFriendsWith = model.createBinaryRelation(person, person);
    const gen = model.createGeneralization(knows, isFriendsWith);
    const genSet = model.createGeneralizationSet(gen);

    it('Test function call', () =>
      expect(isFriendsWith.getGeneralizationSetsWhereSpecific()).toContain(
        genSet
      ));
    it('Test function call', () =>
      expect(isFriendsWith.getGeneralizationSetsWhereSpecific().length).toBe(
        1
      ));
  });

  describe('Test getContents()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);

    it('Test function call', () =>
      expect(knows.getContents()).toContain(knows.getTargetEnd()));
    it('Test function call', () =>
      expect(knows.getContents()).toContain(knows.getSourceEnd()));
    it('Test function call', () => expect(knows.getContents().length).toBe(2));
  });

  describe('Test getAllContents()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);

    it('Test function call', () =>
      expect(knows.getAllContents()).toContain(knows.getTargetEnd()));
    it('Test function call', () =>
      expect(knows.getAllContents()).toContain(knows.getSourceEnd()));
    it('Test function call', () =>
      expect(knows.getAllContents().length).toBe(2));
  });

  describe('Test createSourceEnd()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createRelation();

    knows.createSourceEnd().propertyType = person;
    knows.createTargetEnd().propertyType = person;

    it('Test creation', () => expect(knows.getSourceEnd()).toBeDefined());
    it('Test exception on second creation', () =>
      expect(() => knows.createSourceEnd()).toThrow());
  });

  describe('Test createTargetEnd()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createRelation();

    knows.createSourceEnd().propertyType = person;
    knows.createTargetEnd().propertyType = person;

    it('Test creation', () => expect(knows.getTargetEnd()).toBeDefined());
    it('Test exception on second creation', () =>
      expect(() => knows.createTargetEnd()).toThrow());
  });

  describe('Test createMemberEnd()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const metPersonAt = model.createRelation();

    metPersonAt.createMemberEnd().propertyType = person;
    metPersonAt.createMemberEnd(1).propertyType = person;
    metPersonAt.createMemberEnd(2).propertyType = place;

    it('Test creation', () =>
      expect(metPersonAt.getMemberEnd(0)).toBeDefined());
    it('Test exception on second creation', () =>
      expect(() => metPersonAt.createMemberEnd(0)).toThrow());
    it('Test exception on invalid creation position', () =>
      expect(() => metPersonAt.createMemberEnd(-1)).toThrow());
  });

  describe('Test getSourceEnd()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve source end', () =>
      expect(heavierThan.getSourceEnd()).toBe(heavierThan.properties[0]));
    it('Test retrieve source end', () =>
      expect(derivation.getSourceEnd()).toBe(derivation.properties[0]));
    it('Test exception on ternary relation', () =>
      expect(() => metPersonAt.getSourceEnd()).toThrow());
  });

  describe('Test getTargetEnd()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve target end', () =>
      expect(heavierThan.getTargetEnd()).toBe(heavierThan.properties[1]));
    it('Test retrieve target end', () =>
      expect(derivation.getTargetEnd()).toBe(derivation.properties[1]));
    it('Test exception on ternary relation', () =>
      expect(() => metPersonAt.getTargetEnd()).toThrow());
  });

  describe('Test getMemberEnd()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve member end', () =>
      expect(metPersonAt.getMemberEnd(0)).toBe(metPersonAt.properties[0]));
    it('Test exception on binary relation', () =>
      expect(() => heavierThan.getMemberEnd(0)).toThrow());
    it('Test exception on derivation relation', () =>
      expect(() => derivation.getMemberEnd(0)).toThrow());
  });

  describe('Test getSourceClassEnd()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve source end', () =>
      expect(heavierThan.getSourceClassEnd()).toBe(heavierThan.properties[0]));
    it('Test exception on derivation relation', () =>
      expect(() => derivation.getSourceClassEnd()).toThrow());
    it('Test exception on ternary relation', () =>
      expect(() => metPersonAt.getSourceClassEnd()).toThrow());
  });

  describe('Test getTargetClassEnd()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve target end', () =>
      expect(heavierThan.getTargetClassEnd()).toBe(heavierThan.properties[1]));
    it('Test exception on derivation relation', () =>
      expect(() => derivation.getTargetClassEnd()).toThrow());
    it('Test exception on ternary relation', () =>
      expect(() => metPersonAt.getTargetClassEnd()).toThrow());
  });

  describe('Test getDerivingRelationEnd()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve deriving end', () =>
      expect(derivation.getDerivingRelationEnd()).toBe(
        derivation.properties[0]
      ));
    it('Test exception on binary relation', () =>
      expect(() => heavierThan.getDerivingRelationEnd()).toThrow());
    it('Test exception on ternary relation', () =>
      expect(() => metPersonAt.getDerivingRelationEnd()).toThrow());
  });

  describe('Test getDerivedClassEnd()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve derived end', () =>
      expect(derivation.getDerivedClassEnd()).toBe(derivation.properties[1]));
    it('Test exception on binary relation', () =>
      expect(() => heavierThan.getDerivedClassEnd()).toThrow());
    it('Test exception on ternary relation', () =>
      expect(() => metPersonAt.getDerivedClassEnd()).toThrow());
  });

  describe('Test getMemberClassEnd()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve member end', () =>
      expect(metPersonAt.getMemberClassEnd(0)).toBe(metPersonAt.properties[0]));
    it('Test exception on binary relation', () =>
      expect(() => heavierThan.getMemberClassEnd(0)).toThrow());
    it('Test exception on derivation relation', () =>
      expect(() => derivation.getMemberClassEnd(0)).toThrow());
  });

  describe('Test getSource()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve source', () =>
      expect(heavierThan.getSource()).toBe(
        heavierThan.properties[0].propertyType
      ));
    it('Test retrieve source', () =>
      expect(derivation.getSource()).toBe(
        derivation.properties[0].propertyType
      ));
    it('Test exception on ternary relation', () =>
      expect(() => metPersonAt.getSource()).toThrow());
  });

  describe('Test getTarget()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve target', () =>
      expect(heavierThan.getTarget()).toBe(
        heavierThan.properties[1].propertyType
      ));
    it('Test retrieve target', () =>
      expect(derivation.getTarget()).toBe(
        derivation.properties[1].propertyType
      ));
    it('Test exception on ternary relation', () =>
      expect(() => metPersonAt.getTarget()).toThrow());
  });

  describe('Test getMember()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve member', () =>
      expect(metPersonAt.getMember(0)).toBe(
        metPersonAt.properties[0].propertyType
      ));
    it('Test exception on binary relation', () =>
      expect(() => heavierThan.getMember(0)).toThrow());
    it('Test exception on derivation relation', () =>
      expect(() => derivation.getMember(0)).toThrow());
  });

  describe('Test getSourceClass()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve source', () =>
      expect(heavierThan.getSourceAsClass()).toBe(
        heavierThan.properties[0].propertyType
      ));
    it('Test exception on derivation relation', () =>
      expect(() => derivation.getSourceAsClass()).toThrow());
    it('Test exception on ternary relation', () =>
      expect(() => metPersonAt.getSourceAsClass()).toThrow());
  });

  describe('Test getTargetClass()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve target', () =>
      expect(heavierThan.getTargetAsClass()).toBe(
        heavierThan.properties[1].propertyType
      ));
    it('Test exception on derivation relation', () =>
      expect(() => derivation.getTargetAsClass()).toThrow());
    it('Test exception on ternary relation', () =>
      expect(() => metPersonAt.getTargetAsClass()).toThrow());
  });

  describe('Test getMemberClass()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve member', () =>
      expect(metPersonAt.getMemberAsClass(0)).toBe(
        metPersonAt.properties[0].propertyType
      ));
    it('Test exception on binary relation', () =>
      expect(() => heavierThan.getMemberAsClass(0)).toThrow());
    it('Test exception on derivation relation', () =>
      expect(() => derivation.getMemberAsClass(0)).toThrow());
  });

  describe('Test getDerivingRelation()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve source', () =>
      expect(derivation.getDerivingRelation()).toBe(
        derivation.properties[0].propertyType
      ));
    it('Test exception on binary relation', () =>
      expect(() => heavierThan.getDerivingRelation()).toThrow());
    it('Test exception on ternary relation', () =>
      expect(() => metPersonAt.getDerivingRelation()).toThrow());
  });

  describe('Test getDerivedClass()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve target', () =>
      expect(derivation.getDerivedClass()).toBe(
        derivation.properties[1].propertyType
      ));
    it('Test exception on binary relation', () =>
      expect(() => heavierThan.getDerivedClass()).toThrow());
    it('Test exception on ternary relation', () =>
      expect(() => metPersonAt.getDerivedClass()).toThrow());
  });

  describe('Test getSourceStereotype()', () => {
    const model = new Project().createModel();
    const person = model.createKind();
    const heavierThan = model.createBinaryRelation(person, person);

    it("Test retrieve source's stereotype", () =>
      expect(heavierThan.getSourceStereotype()).toBe(ClassStereotype.KIND));
  });

  describe('Test getTargetStereotype()', () => {
    const model = new Project().createModel();
    const person = model.createKind();
    const heavierThan = model.createBinaryRelation(person, person);

    it("Test retrieve target's stereotype", () =>
      expect(heavierThan.getTargetStereotype()).toBe(ClassStereotype.KIND));
  });

  describe('Test getSourceClassStereotype()', () => {
    const model = new Project().createModel();
    const person = model.createKind();
    const heavierThan = model.createBinaryRelation(person, person);

    it("Test retrieve source's stereotype", () =>
      expect(heavierThan.getSourceClassStereotype()).toBe(
        ClassStereotype.KIND
      ));
  });

  describe('Test getTargetClassStereotype()', () => {
    const model = new Project().createModel();
    const person = model.createKind();
    const heavierThan = model.createBinaryRelation(person, person);

    it("Test retrieve target's stereotype", () =>
      expect(heavierThan.getTargetClassStereotype()).toBe(
        ClassStereotype.KIND
      ));
  });

  describe('Test getMemberClassStereotype()', () => {
    const model = new Project().createModel();
    const person = model.createKind();
    const place = model.createKind();
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it("Test retrieve member's stereotype", () =>
      expect(metPersonAt.getMemberClassStereotype(2)).toBe(
        ClassStereotype.KIND
      ));
  });

  describe('Test getDerivingRelationStereotype()', () => {
    const model = new Project().createModel();
    const person = model.createKind();
    const weight = model.createQuality();
    const heavierThan = model.createComparativeRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);

    it("Test retrieve deriving relation's stereotype", () =>
      expect(derivation.getDerivingRelationStereotype()).toBe(
        RelationStereotype.COMPARATIVE
      ));
  });

  describe('Test getDerivedClassStereotype()', () => {
    const model = new Project().createModel();
    const person = model.createKind();
    const weight = model.createQuality();
    const heavierThan = model.createComparativeRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);

    it("Test retrieve derived class' stereotype", () =>
      expect(derivation.getDerivedClassStereotype()).toBe(
        ClassStereotype.QUALITY
      ));
  });

  describe('Test isBinary()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test binary relation', () => expect(heavierThan.isBinary()).toBe(true));
    it('Test derivation relation', () =>
      expect(derivation.isBinary()).toBe(true));
    it('Test ternary relation', () =>
      expect(metPersonAt.isBinary()).toBe(false));
  });

  describe('Test isTernary()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test binary relation', () => expect(heavierThan.isNary()).toBe(false));
    it('Test derivation relation', () =>
      expect(derivation.isNary()).toBe(false));
    it('Test ternary relation', () => expect(metPersonAt.isNary()).toBe(true));
  });

  describe('Test isBinaryClassRelation()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test binary relation', () =>
      expect(heavierThan.isBinaryClassRelation()).toBe(true));
    it('Test derivation relation', () =>
      expect(derivation.isBinaryClassRelation()).toBe(false));
    it('Test ternary relation', () =>
      expect(metPersonAt.isBinaryClassRelation()).toBe(false));
  });

  describe('Test isDerivation()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test binary relation', () =>
      expect(heavierThan.fromRelationToClass()).toBe(false));
    it('Test derivation relation', () =>
      expect(derivation.fromRelationToClass()).toBe(true));
    it('Test ternary relation', () =>
      expect(metPersonAt.fromRelationToClass()).toBe(false));
  });

  describe('Test isTernaryClassRelation()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test binary relation', () =>
      expect(heavierThan.isNaryClassRelation()).toBe(false));
    it('Test derivation relation', () =>
      expect(derivation.isNaryClassRelation()).toBe(false));
    it('Test ternary relation', () =>
      expect(metPersonAt.isNaryClassRelation()).toBe(true));
  });

  describe('Test isPartWholeRelation()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const organization = model.createClass();
    const event = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const memberOf = model.createMemberOfRelation(person, organization);
    const partOf = model.createPartWholeRelation(event, event);

    it('Test function call', () =>
      expect(heavierThan.isPartWholeRelation()).toBe(false));
    it('Test function call', () =>
      expect(memberOf.isPartWholeRelation()).toBe(true));
    it('Test function call', () =>
      expect(partOf.isPartWholeRelation()).toBe(true));
  });

  describe('Test isExistentialDependency()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const weight = model.createClass();
    const worksFor = model.createMaterialRelation(person, person);
    const characterization = model.createCharacterization(weight, person);

    it('Test function call', () =>
      expect(worksFor.isExistentialDependency()).toBe(false));
    it('Test function call', () =>
      expect(characterization.isExistentialDependency()).toBe(true));
  });

  describe('Test isSourceExistentiallyDependent()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const weight = model.createClass();
    const worksFor = model.createMaterialRelation(person, person);
    const characterization = model.createCharacterization(weight, person);

    it('Test function call', () =>
      expect(worksFor.isSourceExistentiallyDependent()).toBe(false));
    it('Test function call', () =>
      expect(characterization.isSourceExistentiallyDependent()).toBe(true));
  });

  describe('Test isTargetExistentiallyDependent()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createComparativeRelation(person, person);
    const characterization = model.createCharacterization(weight, person);

    it('Test function call', () =>
      expect(heavierThan.isTargetExistentiallyDependent()).toBe(true));
    it('Test function call', () =>
      expect(characterization.isTargetExistentiallyDependent()).toBe(false));
  });

  describe('Test isExistentialDependenceRelation()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const weight = model.createClass();
    const worksFor = model.createMaterialRelation(person, person);
    const characterization = model.createCharacterization(weight, person);

    it('Test function call', () =>
      expect(worksFor.isExistentialDependency()).toBe(false));
    it('Test function call', () =>
      expect(characterization.isExistentialDependency()).toBe(true));
  });

  describe('Test holdsBetween()', () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const weight = model.createClass();
    const knows = model.createMaterialRelation(person, person);
    const characterization = model.createCharacterization(weight, person);

    const condition = (relationEnd: Property) =>
      relationEnd.propertyType === person;

    it('Test function call', () =>
      expect(knows.holdsBetween(condition, condition)).toBe(true));
    it('Test function call', () =>
      expect(characterization.holdsBetween(condition, condition)).toBe(false));
  });

  describe('Test holdsBetweenEvents()', () => {
    const model = new Project().createModel();
    const soccerMatch = model.createEvent();
    const goalEvent = model.createEvent();
    const person = model.createKind();
    const weight = model.createQuality();
    const participational = model.createParticipational(goalEvent, soccerMatch);
    const characterization = model.createCharacterization(weight, person);

    it('Test function call', () =>
      expect(participational.holdsBetweenEvents()).toBe(true));
    it('Test function call', () =>
      expect(characterization.holdsBetweenEvents()).toBe(false));
  });

  describe('Test holdsBetweenMoments()', () => {
    const model = new Project().createModel();
    const person = model.createKind();
    const enrollment = model.createRelator();
    const gpa = model.createQuality();
    const mediation = model.createMediation(enrollment, person);
    const characterization = model.createCharacterization(gpa, enrollment);

    it('Test function call', () =>
      expect(mediation.holdsBetweenMoments()).toBe(false));
    it('Test function call', () =>
      expect(characterization.holdsBetweenMoments()).toBe(true));
  });

  describe('Test holdsBetweenSubstantials()', () => {
    const model = new Project().createModel();
    const person = model.createKind();
    const organization = model.createKind();
    const weight = model.createQuality();
    const memberOf = model.createMemberOfRelation(person, organization);
    const characterization = model.createCharacterization(weight, person);

    it('Test function call', () =>
      expect(memberOf.holdsBetweenSubstantials()).toBe(true));
    it('Test function call', () =>
      expect(characterization.holdsBetweenSubstantials()).toBe(false));
  });

  describe('Test clone()', () => {
    const model = new Project().createModel();
    const classA = model.createClass();
    const relationA = model.createBinaryRelation(classA, classA);
    const relationB = relationA.clone();

    const relationC = new Relation();
    const relationD = relationC.clone();

    it('Test method', () => expect(relationA).toEqual(relationB));
    it('Test method', () => expect(relationC).toEqual(relationD));
  });

  describe('Test involves(class)', () => {
    const model = new Project().createModel();
    const husband = model.createRole();
    const man = model.createSubkind();
    const wife = model.createRole();
    const marriage = model.createMaterialRelation(husband, wife);

    it('Test if Source is in relation', () =>
      expect(marriage.involves(husband)).toBeTruthy());
    it('Test if Target is in relation', () =>
      expect(marriage.involves(wife)).toBeTruthy());
    it('Test if a class if out of relation', () =>
      expect(marriage.involves(man)).toBeFalsy());
  });
});
