import {
  BinaryRelationView,
  ClassView,
  Diagram,
  GeneralizationView,
  Point,
  Project,
  serializationUtils
} from '../../src';
import Ajv from 'ajv/dist/2020';
import addFormats from 'ajv-formats';

const schema = require('ontouml-schema');

function buildProjectWithDiagram(): Project {
  const proj = new Project();
  proj.name.add('Diagrammed Project');

  const model = proj.packageBuilder().root().name('Model').build();

  const agent = model.classBuilder().category().name('Agent').build();
  const person = model.classBuilder().kind().name('Person').build();
  const organization = model.classBuilder().kind().name('Organization').build();
  const contract = model.classBuilder().relator().name('Contract').build();

  const worksFor = model
    .binaryRelationBuilder()
    .material()
    .name('works-for')
    .source(person)
    .target(organization)
    .build();

  const involves = model
    .naryRelationBuilder()
    .members(person, organization, contract)
    .name('involves')
    .build();

  const personToAgent = person.addParent(agent);
  const orgToAgent = organization.addParent(agent);

  const genSet = model
    .generalizationSetBuilder()
    .partition()
    .generalizations(personToAgent, orgToAgent)
    .name('agents')
    .build();

  const note = model
    .noteBuilder()
    .text('People work for organizations.')
    .build();
  model.anchorBuilder().note(note).annotates(worksFor).build();

  const diagram = proj.createDiagram('Overview');
  diagram.description.add('The main diagram of the project.');
  diagram.owner = model;
  diagram.addPackage(model);
  diagram.addBinaryRelation(worksFor);
  diagram.addNaryRelation(involves);
  diagram.addGeneralization(personToAgent);
  diagram.addGeneralization(orgToAgent);
  diagram.addGeneralizationSet(genSet);
  diagram.addClass(contract);

  return proj;
}

