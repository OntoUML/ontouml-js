/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { GraphChecker } from './graph_tester/GraphChecker';
import { TestResource } from './TestResource';
import { ScriptChecker } from './graph_tester/ScriptChecker';
import { baseExample } from './baseExample';
import { OntoUML2DBOptions, StrategyType } from '@libs/ontouml2db';
import { DBMSSupported } from '@libs/ontouml2db/constants/DBMSSupported';
import { NodeChecker } from './graph_tester/NodeChecker';
import { PropertyChecker } from './graph_tester/PropertyChecker';
import { RelationshipChecker } from './graph_tester/RelationshipChecker';
import { Cardinality } from '@libs/ontouml2db/constants/enumerations';
import { TrackerChecker } from './graph_tester/TrackerChecker';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  'CREATE TABLE person ( ' +
  '         person_id               NUMBER(10,0)   NOT NULL GENERATED ALWAYS AS IDENTITY' +
  ',        name                    VARCHAR2(20)   NOT NULL' +
  ',        birth_date              DATE           NOT NULL' +
  ',        rg                      VARCHAR2(20)   NULL' +
  ',        ci                      VARCHAR2(20)   NULL' +
  ',        is_employee             CHAR(1)        NOT NULL DEFAULT FALSE' +
  ',        credit_rating           NUMBER(20,4)   NULL' +
  ',        credit_card             VARCHAR2(20)   NULL' +
  ',        is_personal_customer    CHAR(1)        NOT NULL DEFAULT FALSE' +
  ",        life_phase_enum         ENUM('CHILD','ADULT')  NOT NULL" +
  ',        CONSTRAINT pk_person PRIMARY KEY( person_id )' +
  ');';

const scriptOrganization =
  'CREATE TABLE organization ( ' +
  '         organization_id         NUMBER(10,0)   NOT NULL GENERATED ALWAYS AS IDENTITY' +
  ',        name                    VARCHAR2(20)   NOT NULL' +
  ',        address                 VARCHAR2(20)   NOT NULL' +
  ',        playground_size         NUMBER(10,0)   NULL' +
  ',        capacity                NUMBER(10,0)   NULL' +
  ',        credit_rating           NUMBER(20,4)   NULL' +
  ',        credit_limit            NUMBER(20,4)   NULL' +
  ',        is_corporate_customer   CHAR(1)        NOT NULL DEFAULT FALSE' +
  ',        is_contractor           CHAR(1)        NOT NULL DEFAULT FALSE' +
  ",        organization_type_enum  ENUM('PRIMARYSCHOOL','HOSPITAL')  NULL" +
  ',        CONSTRAINT pk_organization PRIMARY KEY( organization_id )' +
  '); ';

const scriptEmployment =
  'CREATE TABLE employment ( ' +
  '        employment_id           NUMBER(10,0)    NOT NULL GENERATED ALWAYS AS IDENTITY' +
  ',        organization_id        NUMBER(10,0)    NOT NULL' +
  ',        person_id              NUMBER(10,0)    NOT NULL' +
  ',        salary                 NUMBER(20,4)    NOT NULL' +
  ',        CONSTRAINT pk_employment PRIMARY KEY( employment_id )' +
  '); ';

const scriptEnrollment =
  'CREATE TABLE enrollment ( ' +
  '         enrollment_id           NUMBER(10,0)   NOT NULL GENERATED ALWAYS AS IDENTITY' +
  ',        organization_id         NUMBER(10,0)   NOT NULL' +
  ',        person_id               NUMBER(10,0)   NOT NULL' +
  ',        grade                   NUMBER(10,0)   NOT NULL' +
  ',        CONSTRAINT pk_enrollment PRIMARY KEY( enrollment_id )' +
  '); ';

const scriptSupply =
  'CREATE TABLE supply_contract ( ' +
  '         supply_contract_id      NUMBER(10,0)   NOT NULL GENERATED ALWAYS AS IDENTITY' +
  ',        organization_customer_id NUMBER(10,0)  NULL' +
  ',        person_id               NUMBER(10,0)   NULL' +
  ',        organization_id         NUMBER(10,0)   NOT NULL' +
  ',        contract_value          NUMBER(20,4)   NOT NULL' +
  ',        CONSTRAINT pk_supply_contract PRIMARY KEY( supply_contract_id )' +
  '); ';

const scriptNationality =
  'CREATE TABLE nationality ( ' +
  '         nationality_id          NUMBER(10,0)   NOT NULL GENERATED ALWAYS AS IDENTITY' +
  ',        person_id               NUMBER(10,0)   NOT NULL' +
  ",        nationality_enum        ENUM('BRAZILIANCITIZEN','ITALIANCITIZEN')  NOT NULL" +
  ',        CONSTRAINT pk_nationality PRIMARY KEY( nationality_id )' +
  '); ';

const scriptFKEmploymentOrganization =
  'ALTER TABLE employment ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id )';

