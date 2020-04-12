import { alpinebits } from '@test-models/valids';
import { transformOntoUML2GUFO } from './helpers';

describe('InverseRelations', () => {
  let alpinebitsResult;

  beforeAll(async () => {
    alpinebitsResult = await transformOntoUML2GUFO(alpinebits, {
      createInverses: true,
    });
  });

  it('should generate an uri automatically using association end', async () => {
    const data = [
      '<:snowparkFeature> <owl:inverseOf> <:isComponentOfSnowpark>',
      '<:isComponentOfSnowpark> <rdf:type> <owl:ObjectProperty>',
    ];

    for (const value of data) {
      expect(alpinebitsResult).toContain(value);
    }
  });

  it('should generate an uri automatically using stereotype', async () => {
    const data = [
      '<:organizedEvent> <owl:inverseOf> <:organizer>',
      '<:organizer> <rdf:type> <owl:ObjectProperty>',
    ];

    for (const value of data) {
      expect(alpinebitsResult).toContain(value);
    }
  });

  it('should generate a domain and range to inverse relation', async () => {
    const data = [
      '<:organizer> <rdfs:domain> <:EventPlan>',
      '<:organizer> <rdfs:range> <:Organizer>',
      '<:organizedEvent> <rdfs:domain> <:Organizer>',
      '<:organizedEvent> <rdfs:range> <:EventPlan>',
    ];

    for (const value of data) {
      expect(alpinebitsResult).toContain(value);
    }
  });
});
