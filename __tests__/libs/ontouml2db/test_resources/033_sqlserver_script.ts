/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { GraphChecker } from './graph_tester/GraphChecker';
import { TestResource } from './TestResource';
import { ScriptChecker } from './graph_tester/ScriptChecker';
import { baseExample } from './baseExample';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  'CREATE TABLE person ( ' +
  '         person_id               INTEGER        NOT NULL IDENTITY(1,1) PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NULL' +
  ',        birth_date              DATE           NULL' +
  ',        rg                      VARCHAR(20)    NULL' +
  ',        ci                      VARCHAR(20)    NULL' +
  ',        is_employee             BIT            NOT NULL DEFAULT FALSE' +
  ',        credit_rating           REAL           NULL' +
  ',        credit_card             VARCHAR(20)    NULL' +
  ',        is_personal_customer    BIT            NOT NULL DEFAULT FALSE' +
  ",        life_phase_enum         ENUM('CHILD','ADULT')  NULL" +
  '); ';

const scriptOrganization =
  'CREATE TABLE organization ( ' +
  '         organization_id         INTEGER        NOT NULL IDENTITY(1,1) PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NULL' +
  ',        address                 VARCHAR(20)    NULL' +
  ',        playground_size         INTEGER        NULL' +
  ',        capacity                INTEGER        NULL' +
  ',        credit_rating           REAL           NULL' +
  ',        credit_limit            REAL           NULL' +
  ',        is_corporate_customer   BIT            NOT NULL DEFAULT FALSE' +
  ',        is_contractor           BIT            NOT NULL DEFAULT FALSE' +
  ",        organization_type_enum  ENUM('PRIMARYSCHOOL','HOSPITAL')  NULL" +
  '); ';

const scriptEmployment =
  'CREATE TABLE employment ( ' +
  '        employment_id           INTEGER        NOT NULL IDENTITY(1,1) PRIMARY KEY' +
  ',        organization_id        INTEGER        NOT NULL' +
  ',        person_id              INTEGER        NOT NULL' +
  ',        salary                 REAL           NULL' +
  '); ';

const scriptEnrollment =
  'CREATE TABLE enrollment ( ' +
  '         enrollment_id           INTEGER        NOT NULL IDENTITY(1,1) PRIMARY KEY' +
  ',        organization_id         INTEGER        NOT NULL' +
  ',        person_id               INTEGER        NOT NULL' +
  ',        grade                   INTEGER        NULL' +
  '); ';

const scriptSupply =
  'CREATE TABLE supply_contract ( ' +
  '         supply_contract_id      INTEGER        NOT NULL IDENTITY(1,1) PRIMARY KEY' +
  ',        organization_customer_id INTEGER        NULL' +
  ',        person_id               INTEGER        NULL' +
  ',        organization_id         INTEGER        NOT NULL' +
  ',        contract_value          REAL           NULL' +
  '); ';

const scriptNationality =
  'CREATE TABLE nationality ( ' +
  '         nationality_id          INTEGER        NOT NULL IDENTITY(1,1) PRIMARY KEY' +
  ',        person_id               INTEGER        NOT NULL' +
  ",        nationality_enum        ENUM('BRAZILIANCITIZEN','ITALIANCITIZEN')  NOT NULL" +
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

export const test_033: TestResource = {
  title: 'Base Example Test',
  checker: gChecker_run_example,
  project
};
