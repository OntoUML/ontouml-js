import {
  Class,
  Generalization,
  GeneralizationSet,
  Package,
  Project,
  Property,
  serializationUtils,
  Literal,
  Relation
} from '@libs/ontouml';

describe('Serialization tests', () => {
  it('Project serialization', () => {
    const project = new Project();
    project.addName('Name');

    const model = project.createModel();
    model.addName('Model');

    const agent = model.createCategory('Agent');
    const person = model.createKind('Person');
    const organization = model.createKind('Organization');
    const text = model.createDatatype('Text');

    agent.createAttribute(text, 'name');
    person.createAttribute(text, 'surname');

    model.createBinaryRelation(person, organization, 'works-for');

    const agentIntoPerson = model.createGeneralization(agent, person, 'agentIntoPerson');
    const agentIntoOrganization = model.createGeneralization(agent, organization, 'agentIntoOrganization');

    model.createPartition([agentIntoPerson, agentIntoOrganization], null, 'agentsSet');

    expect(() => JSON.stringify(project)).not.toThrow();
    expect(serializationUtils.validate(project)).toBeTruthy();
  });

  describe(`Test serialization.${serializationUtils.validate.name}()`, () => {
    const project = new Project();

    it('Test project serialization', () => expect(serializationUtils.validate(project)).toBeTruthy());
    it('Test string serialization', () => expect(serializationUtils.validate(JSON.stringify(project))).toBeTruthy());
    it('Test object serialization', () => expect(serializationUtils.validate(JSON.parse(JSON.stringify(project)))).toBeTruthy());
    it('Test invalid input', () => expect(() => serializationUtils.validate(true as any)).toThrow());
  });

  describe(`Test serialization.${serializationUtils.parse.name}()`, () => {
    it(`Test ${Project.name} de-serialization`, () => {
      const project = new Project();
      const serialization = JSON.stringify(project);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(project);
    });

    it(`Test ${Package.name} de-serialization`, () => {
      const pkg = new Package();
      const serialization = JSON.stringify(pkg);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(pkg);
    });

    it(`Test ${Class.name} de-serialization`, () => {
      const _class = new Class({ order: 5 });
      const serialization = JSON.stringify(_class);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(_class);
    });

    it(`Test ${Generalization.name} de-serialization`, () => {
      const pkg = new Package();
      const agent = new Class();
      const person = new Class();
      const gen = new Generalization({ general: agent, specific: person });

      pkg.contents = [agent, person, gen];

      const serialization = JSON.stringify(pkg);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(pkg);
    });

    it(`Test ${GeneralizationSet.name} de-serialization`, () => {
      const pkg = new Package();
      const agent = new Class();
      const person = new Class();
      const gen = new Generalization({ general: agent, specific: person });
      const genset = new GeneralizationSet({ generalizations: [gen] });

      pkg.contents = [agent, person, gen, genset];

      const serialization = JSON.stringify(pkg);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(pkg);
    });

    it(`Test ${Property.name} de-serialization`, () => {
      const _class = new Class();
      const prop = new Property({ propertyType: _class });

      _class.properties = [prop];

      const serialization = JSON.stringify(_class);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(_class);
    });

    it(`Test ${Literal.name} de-serialization`, () => {
      const _class = new Class();
      const lit = new Literal();

      _class.literals = [lit];

      const serialization = JSON.stringify(_class);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(_class);
    });

    it(`Test ${Relation.name} de-serialization`, () => {
      const relation = new Relation();

      const serialization = JSON.stringify(relation);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(relation);
    });

    it(`Test full project de-serialization`, () => {
      const project = new Project();
      project.addName('MyProject');

      const model = project.createModel();
      model.addName('Model');

      const agent = model.createCategory('Agent');
      const person = model.createKind('Person');
      const organization = model.createKind('Organization');
      const text = model.createDatatype('Text');

      agent.createAttribute(text, 'name');
      person.createAttribute(text, 'surname');

      model.createMaterialRelation(person, organization, 'works-for');

      const agentIntoPerson = model.createGeneralization(agent, person, 'agentIntoPerson');
      const agentIntoOrganization = model.createGeneralization(agent, organization, 'agentIntoOrganization');

      model.createPartition([agentIntoPerson, agentIntoOrganization], null, 'agentsSet');

      const serialization = JSON.stringify(project);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(project);
    });
  });
});
