import {
  alpinebits as alpinebitsModel,
  inverseRelations as inverseRelationsModel,
} from '@test-models/valids';
import { transformOntoUML2GUFO } from './helpers';

describe('InverseRelations', () => {
  let alpinebits;
  let inverseRelations;
  let inverseRelationsHideOP;

  beforeAll(async () => {
    alpinebits = await transformOntoUML2GUFO(alpinebitsModel, {
      createInverses: true,
    });

    inverseRelations = await transformOntoUML2GUFO(inverseRelationsModel, {
      createInverses: true,
    });

    inverseRelationsHideOP = await transformOntoUML2GUFO(
      inverseRelationsModel,
      {
        createInverses: true,
        createObjectProperty: false,
      },
    );
  });

  it('should generate an uri automatically using association end', async () => {
    const data = [
      '<:snowparkFeature> <owl:inverseOf> <:isComponentOfSnowpark>',
      '<:isComponentOfSnowpark> <rdf:type> <owl:ObjectProperty>',
    ];

    for (const value of data) {
      expect(alpinebits).toContain(value);
    }
  });

  it('should generate an uri automatically using stereotype', async () => {
    const data = [
      '<:organizedEvent> <owl:inverseOf> <:organizer>',
      '<:organizer> <rdf:type> <owl:ObjectProperty>',
    ];

    for (const value of data) {
      expect(alpinebits).toContain(value);
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
      expect(alpinebits).toContain(value);
    }
  });

  it('should generate inverse relation for stereotypes', async () => {
    const data = [
      '<rdfs:subPropertyOf> <:bears>',
      '<rdfs:subPropertyOf> <:hasComponent>',
      '<rdfs:subPropertyOf> <:created>',
      '<rdfs:subPropertyOf> <:hasDependant>',
      '<rdfs:subPropertyOf> <:hasHistoricalDependant>',
      '<rdfs:subPropertyOf> <:isManifestationOf>',
      '<rdfs:subPropertyOf> <:isMediatedBy>',
      '<rdfs:subPropertyOf> <:hasCollectionMember>',
      '<rdfs:subPropertyOf> <:hasParticipant>',
      '<rdfs:subPropertyOf> <:hasEventProperPart>',
      '<rdfs:subPropertyOf> <:hasSubCollection>',
      '<rdfs:subPropertyOf> <:hasSubQuantity>',
      '<rdfs:subPropertyOf> <:terminated>',
      '<rdfs:subPropertyOf> <:hasProperPart>',
    ];

    for (const value of data) {
      expect(inverseRelations).toContain(value);
    }
  });

  it('should not generate inverse relation for comparative and material stereotypes', async () => {
    const data = [
      '<rdfs:subPropertyOf> <:comparativeRelationshipType>',
      '<rdfs:subPropertyOf> <:materialRelationshipType>',
    ];

    for (const value of data) {
      expect(inverseRelations).not.toContain(value);
    }
  });

  it('should generate part-whole cardinality with name when create object property is true', async () => {
    const data = [
      '<owl:onProperty> <:hasEventProperPartPartipationalClassSource>',
      '<owl:onProperty> <:hasProperPartClassTarget>',
    ];
    const data2 = [
      '<owl:onProperty> <:hasEventProperPart>',
      '<owl:onProperty> <:hasProperPart>',
    ];

    for (const value of data) {
      expect(inverseRelations).toContain(value);
    }

    for (const value of data2) {
      expect(inverseRelations).not.toContain(value);
    }
  });

  it('should generate cardinality with stereotype property when create object property is false', async () => {
    const data = [
      '<owl:onProperty> <:hasEventProperPartPartipationalClassSource>',
      '<owl:onProperty> <:hasProperPartClassTarget>',
    ];
    const data2 = [
      '<owl:onProperty> <:hasEventProperPart>',
      '<owl:onProperty> <:hasProperPart>',
    ];

    for (const value of data) {
      expect(inverseRelationsHideOP).not.toContain(value);
    }

    for (const value of data2) {
      expect(inverseRelationsHideOP).toContain(value);
    }
  });
});
