/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { TestResource } from './TestResource';
import { baseExample } from './baseExample';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptPerson =
  'CREATE TABLE IF NOT EXISTS person ( ' +
  '         person_id               INTEGER        NOT NULL AUTO_INCREMENT PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        birth_date              DATE           NOT NULL' +
  ',        rg                      VARCHAR(20)    NULL' +
  ',        ci                      VARCHAR(20)    NULL' +
  ',        is_employee             TINYINT(1)     NOT NULL DEFAULT FALSE' +
  ',        credit_rating           DOUBLE         NULL' +
  ',        credit_card             VARCHAR(20)    NULL' +
  ',        is_personal_customer    TINYINT(1)     NOT NULL DEFAULT FALSE' +
  ",        life_phase_enum         ENUM('CHILD','ADULT')  NOT NULL" +
  '); ';

const scriptOrganization =
  'CREATE TABLE IF NOT EXISTS organization ( ' +
  '         organization_id         INTEGER        NOT NULL AUTO_INCREMENT PRIMARY KEY' +
  ',        name                    VARCHAR(20)    NOT NULL' +
  ',        address                 VARCHAR(20)    NOT NULL' +
  ',        playground_size         INTEGER        NULL' +
  ',        capacity                INTEGER        NULL' +
  ',        credit_rating           DOUBLE         NULL' +
  ',        credit_limit            DOUBLE         NULL' +
  ',        is_corporate_customer   TINYINT(1)     NOT NULL DEFAULT FALSE' +
  ',        is_contractor           TINYINT(1)     NOT NULL DEFAULT FALSE' +
  ",        organization_type_enum  ENUM('PRIMARYSCHOOL','HOSPITAL')  NULL" +
  '); ';

const scriptEmployment =
  'CREATE TABLE IF NOT EXISTS employment ( ' +
  '        employment_id           INTEGER        NOT NULL AUTO_INCREMENT PRIMARY KEY' +
  ',        organization_id        INTEGER        NOT NULL' +
  ',        person_id              INTEGER        NOT NULL' +
  ',        salary                 DOUBLE         NOT NULL' +
  '); ';

const scriptEnrollment =
  'CREATE TABLE IF NOT EXISTS enrollment ( ' +
  '         enrollment_id           INTEGER        NOT NULL AUTO_INCREMENT PRIMARY KEY' +
  ',        organization_id         INTEGER        NOT NULL' +
  ',        person_id               INTEGER        NOT NULL' +
  ',        grade                   INTEGER        NOT NULL' +
  '); ';

const scriptSupply =
  'CREATE TABLE IF NOT EXISTS supply_contract ( ' +
  '         supply_contract_id      INTEGER        NOT NULL AUTO_INCREMENT PRIMARY KEY' +
  ',        organization_customer_id INTEGER        NULL' +
  ',        person_id               INTEGER        NULL' +
  ',        organization_id         INTEGER        NOT NULL' +
  ',        contract_value          DOUBLE         NOT NULL' +
  '); ';

const scriptNationality =
  'CREATE TABLE IF NOT EXISTS nationality ( ' +
  '         nationality_id          INTEGER        NOT NULL AUTO_INCREMENT PRIMARY KEY' +
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

const indexP1 = 'CREATE INDEX ix_person_1 ON person ( is_employee, person_id );';
    
const indexP2 = 'CREATE INDEX ix_person_2 ON person ( is_personal_customer, person_id );';

const indexP3 = 'CREATE INDEX ix_person_3 ON person ( life_phase_enum, person_id );';

const indexO1 = 'CREATE INDEX ix_organization_1 ON organization ( is_corporate_customer, organization_id );';

const indexO2 = 'CREATE INDEX ix_organization_2 ON organization ( is_contractor, organization_id );';

const indexO3 = 'CREATE INDEX ix_organization_3 ON organization ( organization_type_enum, organization_id );';

const indexN1 = 'CREATE INDEX ix_nationality_1 ON nationality ( nationality_enum, person_id, nationality_id );';

const scripts: string[] = [scriptPerson, scriptOrganization, scriptEmployment, scriptEnrollment,
  scriptSupply, scriptNationality, scriptFKEmploymentOrganization, scriptFKEmploymentPerson,
  scriptFKEnrollmentOrganization, scritpFKEnrollmentPerson, scriptFKSupplyOrganizationCustomer,
  scriptFKSupplyPerson, scriptFKSupplyOrganization, scriptFKNationalityPerson, indexP1, indexP2,
  indexP3, indexO1, indexO2, indexO3, indexN1];

// ****************************************
//       FOR OBDA VALIDATION
// ****************************************
const obdaMapping: string[] = [];

// ****************************************
//       M O D E L
// ****************************************
// It is not the purpose of this test to evaluate the graph. The test will be done for the baseExamle.
const project = baseExample.project;


// ****************************************
export const test_030: TestResource = {
  title: '030 - Evaluates MySql script',
  project,
  scripts,
  obdaMapping,
};