const scriptFKEmploymentPerson = 'ALTER TABLE employment ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id )';

const scriptFKEnrollmentOrganization =
  'ALTER TABLE enrollment ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id )';

const scritpFKEnrollmentPerson = 'ALTER TABLE enrollment ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id )';

const scriptFKSupplyOrganizationCustomer =
  'ALTER TABLE supply_contract ADD FOREIGN KEY ( organization_customer_id ) REFERENCES organization ( organization_id )';

const scriptFKSupplyPerson = 'ALTER TABLE supply_contract ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id )';

const scriptFKSupplyOrganization =
  'ALTER TABLE supply_contract ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id )';

const scriptFKNationalityPerson = 'ALTER TABLE nationality ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id )';

// ****************************************
//       CHECK RESULTING GRAPH
// ****************************************
const gChecker_run_example = new GraphChecker()
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
      .addProperty(new PropertyChecker('life_phase_enum', false, ['CHILD', 'ADULT']))
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
      .addProperty(new PropertyChecker('organization_type_enum', true, ['PRIMARYSCHOOL', 'HOSPITAL']))
  )
  .addNode(
    new NodeChecker('employment')
      .addProperty(new PropertyChecker('employment_id', false))
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('salary', false))
  )
  .addNode(
    new NodeChecker('supply_contract')
      .addProperty(new PropertyChecker('supply_contract_id', false))
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('organization_customer_id', true))
      .addProperty(new PropertyChecker('person_id', true))
      .addProperty(new PropertyChecker('contract_value', false))
  )
  .addNode(
    new NodeChecker('enrollment')
      .addProperty(new PropertyChecker('enrollment_id', false))
      .addProperty(new PropertyChecker('organization_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('grade', false))
  )
  .addNode(
    new NodeChecker('nationality')
      .addProperty(new PropertyChecker('nationality_id', false))
      .addProperty(new PropertyChecker('person_id', false))
      .addProperty(new PropertyChecker('nationality_enum', false, ['BRAZILIANCITIZEN', 'ITALIANCITIZEN']))
  )
  .addRelationship(new RelationshipChecker('nationality', Cardinality.C0_N, 'person', Cardinality.C1))
  .addRelationship(new RelationshipChecker('enrollment', Cardinality.C0_N, 'person', Cardinality.C1))
  .addRelationship(new RelationshipChecker('employment', Cardinality.C0_N, 'person', Cardinality.C1))
  .addRelationship(new RelationshipChecker('supply_contract', Cardinality.C0_N, 'person', Cardinality.C0_1))
  .addRelationship(new RelationshipChecker('organization', Cardinality.C1, 'employment', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('organization', Cardinality.C1, 'supply_contract', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('organization', Cardinality.C0_1, 'supply_contract', Cardinality.C0_N))
  .addRelationship(new RelationshipChecker('organization', Cardinality.C1, 'enrollment', Cardinality.C0_N))

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
  .addTracker(new TrackerChecker('Enrollment', 'enrollment'))
  .setNumberOfTablesToFindInScript(6)
  .setNumberOfFkToFindInScript(8)
  .addScriptChecker(new ScriptChecker(scriptPerson, 'The PERSON table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptOrganization, 'The ORFANIZATION table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptEmployment, 'The EMPLOYMENT table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptEnrollment, 'The ENROLLMENT table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptSupply, 'The SUPPLY_CONTRACT table is different than expected.'))
  .addScriptChecker(new ScriptChecker(scriptNationality, 'The Nationality table is different than expected.'))
  .addScriptChecker(
    new ScriptChecker(
      scriptFKEmploymentOrganization,
      'The FK between Employment and Organization not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(scriptFKEmploymentPerson, 'The FK between Employment and Person not exists or is different than expected.')
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKEnrollmentOrganization,
      'The FK between Enrollment and Organization not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(scritpFKEnrollmentPerson, 'The FK between Enrollment and Person not exists or is different than expected.')
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKSupplyOrganizationCustomer,
      'The FK between SupplyContract and Organization like Customer not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(scriptFKSupplyPerson, 'The FK between SupplyContract and Person not exists or is different than expected.')
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKSupplyOrganization,
      'The FK between SupplyContract and Organization not exists or is different than expected.'
    )
  )
  .addScriptChecker(
    new ScriptChecker(
      scriptFKNationalityPerson,
      'The FK between Nationality and Person not exists or is different than expected.'
    )
  );

// ****************************************
//       M O D E L
// ****************************************
// It is not the purpose of this test to evaluate the graph. The test will be done for the baseExamle.
const project = baseExample.project;

// ****************************************
// ** O P T I O N S
// ****************************************
const options: Partial<OntoUML2DBOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DBMSSupported.ORACLE,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa',
  enumFieldToLookupTable: false
};

// ****************************************
export const test_031: TestResource = {
  title: '031 - Evaluates Oracle script',
  checker: gChecker_run_example,
  project,
  options
};
