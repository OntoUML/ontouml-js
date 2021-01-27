import { DBMSSupported } from '@libs/ontouml2db/constants/DBMSSupported';
import { StrategyType } from '@libs/ontouml2db/constants/StrategyType';
import { OntoUML2DBOptions } from '@libs/ontouml2db/OntoUML2DBOptions';
import { OntoUML2DB } from '@libs/ontouml2db/OntoUML2DB';
import fs from 'fs';
import { TestResource } from '../ontouml2db/test_resources/TestResource';
import { baseExample } from '../ontouml2db/test_resources/baseExample';
import { test_001 } from '../ontouml2db/test_resources/001_simple_flattening';
import { test_002 } from '../ontouml2db/test_resources/002_flatting_with_duplicate_attributes';
import { test_003 } from '../ontouml2db/test_resources/003_flatting_gs';
import { test_004 } from '../ontouml2db/test_resources/004_flatting_multiples_generalizations';
import { test_005 } from '../ontouml2db/test_resources/005_flatting_orthogonal_gs';
import { test_006 } from '../ontouml2db/test_resources/006_flatting_cascading_gs';
import { test_007 } from '../ontouml2db/test_resources/007_flatting_category_without_specialization';
import { test_008 } from '../ontouml2db/test_resources/008_flatting_root_association';
import { test_009 } from '../ontouml2db/test_resources/009_flatting_with_association';
import { test_010 } from '../ontouml2db/test_resources/010_flatting_with_association_multiples_generalizations';
import { test_011 } from '../ontouml2db/test_resources/011_flatting_cascading_association_multiples_gs';
import { test_012 } from '../ontouml2db/test_resources/012_simple_lifting';
import { test_013 } from '../ontouml2db/test_resources/013_lifting_cascade_generalization';
import { test_014 } from '../ontouml2db/test_resources/014_lifting_multiple_generalizations';
import { test_015 } from '../ontouml2db/test_resources/015_lifting_multiple_generalizations_duplicate_attributes';
import { test_016 } from '../ontouml2db/test_resources/016_lifting_cascade_generalization_association';
import { test_017 } from '../ontouml2db/test_resources/017_lifting_gs_association';
import { test_018 } from '../ontouml2db/test_resources/018_lifting_orthogonal_gs';
import { test_019 } from '../ontouml2db/test_resources/019_lifting_generalization_and_gs';
import { test_020 } from '../ontouml2db/test_resources/020_lifting_hierarchy_gs';
import { test_021 } from '../ontouml2db/test_resources/021_lifting_generalization_and_gs_association';
import { test_022 } from '../ontouml2db/test_resources/022_lifting_gs_disjoint_complete';
import { test_023 } from '../ontouml2db/test_resources/023_lifting_gs_disjoint_incomplete';
import { test_024 } from '../ontouml2db/test_resources/024_lifting_gs_overlapping_complete';
import { test_025 } from '../ontouml2db/test_resources/025_lifting_gs_overlapping_incomplete';
import { test_026 } from '../ontouml2db/test_resources/026_flatting_to_class_association';
import { test_027 } from '../ontouml2db/test_resources/027_lifting_multiple_relations_to_remake';
import { test_028 } from '../ontouml2db/test_resources/028_multivalued_property';

const testResources: TestResource[] = [
  baseExample,
  test_001,
  test_002,
  test_003,
  test_004,
  test_005,
  test_006,
  test_007,
  test_008,
  test_009,
  test_010,
  test_011,
  test_012,
  test_013,
  test_014,
  test_015,
  test_016,
  test_017,
  test_018,
  test_019,
  test_020,
  test_021,
  test_022,
  test_023,
  test_024,
  test_025,
  test_026,
  test_027,
  test_028
];

let options: OntoUML2DBOptions = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DBMSSupported.H2,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa'
};

