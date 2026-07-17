import {
  BinaryRelation,
  Class,
  Generalization,
  GeneralizationSet,
  Package,
  Project,
  serializationUtils
} from '../src';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const schema = require('ontouml-schema');

function buildFullProject(): Project {
  const proj = new Project();
  proj.name.add('My Project');
  proj.description.add('A very nice project.');

  const model = proj.packageBuilder().root().name('Model').build();
  const pkg = model.packageBuilder().name('Package').build();

  const agent = pkg.classBuilder().category().name('Agent', 'en').build();
  const person = pkg
    .classBuilder()
    .kind()
    .name('Person', 'en')
    .name('Pessoa', 'pt')
    .description('An individual that...')
    .build();
  const organization = pkg.classBuilder().kind().name('Organization').build();
  const text = pkg.classBuilder().datatype().name('Text').build();

  const color = pkg.classBuilder().enumeration().name('Color').build();
  color.literalBuilder().name('red').build();
  color.literalBuilder().name('green').build();
  color.literalBuilder().name('blue').build();

  agent.propertyBuilder().type(text).name('name').build();
  person.propertyBuilder().type(text).name('surname').build();

  pkg
    .binaryRelationBuilder()
    .source(person)
    .target(organization)
    .name('works-for')
    .material()
    .build();

  const agentIntoPerson = person.addParent(agent);
  const agentIntoOrganization = organization.addParent(agent);

  pkg
    .generalizationSetBuilder()
    .partition()
    .generalizations(agentIntoPerson, agentIntoOrganization)
    .name('agentsSet')
    .build();

  return proj;
}

describe('Serialization tests', () => {
  const ajv = new Ajv();
  const validator = addFormats(ajv).compile(schema);

  describe('Validation against the OntoUML JSON Schema', () => {
    it('Serialization of an empty project should be valid', () => {
      const proj = new Project();
      const isValid = validator(proj.toJSON());

      if (!isValid) console.log(validator.errors);
      expect(isValid).toBeTruthy();
    });

    it('Serialization of a full project should be valid', () => {
      const proj = buildFullProject();
      const isValid = validator(JSON.parse(JSON.stringify(proj)));

      if (!isValid) console.log(validator.errors);
      expect(isValid).toBeTruthy();
    });
  });

  describe(`Test serializationUtils.parse()`, () => {
    it(`Should parse an empty project`, () => {
      const proj = new Project();
      const parsed = serializationUtils.parse(JSON.stringify(proj));

      expect(parsed).toEqual(proj);
    });

    it(`Should parse a full project without throwing`, () => {
      const proj = buildFullProject();
      const serialization = JSON.stringify(proj);

      expect(() => serializationUtils.parse(serialization)).not.toThrow();
    });

    it(`Parsed projects should serialize into the original serialization`, () => {
      const proj = buildFullProject();
      const serialization = JSON.stringify(proj);
      const parsed = serializationUtils.parse(serialization);

      expect(JSON.stringify(parsed)).toEqual(serialization);
    });

    it(`Should preserve the contents and containers of packages`, () => {
      const proj = buildFullProject();
      const parsed = serializationUtils.parse(JSON.stringify(proj));

      const root = parsed.root!;
      expect(root).toBeInstanceOf(Package);
      expect(root.name.get()).toEqual('Model');

      const pkg = root.contents[0] as Package;
      expect(pkg.name.get()).toEqual('Package');
      expect(pkg.container).toBe(root);
      expect(pkg.classes).toHaveLength(5);
      expect(pkg.generalizations).toHaveLength(2);
      expect(pkg.generalizationSets).toHaveLength(1);
      expect(pkg.binaryRelations).toHaveLength(1);
      pkg.contents.forEach(content => expect(content.container).toBe(pkg));
    });

    it(`Should preserve references between elements`, () => {
      const proj = buildFullProject();
      const parsed = serializationUtils.parse(JSON.stringify(proj));

      const person = parsed.classes.find(c => c.name.get() === 'Person')!;
      const agent = parsed.classes.find(c => c.name.get() === 'Agent')!;
      const text = parsed.classes.find(c => c.name.get() === 'Text')!;
      const color = parsed.classes.find(c => c.name.get() === 'Color')!;

      expect(person.getParents()).toEqual([agent]);

      const surname = person.attributes[0];
      expect(surname.name.get()).toEqual('surname');
      expect(surname.propertyType).toBe(text);
      expect(surname.container).toBe(person);

      expect(color.literals).toHaveLength(3);
      color.literals.forEach(literal => expect(literal.container).toBe(color));

      const worksFor = parsed.binaryRelations[0];
      expect(worksFor.source).toBe(person);
      expect(worksFor.target?.name.get()).toEqual('Organization');

      const genSet = parsed.generalizationSets[0];
      expect(genSet.getGeneral()).toBe(agent);
      expect(genSet.generalizations).toHaveLength(2);
      genSet.generalizations.forEach(gen =>
        expect(gen).toBeInstanceOf(Generalization)
      );
    });

    it(`Should preserve project metadata`, () => {
      const proj = new Project();
      proj.name.add('Named project');
      proj.publisher = 'https://example.org/publisher';
      proj.acronyms = ['NP'];
      proj.languages = ['en', 'pt'];
      proj.keywords = ['testing'];

      const parsed = serializationUtils.parse(JSON.stringify(proj));

      expect(parsed.name.get()).toEqual('Named project');
      expect(parsed.publisher).toEqual('https://example.org/publisher');
      expect(parsed.acronyms).toEqual(['NP']);
      expect(parsed.languages).toEqual(['en', 'pt']);
      expect(parsed.keywords).toEqual(['testing']);
    });

    it(`Should throw on inputs that are not serialized projects`, () => {
      const proj = new Project();
      const clazz = proj.classBuilder().kind().build();

      expect(() => serializationUtils.parse(JSON.stringify(clazz))).toThrow();
      expect(() => serializationUtils.parse('{}')).toThrow();
      expect(() => serializationUtils.parse('true')).toThrow();
    });

    it(`Should throw on broken references`, () => {
      const proj = new Project();
      const person = proj.classBuilder().kind().id('person').build();
      person.propertyBuilder().type(person).id('age').build();

      const raw = proj.toJSON();
      raw.elements = raw.elements.filter((e: any) => e.id !== 'person');
      raw.elements.forEach((e: any) => {
        if (e.id === 'age') e.propertyType = 'person';
      });

      expect(() => serializationUtils.parse(JSON.stringify(raw))).toThrow();
    });
  });
});
