/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { GraphChecker } from '@libs/ontouml2db/graph/graph_tester/GraphChecker';
import { NodeChecker } from '@libs/ontouml2db/graph/graph_tester/NodeCheker';
import { PropertyChecker } from '@libs/ontouml2db/graph/graph_tester/PropertyChecker';
import { TrackerChecker } from '@libs/ontouml2db/graph/graph_tester/TrackerChecker';
import { RelationshipChecker } from '@libs/ontouml2db/graph/graph_tester/RelationshipChecker';
import { Transformation2DB } from '@libs/ontouml2db/Transformation2DB';
import { Cardinality } from '@libs/ontouml2db/graph/util/enumerations';
import { RunExample } from '@test-models/transformation';
import { test_001 } from '@test-models/transformation';
import { test_002 } from '@test-models/transformation';
import { test_003 } from '@test-models/transformation';
import { test_004 } from '@test-models/transformation';
import { test_005 } from '@test-models/transformation';
import { test_006 } from '@test-models/transformation';
import { test_007 } from '@test-models/transformation';
import { test_008 } from '@test-models/transformation';
import { test_009 } from '@test-models/transformation';
import { test_010 } from '@test-models/transformation';
import { test_011 } from '@test-models/transformation';
import { test_012 } from '@test-models/transformation';
import { test_013 } from '@test-models/transformation';
import { test_014 } from '@test-models/transformation';
import { test_015 } from '@test-models/transformation';
import { test_016 } from '@test-models/transformation';
import { test_017 } from '@test-models/transformation';
import { test_018 } from '@test-models/transformation';
import { test_019 } from '@test-models/transformation';
import { test_020 } from '@test-models/transformation';
import { test_021 } from '@test-models/transformation';
import { test_022 } from '@test-models/transformation';
import { test_023 } from '@test-models/transformation';
import { test_024 } from '@test-models/transformation';
import { test_025 } from '@test-models/transformation';
import { test_026 } from '@test-models/transformation';
import { test_027 } from '@test-models/transformation';
import { test_028 } from '@test-models/transformation';
import { getHeapStatistics } from 'v8';

