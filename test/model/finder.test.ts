import {
  BinaryRelation,
  Class,
  ClassStereotype,
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

  it('getKinds() should return the classes stereotyped as «kind»', () => {
    expect(proj.finder.getKinds()).toIncludeSameMembers([person, organization]);
  });

  it('getCategories() should return the classes stereotyped as «category»', () => {
    expect(proj.finder.getCategories()).toEqual([agent]);
  });

  it('getMixins() should return the classes stereotyped as «mixin»', () => {
    expect(proj.finder.getMixins()).toEqual([crimeWeapon]);
  });

  it('getRoleMixins() should return the classes stereotyped as «roleMixin»', () => {
    expect(proj.finder.getRoleMixins()).toEqual([client]);
  });

  it('getRelators() should return the classes stereotyped as «relator»', () => {
    expect(proj.finder.getRelators()).toEqual([employment]);
  });

  it('getDatatypes() should return the classes stereotyped as «datatype»', () => {
    expect(proj.finder.getDatatypes()).toEqual([text]);
  });

  it('getEnumerations() should return the classes stereotyped as «enumeration»', () => {
    expect(proj.finder.getEnumerations()).toEqual([color]);
  });

  it('getRigidTypes() should return kinds, relators, the category, the datatype, and the enumeration', () => {
    expect(proj.finder.getRigidTypes()).toIncludeSameMembers([
      person,
      organization,
      employment,
      agent,
      text,
      color
    ]);
  });

  it('getAntiRigidTypes() should return the roleMixin', () => {
    expect(proj.finder.getAntiRigidTypes()).toEqual([client]);
  });

  it('getSemiRigidTypes() should return the mixin', () => {
    expect(proj.finder.getSemiRigidTypes()).toEqual([crimeWeapon]);
  });

  it('getClassesByStereotype() should filter classes by the given stereotypes', () => {
    expect(
      proj.finder.getClassesByStereotype([
        ClassStereotype.KIND,
        ClassStereotype.CATEGORY
      ])
    ).toIncludeSameMembers([person, organization, agent]);
  });

  it('getMaterialRelations() should return the material relations', () => {
    expect(proj.finder.getMaterialRelations()).toEqual([worksFor]);
  });

  it('getDerivations() should return the derivation relations', () => {
    expect(proj.finder.getDerivations()).toEqual([derivation]);
  });

  it('getFunctionalComplexTypes() should return the classes restricted to functional complexes', () => {
    expect(proj.finder.getFunctionalComplexTypes()).toIncludeSameMembers([
      agent,
      person,
      organization,
      client,
      crimeWeapon
    ]);
  });

  it('getRelatorTypes() should return the classes restricted to relators', () => {
    expect(proj.finder.getRelatorTypes()).toEqual([employment]);
  });

  it('getModelElements() should return every model element in the project', () => {
    expect(proj.finder.getModelElements()).toIncludeSameMembers(
      proj.getContents()
    );
  });
});
