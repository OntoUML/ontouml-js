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
    client: Class,
    crimeWeapon: Class,
    employment: Class,
    color: Class;
  let name: Property, surname: Property;
  let red: Literal, green: Literal, blue: Literal;
  let involvesEmployee: BinaryRelation,
    involvesEmployer: BinaryRelation,
    derivation: BinaryRelation,
    worksFor: BinaryRelation;
  let personToAgent: Generalization, orgToAgent: Generalization;
  let genSet: GeneralizationSet;

  beforeAll(() => {
    proj = new Project();
    model = proj.packageBuilder().build();
    pkg = model.packageBuilder().name('Package').build();

    agent = pkg.classBuilder().name('Agent').category().build();
    name = agent.propertyBuilder().type(text).name('name').build();

    person = pkg.classBuilder().name('Person').kind().build();
    surname = person.propertyBuilder().type(text).name('surname').build();

    organization = pkg.classBuilder().name('Organization').kind().build();
    client = model.classBuilder().name('Client').roleMixin().build();
    crimeWeapon = model.classBuilder().name('CrimeWeapon').mixin().build();
    employment = model.classBuilder().name('Employment').relator().build();

    involvesEmployee = model
      .binaryRelationBuilder()
      .source(employment)
      .target(person)
      .mediation()
      .build();

    involvesEmployer = model
      .binaryRelationBuilder()
      .source(employment)
      .target(organization)
      .mediation()
      .build();

    worksFor = pkg
      .binaryRelationBuilder()
      .source(person)
      .target(organization)
      .name('works-for')
      .material()
      .build();

    derivation = model
      .binaryRelationBuilder()
      .source(employment)
      .target(worksFor)
      .derivation()
      .build();

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
  });

  it('getNonSortals() should return the roleMixin, the mixin, and the category', () => {
    const list = proj.finder.getNonSortals();
    expect(list).toHaveLength(3);
    expect(list).toIncludeSameMembers([client, crimeWeapon, agent]);
  });

  it('getSortals() should return the 2 kinds and the relator', () => {
    const list = proj.finder.getSortals();
    expect(list).toHaveLength(3);
    expect(list).toIncludeSameMembers([person, employment, organization]);
  });

  it('getMediations() should return all mediations', () => {
    const list = proj.finder.getMediations();
    expect(list).toHaveLength(2);
    expect(list).toIncludeSameMembers([involvesEmployee, involvesEmployer]);
  });
});
