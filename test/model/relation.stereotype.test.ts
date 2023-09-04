import { Project, RelationStereotype } from '../../src';

describe('Test isStereotypeValid()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const knows = model.createMaterialRelation(person, person);
  const worksFor = model.createBinaryRelation(person, person);

  it('should return true for a relation with an OntoUML stereotype', () =>
    expect(knows.hasValidStereotype()).toBeTrue());
  it('should return true for a relation without a stereotype (by default; allowsNone: true)', () =>
    expect(worksFor.hasValidStereotype()).toBeTrue());
  it('should return false for a relation without a stereotype (allowsNone: false)', () =>
    expect(worksFor.hasValidStereotype(false)).toBeFalse());
});

describe('Test hasAnyStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const knows = model.createMaterialRelation(person, person);

  it('Test function call', () =>
    expect(knows.isStereotypeOneOf([RelationStereotype.MATERIAL])).toBeTrue());
});

describe('Test hasExistentialDependenceStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const weight = model.createClass();
  const worksFor = model.createMaterialRelation(person, person);
  const characterization = model.createCharacterization(weight, person);

  it('Test function call', () =>
    expect(worksFor.hasExistentialDependencyStereotype()).toBeFalse());
  it('Test function call', () =>
    expect(characterization.hasExistentialDependencyStereotype()).toBeTrue());
});

describe('Test hasMaterialStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const weight = model.createClass();
  const worksFor = model.createMaterialRelation(person, person);
  const characterization = model.createCharacterization(weight, person);

  it('Test function call', () =>
    expect(worksFor.hasMaterialStereotype()).toBeTrue());
  it('Test function call', () =>
    expect(characterization.hasMaterialStereotype()).toBeFalse());
});

describe('Test hasDerivationStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const weight = model.createClass();
  const heavierThan = model.createComparativeRelation(person, person);
  const derivation = model.createDerivation(heavierThan, weight);

  it('Test function call', () =>
    expect(derivation.hasDerivationStereotype()).toBeTrue());
  it('Test function call', () =>
    expect(heavierThan.hasDerivationStereotype()).toBeFalse());
});

describe('Test hasComparativeStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const weight = model.createClass();
  const heavierThan = model.createComparativeRelation(person, person);
  const characterization = model.createCharacterization(weight, person);

  it('Test function call', () =>
    expect(heavierThan.hasComparativeStereotype()).toBeTrue());
  it('Test function call', () =>
    expect(characterization.hasComparativeStereotype()).toBeFalse());
});

describe('Test hasMediationStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const enrollment = model.createClass();
  const weight = model.createClass();
  const mediation = model.createMediation(enrollment, person);
  const characterization = model.createCharacterization(weight, person);

  it('Test function call', () =>
    expect(mediation.hasMediationStereotype()).toBeTrue());
  it('Test function call', () =>
    expect(characterization.hasMediationStereotype()).toBeFalse());
});

describe('Test hasCharacterizationStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const weight = model.createClass();
  const worksFor = model.createMaterialRelation(person, person);
  const characterization = model.createCharacterization(weight, person);

  it('Test function call', () =>
    expect(characterization.hasCharacterizationStereotype()).toBeTrue());
  it('Test function call', () =>
    expect(worksFor.hasCharacterizationStereotype()).toBeFalse());
});

describe('Test hasExternalDependenceStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const commitment = model.createClass();
  const worksFor = model.createMaterialRelation(person, person);
  const externalDependence = model.createExternalDependence(commitment, person);

  it('Test function call', () =>
    expect(externalDependence.hasExternalDependenceStereotype()).toBeTrue());
  it('Test function call', () =>
    expect(worksFor.hasExternalDependenceStereotype()).toBeFalse());
});

describe('Test hasComponentOfStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const organ = model.createClass();
  const weight = model.createClass();
  const componentOf = model.createComponentOf(organ, person);
  const characterization = model.createCharacterization(weight, person);

  it('Test function call', () =>
    expect(componentOf.hasComponentOfStereotype()).toBeTrue());
  it('Test function call', () =>
    expect(characterization.hasComponentOfStereotype()).toBeFalse());
});

describe('Test hasMemberOfStereotype()', () => {
  const model = new Project().createModel();
  const person = model.createClass();
  const organization = model.createClass();
  const weight = model.createClass();
  const memberOf = model.createMemberOfRelation(person, organization);
  const characterization = model.createCharacterization(weight, person);

  it('Test function call', () =>
    expect(memberOf.hasMemberOfStereotype()).toBeTrue());
  it('Test function call', () =>
    expect(characterization.hasMemberOfStereotype()).toBeFalse());
});

describe('Test hasSubCollectionOfStereotype()', () => {
  const model = new Project().createModel();
  const organization = model.createClass();
  const person = model.createClass();
  const weight = model.createClass();
  const subCollectionOf = model.createSubCollectionOf(
    organization,
    organization
  );
  const characterization = model.createCharacterization(weight, person);

  it('Test function call', () =>
    expect(subCollectionOf.hasSubCollectionOfStereotype()).toBeTrue());
  it('Test function call', () =>
    expect(characterization.hasSubCollectionOfStereotype()).toBeFalse());
});

