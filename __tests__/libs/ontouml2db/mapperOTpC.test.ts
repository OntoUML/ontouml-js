/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { DbmsSupported } from '@libs/ontouml2db/constants/DbmsSupported';
import { Ontouml2DbOptions } from '@libs/ontouml2db/Ontouml2DbOptions';
import { StrategyType } from '@libs/ontouml2db/constants/StrategyType';
import { Ontouml2Db } from '@libs/ontouml2db/Ontouml2Db';
import { baseExample } from './test_resources/baseExample';
import { checkScripts } from './test_resources/util';

// ****************************************
//       FOR SCHEMA VALIDATION
// ****************************************
const scriptNamedEntity = 'CREATE TABLE named_entity ( ';
'         named_entity_id         INTEGER        NOT NULL PRIMARY KEY';
',        name                    VARCHAR(20)    NOT NULL';
'); ';

const scriptCustomer =
  'CREATE TABLE customer ( ' +
  '         customer_id             INTEGER        NOT NULL PRIMARY KEY' +
  ',        credit_rating           DOUBLE         NOT NULL' +
  ');';

const scriptPerson =
  'CREATE TABLE person ( ' +
  '         named_entity_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        birth_date              DATE           NOT NULL' +
  '); ';

const scriptOrganization =
  'CREATE TABLE organization ( ' +
  '         named_entity_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        address                 VARCHAR(20)    NOT NULL' +
  '); ';

const scriptPrimarySchool =
  'CREATE TABLE primary_school ( ' +
  '         named_entity_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        playground_size         INTEGER        NULL' +
  '); ';

const scriptHospital =
  'CREATE TABLE hospital ( ' +
  '         named_entity_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        capacity                INTEGER        NULL' +
  '); ';

const scriptBrazilianCitizen =
  'CREATE TABLE brazilian_citizen ( ' +
  '         named_entity_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        rg                      VARCHAR(20)    NOT NULL' +
  '); ';

const scriptItalianCitizen =
  'CREATE TABLE italian_citizen ( ' +
  '         named_entity_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        ci                      VARCHAR(20)    NOT NULL' +
  '); ';

const scriptEmployee =
  'CREATE TABLE employee ( ' + '         named_entity_id         INTEGER        NOT NULL PRIMARY KEY' + '); ';

const scriptPersonalCustomer =
  'CREATE TABLE personal_customer ( ' +
  '         named_entity_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        customer_id             INTEGER        NOT NULL PRIMARY KEY' +
  ',        credit_card             VARCHAR(20)    NULL' +
  '); ';

const scriptCorporateCustomer =
  'CREATE TABLE corporate_customer ( ' +
  '         named_entity_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        customer_id             INTEGER        NOT NULL PRIMARY KEY' +
  ',        credit_limit            DOUBLE         NOT NULL' +
  '); ';

const scriptContractor =
  'CREATE TABLE contractor ( ' + '         named_entity_id         INTEGER        NOT NULL PRIMARY KEY' + ');';

const scripChild = 'CREATE TABLE child ( ' + '         named_entity_id         INTEGER        NOT NULL PRIMARY KEY' + ');';

const scriptAdult = 'CREATE TABLE adult ( ' + '         named_entity_id         INTEGER        NOT NULL PRIMARY KEY' + ');';

const scriptEmployment =
  'CREATE TABLE employment ( ' +
  '        employment_id           INTEGER        NOT NULL PRIMARY KEY' +
  ',       named_entity_organization_id INTEGER        NOT NULL' +
  ',       named_entity_id         INTEGER        NOT NULL' +
  ',       salary                  DOUBLE         NOT NULL' +
  '); ';

const scriptEnrollment =
  'CREATE TABLE enrollment ( ' +
  '         enrollment_id           INTEGER        NOT NULL PRIMARY KEY' +
  ',        named_entity_primary_school_id INTEGER        NOT NULL' +
  ',        named_entity_id         INTEGER        NOT NULL' +
  ',        grade                   INTEGER        NOT NULL' +
  '); ';

const scriptSupply =
  'CREATE TABLE supply_contract ( ' +
  '         supply_contract_id      INTEGER        NOT NULL PRIMARY KEY' +
  ',        customer_id             INTEGER        NOT NULL' +
  ',        named_entity_id         INTEGER        NOT NULL' +
  ',        contract_value          DOUBLE         NOT NULL' +
  '); ';

const scriptFKPersonNamed = 'ALTER TABLE person ADD FOREIGN KEY ( named_entity_id ) REFERENCES named_entity ( named_entity_id );';

const scriptFKOrganizationNamed =
  'ALTER TABLE organization ADD FOREIGN KEY ( named_entity_id ) REFERENCES named_entity ( named_entity_id );';

const scriptFKPrimatyOrgnization =
  'ALTER TABLE primary_school ADD FOREIGN KEY ( named_entity_id ) REFERENCES organization ( named_entity_id );';

