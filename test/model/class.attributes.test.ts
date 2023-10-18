import { Class, Project, Property, Literal } from '../../src';

describe(`Tests attributes getters`, () => {
  let proj: Project;
  let agent: Class, person: Class, text: Class;
  let alias: Property, surname: Property;

  beforeAll(() => {
    proj = new Project();

    agent = proj.classBuilder().category().build();
    person = proj.classBuilder().kind().build();
    text = proj.classBuilder().datatype().build();

    person.addParent(agent);

    alias = agent.propertyBuilder().type(text).build();
    surname = person.propertyBuilder().type(text).build();
  });

  it('agent.attributes should return only own attributes = [ alias ]', () => {
    expect(agent.attributes).toIncludeSameMembers([alias]);
  });

  it('person.attributes should return only own attributes = [ surname ]', () => {
    expect(person.attributes).toIncludeSameMembers([surname]);
  });

  it('text.attributes should return an empty array = [ ]', () => {
    expect(text.attributes).toBeEmpty();
  });

  it('agent.getAllAttributes() should return [ alias, surname ]', () => {
    const attributes = agent.getAllAttributes();
    expect(attributes).toIncludeSameMembers([alias]);
  });

  it('person.getAllAttributes() should return [ alias, surname ]', () => {
    const attributes = person.getAllAttributes();
    expect(attributes).toIncludeSameMembers([alias, surname]);
  });

  it('text.getAllAttributes() should return an empty array = [ ]', () => {
    const attributes = text.getAllAttributes();
    expect(attributes).toBeEmpty();
  });
});

describe(`Test literal getters`, () => {
  let proj: Project;
  let enumA: Class, enumB: Class, enumN: Class;
  let litA: Literal, litB: Literal;

  beforeAll(() => {
    proj = new Project();

    enumA = proj.classBuilder().enumeration().build();
    enumB = proj.classBuilder().enumeration().build();
    enumN = proj.classBuilder().enumeration().build();

    enumB.addParent(enumA);

    litA = enumA.literalBuilder().build();
    litB = enumB.literalBuilder().build();
  });

  it('enumA.literals should return [ litA ]', () => {
    expect(enumA.literals).toIncludeSameMembers([litA]);
  });

  it('enumB.literals should return [ litB ]', () => {
    expect(enumB.literals).toIncludeSameMembers([litB]);
  });

  it('enumN.literals should return an empty array = [ ]', () => {
    expect(enumN.literals).toBeEmpty();
  });

  it('enumA.getAllLiterals() should return [ litA ]', () => {
    expect(enumA.getAllLiterals()).toIncludeSameMembers([litA]);
  });

  it('enumB.getAllLiterals() should return [ litB ]', () => {
    expect(enumB.getAllLiterals()).toIncludeSameMembers([litA, litB]);
  });

  it('enumN.getAllLiterals() should return an empty array = [ ]', () => {
    expect(enumN.getAllLiterals()).toBeEmpty();
  });
});

describe(`Test ${Class.prototype.hasAttributes.name}()`, () => {
  let proj: Project;
  let clazz: Class;

  beforeEach(() => {
    proj = new Project();
    clazz = proj.classBuilder().build();
  });

  it('hasAttributes() should return false if the class has no attributes', () => {
    expect(clazz.hasAttributes()).toBeFalsy();
  });

  it('hasAttributes() should return true if the class has 1 attribute', () => {
    clazz.propertyBuilder().build();
    expect(clazz.hasAttributes()).toBeTruthy();
  });

  it('hasAttributes() should return true if the class has 3 attributes', () => {
    clazz.propertyBuilder().build();
    clazz.propertyBuilder().build();
    clazz.propertyBuilder().build();
    expect(clazz.hasAttributes()).toBeTruthy();
  });
});

describe(`Test ${Class.prototype.hasLiterals.name}()`, () => {
  let proj: Project;
  let clazz: Class;

  beforeEach(() => {
    proj = new Project();
    clazz = proj.classBuilder().enumeration().build();
  });

  it('hasLiterals() should return false if the class has no literals', () => {
    expect(clazz.hasLiterals()).toBeFalsy();
  });

  it('hasLiterals() should return true if the class has 1 literal', () => {
    clazz.literalBuilder().build();
    expect(clazz.hasLiterals()).toBeTruthy();
  });

  it('hasLiterals() should return true if the class has 3 literals', () => {
    clazz.literalBuilder().build();
    clazz.literalBuilder().build();
    clazz.literalBuilder().build();
    expect(clazz.hasLiterals()).toBeTruthy();
  });
});
