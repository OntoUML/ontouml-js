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

const scriptTest =
  'CREATE TABLE IF NOT EXISTS test ( ' +
  '         test_id                 INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        organization_b_id       INTEGER        NULL' +
  ',        person_b_id             INTEGER        NULL' +
  ',        organization_id         INTEGER        NULL' +
  ',        person_id               INTEGER        NULL' +
  '); ';

const scriptPersonB =
  'CREATE TABLE IF NOT EXISTS person_b ( ' +
  '         person_b_id             INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        name_b                  VARCHAR(20)    NOT NULL' +
  ',        birth_date_b            DATE           NOT NULL' +
  '); ';

const scriptOrganizationB =
  'CREATE TABLE IF NOT EXISTS organization_b ( ' +
  '         organization_b_id       INTEGER        NOT NULL IDENTITY PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        name_b                  VARCHAR(20)    NOT NULL' +
  ',        address                 VARCHAR(20)    NOT NULL' +
  '); ';

const scriptFKTestPerson = 'ALTER TABLE test ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';
const scriptFKTestOrganization =
  'ALTER TABLE test ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id );';
const scriptFKTestPersonB = 'ALTER TABLE test ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';
const scriptFKTestOrganizationB =
  'ALTER TABLE test ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id );';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************

const gChecker_009_flatting_with_association = new GraphChecker()
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
    new NodeChecker('person_b')
      .addProperty(new PropertyChecker('person_b_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('name_b', false))
      .addProperty(new PropertyChecker('birth_date_b', false))
  )
  .addNode(
    new NodeChecker('organization_b')
      .addProperty(new PropertyChecker('organization_b_id', false))
      .addProperty(new PropertyChecker('name', false))
      .addProperty(new PropertyChecker('name_b', false))
      .addProperty(new PropertyChecker('address', false))
  )
  .addNode(
    new NodeChecker('test')
      .addProperty(new PropertyChecker('test_id', false))
      .addProperty(new PropertyChecker('organization_id', true))
      .addProperty(new PropertyChecker('person_id', true))
      .addProperty(new PropertyChecker('organization_b_id', true))
      .addProperty(new PropertyChecker('person_b_id', true))
  )
  .addRelationship(new RelationshipChecker('organization', Cardinality.C0_1, 'test', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('person', Cardinality.C0_1, 'test', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('organization_b', Cardinality.C0_1, 'test', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('person_b', Cardinality.C0_1, 'test', Cardinality.C0_N))
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
  .addTracker(new TrackerChecker('Test', 'test'))
  .setNumberOfTablesToFindInScript(5)
  .setNumberOfFkToFindInScript(4)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptOrganization, 'The ORGANIZATION table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptTest, 'The TEST table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptPersonB, 'The PERSON_B table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptOrganizationB, 'The ORGANIZATION_B table is different than expected.'))
  .addScriptChecker(
    new ScriptChecker(scriptFKTestPerson, 'The FK between Test and Person not exists or is different than expected.')
  )
  .addScriptChecker(
    new ScriptChecker(scriptFKTestOrganization, 'The FK between Test and Organization not exists or is different than expected.')
  )
  .addScriptChecker(
    new ScriptChecker(scriptFKTestPersonB, 'The FK between Test and PersonB not exists or is different than expected.')
  )
  .addScriptChecker(
    new ScriptChecker(scriptFKTestOrganizationB, 'The FK between Test and OrganiationB not exists or is different than expected.')
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
const namedEntityB = model.createCategory('NamedEntityB');
const personB = model.createKind('PersonB');
const organizationB = model.createKind('OrganizationB');
// CREATE PROPERTIES
namedEntity.createAttribute(_string, 'name').cardinality.setOneToOne();
person.createAttribute(_date, 'birthDate').cardinality.setOneToOne();
organization.createAttribute(_string, 'address').cardinality.setOneToOne();
namedEntityB.createAttribute(_string, 'nameB').cardinality.setOneToOne();
personB.createAttribute(_date, 'birthDateB').cardinality.setOneToOne();
organizationB.createAttribute(_string, 'address').cardinality.setOneToOne();
// CREATE GENERALIZATIONS
const genNamedEntityPerson = model.createGeneralization(namedEntity, person);
const genNamedEntityOrganization = model.createGeneralization(namedEntity, organization);
model.createGeneralization(namedEntity, namedEntityB);
const genNamedEntityBPersonB = model.createGeneralization(namedEntityB, personB);
const genNamedEntityBOrganizationB = model.createGeneralization(namedEntityB, organizationB);
// CRETATE GENERALIZATION SET
model.createGeneralizationSet([genNamedEntityPerson, genNamedEntityOrganization], disjoint, complete, null, 'NamedEntityType');
model.createGeneralizationSet(
  [genNamedEntityBPersonB, genNamedEntityBOrganizationB],
  disjoint,
  complete,
  null,
  'NamedEntityType'
);
// CREATE ASSOCIATIONS
const relation = model.createMediationRelation(namedEntity, test, 'has');
relation.getSourceEnd().cardinality.setOneToOne();
relation.getTargetEnd().cardinality.setZeroToMany();

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
  enumFieldToLoocupTable: false
};

// ****************************************
export const test_009: TestResource = {
  title: '009 - Flattening involving a generalization set and a hierarchy of nonSortals',
  checker: gChecker_009_flatting_with_association,
  project,
  options
};
