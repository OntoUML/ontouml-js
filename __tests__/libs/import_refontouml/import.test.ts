import { readFileSync, writeFileSync } from 'fs';
import { parseString } from 'xml2js';

import { Diagram, Package, Project, serializationUtils } from '@libs/ontouml';
import { RefOntoumlImporter } from '@libs/import_refontouml';
import { Modularizer } from '@libs/complexity';

describe(`RefOntoumlImporter Tests`, () => {
  // let refontouml;
  // let importer;
  // let project: Project;

  // beforeAll(() => {
  //   try {
  //     const xml = readFileSync('__tests__/libs/import_refontouml/mgic.refontouml', 'utf8');
  //     parseString(xml, (err, result) => {
  //       refontouml = result['RefOntoUML:Model'];
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }

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
  // });

  it('Should generate views', () => {
    // console.time('timer');
    // console.log('Reading input file...');
    const json = readFileSync('__tests__/libs/import_refontouml/mgic.json', 'utf8');
    // console.timeEnd('timer');
    //
    //
    // console.time('timer');
    // console.log('Parsing project...');
    let proj: Project = serializationUtils.parse(json) as Project;
    // console.timeEnd('timer');
    //
    //
    // console.time('timer');
    // console.log('Generating modules...');
    const modularizer = new Modularizer(proj);
    modularizer.run();
    // console.timeEnd('timer');
    //
    //
    // console.time('timer');
    // console.log('Writting output file...');
    writeFileSync('__tests__/libs/import_refontouml/mgic-with-diagrams.json', JSON.stringify(proj, null, 2));
    // console.timeEnd('timer');
  });
});
