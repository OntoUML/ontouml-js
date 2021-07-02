import { parseString } from 'xml2js';

import { Diagram, Package, Project, serializationUtils } from '@libs/ontouml';
import { RefOntoumlImporter } from '@libs/import_refontouml';

function parseRefontouml(xml: string): Project {
  let refontouml;

  parseString(xml, (err, result) => {
    refontouml = result['RefOntoUML:Model'];
  });

  const importer = new RefOntoumlImporter(refontouml);
  return importer.run().result;
}

describe(`Importing an empty project`, () => {
  const xml = '<?xml version="1.0" encoding="ASCII"?><RefOntoUML:Model xmi:id="123" name="EA_Model" visibility="public"/>';

  const project = parseRefontouml(xml);

  it('Should return a project', () => {
    expect(project).toBeInstanceOf(Project);
  });

  it('Project should have a model', () => {
    expect(project.model).toBeInstanceOf(Package);
  });

  it('Model should be empty', () => {
    expect(project.model.contents).toHaveLength(0);
  });

  it('Project should have no diagrams', () => {
    expect(project.diagrams).toHaveLength(0);
  });

  it('Project should validate against the ontouml-schema', () => {
    const isValid = serializationUtils.validate(project);
    expect(isValid).not.toBeInstanceOf(Array);
    expect(isValid).toBeTruthy();
  });
});

describe(`Importing an simple project`, () => {
  const xml =
    '<?xml version="1.0" encoding="ASCII"?>' +
    '<RefOntoUML:Model xmi:id="123" name="EA_Model" visibility="public">' +
    '   <packagedElement xsi:type="RefOntoUML:Kind" xmi:id="c1" name="Person"/>' +
    '   <packagedElement xsi:type="RefOntoUML:Kind" xmi:id="c2" name="Dog"/>' +
    '</RefOntoUML:Model>';

  const project = parseRefontouml(xml);

  it('Model should contain two classes', () => {
    expect(project.model.contents).toHaveLength(2);
    expect(project.getClassById('c1')).toBeTruthy();
    expect(project.getClassById('c2')).toBeTruthy();
  });

  it('Project should validate against the ontouml-schema', () => {
    const isValid = serializationUtils.validate(project);
    expect(isValid).not.toBeInstanceOf(Array);
    expect(isValid).toBeTruthy();
  });
});
