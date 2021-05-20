import { Ontouml2Db } from '@libs/ontouml2db/Ontouml2Db';
import { TestResource } from './test_resources/TestResource';
import { checkScripts } from './test_resources/util';
import { Ontouml2DbOptions, StrategyType } from '@libs/ontouml2db';
import { DbmsSupported } from '@libs/ontouml2db/constants/DbmsSupported';
import { test_029 } from './test_resources/029_h2_script';
import { test_030 } from './test_resources/030_mysql_script';
import { test_031 } from './test_resources/031_oracle_script';
import { test_032 } from './test_resources/032_postgre.script';
import { test_033 } from './test_resources/033_sqlserver_script';

// ****************************************
describe('Testing One Table per Kind mapper.', () => {
    const options: Partial<Ontouml2DbOptions> = {
        mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
        standardizeNames: true,
        enumFieldToLookupTable: false,
        generateSchema: true,
        generateConnection: false,
        generateObdaFile: false,
        generateIndexes: true,
    };

    let service: Ontouml2Db;
    let files;
  
    it(`Test model: '${test_029.title}'`, () => {
        options.targetDBMS = DbmsSupported.H2;
        expect(() => {
          service = new Ontouml2Db(test_029.project, options);
          files = service.run();
        }).not.toThrow();
  
        expect(checkScripts(files.result.schema, test_029.scripts), ).toBe('');
    });

    it(`Test model: '${test_030.title}'`, () => {
        options.targetDBMS = DbmsSupported.MYSQL;
        expect(() => {
          service = new Ontouml2Db(test_030.project, options);
          files = service.run();
        }).not.toThrow();
  
        expect(checkScripts(files.result.schema, test_030.scripts), ).toBe('');
    });

    it(`Test model: '${test_031.title}'`, () => {
        options.targetDBMS = DbmsSupported.ORACLE;
        expect(() => {
          service = new Ontouml2Db(test_031.project, options);
          files = service.run();
        }).not.toThrow();
  
        expect(checkScripts(files.result.schema, test_031.scripts), ).toBe('');
    });

    it(`Test model: '${test_032.title}'`, () => {
        options.targetDBMS = DbmsSupported.POSTGRE;
        expect(() => {
          service = new Ontouml2Db(test_032.project, options);
          files = service.run();
        }).not.toThrow();
  
        expect(checkScripts(files.result.schema, test_032.scripts), ).toBe('');
    });

    it(`Test model: '${test_033.title}'`, () => {
        options.targetDBMS = DbmsSupported.SQLSERVER;
        expect(() => {
          service = new Ontouml2Db(test_033.project, options);
          files = service.run();
        }).not.toThrow();
  
        expect(checkScripts(files.result.schema, test_033.scripts), ).toBe('');
    });
});