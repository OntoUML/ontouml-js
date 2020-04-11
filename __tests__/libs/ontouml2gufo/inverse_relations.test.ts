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
      '<:features> <owl:inverseOf> <:isComponentOfSnowpark>',
      '<:isComponentOfSnowpark> <rdf:type> <owl:ObjectProperty>',
    ];

    for (const value of data) {
      expect(alpinebitsResult).toContain(value);
    }
  });

  it('should generate an uri automatically using stereotype', async () => {
    const data = [
      '<:isMediatedByEventPlan> <owl:inverseOf> <:organizers>',
      '<:organizers> <rdf:type> <owl:ObjectProperty>',
    ];

    for (const value of data) {
      expect(alpinebitsResult).toContain(value);
    }
  });

  it('should generate a domain and range to inverse relation', async () => {
    const data = [
      '<:organizers> <rdfs:domain> <:EventPlan>',
      '<:organizers> <rdfs:range> <:Organizer>',
      '<:isMediatedByEventPlan> <rdfs:domain> <:Organizer>',
      '<:isMediatedByEventPlan> <rdfs:range> <:EventPlan>',
    ];

    for (const value of data) {
      expect(alpinebitsResult).toContain(value);
    }
  });
});
