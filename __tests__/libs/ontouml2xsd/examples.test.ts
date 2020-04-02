import fs from 'fs';
import {
  annotations,
  alpinebits,
  istandard,
  person,
  partWhole,
  packages,
  derivation,
} from '@test-models/valids';
import { transformOntoUML2XSD } from './helpers';
import { IPackage } from '@types';

type File = {
  name: string;
  model: IPackage;
};

describe('Examples', () => {
  beforeAll(async () => {
    const files: File[] = [
      {
        name: 'alpinebits.xsd',
        model: alpinebits,
      },
      // {
      //   name: 'istandard.xsd',
      //   model: istandard,
      // },
      // {
      //   name: 'person.xsd',
      //   model: person,
      // },
      // {
      //   name: 'partWhole.xsd',
      //   model: partWhole,
      // },
      // {
      //   name: 'annotations.xsd',
      //   model: annotations,
      // },
      // {
      //   name: 'derivation.xsd',
      //   model: derivation,
      // },
    ];

    for (let file of files) {
      const result = transformOntoUML2XSD(file.model);
      const path = `__tests__/libs/ontouml2xsd/examples/${file.name}`;

      fs.writeFileSync(path, result);
    }
  });

  it('should generate example files', async () => {
    expect(true).toBe(true);
  });
});
