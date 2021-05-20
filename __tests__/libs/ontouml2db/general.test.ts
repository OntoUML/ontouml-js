import { Project } from '@libs/ontouml';
import { Ontouml2Db, Ontouml2DbOptions, StrategyType } from '@libs/ontouml2db';
import { DbmsSupported } from '@libs/ontouml2db/constants/DbmsSupported';
import { checkObdaMapping, checkScripts } from './test_resources/util';

describe('Tests Ontouml2Db', () => {
  describe('Test sample Project transformation', () => {

    it('Transformation test without setting options.', () => {
      const project = new Project();
      const model = project.createModel();
      const person = model.createKind('Person');
      
      expect(() => {
        new Ontouml2Db(project).run();
      }).not.toThrow();
    });


    test('Changing the order in which generalizations are created.', () => {
      let options: Partial<Ontouml2DbOptions> = {
        mappingStrategy: StrategyType.ONE_TABLE_PER_CLASS,
        targetDBMS: DbmsSupported.GENERIC_SCHEMA,
        standardizeNames: true,
        generateSchema: true,
        generateObdaFile: false,
        generateConnection: false,
        generateIndexes: false,
        enumFieldToLookupTable: true
      };
    
      const project = new Project();
      const model = project.createModel();
      const employee = model.createKind('Employee');
      const adult = model.createKind('Adult');
      const person = model.createKind('Person');
      model.createGeneralization(adult, employee);
      model.createGeneralization(person, adult);

      const scriptEmployee = 'CREATE TABLE employee ( person_id INTEGER NOT NULL PRIMARY KEY );';
      const scriptAdult = 'CREATE TABLE adult ( person_id INTEGER NOT NULL PRIMARY KEY ); ';
      const scriptPerson = 'CREATE TABLE person ( person_id INTEGER NOT NULL PRIMARY KEY ); ';
      const fk1 = 'ALTER TABLE employee ADD FOREIGN KEY ( person_id ) REFERENCES adult ( person_id );';
      const fk2 = 'ALTER TABLE adult ADD FOREIGN KEY ( person_id ) REFERENCES person ( person_id );'

      const scripts: string[] = [scriptEmployee, scriptAdult, scriptPerson, fk1, fk2];
    
      let ontouml2Db = new Ontouml2Db(project, options);
    
      let files = ontouml2Db.run();
    
      expect(checkScripts(files.result.schema, scripts), ).toBe('');
    });


    test('Check standardize names', () => {
      let options: Partial<Ontouml2DbOptions> = {
        mappingStrategy: StrategyType.ONE_TABLE_PER_CLASS,
        targetDBMS: DbmsSupported.GENERIC_SCHEMA,
        standardizeNames: false,
        generateSchema: true,
        generateObdaFile: true,
        generateConnection: false,
        enumFieldToLookupTable: true
      };
    
      const project = new Project();
      const model = project.createModel();
      const personalCustomer = model.createKind('PersonalCustomer');
      const _string = model.createDatatype('string');
      personalCustomer.createAttribute(_string, 'personName').cardinality.setOneToOne();
    
      const script = 
      'CREATE TABLE PersonalCustomer ( '+
              'PersonalCustomer_id     INTEGER        NOT NULL PRIMARY KEY'+
      ',       personName              VARCHAR(20)    NOT NULL'+
      ');';
      const scripts: string[] = [script];

      const obdaMapping = 
      'mappingId    UndefinedProjectName-PersonalCustomer'+
      'target       :UndefinedProjectName/PersonalCustomer/{PersonalCustomer_id} a :PersonalCustomer ; :personName {personName}^^xsd:string .'+
      'source       SELECT PersonalCustomer.PersonalCustomer_id, PersonalCustomer.personName '+
      '             FROM PersonalCustomer ';
      const mappings: string[] = [obdaMapping];

      let ontouml2Db = new Ontouml2Db(project, options);
    
      let files = ontouml2Db.run();
    
      expect(checkScripts(files.result.schema, scripts), ).toBe('');
      expect(checkObdaMapping(files.result.obda, mappings), ).toBe('');
    });
    
    // it('Transformation of N:N association with an enueration.', () => {
    //   const project = new Project();
    //   const model = project.createModel();
    //   const person = model.createKind('Person');
    //   const typePerson = model.createEnumeration('TypePerson');
    //   const rel = model.createMediationRelation(typePerson, person, 'has');
    //   rel.getSourceEnd().cardinality.setOneToMany();
    //   rel.getTargetEnd().cardinality.setOneToMany();
      
    //   const _string = model.createDatatype('string');
    //   typePerson.createAttribute(_string, 'name').cardinality.setOneToOne();
      
    //   expect(() => {
    //     new Ontouml2Db(project).run();
    //   }).not.toThrow();
    // });

  });
});

