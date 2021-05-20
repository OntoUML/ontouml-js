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
export const test_031: TestResource = {
  title: '031 - Evaluates Oracle script',
  project,
  scripts,
  obdaMapping,
};