const scriptFKHospitalOrganization =
  'ALTER TABLE hospital ADD FOREIGN KEY ( named_entity_id ) REFERENCES organization ( named_entity_id );';

const scriptFKBrazilianPerson =
  'ALTER TABLE brazilian_citizen ADD FOREIGN KEY ( named_entity_id ) REFERENCES person ( named_entity_id );';

const scriptFKItalianPerson =
  'ALTER TABLE italian_citizen ADD FOREIGN KEY ( named_entity_id ) REFERENCES person ( named_entity_id );';

const scriptFKEmployeAdult = 'ALTER TABLE employee ADD FOREIGN KEY ( named_entity_id ) REFERENCES adult ( named_entity_id );';

const scritpFKPersonalCustomerAdult =
  'ALTER TABLE personal_customer ADD FOREIGN KEY ( named_entity_id ) REFERENCES adult ( named_entity_id );';

const scriptFKPersonalCustomerCustomer =
  'ALTER TABLE personal_customer ADD FOREIGN KEY ( customer_id ) REFERENCES customer ( customer_id );';

const scriptFKCorporateOrganization =
  'ALTER TABLE corporate_customer ADD FOREIGN KEY ( named_entity_id ) REFERENCES organization ( named_entity_id );';

const scriptFKCorporateCustomer =
  'ALTER TABLE corporate_customer ADD FOREIGN KEY ( customer_id ) REFERENCES customer ( customer_id );';

const scriptFKContractorOrganization =
  'ALTER TABLE contractor ADD FOREIGN KEY ( named_entity_id ) REFERENCES organization ( named_entity_id );';

const scriptFKChildPerson = 'ALTER TABLE child ADD FOREIGN KEY ( named_entity_id ) REFERENCES person ( named_entity_id );';

const scriptFKAdultPerson = 'ALTER TABLE adult ADD FOREIGN KEY ( named_entity_id ) REFERENCES person ( named_entity_id );';

const scriptFKEmploymentOrganization =
  'ALTER TABLE employment ADD FOREIGN KEY ( named_entity_organization_id ) REFERENCES organization ( named_entity_id );';

const scriptFKEmploymentEmployee =
  'ALTER TABLE employment ADD FOREIGN KEY ( named_entity_id ) REFERENCES employee ( named_entity_id );';

const scriptFKEnrollmentSchool =
  'ALTER TABLE enrollment ADD FOREIGN KEY ( named_entity_primary_school_id ) REFERENCES primary_school ( named_entity_id );';

const scriptFKEnrollmentChild =
  'ALTER TABLE enrollment ADD FOREIGN KEY ( named_entity_id ) REFERENCES child ( named_entity_id );';

const scriptFKSupplyCustomer = 'ALTER TABLE supply_contract ADD FOREIGN KEY ( customer_id ) REFERENCES customer ( customer_id );';

const scriptFKSupplyContractor =
  'ALTER TABLE supply_contract ADD FOREIGN KEY ( named_entity_id ) REFERENCES contractor ( named_entity_id );';


const scripts: string[] = [scriptPerson, scriptOrganization, scriptEmployment, scriptEnrollment, scriptSupply, 
    scriptFKEmploymentOrganization, scriptPrimarySchool, scriptHospital, scriptBrazilianCitizen, scriptItalianCitizen, 
    scriptEmployee, scriptPersonalCustomer, scriptCorporateCustomer, scriptContractor, scripChild, scriptAdult, 
    scriptFKPrimatyOrgnization, scriptFKHospitalOrganization, scriptFKBrazilianPerson, scriptFKItalianPerson, 
    scriptFKEmployeAdult, scritpFKPersonalCustomerAdult, scriptFKCorporateOrganization, scriptFKContractorOrganization, 
    scriptFKChildPerson, scriptFKAdultPerson, scriptFKEmploymentEmployee, scriptFKEnrollmentSchool, scriptFKEnrollmentChild, 
    scriptFKSupplyContractor, scriptNamedEntity, scriptCustomer, scriptFKPersonNamed, scriptFKOrganizationNamed, 
    scriptFKPersonalCustomerCustomer, scriptFKCorporateCustomer, scriptFKSupplyCustomer];
  

// ****************************************
//       M O D E L
// ****************************************
const project = baseExample.project;

// ****************************************
// ** O P T I O N S
// ****************************************
const options: Partial<Ontouml2DbOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_CLASS,
  targetDBMS: DbmsSupported.GENERIC_SCHEMA,
  standardizeNames: true,
  generateConnection: false,
  generateObdaFile: false,
  enumFieldToLookupTable: true
};

// ****************************************
test('Testing One Table per Class approach', () => {
  let service: Ontouml2Db;
  let files;

  expect(() => {
    service = new Ontouml2Db(project, options);
    files = service.run();
  }).not.toThrow();

  expect(checkScripts(files.result.schema, scripts), ).toBe('');
});
