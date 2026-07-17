import {
  ClassView,
  Diagram,
  GeneralizationView,
  Project,
  serializationUtils
} from '../../src';
import Ajv from 'ajv';
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

  const diagram = proj.createDiagram();
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
});
