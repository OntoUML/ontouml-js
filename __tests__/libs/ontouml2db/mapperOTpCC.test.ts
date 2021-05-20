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

const scriptPrimarySchool =
  'CREATE TABLE primary_school ( ' +
  '         organization_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        playground_size         INTEGER        NULL' +
  '); ';

const scriptHospital =
  'CREATE TABLE hospital ( ' +
  '         organization_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        capacity                INTEGER        NULL' +
  '); ';

const scriptBrazilianCitizen =
  'CREATE TABLE brazilian_citizen ( ' +
  '         person_id               INTEGER        NOT NULL PRIMARY KEY' +
  ',        rg                      VARCHAR(20)    NOT NULL' +
  '); ';

const scriptItalianCitizen =
  'CREATE TABLE italian_citizen ( ' +
  '         person_id               INTEGER        NOT NULL PRIMARY KEY' +
  ',        ci                      VARCHAR(20)    NOT NULL' +
  '); ';

const scriptEmployee = 'CREATE TABLE employee ( ' + 
'         person_id              INTEGER        NOT NULL PRIMARY KEY' + 
'); ';

const scriptPersonalCustomer =
  'CREATE TABLE personal_customer ( ' +
  '         person_id               INTEGER        NOT NULL PRIMARY KEY' +
  ',        credit_rating           DOUBLE         NOT NULL' +
  ',        credit_card             VARCHAR(20)    NULL' +
  '); ';

const scriptCorporateCustomer =
  'CREATE TABLE corporate_customer ( ' +
  '         organization_id         INTEGER        NOT NULL PRIMARY KEY' +
  ',        credit_rating           DOUBLE         NOT NULL' +
  ',        credit_limit            DOUBLE         NOT NULL' +
  '); ';

const scriptContractor =
  'CREATE TABLE contractor ( ' + 
  '         organization_id         INTEGER        NOT NULL PRIMARY KEY' + 
  ');';

const scripChild = 'CREATE TABLE child ( ' + 
'         person_id                 INTEGER        NOT NULL PRIMARY KEY' + 
');';

const scriptAdult = 'CREATE TABLE adult ( ' + 
'         person_id                 INTEGER        NOT NULL PRIMARY KEY' + 
');';

const scriptEmployment =
  'CREATE TABLE employment ( ' +
  '        employment_id           INTEGER        NOT NULL PRIMARY KEY' +
  ',       organization_id         INTEGER        NOT NULL' +
  ',       person_id              INTEGER        NOT NULL' +
  ',       salary                  DOUBLE         NOT NULL' +
  '); ';

const scriptEnrollment =
  'CREATE TABLE enrollment ( ' +
  '         enrollment_id           INTEGER        NOT NULL PRIMARY KEY' +
  ',        organization_id         INTEGER        NOT NULL' +
  ',        person_id               INTEGER        NOT NULL' +
  ',        grade                   INTEGER        NOT NULL' +
  '); ';

const scriptSupply =
  'CREATE TABLE supply_contract ( ' +
  '         supply_contract_id      INTEGER        NOT NULL PRIMARY KEY' +
  ',        organization_customer_id INTEGER        NULL' +
  ',        person_id               INTEGER        NULL' +
  ',        organization_id         INTEGER        NOT NULL' +
  ',        contract_value          DOUBLE         NOT NULL' +
  '); ';

const scriptFKPrimatyOrgnization =
  'ALTER TABLE primary_school ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id );';

const scriptFKHospitalOrganization =
  'ALTER TABLE hospital ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id );';

const scriptFKBrazilianPerson = 'ALTER TABLE brazilian_citizen ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

const scriptFKItalianPerson = 'ALTER TABLE italian_citizen ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

const scriptFKEmployeAdult = 'ALTER TABLE employee ADD FOREIGN KEY ( person_id ) REFERENCES adult ( person_id );';

const scritpFKPersonalCustomerAdult =
  'ALTER TABLE personal_customer ADD FOREIGN KEY ( person_id ) REFERENCES adult ( person_id );';

const scriptFKCorporateOrganization =
  'ALTER TABLE corporate_customer ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id );';

const scriptFKContractorOrganization =
  'ALTER TABLE contractor ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id );';

const scriptFKChildPerson = 'ALTER TABLE child ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

const scriptFKAdultPerson = 'ALTER TABLE adult ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );';

const scriptFKEmploymentOrganization =
  'ALTER TABLE employment ADD FOREIGN KEY ( organization_id ) REFERENCES organization ( organization_id );';

const scriptFKEmploymentEmployee = 'ALTER TABLE employment ADD FOREIGN KEY ( person_id ) REFERENCES employee ( person_id );';

const scriptFKEnrollmentSchool =
  'ALTER TABLE enrollment ADD FOREIGN KEY ( organization_id ) REFERENCES primary_school ( organization_id );';

const scriptFKEnrollmentChild = 'ALTER TABLE enrollment ADD FOREIGN KEY ( person_id ) REFERENCES child ( person_id );';

const scriptFKSupplyCorporateCustomer =
  'ALTER TABLE supply_contract ADD FOREIGN KEY ( organization_customer_id ) REFERENCES corporate_customer ( organization_id );';

const scriptFKSupplyPersonalCustomer =
  'ALTER TABLE supply_contract ADD FOREIGN KEY ( person_id ) REFERENCES personal_customer ( person_id );';

const scriptFKSupplyContractor =
  'ALTER TABLE supply_contract ADD FOREIGN KEY ( organization_id ) REFERENCES contractor ( organization_id );';


const scripts: string[] = [scriptPerson, scriptOrganization, scriptEmployment, scriptEnrollment, scriptSupply, 
  scriptFKEmploymentOrganization, scriptPrimarySchool, scriptHospital, scriptBrazilianCitizen, scriptItalianCitizen, 
  scriptEmployee, scriptPersonalCustomer, scriptCorporateCustomer, scriptContractor, scripChild, scriptAdult, 
  scriptFKPrimatyOrgnization, scriptFKHospitalOrganization, scriptFKBrazilianPerson, scriptFKItalianPerson, 
  scriptFKEmployeAdult, scritpFKPersonalCustomerAdult, scriptFKCorporateOrganization, scriptFKContractorOrganization, 
  scriptFKChildPerson, scriptFKAdultPerson, scriptFKEmploymentEmployee, scriptFKEnrollmentSchool, scriptFKEnrollmentChild, 
  scriptFKSupplyCorporateCustomer, scriptFKSupplyPersonalCustomer, scriptFKSupplyContractor];


// ****************************************
//       M O D E L
// ****************************************
const project = baseExample.project;


// ****************************************
// ** O P T I O N S
// ****************************************
let options: Partial<Ontouml2DbOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_CONCRETE_CLASS,
  targetDBMS: DbmsSupported.GENERIC_SCHEMA,
  standardizeNames: true,
  generateConnection: false,
  generateObdaFile: false,
  enumFieldToLookupTable: true
};

// ****************************************
test('Testing One Table per Concrete Class approach', () => {
  let service: Ontouml2Db;
  let files;

  expect(() => {
    service = new Ontouml2Db(project, options);
    files = service.run();
  }).not.toThrow();

  expect(checkScripts(files.result.schema, scripts), ).toBe('');
});
