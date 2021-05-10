/**
 *
 * Author: Gustavo Ludovico Guidoni
 */

import { DbmsSupported } from '@libs/ontouml2db/constants/DbmsSupported';
import { Ontouml2DbOptions } from '@libs/ontouml2db/Ontouml2DbOptions';
import { StrategyType } from '@libs/ontouml2db/constants/StrategyType';
import { baseExample } from './test_resources/baseExample';
import { Ontouml2Db } from '@libs/ontouml2db';

let options: Partial<Ontouml2DbOptions> = {
  mappingStrategy: StrategyType.ONE_TABLE_PER_KIND,
  targetDBMS: DbmsSupported.H2,
  isStandardizeNames: true,
  hostName: 'localhost/~',
  databaseName: 'RunExample',
  userConnection: 'sa',
  passwordConnection: 'sa'
};

test('Run Example', () => {
  let ontoUML2DB = new Ontouml2Db(baseExample.project, options);

  let text = ontoUML2DB.getOBDAFile();

  let files = text.split('|');

  //console.log(text);

  expect(files.length).toBe(1);
});
