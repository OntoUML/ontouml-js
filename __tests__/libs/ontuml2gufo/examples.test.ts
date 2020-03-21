import fs from 'fs';
import {
  annotations,
  alpinebits,
  istandard,
  person,
  partWhole,
} from '@test-models/valids';
import { transformOntoUML2GUFO } from './helpers';

describe('Examples', () => {
  beforeAll(async () => {
    const files = [
      {
        name: 'alpinebits.ttl',
        model: alpinebits,
        options: { format: 'Turtle' },
      },
      { name: 'alpinebits.nt', model: alpinebits },
      {
        name: 'istandard.ttl',
        model: istandard,
        options: { format: 'Turtle' },
      },
      {
        name: 'person.ttl',
        model: person,
        options: { format: 'Turtle' },
      },
      {
        name: 'partWhole.ttl',
        model: partWhole,
        options: { format: 'Turtle' },
      },
      {
        name: 'partWhole.nt',
        model: partWhole,
      },
      {
        name: 'annotations.ttl',
        model: annotations,
        options: { format: 'Turtle' },
      },
    ];

    for (let file of files) {
      const result = await transformOntoUML2GUFO(file.model, file.options);
      const path = `__tests__/libs/ontuml2gufo/examples/${file.name}`;

      fs.writeFileSync(path, result);
    }
  });

  it('should generate example files', async () => {
    expect(true).toBe(true);
  });
});
