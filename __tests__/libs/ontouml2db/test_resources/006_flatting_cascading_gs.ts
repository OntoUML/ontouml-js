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
  'CREATE TABLE person ( ' +
  '         person_id               INTEGER        NOT NULL PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        name_b                  VARCHAR(20)    NULL' +
  ',        birth_date              DATE           NOT NULL' +
  '); ';

const scriptOrganization =
  'CREATE TABLE organization ( ' +
  '         organization_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        name_a                  VARCHAR(20)    NULL' +
  ',        address                 VARCHAR(20)    NOT NULL' +
  '); ';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************

const gChecker_006_flatting_cascading_gs = new GraphChecker()
  .addNode(
    new NodeChecker('person')
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('name_b', true))
      .addProperty(new PropertyChecker('birth_date', false))
  )
  .addNode(
    new NodeChecker('organization')
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('name_a', true))
      .addProperty(new PropertyChecker('address', false))
  )
  .addTracker(new TrackerChecker('NamedEntity', 'person'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization'))
  .addTracker(new TrackerChecker('NamedEntityB', 'person'))
  .addTracker(new TrackerChecker('NamedEntityA', 'organization'))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Organization', 'organization'))
  .setNumberOfTablesToFindInScript(2)
  .setNumberOfFkToFindInScript(0)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptOrganization, 'The ORFANIZATION table is different than expected.'));

// ****************************************
//       M O D E L
// ****************************************
const disjoint = true;
const complete = true;

const project = new Project();
const model = project.createModel();
// CREATE TYPES
const _string = model.createDatatype('string');
const _date = model.createDatatype('Date');
// CREATE CLASSES
const namedEntity = model.createCategory('NamedEntity');
const namedEntityA = model.createCategory('NamedEntityA');
const namedEntityB = model.createCategory('NamedEntityB');
const person = model.createKind('Person');
const organization = model.createKind('Organization');
// CREATE PROPERTIES
namedEntity.createAttribute(_string, 'name').cardinality.setOneToOne();
namedEntityA.createAttribute(_string, 'nameA').cardinality.setZeroToOne();
namedEntityB.createAttribute(_string, 'nameB').cardinality.setZeroToOne();
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
organization.createAttribute(_string, 'address').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
const genNamedEntityEntityA = model.createGeneralization(namedEntity, namedEntityA);
const genNamedEntityEntityB = model.createGeneralization(namedEntity, namedEntityB);
model.createGeneralization(namedEntityB, person);
model.createGeneralization(namedEntityA, organization);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genNamedEntityEntityA, genNamedEntityEntityB], disjoint, complete, null, 'NamedEntityType');

// ****************************************
// ** O P T I O N S
// ****************************************
const options: Partial<OntoUML2DBOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DBMSSupported.GENERIC_SCHEMA,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa'
};

// ****************************************
export const test_006: TestResource = {
  title: '006 - Flattening involving a generalization set, where the subclasses are superclasses of other classes',
  checker: gChecker_006_flatting_cascading_gs,
  project,
  options
};
