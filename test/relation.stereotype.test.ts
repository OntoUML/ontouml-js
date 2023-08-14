import { describe, expect, it } from '@jest/globals';
import { Project, RelationStereotype } from '../src';

describe('Test isStereotypeValid()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const knows = model.createMaterialRelation(person, person);
  const worksFor = model.createBinaryRelation(person, person);

  it('should return true for a relation with an OntoUML stereotype', () => expect(knows.hasValidStereotype()).toBe(true));
  it('should return true for a relation without a stereotype (by default; allowsNone: true)', () =>
    expect(worksFor.hasValidStereotype()).toBe(true));
  it('should return false for a relation without a stereotype (allowsNone: false)', () =>
    expect(worksFor.hasValidStereotype(false)).toBe(false));
});

describe('Test hasAnyStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const knows = model.createMaterialRelation(person, person);

  it('Test function call', () => expect(knows.isStereotypeOneOf([RelationStereotype.MATERIAL])).toBe(true));
});

describe('Test hasExistentialDependenceStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const weight = model.createClass();
  const worksFor = model.createMaterialRelation(person, person);
  const characterization = model.createCharacterizationRelation(weight, person);

  it('Test function call', () => expect(worksFor.hasExistentialDependencyStereotype()).toBe(false));
  it('Test function call', () => expect(characterization.hasExistentialDependencyStereotype()).toBe(true));
});

describe('Test hasMaterialStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const weight = model.createClass();
  const worksFor = model.createMaterialRelation(person, person);
  const characterization = model.createCharacterizationRelation(weight, person);

  it('Test function call', () => expect(worksFor.hasMaterialStereotype()).toBe(true));
  it('Test function call', () => expect(characterization.hasMaterialStereotype()).toBe(false));
});

describe('Test hasDerivationStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const weight = model.createClass();
  const heavierThan = model.createComparativeRelation(person, person);
  const derivation = model.createDerivationRelation(heavierThan, weight);

  it('Test function call', () => expect(derivation.hasDerivationStereotype()).toBe(true));
  it('Test function call', () => expect(heavierThan.hasDerivationStereotype()).toBe(false));
});

describe('Test hasComparativeStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const weight = model.createClass();
  const heavierThan = model.createComparativeRelation(person, person);
  const characterization = model.createCharacterizationRelation(weight, person);

  it('Test function call', () => expect(heavierThan.hasComparativeStereotype()).toBe(true));
  it('Test function call', () => expect(characterization.hasComparativeStereotype()).toBe(false));
});

describe('Test hasMediationStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const enrollment = model.createClass();
  const weight = model.createClass();
  const mediation = model.createMediationRelation(enrollment, person);
  const characterization = model.createCharacterizationRelation(weight, person);

  it('Test function call', () => expect(mediation.hasMediationStereotype()).toBe(true));
  it('Test function call', () => expect(characterization.hasMediationStereotype()).toBe(false));
});

describe('Test hasCharacterizationStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const weight = model.createClass();
  const worksFor = model.createMaterialRelation(person, person);
  const characterization = model.createCharacterizationRelation(weight, person);

  it('Test function call', () => expect(characterization.hasCharacterizationStereotype()).toBe(true));
  it('Test function call', () => expect(worksFor.hasCharacterizationStereotype()).toBe(false));
});

describe('Test hasExternalDependenceStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const commitment = model.createClass();
  const worksFor = model.createMaterialRelation(person, person);
  const externalDependence = model.createExternalDependencyRelation(commitment, person);

  it('Test function call', () => expect(externalDependence.hasExternalDependenceStereotype()).toBe(true));
  it('Test function call', () => expect(worksFor.hasExternalDependenceStereotype()).toBe(false));
});

describe('Test hasComponentOfStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const organ = model.createClass();
  const weight = model.createClass();
  const componentOf = model.createComponentOfRelation(organ, person);
  const characterization = model.createCharacterizationRelation(weight, person);

  it('Test function call', () => expect(componentOf.hasComponentOfStereotype()).toBe(true));
  it('Test function call', () => expect(characterization.hasComponentOfStereotype()).toBe(false));
});

