import { StrategyType } from '@libs/ontouml2db/constants/StrategyType';
import { DBMSSupported } from '@libs/ontouml2db/constants/DBMSSupported';
import { OntoUML2DB } from '@libs/ontouml2db/OntoUML2DB';
import { OntoUML2DBOptions } from '@libs/ontouml2db/OntoUML2DBOptions';

import { test_029 } from './test_resources/029_h2_script';
import { test_030 } from './test_resources/030_mysql_script';
import { test_031 } from './test_resources/031_oracle_script';
import { test_032 } from './test_resources/032_postgre.script';
import { test_033 } from './test_resources/033_sqlserver_script';

const optionsH2: Partial<OntoUML2DBOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DBMSSupported.H2,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa'
};

const optionsMySql: Partial<OntoUML2DBOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DBMSSupported.MYSQL,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa'
};

const optionsOracle: Partial<OntoUML2DBOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DBMSSupported.ORACLE,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa'
};

const optionsPostgre: Partial<OntoUML2DBOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DBMSSupported.POSTGRE,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa'
};

const optionsSqlServer: Partial<OntoUML2DBOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DBMSSupported.SQLSERVER,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa'
};

describe('Test the relational schema for specific DBMS.', () => {
  let service: OntoUML2DB;
  let files;

  test('Testing the relational schema for H2 DBMS.', () => {
    expect(() => {
      service = new OntoUML2DB(test_029.project, optionsH2);
      files = service.run();
    }).not.toThrow();

    test_029.checker.setSchema(files.result.schema);

    console.log(files.result.connection);

    expect(test_029.checker.checkSchema()).toBe('');
  });

  test('Testing the relational schema for MySQL DBMS.', () => {
    expect(() => {
      service = new OntoUML2DB(test_030.project, optionsMySql);
      files = service.run();
    }).not.toThrow();

    test_030.checker.setSchema(files.result.schema);

    console.log(files.result.connection);

    expect(test_030.checker.checkSchema()).toBe('');
  });

  test('Testing the relational schema for Oracle DBMS.', () => {
    expect(() => {
      service = new OntoUML2DB(test_031.project, optionsOracle);
      files = service.run();
    }).not.toThrow();

    test_031.checker.setSchema(files.result.schema);

    console.log(files.result.connection);

    expect(test_031.checker.checkSchema()).toBe('');
  });

  test('Testing the relational schema for Postgre DBMS.', () => {
    expect(() => {
      service = new OntoUML2DB(test_032.project, optionsPostgre);
      files = service.run();
    }).not.toThrow();

    test_032.checker.setSchema(files.result.schema);

    console.log(files.result.connection);

    expect(test_032.checker.checkSchema()).toBe('');
  });

  test('Testing the relational schema for SqlServer DBMS.', () => {
    expect(() => {
      service = new OntoUML2DB(test_033.project, optionsSqlServer);
      files = service.run();
    }).not.toThrow();

    test_033.checker.setSchema(files.result.schema);

    console.log(files.result.connection);

    expect(test_033.checker.checkSchema()).toBe('');
  });
});
