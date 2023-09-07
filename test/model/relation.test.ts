import {
  Project,
  Relation,
  RelationStereotype,
  ClassStereotype,
  Property
} from '../../src';

describe('Relation Tests', () => {
  const proj = new Project();
  const person = proj.classBuilder().build();

  const knows = proj
    .binaryRelationBuilder()
    .source(person)
    .target(person)
    .build();

  const isFriendsWith = proj
    .binaryRelationBuilder()
    .source(person)
    .target(person)
    .build();

  const gen = proj
    .generalizationBuilder()
    .general(knows)
    .specific(isFriendsWith)
    .build();

  const genSet = proj.generalizationSetBuilder().generalizations(gen).build();

  describe('Test getContents()', () => {
    it('Test function call', () =>
      expect(knows.getContents()).toContain(knows.getTargetEnd()));
    it('Test function call', () =>
      expect(knows.getContents()).toContain(knows.getSourceEnd()));
    it('Test function call', () => expect(knows.getContents().length).toBe(2));
  });

  describe('Test getAllContents()', () => {
    it('Test function call', () =>
      expect(knows.getAllContents()).toContain(knows.getTargetEnd()));
    it('Test function call', () =>
      expect(knows.getAllContents()).toContain(knows.getSourceEnd()));
    it('Test function call', () =>
      expect(knows.getAllContents().length).toBe(2));
  });

  describe('Test createSourceEnd()', () => {
    const proj = new Project();
    const person = proj.classBuilder().build();
    const knows = model.createRelation();

    knows.createSourceEnd().propertyType = person;
    knows.createTargetEnd().propertyType = person;

    it('Test creation', () => expect(knows.getSourceEnd()).toBeDefined());
    it('Test exception on second creation', () =>
      expect(() => knows.createSourceEnd()).toThrow());
  });

  describe('Test createTargetEnd()', () => {
    const proj = new Project();
    const person = proj.classBuilder().build();
    const knows = model.createRelation();

    knows.createSourceEnd().propertyType = person;
    knows.createTargetEnd().propertyType = person;

    it('Test creation', () => expect(knows.getTargetEnd()).toBeDefined());
    it('Test exception on second creation', () =>
      expect(() => knows.createTargetEnd()).toThrow());
  });

  describe('Test createMemberEnd()', () => {
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
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
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
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
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
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
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
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
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
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
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
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
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
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
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
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
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
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
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
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
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
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
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
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
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
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
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
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
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
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
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
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
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
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
    const proj = new Project();
    const person = model.createKind();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();

    it("Test retrieve source's stereotype", () =>
      expect(heavierThan.getSourceStereotype()).toBe(ClassStereotype.KIND));
  });

  describe('Test getTargetStereotype()', () => {
    const proj = new Project();
    const person = model.createKind();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();

    it("Test retrieve target's stereotype", () =>
      expect(heavierThan.getTargetStereotype()).toBe(ClassStereotype.KIND));
  });

  describe('Test getSourceClassStereotype()', () => {
    const proj = new Project();
    const person = model.createKind();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();

    it("Test retrieve source's stereotype", () =>
      expect(heavierThan.getSourceClassStereotype()).toBe(
        ClassStereotype.KIND
      ));
  });

  describe('Test getTargetClassStereotype()', () => {
    const proj = new Project();
    const person = model.createKind();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();

    it("Test retrieve target's stereotype", () =>
      expect(heavierThan.getTargetClassStereotype()).toBe(
        ClassStereotype.KIND
      ));
  });

  describe('Test getMemberClassStereotype()', () => {
    const proj = new Project();
    const person = model.createKind();
    const place = model.createKind();
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it("Test retrieve member's stereotype", () =>
      expect(metPersonAt.getMemberClassStereotype(2)).toBe(
        ClassStereotype.KIND
      ));
  });

  describe('Test getDerivingRelationStereotype()', () => {
    const proj = new Project();
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
    const proj = new Project();
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
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test binary relation', () => expect(heavierThan.isBinary()).toBeTrue());
    it('Test derivation relation', () =>
      expect(derivation.isBinary()).toBeTrue());
    it('Test ternary relation', () =>
      expect(metPersonAt.isBinary()).toBeFalse());
  });

  describe('Test isTernary()', () => {
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test binary relation', () => expect(heavierThan.isNary()).toBeFalse());
    it('Test derivation relation', () =>
      expect(derivation.isNary()).toBeFalse());
    it('Test ternary relation', () => expect(metPersonAt.isNary()).toBeTrue());
  });

  describe('Test isBinaryClassRelation()', () => {
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test binary relation', () =>
      expect(heavierThan.isBinaryClassRelation()).toBeTrue());
    it('Test derivation relation', () =>
      expect(derivation.isBinaryClassRelation()).toBeFalse());
    it('Test ternary relation', () =>
      expect(metPersonAt.isBinaryClassRelation()).toBeFalse());
  });

  describe('Test isDerivation()', () => {
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test binary relation', () =>
      expect(heavierThan.fromRelationToClass()).toBeFalse());
    it('Test derivation relation', () =>
      expect(derivation.fromRelationToClass()).toBeTrue());
    it('Test ternary relation', () =>
      expect(metPersonAt.fromRelationToClass()).toBeFalse());
  });

  describe('Test isTernaryClassRelation()', () => {
    const proj = new Project();
    const person = proj.classBuilder().build();
    const place = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
    const derivation = model.createDerivation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test binary relation', () =>
      expect(heavierThan.isNaryClassRelation()).toBeFalse());
    it('Test derivation relation', () =>
      expect(derivation.isNaryClassRelation()).toBeFalse());
    it('Test ternary relation', () =>
      expect(metPersonAt.isNaryClassRelation()).toBeTrue());
  });

  describe('Test isPartWholeRelation()', () => {
    const proj = new Project();
    const person = proj.classBuilder().build();
    const organization = proj.classBuilder().build();
    const event = proj.classBuilder().build();
    const heavierThan = proj
      .binaryRelationBuilder()
      .source(person)
      .target(person)
      .build();
    const memberOf = model.createMemberOfRelation(person, organization);
    const partOf = model.createPartWholeRelation(event, event);

    it('Test function call', () =>
      expect(heavierThan.isPartWholeRelation()).toBeFalse());
    it('Test function call', () =>
      expect(memberOf.isPartWholeRelation()).toBeTrue());
    it('Test function call', () =>
      expect(partOf.isPartWholeRelation()).toBeTrue());
  });

  describe('Test isExistentialDependency()', () => {
    const proj = new Project();
    const person = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const worksFor = model.createMaterialRelation(person, person);
    const characterization = model.createCharacterization(weight, person);

    it('Test function call', () =>
      expect(worksFor.isExistentialDependency()).toBeFalse());
    it('Test function call', () =>
      expect(characterization.isExistentialDependency()).toBeTrue());
  });

  describe('Test isSourceExistentiallyDependent()', () => {
    const proj = new Project();
    const person = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const worksFor = model.createMaterialRelation(person, person);
    const characterization = model.createCharacterization(weight, person);

    it('Test function call', () =>
      expect(worksFor.isSourceExistentiallyDependent()).toBeFalse());
    it('Test function call', () =>
      expect(characterization.isSourceExistentiallyDependent()).toBeTrue());
  });

  describe('Test isTargetExistentiallyDependent()', () => {
    const proj = new Project();
    const person = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const heavierThan = model.createComparativeRelation(person, person);
    const characterization = model.createCharacterization(weight, person);

    it('Test function call', () =>
      expect(heavierThan.isTargetExistentiallyDependent()).toBeTrue());
    it('Test function call', () =>
      expect(characterization.isTargetExistentiallyDependent()).toBeFalse());
  });

  describe('Test isExistentialDependenceRelation()', () => {
    const proj = new Project();
    const person = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const worksFor = model.createMaterialRelation(person, person);
    const characterization = model.createCharacterization(weight, person);

    it('Test function call', () =>
      expect(worksFor.isExistentialDependency()).toBeFalse());
    it('Test function call', () =>
      expect(characterization.isExistentialDependency()).toBeTrue());
  });

  describe('Test holdsBetween()', () => {
    const proj = new Project();
    const person = proj.classBuilder().build();
    const weight = proj.classBuilder().build();
    const knows = model.createMaterialRelation(person, person);
    const characterization = model.createCharacterization(weight, person);

    const condition = (relationEnd: Property) =>
      relationEnd.propertyType === person;

    it('Test function call', () =>
      expect(knows.holdsBetween(condition, condition)).toBeTrue());
    it('Test function call', () =>
      expect(characterization.holdsBetween(condition, condition)).toBeFalse());
  });

  describe('Test holdsBetweenEvents()', () => {
    const proj = new Project();
    const soccerMatch = model.createEvent();
    const goalEvent = model.createEvent();
    const person = model.createKind();
    const weight = model.createQuality();
    const participational = model.createParticipational(goalEvent, soccerMatch);
    const characterization = model.createCharacterization(weight, person);

    it('Test function call', () =>
      expect(participational.holdsBetweenEvents()).toBeTrue());
    it('Test function call', () =>
      expect(characterization.holdsBetweenEvents()).toBeFalse());
  });

  describe('Test holdsBetweenMoments()', () => {
    const proj = new Project();
    const person = model.createKind();
    const enrollment = model.createRelator();
    const gpa = model.createQuality();
    const mediation = model.createMediation(enrollment, person);
    const characterization = model.createCharacterization(gpa, enrollment);

    it('Test function call', () =>
      expect(mediation.holdsBetweenMoments()).toBeFalse());
    it('Test function call', () =>
      expect(characterization.holdsBetweenMoments()).toBeTrue());
  });

  describe('Test holdsBetweenSubstantials()', () => {
    const proj = new Project();
    const person = model.createKind();
    const organization = model.createKind();
    const weight = model.createQuality();
    const memberOf = model.createMemberOfRelation(person, organization);
    const characterization = model.createCharacterization(weight, person);

    it('Test function call', () =>
      expect(memberOf.holdsBetweenSubstantials()).toBeTrue());
    it('Test function call', () =>
      expect(characterization.holdsBetweenSubstantials()).toBeFalse());
  });

  describe('Test clone()', () => {
    const proj = new Project();
    const classA = proj.classBuilder().build();
    const relationA = model.createBinaryRelation(classA, classA);
    const relationB = relationA.clone();

    const relationC = new Relation();
    const relationD = relationC.clone();

    it('Test method', () => expect(relationA).toEqual(relationB));
    it('Test method', () => expect(relationC).toEqual(relationD));
  });

  describe('Test involves(class)', () => {
    const proj = new Project();
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
