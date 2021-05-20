/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { DbmsSupported } from '@libs/ontouml2db/constants/DbmsSupported';
import { Ontouml2DbOptions } from '@libs/ontouml2db/Ontouml2DbOptions';
import { StrategyType } from '@libs/ontouml2db/constants/StrategyType';
import { Ontouml2Db } from '@libs/ontouml2db';
import { TestResource } from './test_resources/TestResource';
import { checkObdaMapping } from './test_resources/util';
import { test_003 } from './test_resources/003_flatting_gs';
import { test_012 } from './test_resources/012_simple_lifting';
import { test_026 } from './test_resources/026_flatting_to_class_association';
import { test_028 } from './test_resources/028_multivalued_property';
import { test_035 } from './test_resources/035_enum_field_to_lookup_table';
import { Project } from '@libs/ontouml/project';

const testResourcesRight: TestResource[] = [
  test_003, test_012, test_026, test_028
];


// ****************************************
describe('Testing Ontology Base Data Access mappings', () => {
  let options: Partial<Ontouml2DbOptions> = {
    mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
    targetDBMS: DbmsSupported.H2,
    standardizeNames: true,
    generateObdaFile: true,
    generateConnection: false,
    enumFieldToLookupTable: false
  };

  let service: Ontouml2Db;
  let files;

  for (const testResource of testResourcesRight) {
    it(`Test OBDA for the model: '${testResource.title}'`, () => {
      expect(() => {
        service = new Ontouml2Db(testResource.project, options);
        files = service.run();
      }).not.toThrow();

      expect(checkObdaMapping(files.result.obda, testResource.obdaMapping), ).toBe('');
    });
  }

  it(`Test OBDA for the model: '${test_035.title}'`, () => {
    options.enumFieldToLookupTable = true;
    expect(() => {
      service = new Ontouml2Db(test_035.project, options);
      files = service.run();
    }).not.toThrow();

    expect(checkObdaMapping(files.result.obda, test_035.obdaMapping), ).toBe('');
  });


  it(`Test OBDA for multiple inheritance`, () => {
    const project = new Project();
    const model = project.createModel();
    // CREATE CLASSES
    const person = model.createKind('Person');
    const adult = model.createRole('Adult');
    const employee = model.createRole('Employee');

    model.createGeneralization(person, adult);
    model.createGeneralization(adult, employee);

    const obdaP = 
    'mappingId    UndefinedProjectName-Person'+
    'target       :UndefinedProjectName/person/{person_id} a :Person .'+
    'source       SELECT person.person_id '+
                 'FROM person ';
    const obdaA = 
    'mappingId    UndefinedProjectName-Adult'+
    'target       :UndefinedProjectName/person/{person_id} a :Adult .'+
    'source       SELECT person.person_id '+
                 'FROM person '+
                 'WHERE is_adult = TRUE ';

    const obdaE =     
    'mappingId    UndefinedProjectName-Employee'+
    'target       :UndefinedProjectName/person/{person_id} a :Employee .'+
    'source       SELECT person.person_id '+
                 'FROM person '+
                 'WHERE is_employee = TRUE '+
                 'AND   is_adult = TRUE ';

    const obdaMapping: string[] = [obdaE, obdaP, obdaA];


    service = new Ontouml2Db(project, options);
    files = service.run();
    

    expect(checkObdaMapping(files.result.obda, obdaMapping), ).toBe('');
  });

  it('Test OBDA properties', () => {
    const project = new Project();
    const model = project.createModel();
    const _string = model.createDatatype('string');
    const _date = model.createDatatype('Date');
    const _datetiem = model.createDatatype('DateTime');
    const _float = model.createDatatype('float');
    const _double = model.createDatatype('double');
    const _long = model.createDatatype('long');
    const _bit = model.createDatatype('bit');
    
    // CREATE CLASSES
    const person = model.createKind('Person');
    person.createAttribute(_string, 'name').cardinality.setOneToOne();
    person.createAttribute(_date, 'myDate').cardinality.setOneToOne();
    person.createAttribute(_datetiem, 'myDateTime').cardinality.setOneToOne();
    person.createAttribute(_float, 'myFloat').cardinality.setOneToOne();
    person.createAttribute(_double, 'myDouble').cardinality.setOneToOne();
    person.createAttribute(_long, 'myLong').cardinality.setOneToOne();
    person.createAttribute(_bit, 'myBit').cardinality.setOneToOne();

    const obda = 
    'mappingId    UndefinedProjectName-Person'+
    'target       :UndefinedProjectName/person/{person_id} a :Person ; :name {name}^^xsd:string ; :myDate {my_date}^^xsd:dateTime ; '+
                  ':myDateTime {my_date_time}^^xsd:dateTime ; :myFloat {my_float}^^xsd:decimal ; :myDouble {my_double}^^xsd:decimal ; '+
                  ':myLong {my_long}^^xsd:decimal ; :myBit {my_bit}^^xsd:bit .'+
    'source       SELECT person.person_id, person.name, person.my_date, person.my_date_time, person.my_float, person.my_double, person.my_long, person.my_bit '+
                 'FROM person ';

    const obdaMapping: string[] = [obda];

    service = new Ontouml2Db(project, options);
    files = service.run();
    
    expect(checkObdaMapping(files.result.obda, obdaMapping), ).toBe('');
  });

});
