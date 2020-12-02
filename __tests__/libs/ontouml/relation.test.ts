import { Project, Relation, RelationStereotype, serializationUtils, ClassStereotype, Property } from '@libs/ontouml';

describe(`${Relation.name} Tests`, () => {
  describe(`Test ${Relation.prototype.getGeneralizations.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);
    const isFriendsWith = model.createBinaryRelation(person, person);
    const gen = model.createGeneralization(knows, isFriendsWith);

    it('Test function call', () => expect(knows.getGeneralizations()).toContain(gen));
    it('Test function call', () => expect(knows.getGeneralizations().length).toBe(1));
  });

  describe(`Test ${Relation.prototype.getGeneralizationSets.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);
    const isFriendsWith = model.createBinaryRelation(person, person);
    const gen = model.createGeneralization(knows, isFriendsWith);
    const genSet = model.createGeneralizationSet(gen);

    it('Test function call', () => expect(knows.getGeneralizationSets()).toContain(genSet));
    it('Test function call', () => expect(knows.getGeneralizationSets().length).toBe(1));
  });

  describe(`Test ${Relation.prototype.getGeneralizationsWhereGeneral.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);
    const isFriendsWith = model.createBinaryRelation(person, person);
    const gen = model.createGeneralization(knows, isFriendsWith);

    it('Test function call', () => expect(knows.getGeneralizationsWhereGeneral()).toContain(gen));
    it('Test function call', () => expect(knows.getGeneralizationsWhereGeneral().length).toBe(1));
  });

  describe(`Test ${Relation.prototype.getGeneralizationsWhereSpecific.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);
    const isFriendsWith = model.createBinaryRelation(person, person);
    const gen = model.createGeneralization(knows, isFriendsWith);

    it('Test function call', () => expect(isFriendsWith.getGeneralizationsWhereSpecific()).toContain(gen));
    it('Test function call', () => expect(isFriendsWith.getGeneralizationsWhereSpecific().length).toBe(1));
  });

  describe(`Test ${Relation.prototype.getGeneralizationSetsWhereGeneral.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);
    const isFriendsWith = model.createBinaryRelation(person, person);
    const gen = model.createGeneralization(knows, isFriendsWith);
    const genSet = model.createGeneralizationSet(gen);

    it('Test function call', () => expect(knows.getGeneralizationSetsWhereGeneral()).toContain(genSet));
    it('Test function call', () => expect(knows.getGeneralizationSetsWhereGeneral().length).toBe(1));
  });

  describe(`Test ${Relation.prototype.getGeneralizationSetsWhereSpecific.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);
    const isFriendsWith = model.createBinaryRelation(person, person);
    const gen = model.createGeneralization(knows, isFriendsWith);
    const genSet = model.createGeneralizationSet(gen);

    it('Test function call', () => expect(isFriendsWith.getGeneralizationSetsWhereSpecific()).toContain(genSet));
    it('Test function call', () => expect(isFriendsWith.getGeneralizationSetsWhereSpecific().length).toBe(1));
  });

  describe(`Test ${Relation.prototype.getParents.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);
    const isFriendsWith = model.createBinaryRelation(person, person);
    const isBestFriendsWith = model.createBinaryRelation(person, person);
    model.createGeneralization(knows, isFriendsWith);
    model.createGeneralization(isFriendsWith, isBestFriendsWith);

    it('Test function call', () => expect(isBestFriendsWith.getParents()).toContain(isFriendsWith));
    it('Test function call', () => expect(isBestFriendsWith.getParents().length).toBe(1));
  });

  describe(`Test ${Relation.prototype.getChildren.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);
    const isFriendsWith = model.createBinaryRelation(person, person);
    const isBestFriendsWith = model.createBinaryRelation(person, person);
    model.createGeneralization(knows, isFriendsWith);
    model.createGeneralization(isFriendsWith, isBestFriendsWith);

    it('Test function call', () => expect(knows.getChildren()).toContain(isFriendsWith));
    it('Test function call', () => expect(knows.getChildren().length).toBe(1));
  });

  describe(`Test ${Relation.prototype.getAncestors.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);
    const isFriendsWith = model.createBinaryRelation(person, person);
    const isBestFriendsWith = model.createBinaryRelation(person, person);
    model.createGeneralization(knows, isFriendsWith);
    model.createGeneralization(isFriendsWith, isBestFriendsWith);

    it('Test function call', () => expect(isBestFriendsWith.getAncestors()).toContain(isFriendsWith));
    it('Test function call', () => expect(isBestFriendsWith.getAncestors()).toContain(knows));
    it('Test function call', () => expect(isBestFriendsWith.getAncestors().length).toBe(2));
  });

  describe(`Test ${Relation.prototype.getDescendants.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);
    const isFriendsWith = model.createBinaryRelation(person, person);
    const isBestFriendsWith = model.createBinaryRelation(person, person);
    model.createGeneralization(knows, isFriendsWith);
    model.createGeneralization(isFriendsWith, isBestFriendsWith);

    it('Test function call', () => expect(knows.getDescendants()).toContain(isFriendsWith));
    it('Test function call', () => expect(knows.getDescendants()).toContain(isBestFriendsWith));
    it('Test function call', () => expect(knows.getDescendants().length).toBe(2));
  });

  describe(`Test ${Relation.prototype.getFilteredAncestors.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);
    const isFriendsWith = model.createBinaryRelation(person, person);
    const isBestFriendsWith = model.createBinaryRelation(person, person);
    model.createGeneralization(knows, isFriendsWith);
    model.createGeneralization(isFriendsWith, isBestFriendsWith);
    const filter = (ancestor: Relation) => ancestor === knows;

    it('Test function call', () => expect(isBestFriendsWith.getFilteredAncestors(filter)).toContain(knows));
    it('Test function call', () => expect(isBestFriendsWith.getFilteredAncestors(filter).length).toBe(1));
  });

  describe(`Test ${Relation.prototype.getFilteredDescendants.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);
    const isFriendsWith = model.createBinaryRelation(person, person);
    const isBestFriendsWith = model.createBinaryRelation(person, person);
    model.createGeneralization(knows, isFriendsWith);
    model.createGeneralization(isFriendsWith, isBestFriendsWith);
    const filter = (descendent: Relation) => descendent === isBestFriendsWith;

    it('Test function call', () => expect(knows.getFilteredDescendants(filter)).toContain(isBestFriendsWith));
    it('Test function call', () => expect(knows.getFilteredDescendants(filter).length).toBe(1));
  });

  describe(`Test ${Relation.prototype.getContents.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);

    it('Test function call', () => expect(knows.getContents()).toContain(knows.getTargetEnd()));
    it('Test function call', () => expect(knows.getContents()).toContain(knows.getSourceEnd()));
    it('Test function call', () => expect(knows.getContents().length).toBe(2));
  });

  describe(`Test ${Relation.prototype.getAllContents.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);

    it('Test function call', () => expect(knows.getAllContents()).toContain(knows.getTargetEnd()));
    it('Test function call', () => expect(knows.getAllContents()).toContain(knows.getSourceEnd()));
    it('Test function call', () => expect(knows.getAllContents().length).toBe(2));
  });

  describe(`Test ${Relation.prototype.getUniqueStereotype.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createMaterialRelation(person, person);

    it('Test function call', () => expect(knows.getUniqueStereotype()).toBe(RelationStereotype.MATERIAL));
  });

  describe(`Test ${Relation.prototype.hasValidStereotypeValue.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createMaterialRelation(person, person);
    const worksFor = model.createBinaryRelation(person, person);

    it('Test function call', () => expect(knows.hasValidStereotypeValue()).toBe(true));
    it('Test function call', () => expect(worksFor.hasValidStereotypeValue()).toBe(true));
  });

  describe(`Test ${Relation.prototype.hasStereotypeContainedIn.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createMaterialRelation(person, person);

    it('Test function call', () => expect(knows.hasStereotypeContainedIn([RelationStereotype.MATERIAL])).toBe(true));
  });

  describe(`Test ${Relation.prototype.toJSON.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createMaterialRelation(person, person);

    it('Test serialization', () => expect(() => JSON.stringify(knows)).not.toThrow());
    it('Test serialization validation', () => expect(serializationUtils.validate(knows.project)).toBeTruthy());
  });

  describe(`Test ${Relation.prototype.createSourceEnd.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createRelation();

    knows.createSourceEnd().propertyType = person;
    knows.createTargetEnd().propertyType = person;

    it('Test creation', () => expect(knows.getSourceEnd()).toBeDefined());
    it('Test exception on second creation', () => expect(() => knows.createSourceEnd()).toThrow());
  });

  describe(`Test ${Relation.prototype.createTargetEnd.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const knows = model.createRelation();

    knows.createSourceEnd().propertyType = person;
    knows.createTargetEnd().propertyType = person;

    it('Test creation', () => expect(knows.getTargetEnd()).toBeDefined());
    it('Test exception on second creation', () => expect(() => knows.createTargetEnd()).toThrow());
  });

  describe(`Test ${Relation.prototype.createMemberEnd.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const metPersonAt = model.createRelation();

    metPersonAt.createMemberEnd().propertyType = person;
    metPersonAt.createMemberEnd(1).propertyType = person;
    metPersonAt.createMemberEnd(2).propertyType = place;

    it('Test creation', () => expect(metPersonAt.getMemberEnd(0)).toBeDefined());
    it('Test exception on second creation', () => expect(() => metPersonAt.createMemberEnd(0)).toThrow());
    it('Test exception on invalid creation position', () => expect(() => metPersonAt.createMemberEnd(-1)).toThrow());
  });

  describe(`Test ${Relation.prototype.setContainer.name}()`, () => {
    const model = new Project().createModel();
    const pkg = model.createPackage();
    const person = model.createClass();
    const knows = model.createBinaryRelation(person, person);

    it('Test function call', () => {
      expect(knows.container).toBe(model);
      expect(knows.container).not.toBe(pkg);
      expect(model.getContents()).toContain(knows);
      expect(pkg.getContents()).not.toContain(knows);

      knows.setContainer(pkg);

      expect(knows.container).toBe(pkg);
      expect(knows.container).not.toBe(model);
      expect(pkg.getContents()).toContain(knows);
      expect(model.getContents()).not.toContain(knows);
    });
  });

  describe(`Test ${Relation.prototype.getSourceEnd.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve source end', () => expect(heavierThan.getSourceEnd()).toBe(heavierThan.properties[0]));
    it('Test retrieve source end', () => expect(derivation.getSourceEnd()).toBe(derivation.properties[0]));
    it('Test exception on ternary relation', () => expect(() => metPersonAt.getSourceEnd()).toThrow());
  });

  describe(`Test ${Relation.prototype.getTargetEnd.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve target end', () => expect(heavierThan.getTargetEnd()).toBe(heavierThan.properties[1]));
    it('Test retrieve target end', () => expect(derivation.getTargetEnd()).toBe(derivation.properties[1]));
    it('Test exception on ternary relation', () => expect(() => metPersonAt.getTargetEnd()).toThrow());
  });

  describe(`Test ${Relation.prototype.getMemberEnd.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve member end', () => expect(metPersonAt.getMemberEnd(0)).toBe(metPersonAt.properties[0]));
    it('Test exception on binary relation', () => expect(() => heavierThan.getMemberEnd(0)).toThrow());
    it('Test exception on derivation relation', () => expect(() => derivation.getMemberEnd(0)).toThrow());
  });

  describe(`Test ${Relation.prototype.getSourceClassEnd.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve source end', () => expect(heavierThan.getSourceClassEnd()).toBe(heavierThan.properties[0]));
    it('Test exception on derivation relation', () => expect(() => derivation.getSourceClassEnd()).toThrow());
    it('Test exception on ternary relation', () => expect(() => metPersonAt.getSourceClassEnd()).toThrow());
  });

  describe(`Test ${Relation.prototype.getTargetClassEnd.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve target end', () => expect(heavierThan.getTargetClassEnd()).toBe(heavierThan.properties[1]));
    it('Test exception on derivation relation', () => expect(() => derivation.getTargetClassEnd()).toThrow());
    it('Test exception on ternary relation', () => expect(() => metPersonAt.getTargetClassEnd()).toThrow());
  });

  describe(`Test ${Relation.prototype.getDerivingRelationEnd.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve deriving end', () => expect(derivation.getDerivingRelationEnd()).toBe(derivation.properties[0]));
    it('Test exception on binary relation', () => expect(() => heavierThan.getDerivingRelationEnd()).toThrow());
    it('Test exception on ternary relation', () => expect(() => metPersonAt.getDerivingRelationEnd()).toThrow());
  });

  describe(`Test ${Relation.prototype.getDerivedClassEnd.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve derived end', () => expect(derivation.getDerivedClassEnd()).toBe(derivation.properties[1]));
    it('Test exception on binary relation', () => expect(() => heavierThan.getDerivedClassEnd()).toThrow());
    it('Test exception on ternary relation', () => expect(() => metPersonAt.getDerivedClassEnd()).toThrow());
  });

  describe(`Test ${Relation.prototype.getMemberClassEnd.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve member end', () => expect(metPersonAt.getMemberClassEnd(0)).toBe(metPersonAt.properties[0]));
    it('Test exception on binary relation', () => expect(() => heavierThan.getMemberClassEnd(0)).toThrow());
    it('Test exception on derivation relation', () => expect(() => derivation.getMemberClassEnd(0)).toThrow());
  });

  describe(`Test ${Relation.prototype.getSource.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve source', () => expect(heavierThan.getSource()).toBe(heavierThan.properties[0].propertyType));
    it('Test retrieve source', () => expect(derivation.getSource()).toBe(derivation.properties[0].propertyType));
    it('Test exception on ternary relation', () => expect(() => metPersonAt.getSource()).toThrow());
  });

  describe(`Test ${Relation.prototype.getTarget.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve target', () => expect(heavierThan.getTarget()).toBe(heavierThan.properties[1].propertyType));
    it('Test retrieve target', () => expect(derivation.getTarget()).toBe(derivation.properties[1].propertyType));
    it('Test exception on ternary relation', () => expect(() => metPersonAt.getTarget()).toThrow());
  });

  describe(`Test ${Relation.prototype.getMember.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve member', () => expect(metPersonAt.getMember(0)).toBe(metPersonAt.properties[0].propertyType));
    it('Test exception on binary relation', () => expect(() => heavierThan.getMember(0)).toThrow());
    it('Test exception on derivation relation', () => expect(() => derivation.getMember(0)).toThrow());
  });

  describe(`Test ${Relation.prototype.getSourceClass.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve source', () => expect(heavierThan.getSourceClass()).toBe(heavierThan.properties[0].propertyType));
    it('Test exception on derivation relation', () => expect(() => derivation.getSourceClass()).toThrow());
    it('Test exception on ternary relation', () => expect(() => metPersonAt.getSourceClass()).toThrow());
  });

  describe(`Test ${Relation.prototype.getTargetClass.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve target', () => expect(heavierThan.getTargetClass()).toBe(heavierThan.properties[1].propertyType));
    it('Test exception on derivation relation', () => expect(() => derivation.getTargetClass()).toThrow());
    it('Test exception on ternary relation', () => expect(() => metPersonAt.getTargetClass()).toThrow());
  });

  describe(`Test ${Relation.prototype.getMemberClass.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve member', () => expect(metPersonAt.getMemberClass(0)).toBe(metPersonAt.properties[0].propertyType));
    it('Test exception on binary relation', () => expect(() => heavierThan.getMemberClass(0)).toThrow());
    it('Test exception on derivation relation', () => expect(() => derivation.getMemberClass(0)).toThrow());
  });

  describe(`Test ${Relation.prototype.getDerivingRelation.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve source', () => expect(derivation.getDerivingRelation()).toBe(derivation.properties[0].propertyType));
    it('Test exception on binary relation', () => expect(() => heavierThan.getDerivingRelation()).toThrow());
    it('Test exception on ternary relation', () => expect(() => metPersonAt.getDerivingRelation()).toThrow());
  });

  describe(`Test ${Relation.prototype.getDerivedClass.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test retrieve target', () => expect(derivation.getDerivedClass()).toBe(derivation.properties[1].propertyType));
    it('Test exception on binary relation', () => expect(() => heavierThan.getDerivedClass()).toThrow());
    it('Test exception on ternary relation', () => expect(() => metPersonAt.getDerivedClass()).toThrow());
  });

  describe(`Test ${Relation.prototype.getSourceStereotype.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createKind();
    const heavierThan = model.createBinaryRelation(person, person);

    it("Test retrieve source's stereotype", () => expect(heavierThan.getSourceStereotype()).toBe(ClassStereotype.KIND));
  });

  describe(`Test ${Relation.prototype.getTargetStereotype.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createKind();
    const heavierThan = model.createBinaryRelation(person, person);

    it("Test retrieve target's stereotype", () => expect(heavierThan.getTargetStereotype()).toBe(ClassStereotype.KIND));
  });

  describe(`Test ${Relation.prototype.getSourceClassStereotype.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createKind();
    const heavierThan = model.createBinaryRelation(person, person);

    it("Test retrieve source's stereotype", () => expect(heavierThan.getSourceClassStereotype()).toBe(ClassStereotype.KIND));
  });

  describe(`Test ${Relation.prototype.getTargetClassStereotype.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createKind();
    const heavierThan = model.createBinaryRelation(person, person);

    it("Test retrieve target's stereotype", () => expect(heavierThan.getTargetClassStereotype()).toBe(ClassStereotype.KIND));
  });

  describe(`Test ${Relation.prototype.getMemberClassStereotype.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createKind();
    const place = model.createKind();
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it("Test retrieve member's stereotype", () => expect(metPersonAt.getMemberClassStereotype(2)).toBe(ClassStereotype.KIND));
  });

  describe(`Test ${Relation.prototype.getDerivingRelationStereotype.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createKind();
    const weight = model.createQuality();
    const heavierThan = model.createComparativeRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);

    it("Test retrieve deriving relation's stereotype", () =>
      expect(derivation.getDerivingRelationStereotype()).toBe(RelationStereotype.COMPARATIVE));
  });

  describe(`Test ${Relation.prototype.getDerivedClassStereotype.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createKind();
    const weight = model.createQuality();
    const heavierThan = model.createComparativeRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);

    it("Test retrieve derived class' stereotype", () =>
      expect(derivation.getDerivedClassStereotype()).toBe(ClassStereotype.QUALITY));
  });

  describe(`Test ${Relation.prototype.isBinaryRelation.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test binary relation', () => expect(heavierThan.isBinaryRelation()).toBe(true));
    it('Test derivation relation', () => expect(derivation.isBinaryRelation()).toBe(true));
    it('Test ternary relation', () => expect(metPersonAt.isBinaryRelation()).toBe(false));
  });

  describe(`Test ${Relation.prototype.isTernaryRelation.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test binary relation', () => expect(heavierThan.isTernaryRelation()).toBe(false));
    it('Test derivation relation', () => expect(derivation.isTernaryRelation()).toBe(false));
    it('Test ternary relation', () => expect(metPersonAt.isTernaryRelation()).toBe(true));
  });

  describe(`Test ${Relation.prototype.isBinaryClassRelation.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test binary relation', () => expect(heavierThan.isBinaryClassRelation()).toBe(true));
    it('Test derivation relation', () => expect(derivation.isBinaryClassRelation()).toBe(false));
    it('Test ternary relation', () => expect(metPersonAt.isBinaryClassRelation()).toBe(false));
  });

  describe(`Test ${Relation.prototype.isDerivationRelation.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test binary relation', () => expect(heavierThan.isDerivationRelation()).toBe(false));
    it('Test derivation relation', () => expect(derivation.isDerivationRelation()).toBe(true));
    it('Test ternary relation', () => expect(metPersonAt.isDerivationRelation()).toBe(false));
  });

  describe(`Test ${Relation.prototype.isTernaryClassRelation.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const place = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);
    const metPersonAt = model.createTernaryRelation([person, person, place]);

    it('Test binary relation', () => expect(heavierThan.isTernaryClassRelation()).toBe(false));
    it('Test derivation relation', () => expect(derivation.isTernaryClassRelation()).toBe(false));
    it('Test ternary relation', () => expect(metPersonAt.isTernaryClassRelation()).toBe(true));
  });

  describe(`Test ${Relation.prototype.isPartWholeRelation.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const organization = model.createClass();
    const event = model.createClass();
    const heavierThan = model.createBinaryRelation(person, person);
    const memberOf = model.createMemberOfRelation(person, organization);
    const partOf = model.createPartWholeRelation(event, event);

    it('Test function call', () => expect(heavierThan.isPartWholeRelation()).toBe(false));
    it('Test function call', () => expect(memberOf.isPartWholeRelation()).toBe(true));
    it('Test function call', () => expect(partOf.isPartWholeRelation()).toBe(true));
  });

  describe(`Test ${Relation.prototype.isExistentialDependency.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const weight = model.createClass();
    const worksFor = model.createMaterialRelation(person, person);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(worksFor.isExistentialDependency()).toBe(false));
    it('Test function call', () => expect(characterization.isExistentialDependency()).toBe(true));
  });

  describe(`Test ${Relation.prototype.isSourceExistentiallyDependent.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const weight = model.createClass();
    const worksFor = model.createMaterialRelation(person, person);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(worksFor.isSourceExistentiallyDependent()).toBe(false));
    it('Test function call', () => expect(characterization.isSourceExistentiallyDependent()).toBe(true));
  });

  describe(`Test ${Relation.prototype.isTargetExistentiallyDependent.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createComparativeRelation(person, person);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(heavierThan.isTargetExistentiallyDependent()).toBe(true));
    it('Test function call', () => expect(characterization.isTargetExistentiallyDependent()).toBe(false));
  });

  describe(`Test ${Relation.prototype.isExistentialDependenceRelation.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const weight = model.createClass();
    const worksFor = model.createMaterialRelation(person, person);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(worksFor.isExistentialDependenceRelation()).toBe(false));
    it('Test function call', () => expect(characterization.isExistentialDependenceRelation()).toBe(true));
  });

  describe(`Test ${Relation.prototype.hasExistentialDependenceStereotype.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const weight = model.createClass();
    const worksFor = model.createMaterialRelation(person, person);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(worksFor.hasExistentialDependenceStereotype()).toBe(false));
    it('Test function call', () => expect(characterization.hasExistentialDependenceStereotype()).toBe(true));
  });

  describe(`Test ${Relation.prototype.hasMaterialStereotype.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const weight = model.createClass();
    const worksFor = model.createMaterialRelation(person, person);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(worksFor.hasMaterialStereotype()).toBe(true));
    it('Test function call', () => expect(characterization.hasMaterialStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.hasDerivationStereotype.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createComparativeRelation(person, person);
    const derivation = model.createDerivationRelation(heavierThan, weight);

    it('Test function call', () => expect(derivation.hasDerivationStereotype()).toBe(true));
    it('Test function call', () => expect(heavierThan.hasDerivationStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.hasComparativeStereotype.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const weight = model.createClass();
    const heavierThan = model.createComparativeRelation(person, person);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(heavierThan.hasComparativeStereotype()).toBe(true));
    it('Test function call', () => expect(characterization.hasComparativeStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.hasMediationStereotype.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const enrollment = model.createClass();
    const weight = model.createClass();
    const mediation = model.createMediationRelation(enrollment, person);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(mediation.hasMediationStereotype()).toBe(true));
    it('Test function call', () => expect(characterization.hasMediationStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.hasCharacterizationStereotype.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const weight = model.createClass();
    const worksFor = model.createMaterialRelation(person, person);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(characterization.hasCharacterizationStereotype()).toBe(true));
    it('Test function call', () => expect(worksFor.hasCharacterizationStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.hasExternalDependenceStereotype.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const commitment = model.createClass();
    const worksFor = model.createMaterialRelation(person, person);
    const externalDependence = model.createExternalDependencyRelation(commitment, person);

    it('Test function call', () => expect(externalDependence.hasExternalDependenceStereotype()).toBe(true));
    it('Test function call', () => expect(worksFor.hasExternalDependenceStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.hasComponentOfStereotype.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const organ = model.createClass();
    const weight = model.createClass();
    const componentOf = model.createComponentOfRelation(organ, person);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(componentOf.hasComponentOfStereotype()).toBe(true));
    it('Test function call', () => expect(characterization.hasComponentOfStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.hasMemberOfStereotype.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const organization = model.createClass();
    const weight = model.createClass();
    const memberOf = model.createMemberOfRelation(person, organization);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(memberOf.hasMemberOfStereotype()).toBe(true));
    it('Test function call', () => expect(characterization.hasMemberOfStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.hasSubCollectionOfStereotype.name}()`, () => {
    const model = new Project().createModel();
    const organization = model.createClass();
    const person = model.createClass();
    const weight = model.createClass();
    const subCollectionOf = model.createSubCollectionOfRelation(organization, organization);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(subCollectionOf.hasSubCollectionOfStereotype()).toBe(true));
    it('Test function call', () => expect(characterization.hasSubCollectionOfStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.hasSubQuantityOfStereotype.name}()`, () => {
    const model = new Project().createModel();
    const wine = model.createClass();
    const water = model.createClass();
    const person = model.createClass();
    const weight = model.createClass();
    const subQuantityOf = model.createSubQuantityOfRelation(water, wine);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(subQuantityOf.hasSubQuantityOfStereotype()).toBe(true));
    it('Test function call', () => expect(characterization.hasSubQuantityOfStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.hasInstantiationStereotype.name}()`, () => {
    const model = new Project().createModel();
    const personType = model.createClass();
    const person = model.createClass();
    const weight = model.createClass();
    const instantiation = model.createInstantiationRelation(person, personType);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(instantiation.hasInstantiationStereotype()).toBe(true));
    it('Test function call', () => expect(characterization.hasInstantiationStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.hasTerminationStereotype.name}()`, () => {
    const model = new Project().createModel();
    const death = model.createClass();
    const person = model.createClass();
    const weight = model.createClass();
    const terminates = model.createTerminationRelation(death, person);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(terminates.hasTerminationStereotype()).toBe(true));
    it('Test function call', () => expect(characterization.hasTerminationStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.hasParticipationalStereotype.name}()`, () => {
    const model = new Project().createModel();
    const soccerMatch = model.createClass();
    const goalEvent = model.createClass();
    const person = model.createClass();
    const weight = model.createClass();
    const participational = model.createParticipationalRelation(goalEvent, soccerMatch);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(participational.hasParticipationalStereotype()).toBe(true));
    it('Test function call', () => expect(characterization.hasParticipationalStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.hasParticipationStereotype.name}()`, () => {
    const model = new Project().createModel();
    const soccerMatch = model.createClass();
    const person = model.createClass();
    const weight = model.createClass();
    const participation = model.createParticipationRelation(person, soccerMatch);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(participation.hasParticipationStereotype()).toBe(true));
    it('Test function call', () => expect(characterization.hasParticipationStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.hasHistoricalDependenceStereotype.name}()`, () => {
    const model = new Project().createModel();
    const presidencyEvent = model.createClass();
    const person = model.createClass();
    const weight = model.createClass();
    const historicalDependence = model.createHistoricalDependenceRelation(person, presidencyEvent); // former president
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(historicalDependence.hasHistoricalDependenceStereotype()).toBe(true));
    it('Test function call', () => expect(characterization.hasHistoricalDependenceStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.hasCreationStereotype.name}()`, () => {
    const model = new Project().createModel();
    const birth = model.createClass();
    const person = model.createClass();
    const weight = model.createClass();
    const creation = model.createCreationRelation(birth, person);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(creation.hasCreationStereotype()).toBe(true));
    it('Test function call', () => expect(characterization.hasCreationStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.hasManifestationStereotype.name}()`, () => {
    const model = new Project().createModel();
    const weightMeasurement = model.createClass();
    const person = model.createClass();
    const weight = model.createClass();
    const manifestation = model.createManifestationRelation(weightMeasurement, weight);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(manifestation.hasManifestationStereotype()).toBe(true));
    it('Test function call', () => expect(characterization.hasManifestationStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.hasBringsAboutStereotype.name}()`, () => {
    const model = new Project().createModel();
    const conceptionEvent = model.createClass();
    const pregnancySituation = model.createClass();
    const person = model.createClass();
    const weight = model.createClass();
    const bringsAbout = model.createBringsAboutRelation(conceptionEvent, pregnancySituation);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(bringsAbout.hasBringsAboutStereotype()).toBe(true));
    it('Test function call', () => expect(characterization.hasBringsAboutStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.hasTriggersStereotype.name}()`, () => {
    const model = new Project().createModel();
    const birthEvent = model.createClass();
    const pregnancySituation = model.createClass();
    const person = model.createClass();
    const weight = model.createClass();
    const bringsAbout = model.createTriggersRelation(pregnancySituation, birthEvent);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(bringsAbout.hasTriggersStereotype()).toBe(true));
    it('Test function call', () => expect(characterization.hasTriggersStereotype()).toBe(false));
  });

  describe(`Test ${Relation.prototype.holdsBetween.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createClass();
    const weight = model.createClass();
    const knows = model.createMaterialRelation(person, person);
    const characterization = model.createCharacterizationRelation(weight, person);

    const condition = (relationEnd: Property) => relationEnd.propertyType === person;

    it('Test function call', () => expect(knows.holdsBetween(condition, condition)).toBe(true));
    it('Test function call', () => expect(characterization.holdsBetween(condition, condition)).toBe(false));
  });

  describe(`Test ${Relation.prototype.holdsBetweenEvents.name}()`, () => {
    const model = new Project().createModel();
    const soccerMatch = model.createEvent();
    const goalEvent = model.createEvent();
    const person = model.createKind();
    const weight = model.createQuality();
    const participational = model.createParticipationalRelation(goalEvent, soccerMatch);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(participational.holdsBetweenEvents()).toBe(true));
    it('Test function call', () => expect(characterization.holdsBetweenEvents()).toBe(false));
  });

  describe(`Test ${Relation.prototype.holdsBetweenMoments.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createKind();
    const enrollment = model.createRelator();
    const gpa = model.createQuality();
    const mediation = model.createMediationRelation(enrollment, person);
    const characterization = model.createCharacterizationRelation(gpa, enrollment);

    it('Test function call', () => expect(mediation.holdsBetweenMoments()).toBe(false));
    it('Test function call', () => expect(characterization.holdsBetweenMoments()).toBe(true));
  });

  describe(`Test ${Relation.prototype.holdsBetweenSubstantials.name}()`, () => {
    const model = new Project().createModel();
    const person = model.createKind();
    const organization = model.createKind();
    const weight = model.createQuality();
    const memberOf = model.createMemberOfRelation(person, organization);
    const characterization = model.createCharacterizationRelation(weight, person);

    it('Test function call', () => expect(memberOf.holdsBetweenSubstantials()).toBe(true));
    it('Test function call', () => expect(characterization.holdsBetweenSubstantials()).toBe(false));
  });

  describe(`Test ${Relation.prototype.clone.name}()`, () => {
    // TODO: implement test
  });

  describe(`Test ${Relation.prototype.replace.name}()`, () => {
    // TODO: implement test
  });
});
