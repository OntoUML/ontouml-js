import {
  BinaryRelation,
  BinaryRelationView,
  Class,
  ClassView,
  Diagram,
  Generalization,
  GeneralizationSet,
  GeneralizationView,
  GeneralizationSetView,
  NaryRelation,
  NaryRelationView,
  Package,
  PackageView,
  Path,
  Project,
  Rectangle,
  Text
} from '../../src';

describe('Diagram tests', () => {
  let proj: Project;
  let pkg: Package;
  let person: Class, organization: Class, contract: Class;
  let worksFor: BinaryRelation;
  let involves: NaryRelation;
  let personToAgent: Generalization, orgToAgent: Generalization;
  let agent: Class;
  let genSet: GeneralizationSet;
  let diagram: Diagram;

  beforeEach(() => {
    proj = new Project();
    pkg = proj.packageBuilder().build();

    agent = pkg.classBuilder().category().name('Agent').build();
    person = pkg.classBuilder().kind().name('Person').build();
    organization = pkg.classBuilder().kind().name('Organization').build();
    contract = pkg.classBuilder().relator().name('Contract').build();

    worksFor = pkg
      .binaryRelationBuilder()
      .material()
      .name('works-for')
      .source(person)
      .target(organization)
      .build();

    involves = pkg
      .naryRelationBuilder()
      .members(person, organization, contract)
      .name('involves')
      .build();

    personToAgent = person.addParent(agent);
    orgToAgent = organization.addParent(agent);

    genSet = pkg
      .generalizationSetBuilder()
      .partition()
      .generalizations(personToAgent, orgToAgent)
      .build();

    diagram = proj.createDiagram();
  });

  it('createDiagram() should register the diagram in the project', () => {
    expect(proj.diagrams).toEqual([diagram]);
    expect(diagram.project).toBe(proj);
  });

  describe('Test addClass()', () => {
    it('should create a class view with a rectangle', () => {
      const view = diagram.addClass(person);

      expect(view).toBeInstanceOf(ClassView);
      expect(view.element).toBe(person);
      expect(view.rectangle).toBeInstanceOf(Rectangle);
      expect(diagram.views).toContain(view);
    });

    it('should register the view in the project', () => {
      const view = diagram.addClass(person);
      expect(proj.getContents()).toContain(view);
    });
  });

  describe('Test addBinaryRelation()', () => {
    it('should create views for the relation and its members', () => {
      const view = diagram.addBinaryRelation(worksFor);

      expect(view).toBeInstanceOf(BinaryRelationView);
      expect(view.element).toBe(worksFor);
      expect(view.source.element).toBe(person);
      expect(view.target.element).toBe(organization);
      expect(view.path).toBeInstanceOf(Path);
      expect(diagram.views).toHaveLength(3);
    });

    it('should reuse existing views of the members', () => {
      const personView = diagram.addClass(person);
      const view = diagram.addBinaryRelation(worksFor);

      expect(view.source).toBe(personView);
      expect(diagram.views).toHaveLength(3);
    });
  });

  describe('Test addNaryRelation()', () => {
    it('should create a view with a diamond and one path per member', () => {
      const view = diagram.addNaryRelation(involves);

      expect(view).toBeInstanceOf(NaryRelationView);
      expect(view.members).toHaveLength(3);
      expect(view.paths).toHaveLength(3);
      expect(diagram.views).toHaveLength(4);
    });
  });

  describe('Test addGeneralization()', () => {
    it('should create views for the generalization and the involved classifiers', () => {
      const view = diagram.addGeneralization(personToAgent);

      expect(view).toBeInstanceOf(GeneralizationView);
      expect(view.source.element).toBe(agent);
      expect(view.target.element).toBe(person);
    });
  });

  describe('Test addGeneralizationSet()', () => {
    it('should create a view with a text shape', () => {
      const view = diagram.addGeneralizationSet(genSet);

      expect(view).toBeInstanceOf(GeneralizationSetView);
      expect(view.text).toBeInstanceOf(Text);
    });
  });

  describe('Test addPackage()', () => {
    it('should create a package view', () => {
      const view = diagram.addPackage(pkg);
      expect(view).toBeInstanceOf(PackageView);
      expect(view.element).toBe(pkg);
    });
  });

  describe('Test addModelElement()', () => {
    it('should dispatch to the right view type', () => {
      expect(diagram.addModelElement(person)).toBeInstanceOf(ClassView);
      expect(diagram.addModelElement(worksFor)).toBeInstanceOf(
        BinaryRelationView
      );
      expect(diagram.addModelElement(involves)).toBeInstanceOf(
        NaryRelationView
      );
      expect(diagram.addModelElement(personToAgent)).toBeInstanceOf(
        GeneralizationView
      );
      expect(diagram.addModelElement(genSet)).toBeInstanceOf(
        GeneralizationSetView
      );
      expect(diagram.addModelElement(pkg)).toBeInstanceOf(PackageView);
    });

    it('should throw for elements that cannot be visualized', () => {
      const attribute = person.propertyBuilder().build();
      expect(() => diagram.addModelElement(attribute)).toThrow();
    });
  });

  describe('Test findView() and containsView()', () => {
    it('should find the view of a model element', () => {
      const view = diagram.addClass(person);

      expect(diagram.findView(person)).toBe(view);
      expect(diagram.containsView(person)).toBeTrue();
      expect(diagram.findView(organization)).toBeUndefined();
      expect(diagram.containsView(organization)).toBeFalse();
    });
  });

  describe('Test view getters', () => {
    beforeEach(() => {
      diagram.addPackage(pkg);
      diagram.addBinaryRelation(worksFor);
      diagram.addGeneralization(personToAgent);
      diagram.addGeneralizationSet(genSet);
    });

    it('should filter views by type', () => {
      expect(diagram.getClassViews()).toHaveLength(3);
      expect(diagram.getRelationViews()).toHaveLength(1);
      expect(diagram.getGeneralizationViews()).toHaveLength(1);
      expect(diagram.getGeneralizationSetViews()).toHaveLength(1);
      expect(diagram.getPackageViews()).toHaveLength(1);
    });

    it('should retrieve the shapes of its views', () => {
      expect(diagram.getRectangles()).toHaveLength(4);
      expect(diagram.getPaths()).toHaveLength(2);
      expect(diagram.getTexts()).toHaveLength(1);
    });

    it('getAllContents() should return views and shapes', () => {
      const contents = diagram.getAllContents();
      const views = diagram.views;
      const shapes = views.flatMap(v => v.shapes);

      expect(contents).toIncludeSameMembers([...views, ...shapes]);
    });
  });
});
