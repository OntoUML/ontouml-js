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
    project.name.add('Name');

    const model = project.packageBuilder().name('Model').build();

    const agent = model.classBuilder().category().name('Agent').build();
    const person = model.classBuilder().kind().name('Person').build();
    const organization = model
      .classBuilder()
      .kind()
      .name('Organization')
      .build();
    const text = model.classBuilder().datatype().name('Text').build();

    agent.attributeBuilder().type(text).name('name').build();
    person.attributeBuilder().type(text).name('surname').build();

    const worksFor = model
      .binaryRelationBuilder()
      .source(person)
      .target(organization)
      .name('works-for')
      .material()
      .build();

    const agentIntoPerson = person.addParent(agent);
    agentIntoPerson.name.add('agentIntoPerson');

    const agentIntoOrganization = organization.addParent(agent);
    agentIntoOrganization.name.add('agentIntoOrganization');

    const agentSet = model
      .generalizationSetBuilder()
      .generalizations(agentIntoPerson, agentIntoOrganization)
      .partition()
      .name('agentsSet')
      .build();

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

  //   it('Test project serialization', () => expect(serializationUtils.validate(project)).toBeTrue());
  //   it('Test string serialization', () => expect(serializationUtils.validate(JSON.stringify(project))).toBeTrue());
  //   it('Test object serialization', () => expect(serializationUtils.validate(JSON.parse(JSON.stringify(project)))).toBeTrue());
  //   it('Test invalid input', () => expect(() => serializationUtils.validate(true as any)).toThrow());

  //   it(`Validate basic ${Project.name}`, () => expect(serializationUtils.validate(new Project())).toBeTrue());
  //   it(`Validate basic ${Package.name}`, () => expect(serializationUtils.validate(new Package())).toBeTrue());
  //   it(`Validate basic ${Class.name}`, () => expect(serializationUtils.validate(new Class())).toBeTrue());
  //   it(`Validate basic ${Relation.name}`, () => expect(serializationUtils.validate(new Relation())).toBeTrue());
  //   it(`Validate basic ${Generalization.name}`, () => {
  //     const generalization = new Generalization();
  //     generalization.general = new Class();
  //     generalization.specific = new Class();

  //     expect(serializationUtils.validate(generalization)).toBeTrue();
  //   });
  //   it(`Validate basic ${GeneralizationSet.name}`, () => {
  //     expect(serializationUtils.validate(new GeneralizationSet())).toBeTrue();
  //   });
  //   it(`Validate basic ${Property.name}`, () => {
  //     const property = new Property();
  //     property.propertyType = new Class();

  //     expect(serializationUtils.validate(property)).toBeTrue();
  //   });
  //   it(`Validate basic ${Literal.name}`, () => expect(serializationUtils.validate(new Literal())).toBeTrue());
  //   it(`Validate basic ${Diagram.name}`, () => expect(serializationUtils.validate(new Diagram())).toBeTrue());

  //   it(`Validate basic ${ClassView.name}`, () => {
  //     const classView = new ClassView();
  //     classView.modelElement = new Class();

  //     expect(serializationUtils.validate(classView)).toBeTrue();
  //   });
  //   it(`Validate basic ${RelationView.name}`, () => {
  //     const relationView = new RelationView();
  //     relationView.modelElement = new Relation();
  //     relationView.source = new ClassView();
  //     relationView.target = new ClassView();

  //     expect(serializationUtils.validate(relationView)).toBeTrue();
  //   });
  //   it(`Validate basic ${GeneralizationView.name}`, () => {
  //     const generalizationView = new GeneralizationView();
  //     generalizationView.modelElement = new Generalization();
  //     generalizationView.source = new ClassView();
  //     generalizationView.target = new ClassView();

  //     expect(serializationUtils.validate(generalizationView)).toBeTrue();
  //   });
  //   it(`Validate basic ${GeneralizationSetView.name}`, () => {
  //     const generalizationSetView = new GeneralizationSetView();
  //     generalizationSetView.modelElement = new GeneralizationSet();
  //     expect(serializationUtils.validate(generalizationSetView)).toBeTrue();
  //   });
  //   it(`Validate basic ${PackageView.name}`, () => {
  //     const packageView = new PackageView();
  //     packageView.modelElement = new Package();
  //     expect(serializationUtils.validate(packageView)).toBeTrue();
  //   });
  //   it(`Validate basic ${Rectangle.name}`, () => expect(serializationUtils.validate(new Rectangle())).toBeTrue());
  //   it(`Validate basic ${Text.name}`, () => expect(serializationUtils.validate(new Text())).toBeTrue());
  //   it(`Validate basic ${Path.name}`, () => expect(serializationUtils.validate(new Path())).toBeTrue());
  // });

  describe(`Test serialization.${serializationUtils.parse.name}()`, () => {
    let proj: Project;

    beforeEach(() => {
      proj = new Project();
    });

    it(`Test ${Project.name} de-serialization`, () => {
      const serialization = JSON.stringify(proj);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(proj);
    });

    it(`Test ${Package.name} de-serialization`, () => {
      const pkg = proj.packageBuilder().build();
      const serialization = JSON.stringify(pkg);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(pkg);
    });

    it(`Test ${Class.name} de-serialization`, () => {
      const _class = proj.classBuilder().order(5).build();
      const serialization = JSON.stringify(_class);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(_class);
    });

    it(`Test ${Generalization.name} de-serialization`, () => {
      const pkg = proj.packageBuilder().id('pkg_id').build();
      const agent = pkg.classBuilder().id('agent_id').build();
      const person = pkg.classBuilder().id('person_id').build();

      pkg
        .generalizationBuilder()
        .id('gen_id')
        .general(agent)
        .specific(person)
        .build();

      const serialization = JSON.stringify(pkg);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(pkg);
    });

    it(`Test ${GeneralizationSet.name} de-serialization`, () => {
      const pkg = proj.packageBuilder().build();
      const agent = pkg.classBuilder().build();
      const person = pkg.classBuilder().build();

      const gen = pkg
        .generalizationBuilder()
        .general(agent)
        .specific(person)
        .build();

      const genset = pkg
        .generalizationSetBuilder()
        .generalizations(gen)
        .build();

      const serialization = JSON.stringify(pkg);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(pkg);
    });

    it(`Test ${Property.name} de-serialization`, () => {
      const clazz = proj.classBuilder().build();
      clazz.attributeBuilder().type(clazz).build();

      const serialization = JSON.stringify(clazz);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(clazz);
    });

    it(`Test ${Literal.name} de-serialization`, () => {
      const clazz = proj.classBuilder().build();
      const lit = clazz.literalBuilder().build();

      const serialization = JSON.stringify(clazz);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(clazz);
    });

    it(`Test ${Relation.name} de-serialization`, () => {
      const clazz = proj.classBuilder().build();
      const relation = proj
        .binaryRelationBuilder()
        .source(clazz)
        .target(clazz)
        .build();

      const serialization = JSON.stringify(relation);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(relation);
    });

    it(`Test full project de-serialization`, () => {
      proj.name.add('MyProject');

      const model = proj.packageBuilder().build();
      model.name.add('Model');

      const agent = model.classBuilder().category().name('Agent').build();
      const person = model.classBuilder().kind().name('Person').build();
      const org = model.classBuilder().kind().name('Organization').build();
      const text = model.classBuilder().datatype().name('Text').build();

      agent.attributeBuilder().type(text).name('name').build();
      person.attributeBuilder().type(text).name('surname').build();

      model
        .binaryRelationBuilder()
        .material()
        .source(person)
        .target(org)
        .name('works-for')
        .build();

      const agentIntoPerson = person.addParent(agent);
      const agentIntoOrganization = org.addParent(agent);

      model
        .generalizationSetBuilder()
        .generalizations(agentIntoPerson, agentIntoOrganization)
        .partition()
        .name('agentsSet');

      const serialization = JSON.stringify(proj);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
      expect(serializationUtils.parse(serialization)).toEqual(proj);
    });
  });
});
