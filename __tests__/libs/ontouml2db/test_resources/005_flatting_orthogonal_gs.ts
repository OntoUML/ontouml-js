/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { Project } from '@libs/ontouml';
import { GraphChecker } from './graph_tester/GraphChecker';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { ScriptChecker } from './graph_tester/ScriptChecker';
import { TrackerChecker } from './graph_tester/TrackerChecker';
import { TestResource } from './TestResource';
import { OntoUML2DBOptions, StrategyType } from '@libs/ontouml2db';
import { DBMSSupported } from '@libs/ontouml2db/constants/DBMSSupported';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  'CREATE TABLE IF NOT EXISTS person ( ' +
  '         person_id               INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        birth_date              DATE           NOT NULL' +
  '); ';

const scriptOrganization =
  'CREATE TABLE IF NOT EXISTS organization ( ' +
  '         organization_id         INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        address                 VARCHAR(20)    NOT NULL' +
  '); ';

const scriptPersonX =
  'CREATE TABLE IF NOT EXISTS person_x ( ' +
  '         person_x_id             INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  '); ';

const scriptOrganizationX =
  'CREATE TABLE IF NOT EXISTS organization_x ( ' +
  '         organization_x_id       INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  '); ';

const scriptTestX =
  'CREATE TABLE IF NOT EXISTS test_x ( ' +
  '         test_x_id               INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        test                    BOOLEAN        NULL' +
  '); ';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const gChecker_005_flatting_orthogonal_gs = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('birth_date', false))
  )
  .addNode(
    new NodeChecker('organization')
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('address', false))
  )
  .addNode(
    new NodeChecker('person_x')
      .addProperty(new PropertyChecker('person_x_id', false))
      .addProperty(new PropertyChecker('name', false))
  )
  .addNode(
    new NodeChecker('organization_x')
      .addProperty(new PropertyChecker('organization_x_id', false))
      .addProperty(new PropertyChecker('name', false))
  )
  .addNode(
    new NodeChecker('test_x')
      .addProperty(new PropertyChecker('test_x_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('test', true))
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
  .addTracker(new TrackerChecker('TestX', 'test_x'))
  .setNumberOfTablesToFindInScript(5)
  .setNumberOfFkToFindInScript(0)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptOrganization, 'The ORFANIZATION table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptPersonX, 'The PERSON_X table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptOrganizationX, 'The ORFANIZATION_X table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptTestX, 'The TEST_X table is different than expected.'));

// ****************************************
//       M O D E L
// ****************************************
const disjoint = true;
const overlappig = false;
const complete = true;
const incomplete = false;

const project = new Project();
const model = project.createModel();
// CREATE TYPES
const _string = model.createDatatype('string');
const _date = model.createDatatype('Date');
const _boolean = model.createDatatype('boolean');
// CREATE CLASSES
const namedEntity = model.createCategory('NamedEntity');
const person = model.createKind('Person');
const organization = model.createKind('Organization');
const personX = model.createKind('PersonX');
const organizationX = model.createKind('OrganizationX');
const testX = model.createKind('TestX');
// CREATE PROPERTIES
namedEntity.createAttribute(_string, 'name').cardinality.setOneToOne();
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
organization.createAttribute(_string, 'address').cardinality.setOneToOne();
testX.createAttribute(_boolean, 'test').cardinality.setZeroToOne();
// CREATE GENERALIZATIONS
const genNamedEntityPerson = model.createGeneralization(namedEntity, person);
const genNamedEntityOrganization = model.createGeneralization(namedEntity, organization);
const genNamedEntityPersonX = model.createGeneralization(namedEntity, personX);
const genNamedEntityOrganizationX = model.createGeneralization(namedEntity, organizationX);
const genNamedEntityTestX = model.createGeneralization(namedEntity, testX);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genNamedEntityPerson, genNamedEntityOrganization], disjoint, complete, null, 'NamedEntityType');
model.createGeneralizationSet(
  [genNamedEntityPersonX, genNamedEntityOrganizationX, genNamedEntityTestX],
  overlappig,
  incomplete,
  null,
  'GSType'
);

// ****************************************
// ** O P T I O N S
// ****************************************
const options: Partial<OntoUML2DBOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DBMSSupported.H2,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa',
  enumFieldToLookupTable: false
};

// ****************************************
export const test_005: TestResource = {
  title: '005 - Flattening involving two orthogonal generalizations sets to each other',
  checker: gChecker_005_flatting_orthogonal_gs,
  project,
  options
};
