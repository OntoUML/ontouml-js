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
  ',        birth_date              DATE           NOT NULL' +
  '); ';

const scriptOrganization =
  'CREATE TABLE organization ( ' +
  '         organization_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        address                 VARCHAR(20)    NOT NULL' +
  '); ';

const scriptNamedEntityA =
  'CREATE TABLE named_entity_a ( ' +
  '         named_entity_a_id       INTEGER        NOT NULL PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        name_a                  VARCHAR(20)    NULL' +
  '); ';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************

const gChecker_007_flatting_category_without_specialization = new GraphChecker()
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
    new NodeChecker('named_entity_a')
      .addProperty(new PropertyChecker('named_entity_a_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('name_a', true))
  )
  .addTracker(new TrackerChecker('NamedEntity', 'person'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization'))
  .addTracker(new TrackerChecker('NamedEntity', 'named_entity_a'))
  .addTracker(new TrackerChecker('NamedEntityA', 'named_entity_a'))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Organization', 'organization'))
  .setNumberOfTablesToFindInScript(3)
  .setNumberOfFkToFindInScript(0)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptOrganization, 'The ORFANIZATION table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptNamedEntityA, 'The NAMED_ENTITY_A table is different than expected.'));

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
const person = model.createKind('Person');
const organization = model.createKind('Organization');
const namedEntityA = model.createCategory('NamedEntityA');
// CREATE PROPERTIES
namedEntity.createAttribute(_string, 'name').cardinality.setOneToOne();
namedEntityA.createAttribute(_string, 'nameA').cardinality.setZeroToOne();
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
organization.createAttribute(_string, 'address').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
const genNamedEntityPerson = model.createGeneralization(namedEntity, person);
const genNamedEntityOrganization = model.createGeneralization(namedEntity, organization);
model.createGeneralization(namedEntity, namedEntityA);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genNamedEntityPerson, genNamedEntityOrganization], disjoint, complete, null, 'NamedEntityType');

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
export const test_007: TestResource = {
  title:
    '007 - Flattening involving one generalization set, where the superclass has one generalization relationship with another non-sortal class',
  checker: gChecker_007_flatting_category_without_specialization,
  project,
  options
};
