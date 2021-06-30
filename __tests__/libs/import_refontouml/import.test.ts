import { readFileSync, writeFileSync } from 'fs';
import { parseString } from 'xml2js';

import { Diagram, Project, serializationUtils } from '@libs/ontouml';
import { RefOntoumlImporter } from '@libs/import_refontouml';
import { Modularizer } from '@libs/complexity';

describe(`RefOntoumlImporter Tests`, () => {
  let sourceModel;
  let importer;
  let targetProject;

  beforeAll(() => {
    try {
      const xml = readFileSync('__tests__/libs/import_refontouml/mgic.refontouml', 'utf8');
      parseString(xml, (err, result) => {
        sourceModel = result['RefOntoUML:Model'];
      });
    } catch (err) {
      console.error(err);
    }

    importer = new RefOntoumlImporter(sourceModel);
    targetProject = importer.run().result;

    writeFileSync('__tests__/libs/import_refontouml/mgic.json', JSON.stringify(targetProject, null, 2));
  });

  it('Should return a project', () => {
    expect(targetProject).toBeInstanceOf(Project);
  });

  it('Should be validate against the ontouml-schema', () => {
    const isValid = serializationUtils.validate(targetProject);
    expect(isValid).toBeTruthy();
    expect(isValid).toHaveLength(0);
  });

  it('Should generate views', () => {
    let diagrams: Diagram[] = new Modularizer(targetProject).buildAll();
  });
});