describe('Database transformation test', () => {
  test('Run Example', () => {

    let mapper = new Transformation2DB(RunExample);
    mapper.setStandardizeDatabaseNomenclature(true);

    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('birth_date', false))
          .addProperty(new PropertyChecker('rg', true))
          .addProperty(new PropertyChecker('ci', true))
          .addProperty(new PropertyChecker('is_employee', false))
          .addProperty(new PropertyChecker('is_personal_customer', false))
          .addProperty(new PropertyChecker('credit_rating', true))
          .addProperty(new PropertyChecker('credit_card', true))
          .addProperty(
            new PropertyChecker('life_phase_enum', false, ['CHILD', 'ADULT']),
          ),
      )
      .addNode(
        new NodeChecker('organization')
          .addProperty(new PropertyChecker('organization_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('address', false))
          .addProperty(new PropertyChecker('is_corporate_customer', false))
          .addProperty(new PropertyChecker('credit_rating', true))
          .addProperty(new PropertyChecker('credit_limit', true))
          .addProperty(new PropertyChecker('is_contractor', false))
          .addProperty(new PropertyChecker('playground_size', true))
          .addProperty(new PropertyChecker('capacity', true))
          .addProperty(
            new PropertyChecker('organization_type_enum', true, [
              'PRIMARYSCHOOL',
              'HOSPITAL',
            ]),
          ),
      )
      .addNode(
        new NodeChecker('employment')
          .addProperty(new PropertyChecker('employment_id', false))
          .addProperty(new PropertyChecker('organization_id', false))
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('salary', false)),
      )
      .addNode(
        new NodeChecker('supply_contract')
          .addProperty(new PropertyChecker('supply_contract_id', false))
          .addProperty(new PropertyChecker('organization_id', false))
          .addProperty(new PropertyChecker('organization_customer_id', true))
          .addProperty(new PropertyChecker('person_id', true))
          .addProperty(new PropertyChecker('contract_value', false)),
      )
      .addNode(
        new NodeChecker('enrollment')
          .addProperty(new PropertyChecker('enrollment_id', false))
          .addProperty(new PropertyChecker('organization_id', false))
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('grade', false)),
      )
      .addNode(
        new NodeChecker('nationality')
          .addProperty(new PropertyChecker('nationality_id', false))
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(
            new PropertyChecker('nationality_enum', false, [
              'BRAZILIANCITIZEN',
              'ITALIANCITIZEN',
            ]),
          ),
      )
      .addRelationship(
        new RelationshipChecker(
          'nationality',
          Cardinality.C0_N,
          'person',
          Cardinality.C1,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'enrollment',
          Cardinality.C0_N,
          'person',
          Cardinality.C1,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'employment',
          Cardinality.C0_N,
          'person',
          Cardinality.C1,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'supply_contract',
          Cardinality.C0_N,
          'person',
          Cardinality.C0_1,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'organization',
          Cardinality.C1,
          'employment',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'organization',
          Cardinality.C1,
          'supply_contract',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'organization',
          Cardinality.C0_1,
          'supply_contract',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'organization',
          Cardinality.C1,
          'enrollment',
          Cardinality.C0_N,
        ),
      )

      .addTracker(new TrackerChecker('NamedEntity', 'person'))
      .addTracker(new TrackerChecker('NamedEntity', 'organization'))
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('Organization', 'organization'))
      .addTracker(new TrackerChecker('BrazilianCitizen', 'person'))
      .addTracker(new TrackerChecker('ItalianCitizen', 'person'))
      .addTracker(new TrackerChecker('Child', 'person'))
      .addTracker(new TrackerChecker('Adult', 'person'))
      .addTracker(new TrackerChecker('Employee', 'person'))
      .addTracker(new TrackerChecker('Customer', 'person'))
      .addTracker(new TrackerChecker('Customer', 'organization'))
      .addTracker(new TrackerChecker('PersonalCustomer', 'person'))
      .addTracker(new TrackerChecker('CorporateCustomer', 'organization'))
      .addTracker(new TrackerChecker('Employment', 'employment'))
      .addTracker(new TrackerChecker('SupplyContract', 'supply_contract'))
      .addTracker(new TrackerChecker('Contractor', 'organization'))
      .addTracker(new TrackerChecker('PrimarySchool', 'organization'))
      .addTracker(new TrackerChecker('Hospital', 'organization'))
      .addTracker(new TrackerChecker('Enrollment', 'enrollment'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getSourceGraph().toString());
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('001 Simple Flattening', () => {
    let mapper = new Transformation2DB(test_001);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('birth_date', false)),
      )
      .addTracker(new TrackerChecker('NamedEntity', 'person'))
      .addTracker(new TrackerChecker('Person', 'person'));

    let result = gChecker.check();

    if (result != '') {
      console.log(
        '************ SOURCE GRAPH: \n' + mapper.getSourceGraph().toString(),
      );
      console.log(
        '************ TARGET GRAPH: \n' + mapper.getTargetGraph().toString(),
      );
      expect(result).toBe('');
    }
  });

  test('002 Flatting with Duplicate Attribures', () => {
    let mapper = new Transformation2DB(test_002);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('x1', true))
          .addProperty(new PropertyChecker('x2', true))
          .addProperty(new PropertyChecker('x3', true)),
      )
      .addTracker(new TrackerChecker('NamedEntity', 'person'))
      .addTracker(new TrackerChecker('Person', 'person'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('003 Flatting Generalization Set', () => {
    let mapper = new Transformation2DB(test_003);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('birth_date', true)),
      )
      .addNode(
        new NodeChecker('organization')
          .addProperty(new PropertyChecker('organization_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('address', true)),
      )
      .addTracker(new TrackerChecker('NamedEntity', 'person'))
      .addTracker(new TrackerChecker('NamedEntity', 'organization'))
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('Organization', 'organization'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('004 Flatting Multiples Generalizations', () => {
    let mapper = new Transformation2DB(test_004);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('birth_date', false)),
      )
      .addNode(
        new NodeChecker('organization')
          .addProperty(new PropertyChecker('organization_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('address', false)),
      )
      .addNode(
        new NodeChecker('test')
          .addProperty(new PropertyChecker('test_id', false))
          .addProperty(new PropertyChecker('name', false)),
      )
      .addTracker(new TrackerChecker('NamedEntity', 'person'))
      .addTracker(new TrackerChecker('NamedEntity', 'organization'))
      .addTracker(new TrackerChecker('NamedEntity', 'test'))
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('Organization', 'organization'))
      .addTracker(new TrackerChecker('Test', 'test'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('005 Flatting Orthogonal Generalization Sets', () => {
    let mapper = new Transformation2DB(test_005);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('birth_date', false)),
      )
      .addNode(
        new NodeChecker('organization')
          .addProperty(new PropertyChecker('organization_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('address', false)),
      )
      .addNode(
        new NodeChecker('person_x')
          .addProperty(new PropertyChecker('person_x_id', false))
          .addProperty(new PropertyChecker('name', false)),
      )
      .addNode(
        new NodeChecker('organization_x')
          .addProperty(new PropertyChecker('organization_x_id', false))
          .addProperty(new PropertyChecker('name', false)),
      )
      .addNode(
        new NodeChecker('test_x')
          .addProperty(new PropertyChecker('test_x_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('test', true)),
      )
      .addTracker(new TrackerChecker('NamedEntity', 'person'))
      .addTracker(new TrackerChecker('NamedEntity', 'organization'))
      .addTracker(new TrackerChecker('NamedEntity', 'person_x'))
      .addTracker(new TrackerChecker('NamedEntity', 'organization_x'))
      .addTracker(new TrackerChecker('NamedEntity', 'test_x'))
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('Organization', 'organization'))
      .addTracker(new TrackerChecker('PersonX', 'person_x'))
      .addTracker(new TrackerChecker('OrganizationX', 'organization_x'))
      .addTracker(new TrackerChecker('TestX', 'test_x'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('006 Flatting Cascading Generalization Sets', () => {
    let mapper = new Transformation2DB(test_006);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('name_b', true))
          .addProperty(new PropertyChecker('birth_date', false)),
      )
      .addNode(
        new NodeChecker('organization')
          .addProperty(new PropertyChecker('organization_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('name_a', true))
          .addProperty(new PropertyChecker('address', false)),
      )
      .addTracker(new TrackerChecker('NamedEntity', 'person'))
      .addTracker(new TrackerChecker('NamedEntity', 'organization'))
      .addTracker(new TrackerChecker('NamedEntityB', 'person'))
      .addTracker(new TrackerChecker('NamedEntityA', 'organization'))
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('Organization', 'organization'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('007 Flatting Category Without Specialization', () => {
    let mapper = new Transformation2DB(test_007);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('birth_date', false)),
      )
      .addNode(
        new NodeChecker('organization')
          .addProperty(new PropertyChecker('organization_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('address', false)),
      )
      .addNode(
        new NodeChecker('named_entity_a')
          .addProperty(new PropertyChecker('named_entity_a_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('name_a', true)),
      )
      .addTracker(new TrackerChecker('NamedEntity', 'person'))
      .addTracker(new TrackerChecker('NamedEntity', 'organization'))
      .addTracker(new TrackerChecker('NamedEntity', 'named_entity_a'))
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('Organization', 'organization'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('008 Flatting Root Association', () => {
    let mapper = new Transformation2DB(test_008);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('birth_date', false)),
      )
      .addNode(
        new NodeChecker('organization')
          .addProperty(new PropertyChecker('organization_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('address', false)),
      )
      .addNode(
        new NodeChecker('test')
          .addProperty(new PropertyChecker('test_id', false))
          .addProperty(new PropertyChecker('organization_id', true))
          .addProperty(new PropertyChecker('person_id', true)),
      )
      .addRelationship(
        new RelationshipChecker(
          'organization',
          Cardinality.C0_1,
          'test',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'person',
          Cardinality.C0_1,
          'test',
          Cardinality.C0_N,
        ),
      )
      .addTracker(new TrackerChecker('NamedEntity', 'person'))
      .addTracker(new TrackerChecker('NamedEntity', 'organization'))
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('Organization', 'organization'))
      .addTracker(new TrackerChecker('Test', 'test'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('009 Flatting Cascading Association', () => {
    let mapper = new Transformation2DB(test_009);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('birth_date', false)),
      )
      .addNode(
        new NodeChecker('organization')
          .addProperty(new PropertyChecker('organization_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('address', false)),
      )
      .addNode(
        new NodeChecker('person_b')
          .addProperty(new PropertyChecker('person_b_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('name_b', false))
          .addProperty(new PropertyChecker('birth_date_b', false)),
      )
      .addNode(
        new NodeChecker('organization_b')
          .addProperty(new PropertyChecker('organization_b_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('name_b', false))
          .addProperty(new PropertyChecker('address', false)),
      )
      .addNode(
        new NodeChecker('test')
          .addProperty(new PropertyChecker('test_id', false))
          .addProperty(new PropertyChecker('organization_id', true))
          .addProperty(new PropertyChecker('person_id', true))
          .addProperty(new PropertyChecker('organization_b_id', true))
          .addProperty(new PropertyChecker('person_b_id', true)),
      )
      .addRelationship(
        new RelationshipChecker(
          'organization',
          Cardinality.C0_1,
          'test',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'person',
          Cardinality.C0_1,
          'test',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'organization_b',
          Cardinality.C0_1,
          'test',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'person_b',
          Cardinality.C0_1,
          'test',
          Cardinality.C0_N,
        ),
      )
      .addTracker(new TrackerChecker('NamedEntity', 'person'))
      .addTracker(new TrackerChecker('NamedEntity', 'organization'))
      .addTracker(new TrackerChecker('NamedEntity', 'person_b'))
      .addTracker(new TrackerChecker('NamedEntity', 'organization_b'))
      .addTracker(new TrackerChecker('NamedEntityB', 'person_b'))
      .addTracker(new TrackerChecker('NamedEntityB', 'organization_b'))
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('Organization', 'organization'))
      .addTracker(new TrackerChecker('PersonB', 'person_b'))
      .addTracker(new TrackerChecker('OrganizationB', 'organization_b'))
      .addTracker(new TrackerChecker('Test', 'test'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('010 Flatting Cascading Association With Multiples Generalizations', () => {
    let mapper = new Transformation2DB(test_010);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('organization_a')
          .addProperty(new PropertyChecker('organization_a_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('address', false)),
      )
      .addNode(
        new NodeChecker('organization_b')
          .addProperty(new PropertyChecker('organization_b_id', false))
          .addProperty(new PropertyChecker('name', false)),
      )
      .addNode(
        new NodeChecker('organization_c')
          .addProperty(new PropertyChecker('organization_c_id', false))
          .addProperty(new PropertyChecker('name', false)),
      )
      .addNode(
        new NodeChecker('organization_d')
          .addProperty(new PropertyChecker('organization_d_id', false))
          .addProperty(new PropertyChecker('name', false)),
      )
      .addNode(
        new NodeChecker('test')
          .addProperty(new PropertyChecker('test_id', false))
          .addProperty(new PropertyChecker('test1', false))
          .addProperty(new PropertyChecker('organization_a_id', true))
          .addProperty(new PropertyChecker('organization_b_id', true))
          .addProperty(new PropertyChecker('organization_c_id', true))
          .addProperty(new PropertyChecker('organization_d_id', true)),
      )
      .addRelationship(
        new RelationshipChecker(
          'organization_a',
          Cardinality.C0_1,
          'test',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'organization_b',
          Cardinality.C0_1,
          'test',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'organization_c',
          Cardinality.C0_1,
          'test',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'organization_d',
          Cardinality.C0_1,
          'test',
          Cardinality.C0_N,
        ),
      )
      .addTracker(new TrackerChecker('NamedEntity', 'organization_a'))
      .addTracker(new TrackerChecker('NamedEntity', 'organization_b'))
      .addTracker(new TrackerChecker('NamedEntity', 'organization_c'))
      .addTracker(new TrackerChecker('NamedEntity', 'organization_d'))
      .addTracker(new TrackerChecker('OrganizationA', 'organization_a'))
      .addTracker(new TrackerChecker('OrganizationB', 'organization_b'))
      .addTracker(new TrackerChecker('OrganizationC', 'organization_c'))
      .addTracker(new TrackerChecker('OrganizationD', 'organization_d'))
      .addTracker(new TrackerChecker('Test', 'test'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('011 Flatting Cascading Association With Multiples Generalization Sets', () => {
    let mapper = new Transformation2DB(test_011);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('organization_a')
          .addProperty(new PropertyChecker('organization_a_id', false))
          .addProperty(new PropertyChecker('name', false)),
      )
      .addNode(
        new NodeChecker('organization_b')
          .addProperty(new PropertyChecker('organization_b_id', false))
          .addProperty(new PropertyChecker('name', false))
          .addProperty(new PropertyChecker('address', false)),
      )
      .addNode(
        new NodeChecker('organization_c')
          .addProperty(new PropertyChecker('organization_c_id', false))
          .addProperty(new PropertyChecker('name', false)),
      )
      .addNode(
        new NodeChecker('organization_d')
          .addProperty(new PropertyChecker('organization_d_id', false))
          .addProperty(new PropertyChecker('name', false)),
      )
      .addNode(
        new NodeChecker('test')
          .addProperty(new PropertyChecker('test_id', false))
          .addProperty(new PropertyChecker('test1', false))
          .addProperty(new PropertyChecker('organization_a_id', true))
          .addProperty(new PropertyChecker('organization_b_id', true))
          .addProperty(new PropertyChecker('organization_c_id', true))
          .addProperty(new PropertyChecker('organization_d_id', true)),
      )
      .addRelationship(
        new RelationshipChecker(
          'organization_a',
          Cardinality.C0_1,
          'test',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'organization_b',
          Cardinality.C0_1,
          'test',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'organization_c',
          Cardinality.C0_1,
          'test',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'organization_d',
          Cardinality.C0_1,
          'test',
          Cardinality.C0_N,
        ),
      )
      .addTracker(new TrackerChecker('NamedEntity', 'organization_a'))
      .addTracker(new TrackerChecker('NamedEntity', 'organization_b'))
      .addTracker(new TrackerChecker('NamedEntity', 'organization_c'))
      .addTracker(new TrackerChecker('NamedEntity', 'organization_d'))
      .addTracker(new TrackerChecker('OrganizationA', 'organization_a'))
      .addTracker(new TrackerChecker('OrganizationB', 'organization_b'))
      .addTracker(new TrackerChecker('OrganizationC', 'organization_c'))
      .addTracker(new TrackerChecker('OrganizationD', 'organization_d'))
      .addTracker(new TrackerChecker('Test', 'test'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('012 Simple Lifting', () => {
    let mapper = new Transformation2DB(test_012);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('birth_date', false))
          .addProperty(new PropertyChecker('test', true))
          .addProperty(new PropertyChecker('is_employee', false)),
      )
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('Employee', 'person'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('013 Lifting Cascade Generalization', () => {
    let mapper = new Transformation2DB(test_013);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('birth_date', false))
          .addProperty(new PropertyChecker('test_role_x', true))
          .addProperty(new PropertyChecker('test_employee', true))
          .addProperty(new PropertyChecker('is_role_x', false))
          .addProperty(new PropertyChecker('is_employee', false)),
      )
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('RoleX', 'person'))
      .addTracker(new TrackerChecker('Employee', 'person'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('014 Lifting Multiple Generalizations', () => {
    let mapper = new Transformation2DB(test_014);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('birth_date', false))
          .addProperty(new PropertyChecker('test1', true))
          .addProperty(new PropertyChecker('test2', true))
          .addProperty(new PropertyChecker('test3', true))
          .addProperty(new PropertyChecker('is_employee', false))
          .addProperty(new PropertyChecker('is_role_x', false))
          .addProperty(new PropertyChecker('is_role_y', false)),
      )
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('RoleX', 'person'))
      .addTracker(new TrackerChecker('RoleY', 'person'))
      .addTracker(new TrackerChecker('Employee', 'person'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('015 Lifting Multiple Generalizations with duplicate attributes', () => {
    let mapper = new Transformation2DB(test_015);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('birth_date', false))
          .addProperty(new PropertyChecker('test1', true))
          .addProperty(
            new PropertyChecker('person_phase_enum', false, ['CHILD', 'ADULT']),
          ),
      )
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('Child', 'person'))
      .addTracker(new TrackerChecker('Adult', 'person'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('016 Lifting Cascade Generalization With Association', () => {
    let mapper = new Transformation2DB(test_016);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('birth_date', false))
          .addProperty(new PropertyChecker('test', true))
          .addProperty(new PropertyChecker('is_adult', false))
          .addProperty(new PropertyChecker('is_employee', false)),
      )
      .addNode(
        new NodeChecker('employment')
          .addProperty(new PropertyChecker('employment_id', false))
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('salary', false)),
      )
      .addRelationship(
        new RelationshipChecker(
          'person',
          Cardinality.C1,
          'employment',
          Cardinality.C0_N,
        ),
      )
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('Adult', 'person'))
      .addTracker(new TrackerChecker('Employee', 'person'))
      .addTracker(new TrackerChecker('Employment', 'employment'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('017 Lifting Generalization Set With Association', () => {
    let mapper = new Transformation2DB(test_017);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('birth_date', false))
          .addProperty(new PropertyChecker('test', true))
          .addProperty(new PropertyChecker('is_employee', false))
          .addProperty(
            new PropertyChecker('life_phase_enum', false, ['CHILD', 'ADULT']),
          ),
      )
      .addNode(
        new NodeChecker('employment')
          .addProperty(new PropertyChecker('employment_id', false))
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('salary', false)),
      )
      .addRelationship(
        new RelationshipChecker(
          'person',
          Cardinality.C1,
          'employment',
          Cardinality.C0_N,
        ),
      )
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('Adult', 'person'))
      .addTracker(new TrackerChecker('Child', 'person'))
      .addTracker(new TrackerChecker('Employee', 'person'))
      .addTracker(new TrackerChecker('Employment', 'employment'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('018 Lifting Orthogonal Generalization Set', () => {
    let mapper = new Transformation2DB(test_018);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('birth_date', false))
          .addProperty(new PropertyChecker('rg', true))
          .addProperty(new PropertyChecker('ci', true))
          .addProperty(
            new PropertyChecker('life_phase_enum', false, [
              'CHILD',
              'TEENAGER',
              'ADULT',
            ]),
          ),
      )
      .addNode(
        new NodeChecker('nationality')
          .addProperty(new PropertyChecker('nationality_id', false))
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(
            new PropertyChecker('nationality_enum', false, [
              'BRAZILIANCITIZEN',
              'ITALIANCITIZEN',
            ]),
          ),
      )
      .addRelationship(
        new RelationshipChecker(
          'nationality',
          Cardinality.C0_N,
          'person',
          Cardinality.C1,
        ),
      )
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('Adult', 'person'))
      .addTracker(new TrackerChecker('Teenager', 'person'))
      .addTracker(new TrackerChecker('Child', 'person'))
      .addTracker(new TrackerChecker('BrazilianCitizen', 'person'))
      .addTracker(new TrackerChecker('ItalianCitizen', 'person'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('019 Lifting Generalization And Generalization Set', () => {
    let mapper = new Transformation2DB(test_019);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('birth_date', false))
          .addProperty(new PropertyChecker('rg', true))
          .addProperty(new PropertyChecker('ci', true))
          .addProperty(new PropertyChecker('is_brazilian_citizen', false))
          .addProperty(new PropertyChecker('is_italian_citizen', false))
          .addProperty(
            new PropertyChecker('life_phase_enum', false, [
              'CHILD',
              'TEENAGER',
              'ADULT',
            ]),
          ),
      )
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('Adult', 'person'))
      .addTracker(new TrackerChecker('Teenager', 'person'))
      .addTracker(new TrackerChecker('Child', 'person'))
      .addTracker(new TrackerChecker('BrazilianCitizen', 'person'))
      .addTracker(new TrackerChecker('ItalianCitizen', 'person'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('020 Lifting Hierarchy Generalization Set', () => {
    let mapper = new Transformation2DB(test_020);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('birth_date', false))
          .addProperty(new PropertyChecker('is_employee', false))
          .addProperty(
            new PropertyChecker('life_phase_enum', false, [
              'CHILD',
              'TEENAGER',
              'ADULT',
            ]),
          )
          .addProperty(
            new PropertyChecker('teenager_phase_enum', true, [
              'TEENAGERA',
              'TEENAGERB',
            ]),
          )
          .addProperty(
            new PropertyChecker('adult_phase_enum', true, ['ADULTA', 'ADULTB']),
          )
          .addProperty(new PropertyChecker('test_teenager_b', true))
          .addProperty(new PropertyChecker('test_adult_a', true))
          .addProperty(new PropertyChecker('test_adult_b', true)),
      )
      .addNode(
        new NodeChecker('employment')
          .addProperty(new PropertyChecker('employment_id', false))
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('salary', false)),
      )
      .addRelationship(
        new RelationshipChecker(
          'person',
          Cardinality.C1,
          'employment',
          Cardinality.C0_N,
        ),
      )
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('Adult', 'person'))
      .addTracker(new TrackerChecker('Teenager', 'person'))
      .addTracker(new TrackerChecker('Child', 'person'))
      .addTracker(new TrackerChecker('TeenagerA', 'person'))
      .addTracker(new TrackerChecker('TeenagerB', 'person'))
      .addTracker(new TrackerChecker('AdultA', 'person'))
      .addTracker(new TrackerChecker('AdultB', 'person'))
      .addTracker(new TrackerChecker('Employee', 'person'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('021 Lifting Generalization And Generalization Set With Association', () => {
    let mapper = new Transformation2DB(test_021);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('birth_date', false))
          .addProperty(
            new PropertyChecker('life_phase_enum', false, [
              'CHILD',
              'TEENAGER',
              'ADULT',
            ]),
          )
          .addProperty(new PropertyChecker('is_test1', false))
          .addProperty(new PropertyChecker('is_test2', false))
          .addProperty(new PropertyChecker('test2', true)),
      )
      .addNode(
        new NodeChecker('employment_a')
          .addProperty(new PropertyChecker('employment_a_id', false))
          .addProperty(new PropertyChecker('person_id', false)),
      )
      .addNode(
        new NodeChecker('employment_b')
          .addProperty(new PropertyChecker('employment_b_id', false))
          .addProperty(new PropertyChecker('person_id', false)),
      )
      .addRelationship(
        new RelationshipChecker(
          'person',
          Cardinality.C1,
          'employment_a',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'person',
          Cardinality.C1,
          'employment_b',
          Cardinality.C0_N,
        ),
      )
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('Adult', 'person'))
      .addTracker(new TrackerChecker('Teenager', 'person'))
      .addTracker(new TrackerChecker('Child', 'person'))
      .addTracker(new TrackerChecker('Test1', 'person'))
      .addTracker(new TrackerChecker('Test2', 'person'))
      .addTracker(new TrackerChecker('EmploymentA', 'employment_a'))
      .addTracker(new TrackerChecker('EmploymentB', 'employment_b'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('022 Lifting GS Disjoint Complete', () => {
    let mapper = new Transformation2DB(test_022);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('super_class')
          .addProperty(new PropertyChecker('super_class_id', false))
          .addProperty(
            new PropertyChecker('super_class_type_enum', false, [
              'SUBCLASS1',
              'SUBCLASS2',
            ]),
          ),
      )
      .addNode(
        new NodeChecker('associated_class')
          .addProperty(new PropertyChecker('associated_class_id', false))
          .addProperty(new PropertyChecker('super_class_id', false)),
      )
      .addRelationship(
        new RelationshipChecker(
          'super_class',
          Cardinality.C1,
          'associated_class',
          Cardinality.C0_N,
        ),
      )
      .addTracker(new TrackerChecker('SuperClass', 'super_class'))
      .addTracker(new TrackerChecker('SubClass1', 'super_class'))
      .addTracker(new TrackerChecker('SubClass2', 'super_class'))
      .addTracker(new TrackerChecker('AssociatedClass', 'associated_class'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('023 Lifting GS Disjoint Incomplete', () => {
    let mapper = new Transformation2DB(test_023);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('super_class')
          .addProperty(new PropertyChecker('super_class_id', false))
          .addProperty(
            new PropertyChecker('super_class_type_enum', true, [
              'SUBCLASS1',
              'SUBCLASS2',
            ]),
          ),
      )
      .addNode(
        new NodeChecker('associated_class')
          .addProperty(new PropertyChecker('associated_class_id', false))
          .addProperty(new PropertyChecker('super_class_id', false)),
      )
      .addRelationship(
        new RelationshipChecker(
          'super_class',
          Cardinality.C1,
          'associated_class',
          Cardinality.C0_N,
        ),
      )
      .addTracker(new TrackerChecker('SuperClass', 'super_class'))
      .addTracker(new TrackerChecker('SubClass1', 'super_class'))
      .addTracker(new TrackerChecker('SubClass2', 'super_class'))
      .addTracker(new TrackerChecker('AssociatedClass', 'associated_class'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('024 Lifting GS Overlapping Complete', () => {
    let mapper = new Transformation2DB(test_024);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('super_class').addProperty(
          new PropertyChecker('super_class_id', false),
        ),
      )
      .addNode(
        new NodeChecker('super_class_type')
          .addProperty(new PropertyChecker('super_class_type_id', false))
          .addProperty(new PropertyChecker('super_class_id', false))
          .addProperty(
            new PropertyChecker('super_class_type_enum', false, [
              'SUBCLASS1',
              'SUBCLASS2',
            ]),
          ),
      )
      .addNode(
        new NodeChecker('associated_class')
          .addProperty(new PropertyChecker('associated_class_id', false))
          .addProperty(new PropertyChecker('super_class_id', false)),
      )
      .addRelationship(
        new RelationshipChecker(
          'super_class',
          Cardinality.C1,
          'associated_class',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'super_class_type',
          Cardinality.C1_N,
          'super_class',
          Cardinality.C1,
        ),
      )
      .addTracker(new TrackerChecker('SuperClass', 'super_class'))
      .addTracker(new TrackerChecker('SubClass1', 'super_class'))
      .addTracker(new TrackerChecker('SubClass2', 'super_class'))
      .addTracker(new TrackerChecker('AssociatedClass', 'associated_class'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('025 Lifting GS Overlapping Incomplete', () => {
    let mapper = new Transformation2DB(test_025);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('super_class').addProperty(
          new PropertyChecker('super_class_id', false),
        ),
      )
      .addNode(
        new NodeChecker('super_class_type')
          .addProperty(new PropertyChecker('super_class_type_id', false))
          .addProperty(new PropertyChecker('super_class_id', false))
          .addProperty(
            new PropertyChecker('super_class_type_enum', false, [
              'SUBCLASS1',
              'SUBCLASS2',
            ]),
          ),
      )
      .addNode(
        new NodeChecker('associated_class')
          .addProperty(new PropertyChecker('associated_class_id', false))
          .addProperty(new PropertyChecker('super_class_id', false)),
      )
      .addRelationship(
        new RelationshipChecker(
          'super_class',
          Cardinality.C1,
          'associated_class',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'super_class_type',
          Cardinality.C0_N,
          'super_class',
          Cardinality.C1,
        ),
      )
      .addTracker(new TrackerChecker('SuperClass', 'super_class'))
      .addTracker(new TrackerChecker('SubClass1', 'super_class'))
      .addTracker(new TrackerChecker('SubClass2', 'super_class'))
      .addTracker(new TrackerChecker('AssociatedClass', 'associated_class'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('026 Flatting To Class Association', () => {
    let mapper = new Transformation2DB(test_026);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person').addProperty(
          new PropertyChecker('person_id', false),
        ),
      )
      .addNode(
        new NodeChecker('associated_class1').addProperty(
          new PropertyChecker('associated_class1_id', false),
        ),
      )
      .addNode(
        new NodeChecker('associated_class2').addProperty(
          new PropertyChecker('associated_class2_id', false),
        ),
      )
      .addNode(
        new NodeChecker('associated_class3').addProperty(
          new PropertyChecker('associated_class3_id', false),
        ),
      )
      .addNode(
        new NodeChecker('associated_class4').addProperty(
          new PropertyChecker('associated_class4_id', false),
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'person',
          Cardinality.C0_N,
          'associated_class1',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'person',
          Cardinality.C0_N,
          'associated_class2',
          Cardinality.C1_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'person',
          Cardinality.C0_1,
          'associated_class3',
          Cardinality.C0_1,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'person',
          Cardinality.C0_1,
          'associated_class4',
          Cardinality.C1,
        ),
      )
      .addTracker(new TrackerChecker('NamedEntity', 'person'))
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('AssociatedClass1', 'associated_class1'))
      .addTracker(new TrackerChecker('AssociatedClass2', 'associated_class2'))
      .addTracker(new TrackerChecker('AssociatedClass3', 'associated_class3'))
      .addTracker(new TrackerChecker('AssociatedClass4', 'associated_class4'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('027 Lifting With multiple relations to remake', () => {
    let mapper = new Transformation2DB(test_027);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(
            new PropertyChecker('life_phase_enum', false, ['CHILD', 'ADULT']),
          )
          .addProperty(new PropertyChecker('is_employee', false))
          .addProperty(new PropertyChecker('is_personal_customer', false)),
      )
      .addNode(
        new NodeChecker('employment')
          .addProperty(new PropertyChecker('employment_id', false))
          .addProperty(new PropertyChecker('person_id', false)),
      )
      .addNode(
        new NodeChecker('test')
          .addProperty(new PropertyChecker('test_id', false))
          .addProperty(new PropertyChecker('person_id', false)),
      )
      .addRelationship(
        new RelationshipChecker(
          'person',
          Cardinality.C1,
          'employment',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'person',
          Cardinality.C1,
          'test',
          Cardinality.C0_N,
        ),
      )
      .addTracker(new TrackerChecker('Person', 'person'))
      .addTracker(new TrackerChecker('Child', 'person'))
      .addTracker(new TrackerChecker('Adult', 'person'))
      .addTracker(new TrackerChecker('Employee', 'person'))
      .addTracker(new TrackerChecker('PersonalCustomer', 'person'))
      .addTracker(new TrackerChecker('Employment', 'employment'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });

  test('028 Test multivalued property', () => {
    let mapper = new Transformation2DB(test_028);
    mapper.setStandardizeDatabaseNomenclature(true);
    mapper.doMapping();

    let gChecker = new GraphChecker()
      .setTransformation(mapper)
      .addNode(
        new NodeChecker('person')
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('name', false)),
      )
      .addNode(
        new NodeChecker('tel')
          .addProperty(new PropertyChecker('tel_id', false))
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('tel', false)),
      )
      .addNode(
        new NodeChecker('address')
          .addProperty(new PropertyChecker('address_id', false))
          .addProperty(new PropertyChecker('person_id', false))
          .addProperty(new PropertyChecker('address', false)),
      )
      .addRelationship(
        new RelationshipChecker(
          'person',
          Cardinality.C1,
          'tel',
          Cardinality.C0_N,
        ),
      )
      .addRelationship(
        new RelationshipChecker(
          'person',
          Cardinality.C1,
          'address',
          Cardinality.C0_N,
        ),
      )

      .addTracker(new TrackerChecker('Person', 'person'));

    let result = gChecker.check();

    if (result != '') {
      console.log(mapper.getTargetGraph().toString());
      expect(result).toBe('');
    }
  });
});
