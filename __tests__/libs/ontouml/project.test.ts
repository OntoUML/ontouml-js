import { Package, Project, serializationUtils } from '@libs/ontouml';

describe('Project tests', () => {
  it('Create Project', () => {
    let _project: Project;
    const initializeProject = () => {
      _project = new Project();
    };
    expect(initializeProject).not.toThrow();
  });

  describe(`Test ${Project.prototype.getContents.name}`, () => {
    const project = new Project({ name: 'Project' });
    const model = project.createModel({ name: 'Model' });
    model.createPackage('Package');

    it('Test function call', () => expect(project.getContents()).toContain(model));
    it('Test function call', () => expect(project.getContents().length).toBe(1));
  });

  describe(`Test ${Project.prototype.getAllContents.name}`, () => {
    const project = new Project({ name: 'Project' });
    const model = project.createModel({ name: 'Model' });
    const pkg = model.createPackage('Package');
    const agent = pkg.createCategory('Agent');
    const person = pkg.createKind('Person');
    const organization = pkg.createKind('Organization');
    const text = pkg.createDatatype('Text');
    const name = agent.createAttribute(text, { name: 'name' });
    person.createAttribute(text, { name: 'surname' });
    pkg.createBinaryRelation(person, organization, 'works-for');
    const agentIntoPerson = pkg.createGeneralization(agent, person, 'agentIntoPerson');
    const agentIntoOrganization = pkg.createGeneralization(agent, organization, 'agentIntoOrganization');
    pkg.createPartition([agentIntoPerson, agentIntoOrganization], null, 'agentsSet');

    it('Test function call', () => expect(project.getAllContents()).toContain(name));
    it('Test function call', () => expect(project.getAllContents().length).toBe(14));
  });

  describe(`Test ${Project.prototype.getAllAttributes.name}`, () => {
    const project = new Project({ name: 'Project' });
    const model = project.createModel({ name: 'Model' });
    const pkg = model.createPackage('Package');
    const agent = pkg.createCategory('Agent');
    const person = pkg.createKind('Person');
    const organization = pkg.createKind('Organization');
    const text = pkg.createDatatype('Text');
    const name = agent.createAttribute(text, { name: 'name' });
    const surname = person.createAttribute(text, { name: 'surname' });
    pkg.createBinaryRelation(person, organization, 'works-for');
    const agentIntoPerson = pkg.createGeneralization(agent, person, 'agentIntoPerson');
    const agentIntoOrganization = pkg.createGeneralization(agent, organization, 'agentIntoOrganization');
    pkg.createPartition([agentIntoPerson, agentIntoOrganization], null, 'agentsSet');

    const attributes = project.getAllAttributes();

    it('Test function call', () => expect(attributes).toContain(name));
    it('Test function call', () => expect(attributes).toContain(surname));
    it('Test function call', () => expect(attributes.length).toBe(2));
  });

  describe(`Test ${Project.prototype.getAllRelationEnds.name}`, () => {
    const project = new Project({ name: 'Project' });
    const model = project.createModel({ name: 'Model' });
    const pkg = model.createPackage('Package');
    const agent = pkg.createCategory('Agent');
    const person = pkg.createKind('Person');
    const organization = pkg.createKind('Organization');
    const text = pkg.createDatatype('Text');
    agent.createAttribute(text, { name: 'name' });
    person.createAttribute(text, { name: 'surname' });
    const worksFor = pkg.createBinaryRelation(person, organization, 'works-for');
    const agentIntoPerson = pkg.createGeneralization(agent, person, 'agentIntoPerson');
    const agentIntoOrganization = pkg.createGeneralization(agent, organization, 'agentIntoOrganization');
    pkg.createPartition([agentIntoPerson, agentIntoOrganization], null, 'agentsSet');

    const relationEnds = project.getAllRelationEnds();

    it('Test function call', () => expect(relationEnds).toContain(worksFor.getSourceEnd()));
    it('Test function call', () => expect(relationEnds).toContain(worksFor.getTargetEnd()));
    it('Test function call', () => expect(relationEnds.length).toBe(2));
  });

  describe(`Test ${Project.prototype.getAllRelations.name}`, () => {
    const project = new Project({ name: 'Project' });
    const model = project.createModel({ name: 'Model' });
    const pkg = model.createPackage('Package');
    const agent = pkg.createCategory('Agent');
    const person = pkg.createKind('Person');
    const organization = pkg.createKind('Organization');
    const text = pkg.createDatatype('Text');
    agent.createAttribute(text, { name: 'name' });
    person.createAttribute(text, { name: 'surname' });
    const worksFor = pkg.createBinaryRelation(person, organization, 'works-for');
    const agentIntoPerson = pkg.createGeneralization(agent, person, 'agentIntoPerson');
    const agentIntoOrganization = pkg.createGeneralization(agent, organization, 'agentIntoOrganization');
    pkg.createPartition([agentIntoPerson, agentIntoOrganization], null, 'agentsSet');

    const relations = project.getAllRelations();

    it('Test function call', () => expect(relations).toContain(worksFor));
    it('Test function call', () => expect(relations.length).toBe(1));
  });

  describe(`Test ${Project.prototype.getAllGeneralizations.name}`, () => {
    const project = new Project({ name: 'Project' });
    const model = project.createModel({ name: 'Model' });
    const pkg = model.createPackage('Package');
    const agent = pkg.createCategory('Agent');
    const person = pkg.createKind('Person');
    const organization = pkg.createKind('Organization');
    const text = pkg.createDatatype('Text');
    agent.createAttribute(text, { name: 'name' });
    person.createAttribute(text, { name: 'surname' });
    pkg.createBinaryRelation(person, organization, 'works-for');
    const agentIntoPerson = pkg.createGeneralization(agent, person, 'agentIntoPerson');
    const agentIntoOrganization = pkg.createGeneralization(agent, organization, 'agentIntoOrganization');
    pkg.createPartition([agentIntoPerson, agentIntoOrganization], null, 'agentsSet');

    const generalizations = project.getAllGeneralizations();

    it('Test function call', () => expect(generalizations).toContain(agentIntoPerson));
    it('Test function call', () => expect(generalizations).toContain(agentIntoOrganization));
    it('Test function call', () => expect(generalizations.length).toBe(2));
  });

  describe(`Test ${Project.prototype.getAllGeneralizationSets.name}`, () => {
    const project = new Project({ name: 'Project' });
    const model = project.createModel({ name: 'Model' });
    const pkg = model.createPackage('Package');
    const agent = pkg.createCategory('Agent');
    const person = pkg.createKind('Person');
    const organization = pkg.createKind('Organization');
    const text = pkg.createDatatype('Text');
    agent.createAttribute(text, { name: 'name' });
    person.createAttribute(text, { name: 'surname' });
    pkg.createBinaryRelation(person, organization, 'works-for');
    const agentIntoPerson = pkg.createGeneralization(agent, person, 'agentIntoPerson');
    const agentIntoOrganization = pkg.createGeneralization(agent, organization, 'agentIntoOrganization');
    const genSet = pkg.createPartition([agentIntoPerson, agentIntoOrganization], null, 'agentsSet');

    const generalizationsSets = project.getAllGeneralizationSets();

    it('Test function call', () => expect(generalizationsSets).toContain(genSet));
    it('Test function call', () => expect(generalizationsSets.length).toBe(1));
  });

  describe(`Test ${Project.prototype.getAllPackages.name}`, () => {
    const project = new Project({ name: 'Project' });
    const model = project.createModel({ name: 'Model' });
    const pkg = model.createPackage('Package');
    const agent = pkg.createCategory('Agent');
    const person = pkg.createKind('Person');
    const organization = pkg.createKind('Organization');
    const text = pkg.createDatatype('Text');
    agent.createAttribute(text, { name: 'name' });
    person.createAttribute(text, { name: 'surname' });
    pkg.createBinaryRelation(person, organization, 'works-for');
    const agentIntoPerson = pkg.createGeneralization(agent, person, 'agentIntoPerson');
    const agentIntoOrganization = pkg.createGeneralization(agent, organization, 'agentIntoOrganization');
    pkg.createPartition([agentIntoPerson, agentIntoOrganization], null, 'agentsSet');

    const packages = project.getAllPackages();

    it('Test function call', () => expect(packages).toContain(model));
    it('Test function call', () => expect(packages).toContain(pkg));
    it('Test function call', () => expect(packages.length).toBe(2));
  });

  describe(`Test ${Project.prototype.getAllClasses.name}`, () => {
    const project = new Project({ name: 'Project' });
    const model = project.createModel({ name: 'Model' });
    const pkg = model.createPackage('Package');
    const agent = pkg.createCategory('Agent');
    const person = pkg.createKind('Person');
    const organization = pkg.createKind('Organization');
    const text = pkg.createDatatype('Text');
    agent.createAttribute(text, { name: 'name' });
    person.createAttribute(text, { name: 'surname' });
    pkg.createBinaryRelation(person, organization, 'works-for');
    const agentIntoPerson = pkg.createGeneralization(agent, person, 'agentIntoPerson');
    const agentIntoOrganization = pkg.createGeneralization(agent, organization, 'agentIntoOrganization');
    pkg.createPartition([agentIntoPerson, agentIntoOrganization], null, 'agentsSet');

    const classes = project.getAllClasses();

    it('Test function call', () => expect(classes).toContain(agent));
    it('Test function call', () => expect(classes).toContain(person));
    it('Test function call', () => expect(classes).toContain(organization));
    it('Test function call', () => expect(classes).toContain(text));
    it('Test function call', () => expect(classes.length).toBe(4));
  });

  describe(`Test ${Project.prototype.getAllEnumerations.name}`, () => {
    const project = new Project({ name: 'Project' });
    const model = project.createModel({ name: 'Model' });
    const pkg = model.createPackage('Package');
    const enumeration = pkg.createEnumeration('Enumeration');

    const enumerations = project.getAllEnumerations();

    it('Test function call', () => expect(enumerations).toContain(enumeration));
    it('Test function call', () => expect(enumerations.length).toBe(1));
  });

  describe(`Test ${Project.prototype.getAllLiterals.name}`, () => {
    const project = new Project({ name: 'Project' });
    const model = project.createModel({ name: 'Model' });
    const pkg = model.createPackage('Package');
    const enumeration = pkg.createEnumeration('Enumeration');
    const literal1 = enumeration.createLiteral();
    const literal2 = enumeration.createLiteral();

    const literals = project.getAllLiterals();

    it('Test function call', () => expect(literals).toContain(literal1));
    it('Test function call', () => expect(literals).toContain(literal2));
    it('Test function call', () => expect(literals.length).toBe(2));
  });

  describe(`Test ${Project.prototype.toJSON.name}`, () => {
    const project = new Project({ name: 'Project' });
    const model = project.createModel({ name: 'Model' });

    const agent = model.createCategory('Agent');
    const person = model.createKind('Person');
    const organization = model.createKind('Organization');
    const text = model.createDatatype('Text');

    agent.createAttribute(text, { name: 'name' });
    person.createAttribute(text, { name: 'surname' });

    model.createBinaryRelation(person, organization, 'works-for');

    const agentIntoPerson = model.createGeneralization(agent, person, 'agentIntoPerson');
    const agentIntoOrganization = model.createGeneralization(agent, organization, 'agentIntoOrganization');

    model.createPartition([agentIntoPerson, agentIntoOrganization], null, 'agentsSet');

    it('Test serialization', () => expect(() => JSON.stringify(project)).not.toThrow());
    it('Test serialization validation', () => expect(serializationUtils.validate(project)).toBeTruthy());
  });

  describe(`Test ${Project.prototype.createModel.name}`, () => {
    const project = new Project();

    it('Test function call', () => {
      expect(project.createModel()).toBeInstanceOf(Package);
      expect(project.model).toBeDefined();
      expect(project.model.project).toBe(project);
      expect(project.model.container).toBeNull();
      expect(() => project.createModel()).toThrow();
    });
  });

  describe(`Test ${Project.prototype.lock.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Project.prototype.unlock.name}`, () => {
    // TODO: implement test
  });

  describe(`Test ${Project.prototype.getClassesByNature.name}`, () => {
    // TODO: implement test
  });
});
