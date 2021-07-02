import { readFileSync, writeFileSync } from 'fs';
import { parseString } from 'xml2js';

import { Diagram, Package, Project, serializationUtils } from '@libs/ontouml';
import { RefOntoumlImporter } from '@libs/import_refontouml';
import { Modularizer } from '@libs/complexity';

describe(`RefOntoumlImporter Tests`, () => {
  let proj;
  // let refontouml;
  // let importer;
  // let project: Project;

  beforeAll(() => {
    const json = readFileSync('__tests__/libs/import_refontouml/mgic.json', 'utf8');
    proj = serializationUtils.parse(json) as Project;
    //   try {
    //     const xml = readFileSync('__tests__/libs/import_refontouml/mgic.refontouml', 'utf8');
    //     parseString(xml, (err, result) => {
    //       refontouml = result['RefOntoUML:Model'];
    //     });
    //   } catch (err) {
    //     console.error(err);
    // }

    //   importer = new RefOntoumlImporter(refontouml);
    //   project = importer.run().result;

    //   writeFileSync('__tests__/libs/import_refontouml/mgic.json', JSON.stringify(project, null, 2));
    // });

    // it('Should return a project', () => {
    //   expect(project).toBeInstanceOf(Project);
    // });

    // it('Should be validate against the ontouml-schema', () => {
    //   const isValid = serializationUtils.validate(project);
    //   expect(isValid).not.toBeInstanceOf(Array);
    //   expect(isValid).toBeTruthy();
  });

  describe('Should generate views', () => {
    const max = 1;
    for (let index = 1; index <= max; index++) {
      it('Run ' + index + ' of ' + max, () => {
        const modularizer = new Modularizer(proj);
        modularizer.run();
      });
    }
  });

  afterAll(() => {
    writeFileSync('__tests__/libs/import_refontouml/mgic-with-diagrams.json', JSON.stringify(proj, null, 2));
  });
});
