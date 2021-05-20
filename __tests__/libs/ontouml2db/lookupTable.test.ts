import { Ontouml2Db } from '@libs/ontouml2db/Ontouml2Db';
import { TestResource } from './test_resources/TestResource';
import { checkScripts } from './test_resources/util';
import { Ontouml2DbOptions, StrategyType } from '@libs/ontouml2db';
import { DbmsSupported } from '@libs/ontouml2db/constants/DbmsSupported';
import { test_035 } from './test_resources/035_enum_field_to_lookup_table';
import { test_036 } from './test_resources/036_enum_field_to_lookup_tables_h2';

describe('Testing One Table per Kind mapper.', () => {
    let service: Ontouml2Db;
    let files;

    it(`Test model: '${test_035.title}'`, () => {
        const options: Partial<Ontouml2DbOptions> = {
            mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
            targetDBMS: DbmsSupported.GENERIC_SCHEMA,
            standardizeNames: true,
            generateConnection: false,
            generateObdaFile: false,
            enumFieldToLookupTable: true
            };
        expect(() => {
            service = new Ontouml2Db(test_035.project, options);
            files = service.run();
        }).not.toThrow();

        expect(checkScripts(files.result.schema, test_035.scripts), ).toBe('');
    });

    it(`Test model: '${test_036.title}'`, () => {
        const options: Partial<Ontouml2DbOptions> = {
            mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
            targetDBMS: DbmsSupported.H2,
            standardizeNames: true,
            generateConnection: false,
            generateObdaFile: false,
            enumFieldToLookupTable: true
            };
        expect(() => {
            service = new Ontouml2Db(test_036.project, options);
            files = service.run();
        }).not.toThrow();

        expect(checkScripts(files.result.schema, test_036.scripts), ).toBe('');
    });
  

    it('Test Generic Schema with enumeration filed:' , () => {
        const options: Partial<Ontouml2DbOptions> = {
            mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
            targetDBMS: DbmsSupported.GENERIC_SCHEMA,
            standardizeNames: true,
            generateConnection: false,
            generateObdaFile: false,
            enumFieldToLookupTable: false
            };
        expect(() => {
            service = new Ontouml2Db(test_036.project, options);
            files = service.run();
        }).toThrow('It is not possible to make lookup field for GENERIC database.');
    });
});