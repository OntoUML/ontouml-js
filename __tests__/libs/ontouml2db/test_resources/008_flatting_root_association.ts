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

const scriptTest =
  'CREATE TABLE IF NOT EXISTS test ( ' +
  '         test_id                 INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        organization_id         INTEGER        NULL' +
  ',        person_id               INTEGER        NULL' +
  '); ';

const scriptFKTestOrganization =
  'ALTER TABLE test ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id );';

const scriptFKTestPerson = 'ALTER TABLE test ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************

const gChecker_008_flatting_root_association = new GraphChecker()
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
    new NodeChecker('test')
      .addProperty(new PropertyChecker('test_id', false))
      .addProperty(new PropertyChecker('organization_id', true))
      .addProperty(new PropertyChecker('person_id', true))
  )
  .addRelationship(new RelationshipChecker('organization', Cardinality.C0_1, 'test', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('person', Cardinality.C0_1, 'test', Cardinality.C0_N))
  .addTracker(new TrackerChecker('NamedEntity', 'person'))
  .addTracker(new TrackerChecker('NamedEntity', 'organization'))
  .addTracker(new TrackerChecker('Person', 'person'))
  .addTracker(new TrackerChecker('Organization', 'organization'))
  .addTracker(new TrackerChecker('Test', 'test'))
  .setNumberOfTablesToFindInScript(3)
  .setNumberOfFkToFindInScript(2)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptOrganization, 'The ORGANIZATION table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptTest, 'The TEST table is different than expected.'))
  .addScriptChecker(
    new ScriptChecker(scriptFKTestOrganization, 'The FK between Test and Organization not exists or is different than expected.')
  )
  .addScriptChecker(
    new ScriptChecker(scriptFKTestPerson, 'The FK between Test and Person not exists or is different than expected.')
  );

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
const test = model.createKind('Test');
// CREATE PROPERTIES
namedEntity.createAttribute(_string, 'name').cardinality.setOneToOne();
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
organization.createAttribute(_string, 'address').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
const genNamedEntityPerson = model.createGeneralization(namedEntity, person);
const genNamedEntityOrganization = model.createGeneralization(namedEntity, organization);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genNamedEntityPerson, genNamedEntityOrganization], disjoint, complete, null, 'NamedEntityType');
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
export const test_008: TestResource = {
  title: '008 - Flattening involving a generalization set, where the superclass has an association with a sortal',
  checker: gChecker_008_flatting_root_association,
  project,
  options
};
