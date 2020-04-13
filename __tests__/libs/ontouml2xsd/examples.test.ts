import fs from 'fs';
import { istandard } from '@test-models/valids';
import { ModelManager } from '@libs/model';
import { OntoUML2XSD, IOntoUML2XSDOptions } from '@libs/ontouml2xsd';
import { IPackage } from '@types';

type File = {
  name: string;
  model: IPackage;
  opts: IOntoUML2XSDOptions;
};

describe('Examples', () => {
  beforeAll(async () => {
    const files: File[] = [
      {
        name: 'IO31.xsd',
        model: istandard,
        opts: {
          namespace: 'http://www.istandaarden.nl/iwlz/2_1/io31/schema',
          prefix: 'io31',
          imports: [
            {
              prefix: 'iwlz',
              namespace: 'http://www.istandaarden.nl/iwlz/2_1/basisschema/schema',
              schemaLocation: 'basisschema.xsd',
            },
          ],
          language: 'nl',
          customDatatypeMap: {
            rWVQow6FYEGQTyAX: 'iwlz:LDT_Datum', // Time Instant
          },
          message: [
            {
              label: 'Root',
              documentation: 'This is the root class of the message',
              properties: [
                {
                  label: 'Header',
                  type: 'Header',
                },
                {
                  label: 'Clienten',
                  type: 'Clienten',
                },
              ],
            },
            {
              label: 'Header',
              documentation: 'This is the header.',
              properties: [
                {
                  label: 'BerichtCode',
                  type: 'iwlz:LDT_BerichtCode',
                },
                {
                  label: 'BerichtVersie',
                  type: 'iwlz:LDT_BerichtVersie',
                },
              ],
            },
            {
              label: 'Clienten',
              documentation: 'This is the body of the message.',
              properties: [
                {
                  label: 'Client',
                  type: 'Client',
                  max: '*',
                },
              ],
            },
            {
              id: 'KqqJFHaGAqAe8BR_', // 'LTH Client',
              label: 'Client',
              properties: [
                {
                  id: 'R94syXaD.AAAAR2f', // 'BSN',
                  type: 'iwlz:LDT_BurgerServicenummer',
                },
                {
                  id: '0RfD1HaGAqAe8BfK', //'date of birth',
                  label: 'Geboortedatum',
                  documentation: "The client's birthdate may be partially known.",
                  type: 'iwlz:CDT_Geboortedatum',
                },
                {
                  id: 'BHi29A6AUB1UpDl3',
                  path: ['cezG9A6AUB1UpDJF', 'BHi29A6AUB1UpDl3'], // 'name.short name'
                  label: 'Naam',
                  // type: 'iwlz:LDT_Naam',
                },
                {
                  id: 'a_XkZnaGAqAeDhA_',
                  path: ['0Knw43aAUBAysYmO', 'a_XkZnaGAqAeDhA_'], // 'registration.legal gender'
                  label: 'Geslacht',
                  // type: 'iwlz:LDT_Geslacht',
                },
                {
                  id: '2.Uo43aAUBAysYrg',
                  path: ['0Knw43aAUBAysYmO', '2.Uo43aAUBAysYrg'], // 'registration.civil status'
                  label: 'BurgerlijkeStaat',
                  type: 'iwlz:LDT_BurgerlijkeStaat',
                  min: '0',
                },
                {
                  id: 'gzVfLo6GAqACCSRv', // legal status
                },
                {
                  id: '01eUzHaGAqAe8CpW', // 'contact info',
                  label: 'Contact',
                  min: '1',
                },
                {
                  id: 'wO0TFHaGAqAe8BdY', // indication,
                  label: 'Indicatie',
                  min: '1',
                  max: '1',
                },
                {
                  label: 'Commentaar',
                  type: 'xs:string',
                  min: '0',
                },
              ],
            },
            {
              id: '2g1kZnaGAqAeDg_y',
              documentation: 'This is the mapping of a 2nd-order type using enumeration.',
              instances: [
                { name: 'Man' },
                { name: 'Woman' },
                { name: 'Undeclared' },
                { name: 'Unknown' },
              ],
            },
            {
              id: 'HiufLo6GAqACCSQ2', // <<enum>> Legal Status
              documentation: 'This is an enumeration.',
              literals: [
                {
                  id: 'FZpfLo6GAqACCSRI',
                  value: '01',
                  documentation: 'A free person.',
                },
                {
                  id: 'DS5fLo6GAqACCSRL',
                  value: '02',
                  documentation: 'A person in jail.',
                },
                {
                  id: '9BFfLo6GAqACCSRO',
                  value: '03',
                  documentation: 'A person underdoing a trial.',
                },
              ],
            },
            {
              id: 'OAOUzHaGAqAe8Co8', // 'Contact Info',
              label: 'Contact',
              properties: [
                { id: 'UH5UzHaGAqAe8CqF', label: 'Telefoon' },
                { id: 'luFUzHaGAqAe8CqI', label: 'Emailadres' },
                { id: 'Cwg.ZnaGAqAeDhWP', type: 'iwlz:CDT_Adres' },
              ],
            },
            {
              id: 'MWE29A6AUB1UpDlL',
              // name: 'Short Name',
              label: 'ShortName',
              properties: [
                { id: 'hrl29A6AUB1UpDmp' },
                { id: 'qD529A6AUB1UpDmf' },
                { id: '0NF29A6AUB1UpDmk' },
              ],
            },
            {
              id: '1so2FHaGAqAe8BBx',
              // name: 'LTH Indication',
              label: 'Indicatie',
              properties: [
                {
                  id: '21oKzHaGAqAe8C_p',
                  // name: 'valid from',
                  label: 'Ingangsdatum',
                },
                {
                  id: 'nVOKzHaGAqAe8DAO',
                  // name: 'valid until',
                  label: 'Einddatum',
                },
              ],
            },
          ],
        },
      },
    ];

    for (let file of files) {
      const modelCopy = JSON.parse(JSON.stringify(file.model));
      const service = new OntoUML2XSD(new ModelManager(modelCopy), file.opts);
      const result = service.transform();
      const path = `__tests__/libs/ontouml2xsd/examples/${file.name}`;
      fs.writeFileSync(path, result);
    }
  });

  it('should generate example files', async () => {
    expect(true).toBe(true);
  });
});