function testTransformation(model, checker, title) {
  let mapper = new OntoUML2DB(model, options);
  let script = mapper.getRelationalSchema();

  checker.setTransformation(mapper);

  let result = checker.check();

  //console.log(mapper.getSourceGraph().toString());
  //console.log(mapper.getTracker().toString());

  if (result != '') {
    console.log(title);
    console.log(mapper.getSourceGraph().toString());
    console.log(mapper.getTracker().toString());
    expect(result).toBe('');
  }

  fs.writeFile('C:\\_Results\\test.sql', script, err => {
    if (err) throw err;
  });
}

test('Execution', () => {
  let pos: number = 0;
  testTransformation(testResources[pos].model, testResources[pos].checker, testResources[pos].title);
  expect(true).toBe(true);
});

test('Generate Ontop Files', () => {
  let ontoUML2DB = new OntoUML2DB(test_001.modelManager, options);

  fs.writeFile('C:\\_Results\\test.sql', ontoUML2DB.getRelationalSchema(), err => {
    if (err) throw err;
  });

  fs.writeFile('C:\\_Results\\test.properties', ontoUML2DB.getProtegeConnection(), err => {
    if (err) throw err;
  });

  fs.writeFile('C:\\_Results\\test.obda', ontoUML2DB.getOBDAFile(), err => {
    if (err) throw err;
  });

  expect(true).toBe(true);
});

test('Execute all', () => {
  testTransformation(testResources[1].modelManager, testResources[1].checker, testResources[1].title);
  testTransformation(testResources[2].modelManager, testResources[2].checker, testResources[2].title);
  testTransformation(testResources[3].modelManager, testResources[3].checker, testResources[3].title);
  testTransformation(testResources[4].modelManager, testResources[4].checker, testResources[4].title);
  testTransformation(testResources[5].modelManager, testResources[5].checker, testResources[5].title);
  testTransformation(testResources[6].modelManager, testResources[6].checker, testResources[6].title);
  testTransformation(testResources[7].modelManager, testResources[7].checker, testResources[7].title);
  testTransformation(testResources[8].modelManager, testResources[8].checker, testResources[8].title);
  testTransformation(testResources[9].modelManager, testResources[9].checker, testResources[9].title);
  testTransformation(testResources[10].modelManager, testResources[10].checker, testResources[10].title);
  testTransformation(testResources[11].modelManager, testResources[11].checker, testResources[11].title);
  testTransformation(testResources[12].modelManager, testResources[12].checker, testResources[12].title);
  testTransformation(testResources[13].modelManager, testResources[13].checker, testResources[13].title);
  testTransformation(testResources[14].modelManager, testResources[14].checker, testResources[14].title);
  testTransformation(testResources[15].modelManager, testResources[15].checker, testResources[15].title);
  testTransformation(testResources[16].modelManager, testResources[16].checker, testResources[16].title);
  testTransformation(testResources[17].modelManager, testResources[17].checker, testResources[17].title);
  testTransformation(testResources[18].modelManager, testResources[18].checker, testResources[18].title);
  testTransformation(testResources[19].modelManager, testResources[19].checker, testResources[19].title);
  testTransformation(testResources[20].modelManager, testResources[20].checker, testResources[20].title);
  testTransformation(testResources[21].modelManager, testResources[21].checker, testResources[21].title);
  testTransformation(testResources[22].modelManager, testResources[22].checker, testResources[22].title);
  testTransformation(testResources[23].modelManager, testResources[23].checker, testResources[23].title);
  testTransformation(testResources[24].modelManager, testResources[24].checker, testResources[24].title);
  testTransformation(testResources[25].modelManager, testResources[25].checker, testResources[25].title);
  testTransformation(testResources[26].modelManager, testResources[26].checker, testResources[26].title);
  testTransformation(testResources[27].modelManager, testResources[27].checker, testResources[27].title);
  testTransformation(testResources[28].modelManager, testResources[28].checker, testResources[28].title);

  testTransformation(testResources[0].modelManager, testResources[0].checker, testResources[0].title);

  expect(true).toBe(true);
});
