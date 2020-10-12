import { alpinebits } from '@test-models/valids';
import { generateGufo } from './helpers';

describe('Custom labels', () => {
  it('should generate custom labels for classes', async () => {
    const result = generateGufo(alpinebits, {
      customElementMapping: {
        JoK2ZeaGAqACBxS5: {
          uri: 'OWLPerson',
          label: { default: 'OWLPerson', en: 'Person', pt: 'Pessoa' }
        },
        Organization: { uri: 'OWLOrganization' },
        'Event Plan': { uri: 'OWLEventPlan' }
      }
    });

    expect(result).toContain('<:OWLPerson> <rdf:type> <owl:Class>');
    expect(result).toContain('<:OWLPerson> <rdfs:label> "Person"@en');
    expect(result).toContain('<:OWLPerson> <rdfs:label> "Pessoa"@pt');
    expect(result).toContain('<:OWLOrganization> <rdf:type> <owl:Class>');
    expect(result).toContain('<:OWLEventPlan> <rdf:type> <owl:Class>');
  });

  it('should generate custom labels for attributes', () => {
    const data = [
      '<:owlCapacity> <rdf:type> <owl:DatatypeProperty>',
      '<:owlArea> <rdf:type> <owl:DatatypeProperty>',
      '<:hasTrail> <rdf:type> <owl:ObjectProperty>',
      '<:hasTrail> <rdfs:label> "hasDefaultLabel"',
      '<:hasTrail> <rdfs:label> "hasLabel"@en'
    ];

    for (const value of data) {
      expect(alpinebitsCustomLabel).toContain(value);
    }
  });

  it('should generate custom labels', () => {
    const data = [
      '<:historicalDependence> <rdf:type> <owl:ObjectProperty>',
      '<:mediation> <rdf:type> <owl:ObjectProperty>',
      '<:mediation> <rdfs:label> "OWLMediation'
    ];

    for (const value of data) {
      expect(partWholeCustomLabel).toContain(value);
    }
});

// let alpinebits;
// let alpinebitsCustomLabel;

// beforeAll(() => {
//   // alpinebits = generateGufo(alpinebitsModel);

//   alpinebitsCustomLabel = generateGufo(alpinebitsModel, {
//     createInverses: true,
//     customElementMapping: {
//       capacity: { uri: 'owlCapacity' },
//       tZNlFRaGAqCsIBOU: { uri: 'owlArea' },
//       '3x40WRaGAqCsIB4X': {
//         uri: 'hasTrail',
//         label: { default: 'hasDefaultLabel', en: 'hasLabel' }
//       }
//     }
//   });
// });