describe('Test hasMemberOfStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const organization = model.createClass();
  const weight = model.createClass();
  const memberOf = model.createMemberOfRelation(person, organization);
  const characterization = model.createCharacterizationRelation(weight, person);

  it('Test function call', () => expect(memberOf.hasMemberOfStereotype()).toBe(true));
  it('Test function call', () => expect(characterization.hasMemberOfStereotype()).toBe(false));
});

describe('Test hasSubCollectionOfStereotype()', () => {
  const model = new Project().createModel();
  const organization = model.createClass();
  const person = model.createClass();
  const weight = model.createClass();
  const subCollectionOf = model.createSubCollectionOfRelation(organization, organization);
  const characterization = model.createCharacterizationRelation(weight, person);

  it('Test function call', () => expect(subCollectionOf.hasSubCollectionOfStereotype()).toBe(true));
  it('Test function call', () => expect(characterization.hasSubCollectionOfStereotype()).toBe(false));
});

describe('Test hasSubQuantityOfStereotype()', () => {
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

describe('Test hasInstantiationStereotype()', () => {
  const model = new Project().createModel();
  const personType = model.createClass();
  const person = model.createClass();
  const weight = model.createClass();
  const instantiation = model.createInstantiationRelation(person, personType);
  const characterization = model.createCharacterizationRelation(weight, person);

  it('Test function call', () => expect(instantiation.hasInstantiationStereotype()).toBe(true));
  it('Test function call', () => expect(characterization.hasInstantiationStereotype()).toBe(false));
});

describe('Test hasTerminationStereotype()', () => {
  const model = new Project().createModel();
  const death = model.createClass();
  const person = model.createClass();
  const weight = model.createClass();
  const terminates = model.createTerminationRelation(death, person);
  const characterization = model.createCharacterizationRelation(weight, person);

  it('Test function call', () => expect(terminates.hasTerminationStereotype()).toBe(true));
  it('Test function call', () => expect(characterization.hasTerminationStereotype()).toBe(false));
});

describe('Test hasParticipationalStereotype()', () => {
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

describe('Test hasParticipationStereotype()', () => {
  const model = new Project().createModel();
  const soccerMatch = model.createClass();
  const person = model.createClass();
  const weight = model.createClass();
  const participation = model.createParticipationRelation(person, soccerMatch);
  const characterization = model.createCharacterizationRelation(weight, person);

  it('Test function call', () => expect(participation.hasParticipationStereotype()).toBe(true));
  it('Test function call', () => expect(characterization.hasParticipationStereotype()).toBe(false));
});

describe('Test hasHistoricalDependenceStereotype()', () => {
  const model = new Project().createModel();
  const presidencyEvent = model.createClass();
  const person = model.createClass();
  const weight = model.createClass();
  const historicalDependence = model.createHistoricalDependenceRelation(person, presidencyEvent); // former president
  const characterization = model.createCharacterizationRelation(weight, person);

  it('Test function call', () => expect(historicalDependence.hasHistoricalDependenceStereotype()).toBe(true));
  it('Test function call', () => expect(characterization.hasHistoricalDependenceStereotype()).toBe(false));
});

describe('Test hasCreationStereotype()', () => {
  const model = new Project().createModel();
  const birth = model.createClass();
  const person = model.createClass();
  const weight = model.createClass();
  const creation = model.createCreationRelation(birth, person);
  const characterization = model.createCharacterizationRelation(weight, person);

  it('Test function call', () => expect(creation.hasCreationStereotype()).toBe(true));
  it('Test function call', () => expect(characterization.hasCreationStereotype()).toBe(false));
});

describe('Test hasManifestationStereotype()', () => {
  const model = new Project().createModel();
  const weightMeasurement = model.createClass();
  const person = model.createClass();
  const weight = model.createClass();
  const manifestation = model.createManifestationRelation(weightMeasurement, weight);
  const characterization = model.createCharacterizationRelation(weight, person);

  it('Test function call', () => expect(manifestation.hasManifestationStereotype()).toBe(true));
  it('Test function call', () => expect(characterization.hasManifestationStereotype()).toBe(false));
});

describe('Test hasBringsAboutStereotype()', () => {
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

describe('Test hasTriggersStereotype()', () => {
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
