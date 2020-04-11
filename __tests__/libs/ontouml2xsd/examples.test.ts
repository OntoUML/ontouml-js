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
  opts: object;
};

describe('Examples', () => {
  beforeAll(async () => {
    const files: File[] = [
      // {
      //   name: 'alpinebits.xsd',
      //   model: alpinebits,
      //   opts: {
      //     message: [
      //       {
      //         id: 'u0X6ZeaGAqACBxFU',
      //         name: 'Event Plan',
      //         label: null,
      //         properties: {
      //           name: { label: null, type: null },
      //           startDate: { label: 'SuperStartDate', type: null },
      //           endDate: { label: null, type: null },
      //           organizers: { label: 'OrganizersList', type: null },
      //         },
      //       },
      //       {
      //         id: 'kJXWZeaGAqACBxRJ',
      //         name: 'Organizer',
      //         label: null,
      //         properties: {
      //           name: { label: null, type: null },
      //           abstract: { label: null, type: null },
      //           shortName: { label: null, type: null },
      //           url: { label: null, type: 'xs:anyURI' },
      //           multimediaDescriptions: { label: null, type: null },
      //         },
      //       },
      //       {
      //         id: 'xh2EFeaGAqACByIW',
      //         name: 'Media Object',
      //         label: null,
      //         properties: {
      //           name: { label: null, type: null },
      //           contentType: { label: null, type: null },
      //           url: { label: null, type: 'xs:anyURI' },
      //           license: { label: null, type: 'xs:string' },
      //         },
      //       },
      //     ]
      //   }
      // },
      {
        name: 'IO31.xsd',
        model: istandard,
        opts: {}
      },
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