describe('Test hasSubQuantityOfStereotype()', () => {
  const model = new Project().createModel();
  const wine = model.createClass();
  const water = model.createClass();
  const person = model.createClass();
  const weight = model.createClass();
  const subQuantityOf = model.createSubQuantityOf(water, wine);
  const characterization = model.createCharacterization(weight, person);

  it('Test function call', () =>
    expect(subQuantityOf.hasSubQuantityOfStereotype()).toBeTrue());
  it('Test function call', () =>
    expect(characterization.hasSubQuantityOfStereotype()).toBeFalse());
});

describe('Test hasInstantiationStereotype()', () => {
  const model = new Project().createModel();
  const personType = model.createClass();
  const person = model.createClass();
  const weight = model.createClass();
  const instantiation = model.createInstantiation(person, personType);
  const characterization = model.createCharacterization(weight, person);

  it('Test function call', () =>
    expect(instantiation.hasInstantiationStereotype()).toBeTrue());
  it('Test function call', () =>
    expect(characterization.hasInstantiationStereotype()).toBeFalse());
});

describe('Test hasTerminationStereotype()', () => {
  const model = new Project().createModel();
  const death = model.createClass();
  const person = model.createClass();
  const weight = model.createClass();
  const terminates = model.createTermination(death, person);
  const characterization = model.createCharacterization(weight, person);

  it('Test function call', () =>
    expect(terminates.hasTerminationStereotype()).toBeTrue());
  it('Test function call', () =>
    expect(characterization.hasTerminationStereotype()).toBeFalse());
});

describe('Test hasParticipationalStereotype()', () => {
  const model = new Project().createModel();
  const soccerMatch = model.createClass();
  const goalEvent = model.createClass();
  const person = model.createClass();
  const weight = model.createClass();
  const participational = model.createParticipational(goalEvent, soccerMatch);
  const characterization = model.createCharacterization(weight, person);

  it('Test function call', () =>
    expect(participational.hasParticipationalStereotype()).toBeTrue());
  it('Test function call', () =>
    expect(characterization.hasParticipationalStereotype()).toBeFalse());
});

describe('Test hasParticipationStereotype()', () => {
  const model = new Project().createModel();
  const soccerMatch = model.createClass();
  const person = model.createClass();
  const weight = model.createClass();
  const participation = model.createParticipation(person, soccerMatch);
  const characterization = model.createCharacterization(weight, person);

  it('Test function call', () =>
    expect(participation.hasParticipationStereotype()).toBeTrue());
  it('Test function call', () =>
    expect(characterization.hasParticipationStereotype()).toBeFalse());
});

describe('Test hasHistoricalDependenceStereotype()', () => {
  const model = new Project().createModel();
  const presidencyEvent = model.createClass();
  const person = model.createClass();
  const weight = model.createClass();
  const historicalDependence = model.createHistoricalDependence(
    person,
    presidencyEvent
  ); // former president
  const characterization = model.createCharacterization(weight, person);

  it('Test function call', () =>
    expect(historicalDependence.hasHistoricalDependenceStereotype()).toBe(
      true
    ));
  it('Test function call', () =>
    expect(characterization.hasHistoricalDependenceStereotype()).toBeFalse());
});

describe('Test hasCreationStereotype()', () => {
  const model = new Project().createModel();
  const birth = model.createClass();
  const person = model.createClass();
  const weight = model.createClass();
  const creation = model.createCreationRelation(birth, person);
  const characterization = model.createCharacterization(weight, person);

  it('Test function call', () =>
    expect(creation.hasCreationStereotype()).toBeTrue());
  it('Test function call', () =>
    expect(characterization.hasCreationStereotype()).toBeFalse());
});

describe('Test hasManifestationStereotype()', () => {
  const model = new Project().createModel();
  const weightMeasurement = model.createClass();
  const person = model.createClass();
  const weight = model.createClass();
  const manifestation = model.createManifestationRelation(
    weightMeasurement,
    weight
  );
  const characterization = model.createCharacterization(weight, person);

  it('Test function call', () =>
    expect(manifestation.hasManifestationStereotype()).toBeTrue());
  it('Test function call', () =>
    expect(characterization.hasManifestationStereotype()).toBeFalse());
});

describe('Test hasBringsAboutStereotype()', () => {
  const model = new Project().createModel();
  const conceptionEvent = model.createClass();
  const pregnancySituation = model.createClass();
  const person = model.createClass();
  const weight = model.createClass();
  const bringsAbout = model.createBringsAboutRelation(
    conceptionEvent,
    pregnancySituation
  );
  const characterization = model.createCharacterization(weight, person);

  it('Test function call', () =>
    expect(bringsAbout.hasBringsAboutStereotype()).toBeTrue());
  it('Test function call', () =>
    expect(characterization.hasBringsAboutStereotype()).toBeFalse());
});

describe('Test hasTriggersStereotype()', () => {
  const model = new Project().createModel();
  const birthEvent = model.createClass();
  const pregnancySituation = model.createClass();
  const person = model.createClass();
  const weight = model.createClass();
  const bringsAbout = model.createTriggersRelation(
    pregnancySituation,
    birthEvent
  );
  const characterization = model.createCharacterization(weight, person);

  it('Test function call', () =>
    expect(bringsAbout.hasTriggersStereotype()).toBeTrue());
  it('Test function call', () =>
    expect(characterization.hasTriggersStereotype()).toBeFalse());
});
