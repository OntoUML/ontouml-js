import { StrategyType } from '@libs/ontouml2db/constants/StrategyType';
import { DBMSSupported } from '@libs/ontouml2db/constants/DBMSSupported';
import { OntoUML2DB } from '@libs/ontouml2db/OntoUML2DB';
import { OntoUML2DBOptions } from '@libs/ontouml2db/OntoUML2DBOptions';
import { baseExample } from './../ontouml2db/test_resources/baseExample';

const options: OntoUML2DBOptions[] = [
  {
    mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
    targetDBMS: DBMSSupported.H2,
    isStandardizeNames: true,
    hostName: 'localhost/~',
    databaseName: 'RunExample',
    userConnection: 'sa',
    passwordConnection: 'sa'
  },

  {
    mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
    targetDBMS: DBMSSupported.MYSQL,
    isStandardizeNames: true,
    hostName: 'localhost/~',
    databaseName: 'RunExample',
    userConnection: 'sa',
    passwordConnection: 'sa'
  },

  {
    mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
    targetDBMS: DBMSSupported.ORACLE,
    isStandardizeNames: true,
    hostName: 'localhost/~',
    databaseName: 'RunExample',
    userConnection: 'sa',
    passwordConnection: 'sa'
  },

  {
    mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
    targetDBMS: DBMSSupported.POSTGRE,
    isStandardizeNames: true,
    hostName: 'localhost/~',
    databaseName: 'RunExample',
    userConnection: 'sa',
    passwordConnection: 'sa'
  },

  {
    mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
    targetDBMS: DBMSSupported.SQLSERVER,
    isStandardizeNames: true,
    hostName: 'localhost/~',
    databaseName: 'RunExample',
    userConnection: 'sa',
    passwordConnection: 'sa'
  }
];

describe('Test', () => {
  let title: string = '';

  for (const option of options) {
    title = 'Script for ' + option.targetDBMS.toString();

    test(title, () => {
      let mapper = new OntoUML2DB(baseExample.modelManager);
      let script = '';
      script = mapper.getRelationalSchema();

      if (script == '') {
        expect(true).toBe(false);
      }
    });
  }
});
