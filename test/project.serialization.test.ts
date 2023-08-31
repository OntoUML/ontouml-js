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
} from '../src';

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

    const worksFor = model.createMediation(person, organization, 'works-for');

    const agentIntoPerson = model.createGeneralization(
      agent,
      person,
      'agentIntoPerson'
    );
    const agentIntoOrganization = model.createGeneralization(
      agent,
      organization,
      'agentIntoOrganization'
    );

    const agentSet = model.createPartition(
      [agentIntoPerson, agentIntoOrganization],
      null,
      'agentsSet'
    );

    const diagram = project.createDiagram();

    diagram.owner = model;
    diagram.addPackage(model);
    diagram.addClass(agent);
    diagram.addClass(person);
    diagram.addClass(organization);
    diagram.addGeneralization(agentIntoPerson);
    diagram.addGeneralization(agentIntoOrganization);
    diagram.addGeneralizationSet(agentSet);
    diagram.addBinaryRelation(worksFor);

    expect(() => JSON.stringify(project)).not.toThrow();
  });

  // TODO: Reimplement this test when the schemas are published
  // describe(`Test serialization.${serializationUtils.validate.name}()`, () => {
  //   const project = new Project().createModel().project;

  //   it('Test project serialization', () => expect(serializationUtils.validate(project)).toBe(true));
  //   it('Test string serialization', () => expect(serializationUtils.validate(JSON.stringify(project))).toBe(true));
  //   it('Test object serialization', () => expect(serializationUtils.validate(JSON.parse(JSON.stringify(project)))).toBe(true));
  //   it('Test invalid input', () => expect(() => serializationUtils.validate(true as any)).toThrow());

  //   it(`Validate basic ${Project.name}`, () => expect(serializationUtils.validate(new Project())).toBe(true));
  //   it(`Validate basic ${Package.name}`, () => expect(serializationUtils.validate(new Package())).toBe(true));
  //   it(`Validate basic ${Class.name}`, () => expect(serializationUtils.validate(new Class())).toBe(true));
  //   it(`Validate basic ${Relation.name}`, () => expect(serializationUtils.validate(new Relation())).toBe(true));
  //   it(`Validate basic ${Generalization.name}`, () => {
  //     const generalization = new Generalization();
  //     generalization.general = new Class();
  //     generalization.specific = new Class();

  //     expect(serializationUtils.validate(generalization)).toBe(true);
  //   });
  //   it(`Validate basic ${GeneralizationSet.name}`, () => {
  //     expect(serializationUtils.validate(new GeneralizationSet())).toBe(true);
  //   });
  //   it(`Validate basic ${Property.name}`, () => {
  //     const property = new Property();
  //     property.propertyType = new Class();

  //     expect(serializationUtils.validate(property)).toBe(true);
  //   });
  //   it(`Validate basic ${Literal.name}`, () => expect(serializationUtils.validate(new Literal())).toBe(true));
  //   it(`Validate basic ${Diagram.name}`, () => expect(serializationUtils.validate(new Diagram())).toBe(true));

  //   it(`Validate basic ${ClassView.name}`, () => {
  //     const classView = new ClassView();
  //     classView.modelElement = new Class();

  //     expect(serializationUtils.validate(classView)).toBe(true);
  //   });
  //   it(`Validate basic ${RelationView.name}`, () => {
  //     const relationView = new RelationView();
  //     relationView.modelElement = new Relation();
  //     relationView.source = new ClassView();
  //     relationView.target = new ClassView();

  //     expect(serializationUtils.validate(relationView)).toBe(true);
  //   });
  //   it(`Validate basic ${GeneralizationView.name}`, () => {
  //     const generalizationView = new GeneralizationView();
  //     generalizationView.modelElement = new Generalization();
  //     generalizationView.source = new ClassView();
  //     generalizationView.target = new ClassView();

  //     expect(serializationUtils.validate(generalizationView)).toBe(true);
  //   });
  //   it(`Validate basic ${GeneralizationSetView.name}`, () => {
  //     const generalizationSetView = new GeneralizationSetView();
  //     generalizationSetView.modelElement = new GeneralizationSet();
  //     expect(serializationUtils.validate(generalizationSetView)).toBe(true);
  //   });
  //   it(`Validate basic ${PackageView.name}`, () => {
  //     const packageView = new PackageView();
  //     packageView.modelElement = new Package();
  //     expect(serializationUtils.validate(packageView)).toBe(true);
  //   });
  //   it(`Validate basic ${Rectangle.name}`, () => expect(serializationUtils.validate(new Rectangle())).toBe(true));
  //   it(`Validate basic ${Text.name}`, () => expect(serializationUtils.validate(new Text())).toBe(true));
  //   it(`Validate basic ${Path.name}`, () => expect(serializationUtils.validate(new Path())).toBe(true));
  // });

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
      const pkg = new Package({ id: 'pkg_id' });
      const agent = new Class({ id: 'agent_id' });
      const person = new Class({ id: 'person_id' });
      const gen = new Generalization({
        id: 'gen_id',
        general: agent,
        specific: person
      });

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

      const agentIntoPerson = model.createGeneralization(
        agent,
        person,
        'agentIntoPerson'
      );
      const agentIntoOrganization = model.createGeneralization(
        agent,
        organization,
        'agentIntoOrganization'
      );

      model.createPartition(
        [agentIntoPerson, agentIntoOrganization],
        null,
        'agentsSet'
      );

      const serialization = JSON.stringify(project);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(project);
    });
  });
});
