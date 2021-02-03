// import { StrategyType } from '@libs/ontouml2db/constants/StrategyType';
import { DBMSSupported } from '@libs/ontouml2db/constants/DBMSSupported';
// import { OntoUML2DB } from '@libs/ontouml2db/OntoUML2DB';
// import { OntoUML2DBOptions } from '@libs/ontouml2db/OntoUML2DBOptions';
// import { baseExample } from './../ontouml2db/test_resources/baseExample';

import { OntoUML2DB, OntoUML2DBOptions, StrategyType } from '@libs/ontouml2db';
import { test_001 } from './test_resources/001_simple_flattening';
import { test_002 } from './test_resources/002_flatting_with_duplicate_attributes';

const options: Partial<OntoUML2DBOptions>[] = [
  {
    mappingStrategy: StrategyType.ONE_TABLE_PER_CLASS,
    targetDBMS: DBMSSupported.H2,
    isStandardizeNames: true,
    hostName: 'localhost/~',
    databaseName: 'RunExample',
    userConnection: 'sa',
    passwordConnection: 'sa'
  }
];

describe('Test models against different options', () => {
  describe(`Test model '${test_001.title}'`, () => {
    for (let index = 1; index < options.length + 1; index++) {
      it(`Test set of options ${index}`, () => {
        const service = new OntoUML2DB(test_001.project, options[index - 1]);
        test_001.checker.setTransformation(service);

        console.log(service.getRelationalSchema());

        // let result;
        // expect(() => {
        //     result = service.run();
        //     console.log(result);
        // }).not.toThrow();

        expect(() => service.getRelationalSchema()).not.toThrow();
        expect(test_001.checker.check()).toBe('');
      });
    }
  });

  //   describe(`Test model '${test_002.title}'`, () => {
  //     for (let index = 1; index < options.length + 1; index++) {
  //       it(`Test set of options ${index}`, () => {
  //         const service = new OntoUML2DB(test_002.project, options[index - 1]);
  //         test_002.checker.setTransformation(service);

  //         expect(() => service.getRelationalSchema()).not.toThrow();
  //         expect(test_002.checker.check()).toBe('');
  //       });
  //     }
  //   });
});
