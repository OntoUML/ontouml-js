import {
  Class,
  Generalization,
  GeneralizationSet,
  Package,
  Project,
  Property,
  Relation,
  serializationUtils
} from '@libs/ontouml';

describe('Project tests', () => {
  let project: Project;
  let model, pkg: Package;
  let agent, person, organization, text: Class;
  let name, surname: Property;
  let worksFor: Relation;
  let agentIntoPerson, agentIntoOrganization: Generalization;
  let genSet: GeneralizationSet;

  beforeAll(() => {
    project = new Project();
    model = project.createModel();
    pkg = model.createPackage('Package');
    agent = pkg.createCategory('Agent');
    person = pkg.createKind('Person');
    organization = pkg.createKind('Organization');
    text = pkg.createDatatype('Text');
    name = agent.createAttribute(text, 'name');
    surname = person.createAttribute(text, 'surname');
    worksFor = pkg.createBinaryRelation(person, organization, 'works-for');
    agentIntoPerson = pkg.createGeneralization(agent, person, 'agentIntoPerson');
    agentIntoOrganization = pkg.createGeneralization(agent, organization, 'agentIntoOrganization');
    genSet = pkg.createPartition([agentIntoPerson, agentIntoOrganization], null, 'agentsSet');
  });

  it(`Test getContents()`, () => {
    expect(project.getContents()).toContain(model);
    expect(project.getContents().length).toBe(1);
  });

  it(`Test getAllContents()`, () => {
    expect(project.getAllContents()).toContain(name);
    expect(project.getAllContents().length).toBe(14);
  });

  it(`Test getAllAttributes()`, () => {
    let attributes = project.getAllAttributes();
    expect(attributes).toContain(name);
    expect(attributes).toContain(surname);
    expect(attributes.length).toBe(2);
  });

  it(`Test getAllRelationEnds()`, () => {
    const relationEnds = project.getAllRelationEnds();
    expect(relationEnds).toContain(worksFor.getSourceEnd());
    expect(relationEnds).toContain(worksFor.getTargetEnd());
    expect(relationEnds.length).toBe(2);
  });

  it(`Test getAllRelations()`, () => {
    const relations = project.getAllRelations();
    expect(relations).toContain(worksFor);
    expect(relations.length).toBe(1);
  });

  it(`Test getAllGeneralizations()`, () => {
    const generalizations = project.getAllGeneralizations();
    expect(generalizations).toContain(agentIntoPerson);
    expect(generalizations).toContain(agentIntoOrganization);
    expect(generalizations.length).toBe(2);
  });

  it(`Test getAllGeneralizationSets()`, () => {
    const generalizationsSets = project.getAllGeneralizationSets();
    expect(generalizationsSets).toContain(genSet);
    expect(generalizationsSets.length).toBe(1);
  });

  it(`Test getAllPackages()`, () => {
    const packages = project.getAllPackages();

    expect(packages).toContain(model);
    expect(packages).toContain(pkg);
    expect(packages.length).toBe(2);
  });

  it(`Test getAllClasses()`, () => {
    const classes = project.getAllClasses();
    expect(classes).toContain(agent);
    expect(classes).toContain(person);
    expect(classes).toContain(organization);
    expect(classes).toContain(text);
    expect(classes.length).toBe(4);
  });

  it(`Test getAllEnumerations()`, () => {
    const enumeration = pkg.createEnumeration('Enumeration');
    const enumerations = project.getAllEnumerations();
    expect(enumerations).toContain(enumeration);
    expect(enumerations.length).toBe(1);
  });

  it(`Test getAllLiterals()`, () => {
    const enumeration = pkg.createEnumeration('Enumeration');
    const literal1 = enumeration.createLiteral();
    const literal2 = enumeration.createLiteral();

    const literals = project.getAllLiterals();
    expect(literals).toContain(literal1);
    expect(literals).toContain(literal2);
    expect(literals.length).toBe(2);
  });

  describe(`Test toJSON()`, () => {
    it('Should serialize without throwing an exception', () => {
      expect(() => JSON.stringify(project)).not.toThrow();
    });

    it('Should serialize into an object compliant with the OntoUML JSON schema', () => {
      expect(serializationUtils.validate(project)).toBeTruthy();
    });
  });

  it(`Test createModel()`, () => {
    let project = new Project();
    expect(project.createModel()).toBeInstanceOf(Package);
    expect(project.model).toBeDefined();
    expect(project.model.project).toBe(project);
    expect(project.model.container).toBeNull();
    expect(() => project.createModel()).toThrow();
  });

  describe(`Test lock()`, () => {
    // TODO: implement test
  });

  describe(`Test unlock()`, () => {
    // TODO: implement test
  });

  describe(`Test getClassesByNature()`, () => {
    // TODO: implement test
  });
});
