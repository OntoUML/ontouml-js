/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { DBMSSupported } from '@libs/ontouml2db/constants/DBMSSupported';
import { OntoUML2DBOptions } from '@libs/ontouml2db/OntoUML2DBOptions';
import { StrategyType } from '@libs/ontouml2db/constants/StrategyType';
import { baseExample } from './test_resources/baseExample';
import { OntoUML2DB } from '@libs/ontouml2db';

let options: Partial<OntoUML2DBOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DBMSSupported.H2,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa'
};

test('Run Example', () => {
  let ontoUML2DB = new OntoUML2DB(baseExample.modelManager, options);

  let text = ontoUML2DB.getOBDAFile();

  let files = text.split('|');

  //console.log(text);

  expect(files.length).toBe(1);
});
