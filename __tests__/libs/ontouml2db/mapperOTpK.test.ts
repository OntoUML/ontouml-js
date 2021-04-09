/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { TestResource } from './test_resources/TestResource';
import { OntoUML2DB } from '@libs/ontouml2db';
import { baseExample } from './test_resources/baseExample';
import { test_001 } from './test_resources/001_simple_flattening';
import { test_002 } from './test_resources/002_flatting_with_duplicate_attributes';
import { test_003 } from './test_resources/003_flatting_gs';
import { test_004 } from './test_resources/004_flatting_multiples_generalizations';
import { test_005 } from './test_resources/005_flatting_orthogonal_gs';
import { test_006 } from './test_resources/006_flatting_cascading_gs';
import { test_007 } from './test_resources/007_flatting_category_without_specialization';
import { test_008 } from './test_resources/008_flatting_root_association';
import { test_009 } from './test_resources/009_flatting_with_association';
import { test_010 } from './test_resources/010_flatting_with_association_multiples_generalizations';
import { test_011 } from './test_resources/011_flatting_cascading_association_multiples_gs';
import { test_012 } from './test_resources/012_simple_lifting';
import { test_013 } from './test_resources/013_lifting_cascade_generalization';
import { test_014 } from './test_resources/014_lifting_multiple_generalizations';
import { test_015 } from './test_resources/015_lifting_multiple_generalizations_duplicate_attributes';
import { test_016 } from './test_resources/016_lifting_cascade_generalization_association';
import { test_017 } from './test_resources/017_lifting_gs_association';
import { test_018 } from './test_resources/018_lifting_orthogonal_gs';
import { test_019 } from './test_resources/019_lifting_generalization_and_gs';
import { test_020 } from './test_resources/020_lifting_hierarchy_gs';
import { test_021 } from './test_resources/021_lifting_generalization_and_gs_association';
import { test_022 } from './test_resources/022_lifting_gs_disjoint_complete';
import { test_023 } from './test_resources/023_lifting_gs_disjoint_incomplete';
import { test_024 } from './test_resources/024_lifting_gs_overlapping_complete';
import { test_025 } from './test_resources/025_lifting_gs_overlapping_incomplete';
import { test_026 } from './test_resources/026_flatting_to_class_association';
import { test_027 } from './test_resources/027_lifting_multiple_relations_to_remake';
import { test_028 } from './test_resources/028_multivalued_property';
import { test_029 } from './test_resources/029_h2_script';
import { test_030 } from './test_resources/030_mysql_script';
import { test_031 } from './test_resources/031_oracle_script';
import { test_032 } from './test_resources/032_postgre.script';
import { test_033 } from './test_resources/033_sqlserver_script';
import { test_034 } from './test_resources/034_lifting_with_duplicate_attributes';
import { test_035 } from './test_resources/035_enum_field_to_lookup_table';
import { test_036 } from './test_resources/036_enum_field_to_lookup_tables_h2';
import { test_037 } from '../ontouml2db/test_resources/037_test_generic_db_without_lookup_tabele_for_enums';

const testResourcesRight: TestResource[] = [
  test_001,
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
  test_028,
  test_029,
  test_030,
  test_031,
  test_032,
  test_033,
  test_035,
  test_036,
  baseExample
];

const testResourcesWrong: TestResource[] = [test_002, test_034, test_037];

describe('Testing One Table per Kind mapper.', () => {
  let service: OntoUML2DB;
  let files;

  describe('Correct models', () => {
    for (const testResource of testResourcesRight) {
      it(`Test model: '${testResource.title}'`, () => {
        expect(() => {
          service = new OntoUML2DB(testResource.project, testResource.options);
          files = service.run();
        }).not.toThrow();

        testResource.checker.setTransformation(service);
        testResource.checker.setSchema(files.result.schema);

        expect(testResource.checker.check()).toBe('');
      });
    }
  });

  describe('Wrong models', () => {
    for (const testResource of testResourcesWrong) {
      it(`Test model: '${testResource.title}'`, () => {
        expect(() => {
          service = new OntoUML2DB(testResource.project, testResource.options);
          service.run();
        }).toThrow(Error);
      });
    }
  });
});