describe('Diagram serialization tests', () => {
  const ajv = new Ajv();
  const validator = addFormats(ajv).compile(schema);

  it('Serialization of a project with a diagram should be valid against the OntoUML JSON Schema', () => {
    const proj = buildProjectWithDiagram();
    const isValid = validator(JSON.parse(JSON.stringify(proj)));

    if (!isValid) console.log(validator.errors);
    expect(isValid).toBeTruthy();
  });

  it('Should serialize diagrams and views within the project elements', () => {
    const proj = buildProjectWithDiagram();
    const raw = JSON.parse(JSON.stringify(proj));
    const types = raw.elements.map((e: any) => e.type);

    expect(types).toContain('Diagram');
    expect(types).toContain('ClassView');
    expect(types).toContain('PackageView');
    expect(types).toContain('BinaryRelationView');
    expect(types).toContain('NaryRelationView');
    expect(types).toContain('GeneralizationView');
    expect(types).toContain('GeneralizationSetView');
  });

  it('Should parse a project with a diagram without throwing', () => {
    const proj = buildProjectWithDiagram();
    expect(() => serializationUtils.parse(JSON.stringify(proj))).not.toThrow();
  });

  it('Parsed projects should serialize into the original serialization', () => {
    const proj = buildProjectWithDiagram();
    const serialization = JSON.stringify(proj);
    const parsed = serializationUtils.parse(serialization);

    expect(JSON.stringify(parsed)).toEqual(serialization);
  });

  it('Should preserve the structure of parsed diagrams', () => {
    const proj = buildProjectWithDiagram();
    const parsed = serializationUtils.parse(JSON.stringify(proj));

    expect(parsed.diagrams).toHaveLength(1);

    const diagram = parsed.diagrams[0] as Diagram;
    expect(diagram.name.get()).toEqual('Overview');
    expect(diagram.description.get()).toEqual(
      'The main diagram of the project.'
    );
    expect(diagram.owner).toBe(parsed.root);
    expect(diagram.views).toHaveLength(proj.diagrams[0].views.length);

    const person = parsed.classes.find(c => c.name.get() === 'Person')!;
    const personView = diagram.findView(person) as ClassView;
    expect(personView).toBeInstanceOf(ClassView);

    const worksFor = parsed.binaryRelations[0];
    const relationView = diagram.getRelationViews()[0];
    expect(relationView.element).toBe(worksFor);
    expect(relationView.source).toBe(personView);

    const genSetView = diagram.getGeneralizationSetViews()[0];
    expect(genSetView.element).toBe(parsed.generalizationSets[0]);

    const naryView = diagram.views.find(
      v => v.element === parsed.naryRelations[0]
    )!;
    expect(naryView).toBeDefined();

    diagram.getGeneralizationViews().forEach(view => {
      expect(view).toBeInstanceOf(GeneralizationView);
      expect(parsed.generalizations).toContain(view.element);
    });
  });

  it('Should serialize the shapes of views within the project elements', () => {
    const proj = buildProjectWithDiagram();
    const raw = JSON.parse(JSON.stringify(proj));
    const types = raw.elements.map((e: any) => e.type);

    expect(types).toContain('Rectangle');
    expect(types).toContain('Path');
    expect(types).toContain('Text');
    expect(types).toContain('Diamond');

    // every shape referenced by a view is serialized as a project element
    const ids = new Set(raw.elements.map((e: any) => e.id));
    const shapeRefs = raw.elements.flatMap((e: any) =>
      [e.rectangle, e.text, e.diamond, e.path, ...(e.paths ?? [])].filter(
        (ref: any) => typeof ref === 'string' && e.type?.endsWith('View')
      )
    );

    shapeRefs.forEach((ref: string) => expect(ids.has(ref)).toBeTrue());
  });

  it('Should preserve the geometry of parsed shapes', () => {
    const proj = buildProjectWithDiagram();
    const diagram = proj.diagrams[0];

    const classView = diagram.getClassViews()[0];
    classView.rectangle.setX(111);
    classView.rectangle.setY(222);
    classView.rectangle.width = 333;
    classView.rectangle.height = 44;

    const relationView = diagram.getRelationViews()[0];
    relationView.path.points = [
      new Point(1, 2),
      new Point(3, 4),
      new Point(5, 6)
    ];

    const parsed = serializationUtils.parse(JSON.stringify(proj));
    const parsedDiagram = parsed.diagrams[0];

    const parsedClassView = parsedDiagram.views.find(
      v => v.id === classView.id
    ) as ClassView;
    expect(parsedClassView.rectangle.id).toEqual(classView.rectangle.id);
    expect(parsedClassView.rectangle.getX()).toEqual(111);
    expect(parsedClassView.rectangle.getY()).toEqual(222);
    expect(parsedClassView.rectangle.width).toEqual(333);
    expect(parsedClassView.rectangle.height).toEqual(44);

    const parsedRelationView = parsedDiagram.views.find(
      v => v.id === relationView.id
    ) as BinaryRelationView;
    expect(parsedRelationView.path.id).toEqual(relationView.path.id);
    expect(parsedRelationView.path.points.map(p => [p.x, p.y])).toEqual([
      [1, 2],
      [3, 4],
      [5, 6]
    ]);
  });

  it('Should parse serializations without shapes, keeping shape ids', () => {
    const proj = buildProjectWithDiagram();
    const raw = JSON.parse(JSON.stringify(proj));
    const shapeTypes = ['Rectangle', 'Path', 'Text', 'Diamond'];
    raw.elements = raw.elements.filter(
      (e: any) => !shapeTypes.includes(e.type)
    );

    const classView = proj.diagrams[0].getClassViews()[0];
    const parsed = serializationUtils.parse(JSON.stringify(raw));
    const parsedClassView = parsed.diagrams[0].views.find(
      v => v.id === classView.id
    ) as ClassView;

    expect(parsedClassView.rectangle.id).toEqual(classView.rectangle.id);
  });
});
