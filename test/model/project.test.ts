import {
  BinaryRelation,
  Class,
  Generalization,
  GeneralizationSet,
  Literal,
  Package,
  Project,
  Property
} from '../../src';

describe('Project tests', () => {
  let proj: Project;
  let model: Package, pkg: Package;
  let agent: Class,
    person: Class,
    organization: Class,
    text: Class,
    color: Class;
  let name: Property, surname: Property;
  let red: Literal, green: Literal, blue: Literal;
  let worksFor: BinaryRelation;
  let personToAgent: Generalization, orgToAgent: Generalization;
  let genSet: GeneralizationSet;

  beforeAll(() => {
    proj = new Project();
    model = proj.packageBuilder().build();
    pkg = model.packageBuilder().name('Package').build();

    agent = pkg.classBuilder().name('Agent').category().build();
    person = pkg.classBuilder().name('Person').kind().build();
    organization = pkg.classBuilder().name('Organization').kind().build();
    text = pkg.classBuilder().name('Text').datatype().build();

    color = pkg.classBuilder().enumeration().name('Color').build();
    red = color.literalBuilder().name('red').build();
    green = color.literalBuilder().name('green').build();
    blue = color.literalBuilder().name('blue').build();

    personToAgent = person.addParent(agent);
    orgToAgent = organization.addParent(agent);

    genSet = pkg
      .generalizationSetBuilder()
      .partition()
      .generalizations(personToAgent, orgToAgent)
      .name('agentsSet')
      .build();

    name = agent.attributeBuilder().type(text).name('name').build();
    surname = person.attributeBuilder().type(text).name('surname').build();

    worksFor = pkg
      .binaryRelationBuilder()
      .source(person)
      .target(organization)
      .name('works-for')
      .material()
      .build();
  });

  it(`Test getAllAttributes()`, () => {
    let attributes = proj.attributes;
    expect(attributes).toContain(name);
    expect(attributes).toContain(surname);
    expect(attributes.length).toBe(2);
  });

  it(`relationEnds field should return all relation ends`, () => {
    expect(proj.relationEnds).toIncludeSameMembers(worksFor.properties);
  });

  it(`relations field should return all relations`, () => {
    expect(proj.relations).toIncludeSameMembers([worksFor]);
  });

  it(`generalization field should return all generalizations`, () => {
    expect(proj.generalizations).toIncludeSameMembers([
      personToAgent,
      orgToAgent
    ]);
  });

  it(`generalizationSets field should return all generalization sets`, () => {
    expect(proj.generalizationSets).toIncludeSameMembers([genSet]);
  });

  it(`packages field should return all packages`, () => {
    expect(proj.packages).toIncludeSameMembers([model, pkg]);
  });

  it(`classes field should return all classes`, () => {
    expect(proj.classes).toIncludeSameMembers([
      agent,
      person,
      organization,
      text,
      color
    ]);
  });

  it(`literals field should return all literals`, () => {
    expect(proj.literals).toIncludeSameMembers([red, green, blue]);
  });

  it(`Test getContents()`, () => {
    expect(proj.getContents()).toIncludeSameMembers([
      model,
      pkg,
      agent,
      person,
      organization,
      text,
      color,
      red,
      green,
      blue,
      personToAgent,
      orgToAgent,
      genSet,
      name,
      surname,
      worksFor,
      worksFor.properties
    ]);
  });

  it(`for projects, getAllContents() should return the same elements as getContents()`, () => {
    expect(proj.getAllContents()).toIncludeSameMembers(proj.getContents());
  });

  describe(`Test toJSON()`, () => {
    it('Should serialize without throwing an exception', () => {
      expect(() => JSON.stringify(proj)).not.toThrow();
    });

    //TODO: Figure out how to handle validation
    // it('Should serialize into an object compliant with the OntoUML JSON schema', () => {
    //   expect(serializationUtils.validate(proj)).toBeTrue();
    // });
  });
});
