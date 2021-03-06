/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { RelationshipChecker } from './graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { TestResource } from './TestResource';
import { ScriptChecker } from './graph_tester/ScriptChecker';
import { Project } from '@libs/ontouml';
import { Ontouml2DbOptions, StrategyType } from '@libs/ontouml2db';
import { DbmsSupported } from '@libs/ontouml2db/constants/DbmsSupported';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptOrganizationA =
  'CREATE TABLE IF NOT EXISTS organization_a ( ' +
  '         organization_a_id       INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  '); ';

const scriptOrganizationB =
  'CREATE TABLE IF NOT EXISTS organization_b ( ' +
  '         organization_b_id       INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        address                 VARCHAR(20)    NOT NULL' +
  '); ';

const scriptOrganizationC =
  'CREATE TABLE IF NOT EXISTS organization_c ( ' +
  '         organization_c_id       INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  '); ';

const scriptOrganizationD =
  'CREATE TABLE IF NOT EXISTS organization_d ( ' +
  '         organization_d_id       INTEGER         NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  '); ';

const scriptTest =
  'CREATE TABLE IF NOT EXISTS test ( ' +
  '         test_id                 INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        organization_d_id       INTEGER        NULL' +
  ',        organization_c_id       INTEGER        NULL' +
  ',        organization_b_id       INTEGER        NULL' +
  ',        organization_a_id       INTEGER        NULL' +
  ',        test1                   INTEGER        NOT NULL' +
  '); ';

const scriptFKTestOrganizationA =
  'ALTER TABLE test ADD FOREIGN KEY ( organization_a_id ) REFERENCES organization_a ( organization_a_id );';
const scriptFKTestOrganizationB =
  'ALTER TABLE test ADD FOREIGN KEY ( organization_b_id ) REFERENCES organization_b ( organization_b_id );';
const scriptFKTestOrganizationC =
  'ALTER TABLE test ADD FOREIGN KEY ( organization_c_id ) REFERENCES organization_c ( organization_c_id );';
const scriptFKTestOrganizationD =
  'ALTER TABLE test ADD FOREIGN KEY ( organization_d_id ) REFERENCES organization_d ( organization_d_id );';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************

const gChecker_011_flatting_cascading_association_multiples_gs = new GraphChecker()
  .addNode(
    new NodeChecker('organization_a')
      .addProperty(new PropertyChecker('organization_a_id', false))
      .addProperty(new PropertyChecker('name', false))
  )
  .addNode(
    new NodeChecker('organization_b')
      .addProperty(new PropertyChecker('organization_b_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('address', false))
  )
  .addNode(
    new NodeChecker('organization_c')
      .addProperty(new PropertyChecker('organization_c_id', false))
      .addProperty(new PropertyChecker('name', false))
  )
  .addNode(
    new NodeChecker('organization_d')
      .addProperty(new PropertyChecker('organization_d_id', false))
      .addProperty(new PropertyChecker('name', false))
  )
  .addNode(
    new NodeChecker('test')
      .addProperty(new PropertyChecker('test_id', false))
      .addProperty(new PropertyChecker('test1', false))
      .addProperty(new PropertyChecker('organization_a_id', true))
      .addProperty(new PropertyChecker('organization_b_id', true))
      .addProperty(new PropertyChecker('organization_c_id', true))
      .addProperty(new PropertyChecker('organization_d_id', true))
  )
  .addRelationship(new RelationshipChecker('organization_a', Cardinality.C0_1, 'test', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('organization_b', Cardinality.C0_1, 'test', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('organization_c', Cardinality.C0_1, 'test', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('organization_d', Cardinality.C0_1, 'test', Cardinality.C0_N))
  .addTracker(new TrackerChecker('NamedEntity', 'organization_a'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization_b'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization_c'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization_d'))
  .addTracker(new TrackerChecker('OrganizationA', 'organization_a'))
  .addTracker(new TrackerChecker('OrganizationB', 'organization_b'))
  .addTracker(new TrackerChecker('OrganizationC', 'organization_c'))
  .addTracker(new TrackerChecker('OrganizationD', 'organization_d'))
  .addTracker(new TrackerChecker('Test', 'test'))
  .setNumberOfTablesToFindInScript(5)
  .setNumberOfFkToFindInScript(4)
  .addScriptChecker(new ScriptChecker(scriptOrganizationA, 'The ORGANIZATION_A table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptOrganizationB, 'The ORGANIZATION_B table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptOrganizationC, 'The ORGANIZATION_C table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptOrganizationD, 'The ORGANIZATION_D table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptTest, 'The TEST table is different than expected.'))
  .addScriptChecker(
    new ScriptChecker(
      scriptFKTestOrganizationA,
      'The FK between Test and Organiation_A not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKTestOrganizationB,
      'The FK between Test and Organiation_B not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKTestOrganizationC,
      'The FK between Test and Organiation_C not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKTestOrganizationD,
      'The FK between Test and Organiation_D not exists or is different than expected.'
    )
  );

// ****************************************
//       M O D E L
// ****************************************
const overlapping = false;
const incomplete = false;

const project = new Project();
const model = project.createModel();
// CREATE TYPES
const _string = model.createDatatype('string');
const _int = model.createDatatype('int');
// CREATE CLASSES
const namedEntity = model.createCategory('NamedEntity');
const organizationA = model.createKind('OrganizationA');
const organizationB = model.createKind('OrganizationB');
const organizationC = model.createKind('OrganizationC');
const organizationD = model.createKind('OrganizationD');
const test = model.createKind('Test');
// CREATE PROPERTIES
namedEntity.createAttribute(_string, 'name').cardinality.setOneToOne();
organizationB.createAttribute(_string, 'address').cardinality.setOneToOne();
test.createAttribute(_int, 'test1').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
const genNamedEntityOrganizationA = model.createGeneralization(namedEntity, organizationA);
const genNamedEntityOrganizationB = model.createGeneralization(namedEntity, organizationB);
const genNamedEntityOrganizationC = model.createGeneralization(namedEntity, organizationC);
const genNamedEntityOrganizationD = model.createGeneralization(namedEntity, organizationD);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genNamedEntityOrganizationA, genNamedEntityOrganizationB], overlapping, incomplete, null, 'Set1');
model.createGeneralizationSet([genNamedEntityOrganizationC, genNamedEntityOrganizationD], overlapping, incomplete, null, 'Set');
// CREATE ASSOCIATIONS
const relation = model.createMediationRelation(namedEntity, test, 'has');
relation.getSourceEnd().cardinality.setOneToOne();
relation.getTargetEnd().cardinality.setZeroToMany();

// ****************************************
// ** O P T I O N S
// ****************************************
const options: Partial<Ontouml2DbOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DbmsSupported.H2,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa',
  enumFieldToLookupTable: false
};

// ****************************************
export const test_011: TestResource = {
  title: '011 - Flatting with one association and multiples generalization sets',
  checker: gChecker_011_flatting_cascading_association_multiples_gs,
  project,
  options
};
